import type { SelectOption } from "@/types/form";
import type { StudentStatus } from "@/modules/students/types";

export const STUDENT_STATUSES = ["active", "inactive", "graduated", "withdrawn"] as const satisfies readonly StudentStatus[];

export const studentStatusOptions: SelectOption[] = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Graduated", value: "graduated" },
  { label: "Withdrawn", value: "withdrawn" },
];

export const studentGenderOptions: SelectOption[] = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
  { label: "Prefer not to say", value: "prefer_not_to_say" },
];
