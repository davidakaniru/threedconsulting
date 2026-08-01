import type { Metadata } from "next";

import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Request a secure link to reset your account password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard size="sm">
      <ForgotPasswordForm />
    </AuthCard>
  );
}
