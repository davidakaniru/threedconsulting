import { ApiError } from "@/lib/api/errors";
import { createClient } from "@/lib/supabase/server";
import {
  deactivateProfileById,
  findProfileById,
  updateProfileById,
} from "@/lib/profile/profile.repository";
import type { ProfileUpdateRequest } from "@/lib/schemas/profile-schema";
import type { AuthenticatedUser, UserProfile } from "@/types/auth";

function mapProfile(profile: {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: UserProfile["role"];
  status: UserProfile["status"];
  avatar_url: string | null;
  phone: string | null;
  date_of_birth: string | null;
  address: string | null;
  preferred_language: string;
  created_at: string;
  updated_at: string;
}): AuthenticatedUser {
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

function nullable(value?: string | null) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

export async function getProfile(userId: string): Promise<AuthenticatedUser> {
  const { data, error } = await findProfileById(userId);

  if (error || !data) {
    console.error("Unable to load profile", error);
    throw new ApiError(
      "PROFILE_NOT_FOUND",
      "Your profile could not be loaded.",
      404,
    );
  }

  return mapProfile(data);
}

export async function updateProfile(
  userId: string,
  input: ProfileUpdateRequest,
): Promise<AuthenticatedUser> {
  const { data, error } = await updateProfileById(userId, {
    first_name: input.firstName.trim(),
    last_name: input.lastName.trim(),
    phone: nullable(input.phone),
    date_of_birth: nullable(input.dateOfBirth),
    address: nullable(input.address),
    preferred_language: input.preferredLanguage,
  });

  if (error) {
    console.error("Unable to update profile", error);
    throw new ApiError(
      "PROFILE_UPDATE_FAILED",
      "Your profile could not be updated.",
      500,
    );
  }

  return mapProfile(data);
}

export async function uploadAvatar(userId: string, file: File) {
  const supabase = await createClient();
  const path = `${userId}/avatar`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    console.error("Unable to upload avatar", uploadError);
    throw new ApiError(
      "AVATAR_UPLOAD_FAILED",
      "Your profile photo could not be uploaded.",
      500,
    );
  }

  const { data: publicUrlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(path);
  const versionedUrl = `${publicUrlData.publicUrl}?v=${Date.now()}`;

  const { data, error } = await updateProfileById(userId, {
    avatar_url: versionedUrl,
  });

  if (error) {
    console.error("Unable to save avatar URL", error);
    throw new ApiError(
      "AVATAR_UPDATE_FAILED",
      "The photo uploaded, but your profile could not be updated.",
      500,
    );
  }

  return mapProfile(data);
}

export async function changePassword(
  email: string,
  currentPassword: string,
  newPassword: string,
) {
  const supabase = await createClient();

  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  });

  if (verifyError) {
    throw new ApiError(
      "CURRENT_PASSWORD_INVALID",
      "Your current password is incorrect.",
      400,
    );
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    console.error("Unable to update password", updateError);
    throw new ApiError(
      "PASSWORD_UPDATE_FAILED",
      "Your password could not be changed.",
      500,
    );
  }
}

export async function deactivateProfile(userId: string) {
  const { error } = await deactivateProfileById(userId);

  if (error) {
    console.error("Unable to deactivate profile", error);
    throw new ApiError(
      "PROFILE_DEACTIVATION_FAILED",
      "Your account could not be deactivated.",
      500,
    );
  }

  const supabase = await createClient();
  await supabase.auth.signOut();
}
