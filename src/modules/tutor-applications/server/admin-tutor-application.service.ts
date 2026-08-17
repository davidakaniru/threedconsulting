import "server-only";

import { ApiError } from "@/lib/api/errors";
import { writeAuditLog } from "@/lib/audit";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizePagination } from "@/lib/modules";
import type {
  TutorApplicationAction,
  TutorApplicationDetail,
  TutorApplicationListResult,
  TutorApplicationResult,
  TutorApplicationSummary,
} from "@/modules/tutor-applications/types";
import type { TeacherDetail } from "@/modules/teachers/types";
import { getTeacher } from "@/modules/teachers/server/teacher.service";

const BUCKET = "tutor-applications";

function mapApplication(row: any): TutorApplicationSummary {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    gender: row.gender,
    dateOfBirth: row.date_of_birth,
    expertise: row.expertise,
    qualifications: row.qualifications,
    profileImagePath: row.profile_image_path,
    cvPath: row.cv_path,
    summary: row.summary,
    addressLine1: row.address_line_1,
    city: row.city,
    country: row.country,
    status: row.status,
    createdAt: row.created_at,
    reviewedAt: row.reviewed_at,
    reviewedBy: row.reviewed_by,
    rejectionReason: row.rejection_reason,
  };
}

export async function getTutorApplications(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: "pending" | "reviewing" | "accepted" | "rejected" | "all";
}): Promise<TutorApplicationListResult> {
  const { page, pageSize, from, to } = normalizePagination(params);
  const admin = createAdminClient();
  let query = admin
    .from("tutor_applications")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status);
  } else {
    // Accepted applications have been converted into active tutor accounts and
    // belong in the Active Tutors tab rather than the application queue.
    query = query.neq("status", "accepted");
  }
  if (params.search?.trim()) {
    const term = params.search.trim().replace(/[%_]/g, "");
    query = query.or(
      `first_name.ilike.%${term}%,last_name.ilike.%${term}%,email.ilike.%${term}%,expertise.ilike.%${term}%`,
    );
  }

  const { data, error, count } = await query;
  if (error) {
    console.error("Unable to list tutor applications", error);
    throw new ApiError(
      "TUTOR_APPLICATIONS_LOAD_FAILED",
      "Tutor applications could not be loaded.",
      500,
    );
  }

  return {
    applications: (data ?? []).map(mapApplication),
    total: count ?? 0,
    page,
    pageSize,
  };
}

export async function getTutorApplication(
  id: string,
): Promise<TutorApplicationDetail> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("tutor_applications")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Unable to load tutor application", error);
    throw new ApiError(
      "TUTOR_APPLICATION_LOAD_FAILED",
      "The tutor application could not be loaded.",
      500,
    );
  }
  if (!data)
    throw new ApiError(
      "TUTOR_APPLICATION_NOT_FOUND",
      "Tutor application not found.",
      404,
    );

  const application = mapApplication(data);
  const [profileUrl, cvUrl] = await Promise.all([
    admin.storage
      .from(BUCKET)
      .createSignedUrl(application.profileImagePath, 3600),
    application.cvPath
      ? admin.storage.from(BUCKET).createSignedUrl(application.cvPath, 3600)
      : Promise.resolve({ data: null, error: null }),
  ]);

  return {
    ...application,
    profileImageUrl: profileUrl.data?.signedUrl ?? null,
    cvUrl: cvUrl.data?.signedUrl ?? null,
  };
}

