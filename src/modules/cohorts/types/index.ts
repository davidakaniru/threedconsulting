import type { Enums } from "@/types/database";
export type CohortStatus = Enums<"cohort_status">;
export interface CohortSummary {
  id: string;
  teachingAssignmentId: string;
  code: string;
  name: string;
  description: string | null;
  capacity: number;
  startDate: string;
  expectedEndDate: string | null;
  status: CohortStatus;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
  teacher: { id: string; name: string; email: string; employeeId: string };
  programme: { id: string; name: string; slug: string };
}
export type CohortDetail = CohortSummary;
export interface CohortListResult {
  cohorts: CohortSummary[];
  total: number;
  page: number;
  pageSize: number;
}
export interface CohortMetricsI {
  total: number;
  draft: number;
  open: number;
  active: number;
  completed: number;
  archived: number;
}
