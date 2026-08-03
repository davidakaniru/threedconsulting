import type { TeachingAssignment } from "@/modules/teaching-assignments/types";

export type TeachingAssignmentRow = {
  id: string;
  teacher_id: string;
  programme_id: string;
  status: "active" | "inactive";
  primary_instructor: boolean;
  assigned_by: string | null;
  assigned_at: string;
  created_at: string;
  updated_at: string;
  teachers: { employee_id: string; profiles: { first_name: string | null; last_name: string | null; email: string } | Array<{ first_name: string | null; last_name: string | null; email: string }> } | Array<{ employee_id: string; profiles: { first_name: string | null; last_name: string | null; email: string } | Array<{ first_name: string | null; last_name: string | null; email: string }> }>;
  programmes: { name: string; slug: string; status: "draft" | "published" | "archived" } | Array<{ name: string; slug: string; status: "draft" | "published" | "archived" }>;
};

function one<T>(value: T | T[]): T { return Array.isArray(value) ? value[0] : value; }

export function mapTeachingAssignment(row: TeachingAssignmentRow): TeachingAssignment {
  const teacher = one(row.teachers);
  const profile = one(teacher.profiles);
  const programme = one(row.programmes);
  return {
    id: row.id,
    teacherId: row.teacher_id,
    programmeId: row.programme_id,
    status: row.status,
    primaryInstructor: row.primary_instructor,
    assignedBy: row.assigned_by,
    assignedAt: row.assigned_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    teacher: { firstName: profile.first_name, lastName: profile.last_name, email: profile.email, employeeId: teacher.employee_id },
    programme,
  };
}
