import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthLogo } from "@/components/auth/auth-logo";
import { SetPasswordForm } from "@/components/auth/set-password-form";
import { getCurrentUser } from "@/lib/auth/current-user";
export const metadata: Metadata = { title: "Activate Teacher Account" };
export default async function SetPasswordPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  if (user.role !== "teacher") redirect(`/portal/${user.role}`);
  return (
    <main className="grid min-h-svh place-items-center bg-linear-to-br from-sky-50 via-cream to-orange-50 p-5">
      <div className="w-full max-w-lg">
        <AuthLogo compact className="mb-6 justify-center" />
        <AuthCard size="sm">
          <SetPasswordForm />
        </AuthCard>
      </div>
    </main>
  );
}
