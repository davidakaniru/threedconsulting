import { firstRelation } from "@/lib/mappers";
import type { Homework } from "../types";
export function mapHomework(row: any): Homework {
  const s = firstRelation(row.class_sessions);
  const c = firstRelation(s?.cohorts);
  const ta = firstRelation(c?.teaching_assignments);
  const p = firstRelation(ta?.programmes);
  const t = firstRelation(ta?.teachers);
  const profile = firstRelation(t?.profiles);
  const submissions = Array.isArray(row.homework_submissions)
    ? row.homework_submissions
    : [];
  const count = (status: string) =>
    submissions.filter((x: any) => x.status === status).length;
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
      cohort: {
        id: c?.id ?? "",
        code: c?.code ?? "",
        name: c?.name ?? "",
        programme: { id: p?.id ?? "", name: p?.name ?? "Unknown programme" },
        teacher: {
          id: ta?.teacher_id ?? "",
          name:
            [profile?.first_name, profile?.last_name]
              .filter(Boolean)
              .join(" ") ||
            profile?.email ||
            "Unknown teacher",
        },
      },
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
