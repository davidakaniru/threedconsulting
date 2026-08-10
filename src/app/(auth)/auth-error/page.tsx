import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Confirmation Failed",
};

export default function AuthErrorPage() {
  return (
    <AuthCard size="sm" className="text-center">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="size-8" />
      </span>
      <h1 className="mt-5 font-display text-3xl font-extrabold text-foreground">
        Confirmation link failed
      </h1>
      <p className="mt-3 leading-7 text-muted-foreground">
        This link may be invalid or expired. Try registering again or contact
        support if the problem continues.
      </p>
      <div className="mt-7 grid gap-3">
        <Button asChild size="lg">
          <Link href="/register">Register again</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/sign-in">Return to sign in</Link>
        </Button>
      </div>
    </AuthCard>
  );
}
