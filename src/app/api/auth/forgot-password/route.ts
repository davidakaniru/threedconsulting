import type { NextRequest } from "next/server";
import { ValidationError } from "yup";

import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { forgotPasswordSchema } from "@/lib/schemas/forgot-password-schema";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const input = await forgotPasswordSchema.validate(await request.json(), {
      abortEarly: false,
      stripUnknown: true,
    });

    const supabase = await createClient();
    const redirectTo = new URL("/auth/recovery", request.nextUrl.origin);
    redirectTo.searchParams.set("next", "/reset-password");

    const { error } = await supabase.auth.resetPasswordForEmail(
      input.email.trim().toLowerCase(),
      { redirectTo: redirectTo.toString() },
    );

    if (error) {
      console.error("Password recovery email request failed", error);
      throw new ApiError(
        "PASSWORD_RESET_REQUEST_FAILED",
        "We couldn't send reset instructions right now. Please try again shortly.",
        error.status === 429 ? 429 : 500,
      );
    }

    return apiSuccess({ sent: true });
  } catch (error) {
    if (error instanceof ValidationError) {
      return apiError(
        "VALIDATION_ERROR",
        "Please enter a valid email address.",
        422,
      );
    }

    if (error instanceof ApiError) {
      return apiError(error.code, error.message, error.status, error.details);
    }

    console.error("Forgot password request failed", error);
    return apiError(
      "INTERNAL_SERVER_ERROR",
      "We couldn't process the password-reset request.",
      500,
    );
  }
}
