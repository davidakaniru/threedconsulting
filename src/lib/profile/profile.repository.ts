import { createClient } from "@/lib/supabase/server";
import type { TablesUpdate } from "@/types/database";

const PROFILE_COLUMNS =
  "id,email,first_name,last_name,role,status,avatar_url,phone,date_of_birth,address,preferred_language,created_at,updated_at" as const;

export async function findProfileById(id: string) {
  const supabase = await createClient();
  return supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", id)
    .maybeSingle();
}

export async function updateProfileById(
  id: string,
  changes: Pick<
    TablesUpdate<"profiles">,
    | "first_name"
    | "last_name"
    | "phone"
    | "date_of_birth"
    | "address"
    | "preferred_language"
    | "avatar_url"
  >,
) {
  const supabase = await createClient();
  return supabase
    .from("profiles")
    .update(changes)
    .eq("id", id)
    .select(PROFILE_COLUMNS)
    .single();
}

export async function deactivateProfileById(id: string) {
  const supabase = await createClient();
  return supabase.rpc("deactivate_own_profile", { expected_user_id: id });
}
