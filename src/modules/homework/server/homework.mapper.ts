import { firstRelation } from "@/lib/mappers";
import type { Homework } from "../types";
export function mapHomework(row: any): Homework {
  const s = firstRelation(row.class_sessions);
  const la = firstRelation(s?.lesson_assignments);
  const student = firstRelation(la?.students);
  const p = firstRelation(la?.programmes);
  const t = firstRelation(la?.teachers);
  const profile = firstRelation(t?.profiles);
  const studentName =
    [student?.first_name, student?.middle_name, student?.last_name]
      .filter(Boolean)
      .join(" ") || "Child";
  const teacherName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    profile?.email ||
    "Teacher";
  const submissions = Array.isArray(row.homework_submissions)
    ? row.homework_submissions
    : [];
  const count = (status: string) =>
    submissions.filter((x: any) => x.status === status).length;
  const lesson = {
    id: la?.id ?? "",
    student: { id: la?.student_id ?? "", name: studentName },
    programme: { id: p?.id ?? "", name: p?.name ?? "Programme" },
    teacher: { id: la?.teacher_id ?? "", name: teacherName },
  };
  return {
    id: row.id,
    sessionId: row.session_id,
    title: row.title,
    instructions: row.instructions,
    dueAt: row.due_at,
    maximumScore: row.maximum_score == null ? null : Number(row.maximum_score),
    status: row.status,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    session: {
      id: s?.id ?? "",
      title: s?.title ?? "",
      sessionDate: s?.session_date ?? "",
      lesson,
    },
    submissions: {
      pending: count("pending"),
      submitted: count("submitted"),
      graded: count("graded"),
      late: count("late"),
      total: submissions.length,
    },
  };
}
