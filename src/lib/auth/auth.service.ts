import { createClient } from "@/lib/supabase/server";
import type { LoginRequest } from "@/lib/schemas/login-schema";
import type { RegisterRequest } from "@/lib/schemas/register-schema";
import { mapLoginError, mapSignupError, AppAuthError } from "@/lib/auth/auth-errors";
import type { AuthenticatedUser } from "@/types/auth";

export interface RegisterResult {
  requiresEmailConfirmation: boolean;
}

export async function registerParent(
  input: RegisterRequest,
  origin: string,
): Promise<RegisterResult> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: `${origin}/portal/parent`,
      data: {
        first_name: input.firstName,
        last_name: input.lastName,
      },
    },
  });

  if (error) {
    throw mapSignupError(error);
  }

  return {
    requiresEmailConfirmation: data.session === null,
  };
}

export async function login(input: LoginRequest): Promise<AuthenticatedUser> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) {
    throw mapLoginError(error);
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id,email,first_name,last_name,role,status,avatar_url,phone,date_of_birth,address,preferred_language,created_at,updated_at")
    .eq("id", data.user.id)
    .single();

  if (profileError) {
    await supabase.auth.signOut();
    throw new AppAuthError(
      "AUTH_PROFILE_UNAVAILABLE",
      "Your account profile could not be loaded. Please contact support.",
      500,
    );
  }

  if (profile.status !== "active") {
    await supabase.auth.signOut();
    throw new AppAuthError(
      "AUTH_ACCOUNT_UNAVAILABLE",
      "This account is currently unavailable. Please contact support.",
      403,
    );
  }

  return {
    id: profile.id,
    email: profile.email,
    firstName: profile.first_name,
    lastName: profile.last_name,
    role: profile.role,
    status: profile.status,
    avatarUrl: profile.avatar_url,
    phone: profile.phone,
    dateOfBirth: profile.date_of_birth,
    address: profile.address,
    preferredLanguage: profile.preferred_language === "en" ? "en" : "en",
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  };
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new AppAuthError(
      "AUTH_LOGOUT_FAILED",
      "We could not sign you out. Please try again.",
      500,
    );
  }
}
