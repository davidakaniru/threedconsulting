import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/database";

import { getPublicEnvironment } from "@/lib/config/env";

export function createClient() {
  const { supabaseUrl, supabasePublishableKey } = getPublicEnvironment();

  return createBrowserClient<Database>(supabaseUrl, supabasePublishableKey);
}
