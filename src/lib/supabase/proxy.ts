import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import type { Database } from "@/types/database";

import { getPublicEnvironment } from "@/lib/config/env";

export async function updateSession(request: NextRequest) {
  const { supabaseUrl, supabasePublishableKey } = getPublicEnvironment();

  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  try {
    await supabase.auth.getClaims();
  } catch (error) {
    console.error("proxy: supabase.auth.getClaims() failed", error);
  }

  return response;
}
