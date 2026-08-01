import type { Enums } from "@/types/database";

export type StudentStatus = Enums<"student_status">;
export type StudentGender = "male" | "female" | "other" | "prefer_not_to_say";

export interface StudentSummary {
  id: string;
  admissionNumber: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string;
  gender: StudentGender | null;
  status: StudentStatus;
  admissionDate: string;
  photoUrl: string | null;
  createdAt: string;
}

export interface StudentParentLink { id:string; firstName:string; lastName:string; email:string; phone:string|null; relationship:string; isPrimaryContact:boolean; }

export interface StudentDetail extends StudentSummary {
  notes: string | null;
  parents?: StudentParentLink[];
  updatedAt: string;
}

export interface StudentListResult {
  students: StudentSummary[];
  total: number;
  page: number;
  pageSize: number;
}

export interface StudentMetricsI {
  total: number;
  active: number;
  inactive: number;
  graduated: number;
}
