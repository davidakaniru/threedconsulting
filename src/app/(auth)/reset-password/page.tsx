import type { Metadata } from "next";
import { cookies } from "next/headers";

import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Create a new password for your account.",
};

export default async function ResetPasswordPage() {
  const cookieStore = await cookies();
  const recoveryAllowed =
    cookieStore.get("threed_password_recovery")?.value === "1";

  return (
    <AuthCard size="sm">
      <ResetPasswordForm recoveryAllowed={recoveryAllowed} />
    </AuthCard>
  );
}
