import type { Metadata } from "next";

import { AuthCard } from "@/components/auth/auth-card";
import { RegisterForm } from "@/components/forms/register-form";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a parent account to manage enrolments and learning progress.",
};

export default function RegisterPage() {
  return (
    <AuthCard size="lg">
      <RegisterForm />
    </AuthCard>
  );
}
