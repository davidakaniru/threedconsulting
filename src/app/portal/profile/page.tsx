import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ProfileSettings } from "@/components/profile/profile-settings";
import { BrandLogo } from "@/components/shared/brand-logo";
import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth/guards";
import { getRoleRedirect } from "@/lib/utils";

export default async function ProfilePage() {
  const user = await requireAuth();

  return (
    <main className="min-h-svh bg-cream px-5 py-7 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <BrandLogo priority />
          <Button asChild variant="outline">
            <Link href={getRoleRedirect(user.role)}>
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back to dashboard
            </Link>
          </Button>
        </header>

        <div className="mb-7 mt-10">
          <p className="font-display text-sm font-bold uppercase tracking-wider text-primary">
            Account settings
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            Profile & security
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
            Manage your personal details, profile photo, password, and account
            status.
          </p>
        </div>

        <ProfileSettings initialProfile={user} />
      </div>
    </main>
  );
}
