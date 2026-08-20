import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  FileCheck2,
  GraduationCap,
  Home,
  ListChecks,
  MessagesSquare,
  Settings,
  Star,
  UserRound,
  Users,
} from "lucide-react";
import type { UserRole } from "@/types/auth";

export interface PortalNavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  enabled: boolean;
  permission?: string;
  group?: string;
}

export const portalNavigation: Record<
  UserRole,
  readonly PortalNavigationItem[]
> = {
  admin: [
    { label: "Dashboard", href: "/portal/admin", icon: Home, enabled: true },
    {
      label: "Teachers",
      href: "/portal/admin/teachers",
      icon: GraduationCap,
      enabled: true,
      permission: "teachers.read",
      group: "People",
    },
    {
      label: "Students",
      href: "/portal/admin/students",
      icon: Users,
      enabled: true,
      permission: "students.read",
      group: "People",
    },
    {
      label: "Parents",
      href: "/portal/admin/parents",
      icon: UserRound,
      enabled: true,
      permission: "parents.read",
      group: "People",
    },
    {
      label: "Programmes",
      href: "/portal/admin/programmes",
      icon: BookOpen,
      enabled: true,
      permission: "programmes.read",
      group: "Academics",
    },
    {
      label: "Lesson requests",
      href: "/portal/admin/lesson-requests",
      icon: FileCheck2,
      enabled: true,
      permission: "enrolments.read",
      group: "Academics",
    },
    {
      label: "Sessions",
      href: "/portal/admin/sessions",
      icon: CalendarDays,
      enabled: true,
      permission: "sessions.read",
      group: "Academics",
    },
    {
      label: "Teacher reports",
      href: "/portal/admin/reports/teachers",
      icon: BarChart3,
      enabled: true,
      group: "Academics",
    },
    {
      label: "Reviews",
      href: "/portal/admin/reviews",
      icon: Star,
      enabled: true,
      group: "Quality",
    },
    {
      label: "Contact inquiries",
      href: "/portal/admin/inquiries",
      icon: MessagesSquare,
      enabled: true,
      group: "Communication",
    },
    {
      label: "Settings",
      href: "/portal/profile",
      icon: Settings,
      enabled: true,
      group: "System",
    },
  ],
  teacher: [
    { label: "Dashboard", href: "/portal/teacher", icon: Home, enabled: true },
    {
      label: "Lessons",
      href: "/portal/teacher/lessons",
      icon: BookOpen,
      enabled: true,
    },
    {
      label: "My sessions",
      href: "/portal/teacher/sessions",
      icon: CalendarDays,
      enabled: true,
    },
    {
      label: "Attendance",
      href: "/portal/teacher/attendance",
      icon: ListChecks,
      enabled: true,
    },
    {
      label: "Settings",
      href: "/portal/profile",
      icon: Settings,
      enabled: true,
    },
  ],
  parent: [
    { label: "My children", href: "/portal/parent", icon: Home, enabled: true },
    {
      label: "My enrolments",
      href: "/portal/parent/enrolments",
      icon: FileCheck2,
      enabled: true,
    },
    {
      label: "Settings",
      href: "/portal/profile",
      icon: Settings,
      enabled: true,
    },
  ],
};

export function isPortalNavigationItemActive(
  pathname: string,
  item: PortalNavigationItem,
  role: UserRole,
) {
  const dashboard = `/portal/${role}`;
  return (
    pathname === item.href ||
    (item.href !== dashboard && pathname.startsWith(`${item.href}/`))
  );
}

export function findPortalNavigationItem(pathname: string, role: UserRole) {
  return [...portalNavigation[role]]
    .sort((a, b) => b.href.length - a.href.length)
    .find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    );
}
