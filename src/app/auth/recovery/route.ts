import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

function safeNext(request: NextRequest) {
  const requested = request.nextUrl.searchParams.get("next");
  if (!requested || !requested.startsWith("/") || requested.startsWith("//")) {
    return "/reset-password";
  }
  return requested;
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const next = safeNext(request);
  const code = request.nextUrl.searchParams.get("code");
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type") as EmailOtpType | null;

  let verified = false;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    verified = !error;
    if (error) console.error("Recovery code exchange failed", error);
  } else if (tokenHash && type === "recovery") {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "recovery",
    });
    verified = !error;
    if (error) console.error("Recovery token verification failed", error);
  }

  if (verified) {
    const destination = new URL(next, request.nextUrl.origin);
    const response = NextResponse.redirect(destination);
    response.cookies.set("threed_password_recovery", "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 15 * 60,
    });
    return response;
  }

  const invalid = new URL("/forgot-password", request.nextUrl.origin);
  invalid.searchParams.set("error", "invalid_or_expired_link");
  return NextResponse.redirect(invalid);
}
