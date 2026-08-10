import { createAdminClient } from "@/lib/supabase/admin";
import type { TablesInsert, TablesUpdate } from "@/types/database";
import { sanitizeFilterTerm } from "@/lib/repositories";
const SELECT =
  "id,session_id,title,instructions,due_at,maximum_score,status,created_by,created_at,updated_at,class_sessions!inner(id,title,session_date,lesson_assignment_id,lesson_assignments!inner(id,teacher_id,student_id,programme_id,students(id,first_name,middle_name,last_name),programmes(id,name),teachers(id,profiles(first_name,last_name,email)))),homework_submissions(status)" as const;
export function listHomeworkRows(
  from: number,
  to: number,
  f: {
    search?: string;
    status?: string;
    sessionId?: string;
    teacherId?: string;
  },
) {
  let q = (createAdminClient() as any)
    .from("homework")
    .select(SELECT, { count: "exact" })
    .order("due_at", { ascending: false })
    .range(from, to);
  if (f.search) {
    const s = sanitizeFilterTerm(f.search);
    q = q.or(`title.ilike.%${s}%,instructions.ilike.%${s}%`);
  }
  if (f.status && f.status !== "all") q = q.eq("status", f.status);
  if (f.sessionId) q = q.eq("session_id", f.sessionId);
  if (f.teacherId)
    q = q.eq("class_sessions.lesson_assignments.teacher_id", f.teacherId);
  return q;
}
export function getHomeworkRow(id: string) {
  return (createAdminClient() as any)
    .from("homework")
    .select(SELECT)
    .eq("id", id)
    .maybeSingle();
}
export function insertHomework(input: TablesInsert<"homework">) {
  return (createAdminClient() as any)
    .from("homework")
    .insert(input)
    .select(SELECT)
    .single();
}
export function updateHomeworkRow(id: string, input: TablesUpdate<"homework">) {
  return (createAdminClient() as any)
    .from("homework")
    .update(input)
    .eq("id", id)
    .select(SELECT)
    .single();
}
export function teacherOwnsSession(sessionId: string, teacherId: string) {
  return (createAdminClient() as any)
    .from("class_sessions")
    .select("id,lesson_assignments!inner(teacher_id,status)")
    .eq("id", sessionId)
    .eq("lesson_assignments.teacher_id", teacherId)
    .eq("lesson_assignments.status", "active")
    .maybeSingle();
}
