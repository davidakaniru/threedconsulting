import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getPublicEnvironment } from "@/lib/config/env";

export function createAdminClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!secretKey) throw new Error("Missing required environment variable: SUPABASE_SECRET_KEY");
  const { supabaseUrl } = getPublicEnvironment();
  return createClient<Database>(supabaseUrl, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });
}
