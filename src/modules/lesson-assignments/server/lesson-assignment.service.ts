import "server-only";
import { ApiError } from "@/lib/api/errors";
import { createAdminClient } from "@/lib/supabase/admin";
import type { LessonAssignmentView } from "../types";
const db = () => createAdminClient() as any;

function map(row: any): LessonAssignmentView {
  const profile = row.teachers?.profiles;
  return {
    id: row.id,
    lessonRequestId: row.lesson_request_id,
    teacherId: row.teacher_id,
    teacherName:
      [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
      "Teacher",
    teacherQualification: row.teachers?.qualification ?? null,
    teacherSpecialization: row.teachers?.specialization ?? null,
    studentId: row.student_id,
    studentName:
      [row.students?.first_name, row.students?.last_name]
        .filter(Boolean)
        .join(" ") || "Child",
    parentId: row.parent_id,
    programme: row.programmes ?? {
      id: row.programme_id,
      name: "Programme",
      slug: "",
    },
    preferredDays: row.preferred_days ?? [],
    sessionTime: row.session_time,
    durationMonths: row.duration_months,
    startDate: row.start_date,
    endDate: row.end_date,
    status: row.status,
  };
}
const SELECT =
  "*,programmes(id,name,slug),students(id,first_name,last_name),teachers(id,qualification,specialization,profiles!inner(first_name,last_name))";

export async function getTeacherLessonAssignments(
  teacherId: string,
): Promise<LessonAssignmentView[]> {
  const { data, error } = await db()
    .from("lesson_assignments")
    .select(SELECT)
    .eq("teacher_id", teacherId)
    .order("created_at", { ascending: false });
  if (error)
    throw new ApiError(
      "LESSON_ASSIGNMENTS_LOAD_FAILED",
      "Your teaching assignments could not be loaded.",
      500,
    );
  return (data ?? []).map(map);
}
export async function getParentLessonAssignments(
  parentId: string,
): Promise<LessonAssignmentView[]> {
  const { data, error } = await db()
    .from("lesson_assignments")
    .select(SELECT)
    .eq("parent_id", parentId)
    .order("created_at", { ascending: false });
  if (error)
    throw new ApiError(
      "PARENT_LESSON_ASSIGNMENTS_LOAD_FAILED",
      "Matched lessons could not be loaded.",
      500,
    );
  return (data ?? []).map(map);
}
export async function getLessonAssignmentByRequest(
  requestId: string,
): Promise<LessonAssignmentView | null> {
  const { data, error } = await db()
    .from("lesson_assignments")
    .select(SELECT)
    .eq("lesson_request_id", requestId)
    .maybeSingle();
  if (error)
    throw new ApiError(
      "LESSON_ASSIGNMENT_LOAD_FAILED",
      "Lesson assignment could not be loaded.",
      500,
    );
  return data ? map(data) : null;
}
