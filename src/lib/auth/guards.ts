import { redirect } from "next/navigation";

import { ApiError } from "@/lib/api/errors";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getRoleRedirect } from "@/lib/utils";
import type { AuthenticatedUser, UserRole } from "@/types/auth";

export async function requireAuth(): Promise<AuthenticatedUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (user.status !== "active") {
    redirect("/sign-in?reason=account-unavailable");
  }

  return user;
}

export async function requireRole(role: UserRole): Promise<AuthenticatedUser> {
  const user = await requireAuth();

  if (user.role !== role) {
    redirect(getRoleRedirect(user.role));
  }

  return user;
}

export const requireAdmin = () => requireRole("admin");
export const requireTeacher = () => requireRole("teacher");
export const requireParent = () => requireRole("parent");

export async function requireApiRole(
  role: UserRole,
): Promise<AuthenticatedUser> {
  const user = await requireApiAuth();
  if (user.role !== role)
    throw new ApiError(
      "FORBIDDEN",
      "You do not have permission to perform this action.",
      403,
    );
  return user;
}

export const requireApiAdmin = () => requireApiRole("admin");
export const requireApiParent = () => requireApiRole("parent");
export const requireApiTeacher = () => requireApiRole("teacher");

export async function requireApiAuth(): Promise<AuthenticatedUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new ApiError("AUTH_REQUIRED", "Please sign in to continue.", 401);
  }

  if (user.status !== "active") {
    throw new ApiError(
      "ACCOUNT_UNAVAILABLE",
      "This account is not currently available.",
      403,
    );
  }

  return user;
}
