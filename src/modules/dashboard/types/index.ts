import type { ParentMetricsI } from "@/modules/parents/types";
import type { ProgrammeMetricsI } from "@/modules/programmes/types";
import type { StudentMetricsI } from "@/modules/students/types";
import type { TeacherMetricsI } from "@/modules/teachers/types";

export interface AdminDashboardMetrics {
  teachers: TeacherMetricsI;
  students: StudentMetricsI;
  parents: ParentMetricsI;
  programmes: ProgrammeMetricsI;
}

export interface AdminDashboardOverview {
  metrics: AdminDashboardMetrics;
  pendingLessonRequests: Array<{
    id: string;
    childName: string;
    parentName: string;
    submittedAt: string;
    programmeName: string;
  }>;
  todaySessions: Array<{
    id: string;
    title: string;
    startTime: string;
    programmeName: string;
    teacherName: string;
  }>;
  recentActivity: Array<{
    id: number;
    action: string;
    entityType: string;
    createdAt: string;
  }>;
}
