import type { NextRequest } from "next/server";
import { ValidationError } from "yup";

import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { requireApiAuth } from "@/lib/auth/guards";
import { deactivateProfile, getProfile, updateProfile } from "@/lib/profile/profile.service";
import { profileSchema } from "@/lib/schemas/profile-schema";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await requireApiAuth();
    return apiSuccess(await getProfile(user.id));
  } catch (error) {
    if (error instanceof ApiError) return apiError(error.code, error.message, error.status, error.details);
    console.error("Profile GET failed", error);
    return apiError("INTERNAL_SERVER_ERROR", "Unable to load your profile.", 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireApiAuth();
    const body: unknown = await request.json();
    const input = await profileSchema.validate(body, { abortEarly: false, stripUnknown: true });
    return apiSuccess(await updateProfile(user.id, input));
  } catch (error) {
    if (error instanceof SyntaxError) return apiError("INVALID_JSON", "The request body is invalid.", 400);
    if (error instanceof ValidationError) return apiError("VALIDATION_ERROR", "Please correct the highlighted fields.", 422);
    if (error instanceof ApiError) return apiError(error.code, error.message, error.status, error.details);
    console.error("Profile PATCH failed", error);
    return apiError("INTERNAL_SERVER_ERROR", "Unable to update your profile.", 500);
  }
}

export async function DELETE() {
  try {
    const user = await requireApiAuth();
    await deactivateProfile(user.id);
    return apiSuccess({ deactivated: true });
  } catch (error) {
    if (error instanceof ApiError) return apiError(error.code, error.message, error.status, error.details);
    console.error("Profile DELETE failed", error);
    return apiError("INTERNAL_SERVER_ERROR", "Unable to deactivate your account.", 500);
  }
}
