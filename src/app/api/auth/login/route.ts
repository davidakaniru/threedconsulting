import type { NextRequest } from "next/server";
import { ValidationError } from "yup";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { AppAuthError } from "@/lib/auth/auth-errors";
import { login } from "@/lib/auth/auth.service";
import { loginSchema, type LoginRequest } from "@/lib/schemas/login-schema";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const validated = await loginSchema.validate(body, { abortEarly: false, stripUnknown: true });
    const input: LoginRequest = validated;
    return apiSuccess({ user: await login(input) });
  } catch (error) {
    if (error instanceof SyntaxError) return apiError("INVALID_JSON", "The request body is invalid.", 400);
    if (error instanceof ValidationError) return apiError("VALIDATION_ERROR", "Please correct the highlighted fields.", 422);
    if (error instanceof AppAuthError) return apiError(error.code, error.message, error.status);
    console.error("Login failed", error);
    return apiError("INTERNAL_SERVER_ERROR", "Unable to sign in. Please try again.", 500);
  }
}
