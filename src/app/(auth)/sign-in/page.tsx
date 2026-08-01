import type { Metadata } from "next";

import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/forms/login-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to access your dashboard.",
};

export default function LoginPage() {
  return (
    <AuthCard size="md">
      <LoginForm />
    </AuthCard>
  );
}
