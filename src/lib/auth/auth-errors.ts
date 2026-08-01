import type { AuthError } from "@supabase/supabase-js";

export type AuthErrorCode =
  | "AUTH_RATE_LIMITED"
  | "AUTH_SIGNUP_DISABLED"
  | "AUTH_WEAK_PASSWORD"
  | "AUTH_REGISTRATION_FAILED"
  | "AUTH_INVALID_CREDENTIALS"
  | "AUTH_EMAIL_UNCONFIRMED"
  | "AUTH_ACCOUNT_UNAVAILABLE"
  | "AUTH_PROFILE_UNAVAILABLE"
  | "AUTH_LOGOUT_FAILED";

export class AppAuthError extends Error {
  constructor(
    public readonly code: AuthErrorCode,
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "AppAuthError";
  }
}

export function mapSignupError(error: AuthError): AppAuthError {
  if (error.status === 429) {
    return new AppAuthError(
      "AUTH_RATE_LIMITED",
      "Too many registration attempts. Please try again shortly.",
      429,
    );
  }

  if (error.code === "signup_disabled") {
    return new AppAuthError(
      "AUTH_SIGNUP_DISABLED",
      "Account registration is currently unavailable.",
      503,
    );
  }

  if (error.code === "weak_password") {
    return new AppAuthError(
      "AUTH_WEAK_PASSWORD",
      "Please choose a stronger password.",
      400,
    );
  }

  return new AppAuthError(
    "AUTH_REGISTRATION_FAILED",
    "We could not create your account. Please try again.",
    400,
  );
}

export function mapLoginError(error: AuthError): AppAuthError {
  if (error.status === 429) {
    return new AppAuthError(
      "AUTH_RATE_LIMITED",
      "Too many sign-in attempts. Please wait a moment and try again.",
      429,
    );
  }

  if (error.code === "email_not_confirmed") {
    return new AppAuthError(
      "AUTH_EMAIL_UNCONFIRMED",
      "Please confirm your email address before signing in.",
      403,
    );
  }

  if (error.code === "invalid_credentials") {
    return new AppAuthError(
      "AUTH_INVALID_CREDENTIALS",
      "The email address or password is incorrect.",
      401,
    );
  }

  return new AppAuthError(
    "AUTH_INVALID_CREDENTIALS",
    "Unable to sign in with those details.",
    401,
  );
}
