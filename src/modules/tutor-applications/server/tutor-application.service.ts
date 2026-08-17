
import "server-only";

import { ApiError } from "@/lib/api/errors";
import { createAdminClient } from "@/lib/supabase/admin";
import type { TutorApplicationValues } from "@/modules/tutor-applications/schemas";

const MAX_PROFILE_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_CV_BYTES = 10 * 1024 * 1024;

const PROFILE_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

function extensionFor(file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext && /^[a-z0-9]+$/.test(ext)) return ext;
  return file.type === "application/pdf" ? "pdf" : "bin";
}

function assertFile(
  value: FormDataEntryValue | null,
  label: string,
  codePrefix: string,
  allowedTypes: Set<string>,
  maxBytes: number,
) {
  if (!(value instanceof File) || value.size === 0) {
    throw new ApiError(
      `${codePrefix}_REQUIRED`,
      `Please upload your ${label}.`,
      422,
    );
  }

  if (!allowedTypes.has(value.type)) {
    throw new ApiError(
      `${codePrefix}_TYPE_INVALID`,
      `Please upload your ${label} in a supported format.`,
      422,
    );
  }

  if (value.size > maxBytes) {
    throw new ApiError(
      `${codePrefix}_TOO_LARGE`,
      `Your ${label} is too large.`,
      422,
    );
  }

  return value;
}

export async function submitTutorApplication(
  values: TutorApplicationValues,
  profileImage: File,
  cv: File | null,
): Promise<{ id: string; status: "pending" }> {
  const admin = createAdminClient() as any;

  const dob = new Date(`${values.dateOfBirth}T00:00:00`);
  if (Number.isNaN(dob.getTime()) || dob > new Date()) {
    throw new ApiError(
      "DATE_OF_BIRTH_INVALID",
      "Please provide a valid date of birth.",
      422,
    );
  }

  const existing = await admin
    .from("tutor_applications")
    .select("id,status")
    .ilike("email", values.email.trim().toLowerCase())
    .in("status", ["pending", "reviewing"])
    .limit(1);

  if (existing.error) {
    console.error("Tutor application duplicate check failed", existing.error);
    throw new ApiError(
      "TUTOR_APPLICATION_CHECK_FAILED",
      "We could not submit your application right now.",
      500,
    );
  }

  if (existing.data?.length) {
    throw new ApiError(
      "TUTOR_APPLICATION_EXISTS",
      "We already have an active tutor application for this email address.",
      409,
    );
  }

  const applicationId = crypto.randomUUID();
  const bucket = "tutor-applications";
  const profilePath = `${applicationId}/profile.${extensionFor(profileImage)}`;
  const cvPath = cv ? `${applicationId}/cv.${extensionFor(cv)}` : null;

  try {
    // Upload the files before creating the row because profile_image_path is
    // intentionally NOT NULL. This prevents partially-created applications.
    const profileUpload = await admin.storage
      .from(bucket)
      .upload(profilePath, profileImage, {
        contentType: profileImage.type,
        upsert: false,
      });

    if (profileUpload.error) throw profileUpload.error;

    if (cv && cvPath) {
      const cvUpload = await admin.storage
        .from(bucket)
        .upload(cvPath, cv, {
          contentType: cv.type,
          upsert: false,
        });
      if (cvUpload.error) throw cvUpload.error;
    }

    const inserted = await admin
      .from("tutor_applications")
      .insert({
        id: applicationId,
        first_name: values.firstName.trim(),
        last_name: values.lastName.trim(),
        email: values.email.trim().toLowerCase(),
        phone: values.phone.trim(),
        address_line_1: values.addressLine1.trim(),
        city: values.city.trim(),
        country: values.country.trim(),
        gender: values.gender,
        date_of_birth: values.dateOfBirth,
        profile_image_path: profilePath,
        summary: values.summary.trim(),
        expertise: values.expertise.trim(),
        qualifications: values.qualifications.trim(),
        cv_path: cvPath,
        status: "pending",
      })
      .select("id,status")
      .single();

    if (inserted.error || !inserted.data) throw inserted.error;

    return { id: applicationId, status: "pending" };
  } catch (error) {
    await admin.storage.from(bucket).remove(
      [profilePath, ...(cvPath ? [cvPath] : [])],
    );

    console.error("Tutor application creation failed", error);
    throw new ApiError(
      "TUTOR_APPLICATION_CREATE_FAILED",
      "We could not submit your tutor application right now. Please try again.",
      500,
    );
  }
}

export function validateTutorApplicationFiles(
  profileImage: FormDataEntryValue | null,
  cv: FormDataEntryValue | null,
) {
  const image = assertFile(
    profileImage,
    "profile image",
    "PROFILE_IMAGE",
    PROFILE_IMAGE_TYPES,
    MAX_PROFILE_IMAGE_BYTES,
  );

  let cvFile: File | null = null;
  if (cv instanceof File && cv.size > 0) {
    cvFile = assertFile(
      cv,
      "CV",
      "CV",
      new Set(["application/pdf"]),
      MAX_CV_BYTES,
    );
  }

  return { image, cv: cvFile };
}
