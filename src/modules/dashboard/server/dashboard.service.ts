import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { getParentMetrics } from "@/modules/parents/server";
import { getProgrammeMetrics } from "@/modules/programmes/server";
import { getStudentMetrics } from "@/modules/students/server";
import { getTeacherMetrics } from "@/modules/teachers/server";
import type {
  AdminDashboardMetrics,
  AdminDashboardOverview,
} from "@/modules/dashboard/types";

export async function getAdminDashboardMetrics(): Promise<AdminDashboardMetrics> {
  const [teachers, students, parents, programmes] = await Promise.all([
    getTeacherMetrics(),
    getStudentMetrics(),
    getParentMetrics(),
    getProgrammeMetrics(),
  ]);
  return { teachers, students, parents, programmes };
}

export async function getAdminDashboardOverview(): Promise<AdminDashboardOverview> {
  const client = createAdminClient() as any;
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  const [metrics, enrolments, sessions, activity] = await Promise.all([
    getAdminDashboardMetrics(),
    client
      .from("lesson_requests")
      .select("id,child_first_name,child_last_name,created_at,programmes(name),parents(profiles(first_name,last_name))")
      .eq("status", "pending_review")
      .order("created_at", { ascending: false })
      .limit(5),
    client
      .from("class_sessions")
      .select("id,title,start_time,cohorts(teaching_assignments(programmes(name),teachers(profiles(first_name,last_name))))")
      .eq("session_date", today)
      .eq("status", "scheduled")
      .order("start_time")
      .limit(6),
    client
      .from("audit_logs")
      .select("id,action,entity_type,created_at")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  return {
    metrics,
    pendingLessonRequests: (enrolments.data ?? []).map((row: any) => ({
      id: row.id,
      childName: `${row.child_first_name} ${row.child_last_name}`,
      parentName: [row.parents?.profiles?.first_name, row.parents?.profiles?.last_name].filter(Boolean).join(" ") || "Parent",
      programmeName: row.programmes?.name ?? "Programme",
      submittedAt: row.created_at,
    })),
    todaySessions: (sessions.data ?? []).map((row: any) => {
      const profile = row.cohorts?.teaching_assignments?.teachers?.profiles;
      return {
        id: row.id,
        title: row.title,
        startTime: row.start_time,
        programmeName: row.cohorts?.teaching_assignments?.programmes?.name ?? "Programme",
        teacherName: [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "Teacher",
      };
    }),
    recentActivity: (activity.data ?? []).map((row: any) => ({
      id: row.id,
      action: row.action,
      entityType: row.entity_type,
      createdAt: row.created_at,
    })),
  };
}
