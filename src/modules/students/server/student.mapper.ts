import type { Tables } from "@/types/database";
import type { StudentDetail, StudentSummary } from "@/modules/students/types";

export type StudentRow = Tables<"students">;

export function mapStudentSummary(row: StudentRow, photoUrl: string | null = null): StudentSummary {
  return {
    id: row.id,
    admissionNumber: row.admission_number,
    firstName: row.first_name,
    middleName: row.middle_name,
    lastName: row.last_name,
    dateOfBirth: row.date_of_birth,
    gender: row.gender as StudentSummary["gender"],
    status: row.status,
    admissionDate: row.admission_date,
    photoUrl,
    createdAt: row.created_at,
  };
}

export function mapStudentDetail(row: StudentRow, photoUrl: string | null = null): StudentDetail {
  return {
    ...mapStudentSummary(row, photoUrl),
    notes: row.notes,
    updatedAt: row.updated_at,
  };
}
