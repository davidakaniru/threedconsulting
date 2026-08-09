import type { LessonAssignmentView } from "@/modules/lesson-assignments/types";
import type { ClassSession } from "@/modules/sessions/types";
import type { TeachingAssignment } from "@/modules/teaching-assignments/types";

export interface TeacherDashboardMetrics {
  programmes: number;
  activeLessons: number;
  upcomingSessions: number;
  attendancePending: number;
}

export interface TeacherDashboardData {
  metrics: TeacherDashboardMetrics;
  assignments: TeachingAssignment[];
  lessons: LessonAssignmentView[];
  upcomingSessions: ClassSession[];
  attendanceAttention: ClassSession[];
}
