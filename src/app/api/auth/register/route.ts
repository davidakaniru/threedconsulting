import type { NextRequest } from "next/server";
import { ValidationError } from "yup";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { AppAuthError } from "@/lib/auth/auth-errors";
import { registerParent } from "@/lib/auth/auth.service";
import { registerSchema, type RegisterRequest } from "@/lib/schemas/register-schema";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const validated = await registerSchema.validate(body, { abortEarly: false, stripUnknown: true });
    const input: RegisterRequest = validated;
    const result = await registerParent(input, request.nextUrl.origin);
    return apiSuccess({
      message: result.requiresEmailConfirmation ? "Check your email to confirm your account." : "Your account has been created.",
      requiresEmailConfirmation: result.requiresEmailConfirmation,
    }, 201);
  } catch (error) {
    if (error instanceof SyntaxError) return apiError("INVALID_JSON", "The request body is invalid.", 400);
    if (error instanceof ValidationError) {
      const details = error.inner.reduce<Record<string, string>>((result, item) => {
        if (item.path && !result[item.path]) result[item.path] = item.message;
        return result;
      }, {});
      return apiError("VALIDATION_ERROR", "Please correct the highlighted fields.", 422, details);
    }
    if (error instanceof AppAuthError) return apiError(error.code, error.message, error.status);
    console.error("Registration failed", error);
    return apiError("INTERNAL_SERVER_ERROR", "We could not create your account. Please try again.", 500);
  }
}
