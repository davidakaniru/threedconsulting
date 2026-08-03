import type { ProgrammeMetricsI } from "@/modules/programmes/types";
import type { ParentMetricsI } from "@/modules/parents/types";
import type { StudentMetricsI } from "@/modules/students/types";
import type { TeacherMetricsI } from "@/modules/teachers/types";

export interface AdminDashboardMetrics {
  teachers: TeacherMetricsI;
  students: StudentMetricsI;
  parents: ParentMetricsI;
  programmes: ProgrammeMetricsI;
}
