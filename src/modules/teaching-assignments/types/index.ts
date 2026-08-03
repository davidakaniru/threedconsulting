import type { Enums } from "@/types/database";

export type TeachingAssignmentStatus = Enums<"teaching_assignment_status">;

export interface TeachingAssignment {
  id: string;
  teacherId: string;
  programmeId: string;
  status: TeachingAssignmentStatus;
  primaryInstructor: boolean;
  assignedBy: string | null;
  assignedAt: string;
  createdAt: string;
  updatedAt: string;
  teacher: {
    firstName: string | null;
    lastName: string | null;
    email: string;
    employeeId: string;
  };
  programme: {
    name: string;
    slug: string;
    status: "draft" | "published" | "archived";
  };
}

export interface TeachingAssignmentListResult {
  assignments: TeachingAssignment[];
  total: number;
}
