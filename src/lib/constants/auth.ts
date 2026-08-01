import type { ProfileStatus, UserRole } from "@/types/auth";

export const USER_ROLES = {
  parent: "parent",
  teacher: "teacher",
  admin: "admin",
} as const satisfies Record<UserRole, UserRole>;

export const PROFILE_STATUSES = {
  active: "active",
  inactive: "inactive",
  suspended: "suspended",
} as const satisfies Record<ProfileStatus, ProfileStatus>;

export const ROLE_PORTAL_PATHS: Record<UserRole, string> = {
  parent: "/portal/parent",
  teacher: "/portal/teacher",
  admin: "/portal/admin",
};
