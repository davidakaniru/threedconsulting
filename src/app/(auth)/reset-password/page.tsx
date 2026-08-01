import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordFormSkeleton } from "@/components/forms/form-skeleton";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Create a new password for your account.",
};

export default function ResetPasswordPage() {
  return (
    <AuthCard size="sm">
      <Suspense fallback={<ResetPasswordFormSkeleton />}>
        <ResetPasswordForm />
      </Suspense>
    </AuthCard>
  );
}
