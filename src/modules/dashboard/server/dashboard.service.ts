import { getProgrammeMetrics } from "@/modules/programmes/server";
import { getParentMetrics } from "@/modules/parents/server";
import { getStudentMetrics } from "@/modules/students/server";
import { getTeacherMetrics } from "@/modules/teachers/server";
import type { AdminDashboardMetrics } from "@/modules/dashboard/types";

/**
 * Aggregates cross-domain metrics for the Admin dashboard.
 *
 * Each domain remains responsible for its own exact-count queries. The
 * dashboard only composes their results, keeping count rules consistent
 * between the dashboard and the corresponding management pages.
 */
export async function getAdminDashboardMetrics(): Promise<AdminDashboardMetrics> {
  const [teachers, students, parents, programmes] = await Promise.all([
    getTeacherMetrics(),
    getStudentMetrics(),
    getParentMetrics(),
    getProgrammeMetrics(),
  ]);

  return {
    teachers,
    students,
    parents,
    programmes,
  };
}
