import type { CohortSummary } from "@/modules/cohorts/types";
import type { Homework } from "@/modules/homework/types";
import type { ClassSession } from "@/modules/sessions/types";
import type { TeachingAssignment } from "@/modules/teaching-assignments/types";

export interface TeacherDashboardMetrics {
  programmes: number;
  activeCohorts: number;
  upcomingSessions: number;
  attendancePending: number;
}

export interface TeacherDashboardData {
  metrics: TeacherDashboardMetrics;
  assignments: TeachingAssignment[];
  cohorts: CohortSummary[];
  upcomingSessions: ClassSession[];
  attendanceAttention: ClassSession[];
  homeworkDue: Homework[];
}
