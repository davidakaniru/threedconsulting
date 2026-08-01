import type { TeacherEmploymentStatus } from "@/modules/teachers/types";

export const TEACHER_EMPLOYMENT_STATUSES = ["active", "on_leave", "former"] as const;
export const TEACHER_ONBOARDING_STATUSES = ["invited", "active"] as const;

export const teacherEmploymentStatusOptions: Array<{ label: string; value: TeacherEmploymentStatus }> = [
  { label: "Active", value: "active" },
  { label: "On leave", value: "on_leave" },
  { label: "Former", value: "former" },
];
