import type { NextRequest } from "next/server";
import { ValidationError } from "yup";
import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { requireApiAuth } from "@/lib/auth/guards";
import { setInvitedPasswordSchema } from "@/modules/teachers/schemas";
import { setInvitedTeacherPassword } from "@/modules/teachers/server";

export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  try {
    const user = await requireApiAuth();
    if (user.role !== "teacher") throw new ApiError("FORBIDDEN", "This setup link is only available to invited teachers.", 403);
    const input = await setInvitedPasswordSchema.validate(await request.json(), { abortEarly: false, stripUnknown: true });
    await setInvitedTeacherPassword(user.id, input.password);
    return apiSuccess({ completed: true });
  } catch (error) {
    if (error instanceof ValidationError) return apiError("VALIDATION_ERROR", "Please choose a valid password.", 422);
    if (error instanceof ApiError) return apiError(error.code, error.message, error.status, error.details);
    console.error("Invite password setup failed", error); return apiError("INTERNAL_SERVER_ERROR", "Unable to complete account setup.", 500);
  }
}
