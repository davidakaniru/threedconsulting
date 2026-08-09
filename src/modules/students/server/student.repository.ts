import { createAdminClient } from "@/lib/supabase/admin";
import { sanitizeFilterTerm } from "@/lib/repositories";
import type { TablesInsert, TablesUpdate } from "@/types/database";
import type { StudentStatus } from "@/modules/students/types";

const STUDENT_SELECT =
  "id,admission_number,first_name,middle_name,last_name,date_of_birth,gender,photo_path,status,admission_date,notes,created_at,updated_at" as const;

export function listStudentRows(
  from: number,
  to: number,
  search?: string,
  status?: string,
) {
  const term = sanitizeFilterTerm(search);
  let query = createAdminClient()
    .from("students")
    .select(STUDENT_SELECT, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);
  if (status && status !== "all")
    query = query.eq("status", status as StudentStatus);
  if (term)
    query = query.or(
      `first_name.ilike.%${term}%,middle_name.ilike.%${term}%,last_name.ilike.%${term}%,admission_number.ilike.%${term}%`,
    );
  return query;
}

export function getStudentRow(id: string) {
  return createAdminClient()
    .from("students")
    .select(STUDENT_SELECT)
    .eq("id", id)
    .maybeSingle();
}

export function insertStudent(input: TablesInsert<"students">) {
  return createAdminClient()
    .from("students")
    .insert(input)
    .select(STUDENT_SELECT)
    .single();
}

export function updateStudentRow(id: string, input: TablesUpdate<"students">) {
  return createAdminClient()
    .from("students")
    .update(input)
    .eq("id", id)
    .select(STUDENT_SELECT)
    .single();
}

export function updateStudentPhotoPath(id: string, photoPath: string | null) {
  return createAdminClient()
    .from("students")
    .update({ photo_path: photoPath })
    .eq("id", id)
    .select(STUDENT_SELECT)
    .single();
}

export function getStudentCount(status?: StudentStatus) {
  let query = createAdminClient()
    .from("students")
    .select("id", { count: "exact", head: true });
  if (status) query = query.eq("status", status);
  return query;
}
