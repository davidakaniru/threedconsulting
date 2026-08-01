import type { NextRequest } from "next/server";
import { ValidationError } from "yup";

import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { requireApiAuth } from "@/lib/auth/guards";
import { changePassword } from "@/lib/profile/profile.service";
import { passwordChangeRequestSchema } from "@/lib/schemas/profile-schema";

export const runtime = "nodejs";

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireApiAuth();
    const body: unknown = await request.json();
    const input = await passwordChangeRequestSchema.validate(body, { abortEarly: false, stripUnknown: true });

    await changePassword(user.email, input.currentPassword, input.newPassword);
    return apiSuccess({ changed: true });
  } catch (error) {
    if (error instanceof SyntaxError) return apiError("INVALID_JSON", "The request body is invalid.", 400);
    if (error instanceof ValidationError) return apiError("VALIDATION_ERROR", "Please correct the highlighted fields.", 422);
    if (error instanceof ApiError) return apiError(error.code, error.message, error.status, error.details);
    console.error("Password change failed", error);
    return apiError("INTERNAL_SERVER_ERROR", "Unable to change your password.", 500);
  }
}
