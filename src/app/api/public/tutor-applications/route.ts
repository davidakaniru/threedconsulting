
import type { NextRequest } from "next/server";
import { ValidationError } from "yup";

import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { tutorApplicationSchema } from "@/modules/tutor-applications";
import {
  submitTutorApplication,
  validateTutorApplicationFiles,
} from "@/modules/tutor-applications/server/tutor-application.service";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();

    const raw = {
      firstName: form.get("firstName"),
      lastName: form.get("lastName"),
      email: form.get("email"),
      phone: form.get("phone"),
      addressLine1: form.get("addressLine1"),
      city: form.get("city"),
      country: form.get("country"),
      gender: form.get("gender"),
      dateOfBirth: form.get("dateOfBirth"),
      summary: form.get("summary"),
      expertise: form.get("expertise"),
      qualifications: form.get("qualifications"),
    };

    const values = await tutorApplicationSchema.validate(raw, {
      abortEarly: false,
      stripUnknown: true,
    });

    const { image, cv } = validateTutorApplicationFiles(
      form.get("profileImage"),
      form.get("cv"),
    );

    const result = await submitTutorApplication(values, image, cv);

    return apiSuccess(result, 201);
  } catch (error) {
    if (error instanceof ValidationError) {
      return apiError(
        "VALIDATION_ERROR",
        "Please correct the highlighted details before submitting.",
        422,
      );
    }

    if (error instanceof ApiError) {
      return apiError(
        error.code,
        error.message,
        error.status,
        error.details,
      );
    }

    console.error("Tutor application failed", error);
    return apiError(
      "INTERNAL_SERVER_ERROR",
      "We could not submit your tutor application. Please try again.",
      500,
    );
  }
}
