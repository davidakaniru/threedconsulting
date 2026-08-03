import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  Home,
  MessageSquare,
  Settings,
  UserRound,
  Users,
} from "lucide-react";

import type { UserRole } from "@/types/auth";

export interface PortalNavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  enabled: boolean;
  /** Reserved for the permissions layer planned after the core domain modules. */
  permission?: string;
}

export const portalNavigation: Record<UserRole, readonly PortalNavigationItem[]> = {
  admin: [
    { label: "Dashboard", href: "/portal/admin", icon: Home, enabled: true },
    { label: "Teachers", href: "/portal/admin/teachers", icon: GraduationCap, enabled: true, permission: "teachers.read" },
    { label: "Programmes", href: "/portal/admin/programmes", icon: BookOpen, enabled: true, permission: "programmes.read" },
    { label: "Classes", href: "/portal/admin/classes", icon: BookOpen, enabled: false, permission: "classes.read" },
    { label: "Students", href: "/portal/admin/students", icon: Users, enabled: true, permission: "students.read" },
    { label: "Parents", href: "/portal/admin/parents", icon: UserRound, enabled: true, permission: "parents.read" },
    { label: "Messages", href: "/portal/admin/messages", icon: MessageSquare, enabled: false, permission: "messages.read" },
    { label: "Settings", href: "/portal/profile", icon: Settings, enabled: true },
  ],
  teacher: [
    { label: "Dashboard", href: "/portal/teacher", icon: Home, enabled: true },
    { label: "My programmes", href: "/portal/teacher/programmes", icon: BookOpen, enabled: true },
    { label: "My classes", href: "/portal/teacher/classes", icon: BookOpen, enabled: false },
    { label: "Students", href: "/portal/teacher/students", icon: Users, enabled: false },
    { label: "Attendance", href: "/portal/teacher/attendance", icon: CalendarDays, enabled: false },
    { label: "Messages", href: "/portal/teacher/messages", icon: MessageSquare, enabled: false },
    { label: "Settings", href: "/portal/profile", icon: Settings, enabled: true },
  ],
  parent: [
    { label: "Dashboard", href: "/portal/parent", icon: Home, enabled: true },
    { label: "Messages", href: "/portal/parent/messages", icon: MessageSquare, enabled: false },
    { label: "Settings", href: "/portal/profile", icon: Settings, enabled: true },
  ],
} as const;

export function isPortalNavigationItemActive(
  pathname: string,
  item: PortalNavigationItem,
  role: UserRole,
): boolean {
  const dashboard = `/portal/${role}`;
  return pathname === item.href || (
    item.href !== dashboard && pathname.startsWith(`${item.href}/`)
  );
}

export function findPortalNavigationItem(pathname: string, role: UserRole) {
  return [...portalNavigation[role]]
    .sort((left, right) => right.href.length - left.href.length)
    .find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
}
