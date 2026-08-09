import type { ReactNode } from "react";
import Link from "next/link";
import { UserRound } from "lucide-react";

import { BrandLogo } from "@/components/shared/brand-logo";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/portal/logout-button";
import type { AuthenticatedUser } from "@/types/auth";

interface PortalPageProps {
  user: AuthenticatedUser;
  title: string;
  description: string;
  children?: ReactNode;
}

export function PortalPage({
  user,
  title,
  description,
  children,
}: PortalPageProps) {
  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;

  return (
    <main className="min-h-svh bg-cream px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <BrandLogo priority />
        </div>
        <header className="flex flex-col gap-5 rounded-3xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-wider text-primary">
              {user.role} portal
            </p>
            <h1 className="mt-2 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
              {title}
            </h1>
            <p className="mt-2 text-muted-foreground">Welcome, {name}.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild variant="outline">
              <Link href="/portal/profile">
                <UserRound aria-hidden="true" className="size-4" />
                Profile
              </Link>
            </Button>
            <LogoutButton />
          </div>
        </header>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <p className="max-w-2xl leading-7 text-muted-foreground">
            {description}
          </p>
          {children}
        </section>
      </div>
    </main>
  );
}
