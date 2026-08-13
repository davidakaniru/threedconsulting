import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { AuthDecorations } from "@/components/auth/auth-decorations";
import { AuthLogo } from "@/components/auth/auth-logo";
import { BackgroundBlob } from "@/components/shared/background-blob";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getRoleRedirect } from "@/lib/utils";

interface AuthLayoutProps {
  children: ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const cookieStore = await cookies();
  const passwordRecovery =
    cookieStore.get("threed_password_recovery")?.value === "1";
  const user = await getCurrentUser();

  // Supabase password recovery creates a temporary authenticated session.
  // Let that session reach /reset-password instead of treating it like a
  // normal login and redirecting it to the user's portal.
  if (user?.status === "active" && !passwordRecovery) {
    redirect(getRoleRedirect(user.role));
  }

  return (
    <main
      className="relative min-h-svh overflow-hidden
        bg-linear-to-br from-sky-50 via-cream to-orange-50
        px-5 py-8 sm:px-8 sm:py-10 lg:py-12"
    >
      <BackgroundBlob className="-left-32 -top-32 size-104 bg-sky-200/60" />
      <BackgroundBlob className="-bottom-36 -right-32 size-112 bg-purple/20" />
      <BackgroundBlob className="left-[43%] top-[38%] size-72 bg-coral/10" />
      <AuthDecorations />

      <div
        className="relative z-10 mx-auto grid min-h-[calc(100svh-4rem)]
          max-w-6xl items-center justify-center gap-10"
      >
        <div className="mx-auto w-full flex flex-col items-center justify-center">
          <AuthLogo compact className="mb-7" />
          {children}
        </div>
      </div>
    </main>
  );
}
