import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

function getSafeRedirect(request: NextRequest, nextValue: string | null) {
  const fallback = new URL("/portal/parent", request.url);
  if (!nextValue) return fallback;

  try {
    const target = new URL(nextValue, request.url);
    return target.origin === request.nextUrl.origin ? target : fallback;
  } catch {
    return fallback;
  }
}

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type") as EmailOtpType | null;
  const redirectTo = getSafeRedirect(
    request,
    request.nextUrl.searchParams.get("next"),
  );

  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");
  redirectTo.searchParams.delete("next");

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });

    if (!error) {
      return NextResponse.redirect(redirectTo);
    }
  }

  const errorUrl = new URL("/auth-error", request.url);
  return NextResponse.redirect(errorUrl);
}
