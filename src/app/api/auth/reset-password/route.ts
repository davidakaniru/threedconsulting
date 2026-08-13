import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { ValidationError } from "yup";

import { ApiError } from "@/lib/api/errors";
import { apiError, apiSuccess } from "@/lib/api/responses";
import { resetPasswordSchema } from "@/lib/schemas/reset-password-schema";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const input = await resetPasswordSchema.validate(await request.json(), {
      abortEarly: false,
      stripUnknown: true,
    });

    const cookieStore = await cookies();
    if (cookieStore.get("threed_password_recovery")?.value !== "1") {
      throw new ApiError(
        "RESET_SESSION_INVALID",
        "This password-reset session is invalid or has expired. Please request a new link.",
        401,
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new ApiError(
        "RESET_SESSION_INVALID",
        "This password-reset session is invalid or has expired. Please request a new link.",
        401,
      );
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: input.password,
    });

    if (updateError) {
      const message = updateError.message.toLowerCase();

      if (message.includes("same") || message.includes("different")) {
        throw new ApiError(
          "PASSWORD_REUSED",
          "Please choose a different password.",
          422,
        );
      }

      throw new ApiError(
        "PASSWORD_RESET_FAILED",
        "We couldn't update your password. Please request a new reset link and try again.",
        updateError.status === 429 ? 429 : 400,
      );
    }

    // End the temporary recovery session. The user signs in normally afterward.
    await supabase.auth.signOut();

    const response = apiSuccess({ reset: true });
    response.cookies.set("threed_password_recovery", "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
    return response;
  } catch (error) {
    if (error instanceof ValidationError) {
      const details = error.inner.reduce<Record<string, string>>(
        (result, item) => {
          if (item.path && !result[item.path]) result[item.path] = item.message;
          return result;
        },
        {},
      );

      return apiError(
        "VALIDATION_ERROR",
        "Please choose a valid password.",
        422,
        details,
      );
    }

    if (error instanceof ApiError) {
      return apiError(error.code, error.message, error.status, error.details);
    }

    console.error("Password reset failed", error);
    return apiError(
      "INTERNAL_SERVER_ERROR",
      "We couldn't reset your password.",
      500,
    );
  }
}
