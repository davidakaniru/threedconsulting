import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
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

export const getCurrentUser = cache(
  async (): Promise<AuthenticatedUser | null> => {
    const supabase = await createClient();
    const { data: claimsData, error: claimsError } =
      await supabase.auth.getClaims();

    const userId = claimsData?.claims?.sub;

    if (claimsError || !userId) {
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(
        "id,email,first_name,last_name,role,status,avatar_url,phone,date_of_birth,address,preferred_language,created_at,updated_at",
      )
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("Unable to load the authenticated profile", profileError);
      return null;
    }

    return profile ? mapProfile(profile) : null;
  },
);
