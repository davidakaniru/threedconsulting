"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/auth/use-logout";

export function LogoutButton() {
  const router = useRouter();
  const logoutMutation = useLogout();

  async function handleLogout() {
    try {
      await logoutMutation.mutateAsync();
      router.replace("/sign-in");
      router.refresh();
    } catch {
      // Keep the user on the page so they can retry.
    }
  }

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        onClick={handleLogout}
        disabled={logoutMutation.isPending}
      >
        <LogOut aria-hidden="true" className="size-4" />
        {logoutMutation.isPending ? "Signing out..." : "Sign out"}
      </Button>
      {logoutMutation.error && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {logoutMutation.error.message}
        </p>
      )}
    </div>
  );
}
