import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { getCohortMetrics } from "@/modules/cohorts/server";
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

  const [metrics, cohortMetrics, enrolments, sessions, cohorts, activity] =
    await Promise.all([
      getAdminDashboardMetrics(),
      getCohortMetrics(),
      client
        .from("enrolment_applications")
        .select("id,child_first_name,child_last_name,parent_name,submitted_at")
        .in("status", ["pending", "under_review"])
        .order("submitted_at", { ascending: false })
        .limit(5),
      client
        .from("class_sessions")
        .select(
          "id,title,start_time,cohorts(code,teaching_assignments(programmes(name),teachers(profiles(first_name,last_name))))",
        )
        .eq("session_date", today)
        .eq("status", "scheduled")
        .order("start_time")
        .limit(6),
      client
        .from("cohorts")
        .select(
          "id,code,name,capacity,teaching_assignments(programmes(name)),cohort_students(id,status)",
        )
        .in("status", ["open", "active"])
        .order("created_at", { ascending: false }),
      client
        .from("audit_logs")
        .select("id,action,entity_type,created_at")
        .order("created_at", { ascending: false })
        .limit(8),
    ]);

  const capacityAlerts = (cohorts.data ?? [])
    .map((row: any) => {
      const memberCount = (row.cohort_students ?? []).filter(
        (member: any) => member.status === "active",
      ).length;
      return {
        id: row.id,
        code: row.code,
        name: row.name,
        programmeName:
          row.teaching_assignments?.programmes?.name ?? "Programme",
        memberCount,
        capacity: row.capacity,
      };
    })
    .filter((row: any) => row.capacity > 0 && row.memberCount / row.capacity >= 0.8)
    .sort((a: any, b: any) => b.memberCount / b.capacity - a.memberCount / a.capacity)
    .slice(0, 5);

  return {
    metrics,
    activeCohorts: cohortMetrics.active,
    pendingEnrolments: (enrolments.data ?? []).map((row: any) => ({
      id: row.id,
      childName: `${row.child_first_name} ${row.child_last_name}`,
      parentName: row.parent_name,
      submittedAt: row.submitted_at,
    })),
    todaySessions: (sessions.data ?? []).map((row: any) => {
      const profile = row.cohorts?.teaching_assignments?.teachers?.profiles;
      return {
        id: row.id,
        title: row.title,
        startTime: row.start_time,
        cohortCode: row.cohorts?.code ?? "Cohort",
        programmeName:
          row.cohorts?.teaching_assignments?.programmes?.name ?? "Programme",
        teacherName:
          [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
          "Teacher",
      };
    }),
    capacityAlerts,
    recentActivity: (activity.data ?? []).map((row: any) => ({
      id: row.id,
      action: row.action,
      entityType: row.entity_type,
      createdAt: row.created_at,
    })),
  };
}
