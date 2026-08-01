import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ROLE_PORTAL_PATHS } from "@/lib/constants/auth";
import { toApiError } from "@/lib/api/errors";
import type { UserRole } from "@/types/auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRoleRedirect(role: UserRole): string {
  return ROLE_PORTAL_PATHS[role];
}

export function parseError(error: unknown): string {
  return toApiError(error).message;
}