export async function performTutorApplicationAction(
  id: string,
  action: TutorApplicationAction,
  actorId: string,
  origin: string,
): Promise<TutorApplicationResult | TeacherDetail> {
  const admin = createAdminClient();
  const { data: application, error: loadError } = await admin
    .from("tutor_applications")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (loadError) {
    throw new ApiError(
      "TUTOR_APPLICATION_LOAD_FAILED",
      "The tutor application could not be loaded.",
      500,
    );
  }
  if (!application)
    throw new ApiError(
      "TUTOR_APPLICATION_NOT_FOUND",
      "Tutor application not found.",
      404,
    );
  if (application.status === "accepted")
    throw new ApiError(
      "TUTOR_APPLICATION_ALREADY_ACCEPTED",
      "This application has already been accepted.",
      409,
    );
  if (application.status === "rejected")
    throw new ApiError(
      "TUTOR_APPLICATION_ALREADY_REJECTED",
      "This application has already been rejected.",
      409,
    );

  if (action.type === "reject") {
    const { error } = await admin
      .from("tutor_applications")
      .update({
        status: "rejected",
        reviewed_at: new Date().toISOString(),
        reviewed_by: actorId,
        rejection_reason: action.reason?.trim() || null,
      })
      .eq("id", id);

    if (error)
      throw new ApiError(
        "TUTOR_APPLICATION_REJECT_FAILED",
        "The tutor application could not be rejected.",
        500,
      );

    await writeAuditLog({
      actorId,
      action: "tutor_application.rejected",
      entityType: "tutor_application",
      entityId: id,
      metadata: { email: application.email },
    });

    return { id, status: "rejected", email: application.email };
  }

  const { data: existingTeacher } = await admin
    .from("teachers")
    .select("id")
    .eq("application_id", id)
    .maybeSingle();
  if (existingTeacher) {
    throw new ApiError(
      "TUTOR_APPLICATION_ALREADY_PROVISIONED",
      "This application has already been converted to a tutor account.",
      409,
    );
  }

  const { data: invite, error: inviteError } =
    await admin.auth.admin.inviteUserByEmail(application.email, {
      redirectTo: `${origin}/auth/confirm?next=/set-password`,
      data: {
        first_name: application.first_name,
        last_name: application.last_name,
        role: "teacher",
      },
    });

  if (inviteError || !invite.user) {
    if (inviteError?.message?.toLowerCase().includes("already")) {
      throw new ApiError(
        "TUTOR_EMAIL_EXISTS",
        "An account already exists with this email address. The application was not accepted.",
        409,
      );
    }
    throw new ApiError(
      "TUTOR_INVITE_FAILED",
      "The tutor activation email could not be sent.",
      500,
    );
  }

  const userId = invite.user.id;
  try {
    const profileResult = await admin
      .from("profiles")
      .update({
        first_name: application.first_name,
        last_name: application.last_name,
        email: application.email.trim().toLowerCase(),
        phone: application.phone,
        address: `${application.address_line_1}, ${application.city}, ${application.country}`,
        date_of_birth: application.date_of_birth,
        role: "teacher",
        status: "active",
      })
      .eq("id", userId)
      .select("id")
      .single();

    if (profileResult.error) throw profileResult.error;

    const profileCopy = await admin.storage
      .from(BUCKET)
      .download(application.profile_image_path);
    if (profileCopy.error || !profileCopy.data)
      throw (
        profileCopy.error ?? new Error("Profile image could not be copied.")
      );

    const avatarPath = `${userId}/avatar`;
    const avatarUpload = await admin.storage
      .from("avatars")
      .upload(avatarPath, profileCopy.data, {
        contentType: profileCopy.data.type || "image/jpeg",
        cacheControl: "3600",
        upsert: true,
      });
    if (avatarUpload.error) throw avatarUpload.error;

    const { data: avatarUrlData } = admin.storage
      .from("avatars")
      .getPublicUrl(avatarPath);
    const avatarUpdate = await admin
      .from("profiles")
      .update({ avatar_url: `${avatarUrlData.publicUrl}?v=${Date.now()}` })
      .eq("id", userId);
    if (avatarUpdate.error) throw avatarUpdate.error;

    const teacherResult = await admin
      .from("teachers")
      .insert({
        id: userId,
        application_id: id,
        gender: application.gender,
        summary: application.summary,
        cv_path: application.cv_path,
        qualification: application.qualifications,
        specialization: application.expertise,
        employment_status: "active",
        onboarding_status: "invited",
      })
      .select("id")
      .single();
    if (teacherResult.error) throw teacherResult.error;

    const { error: acceptedError } = await admin
      .from("tutor_applications")
      .update({
        status: "accepted",
        reviewed_at: new Date().toISOString(),
        reviewed_by: actorId,
      })
      .eq("id", id);
    if (acceptedError) throw acceptedError;

    await writeAuditLog({
      actorId,
      action: "tutor_application.accepted",
      entityType: "tutor_application",
      entityId: id,
      metadata: { teacherId: userId, email: application.email },
    });

    const teacher = await getTeacher(userId);
    return teacher;
  } catch (error) {
    await admin.auth.admin.deleteUser(userId);
    console.error("Accepted tutor provisioning rolled back", error);
    throw new ApiError(
      "TUTOR_PROVISION_FAILED",
      "The application was not accepted because the tutor account could not be provisioned. No partial account was kept.",
      500,
    );
  }
}
