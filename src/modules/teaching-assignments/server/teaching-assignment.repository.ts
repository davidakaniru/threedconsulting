import { createAdminClient } from "@/lib/supabase/admin";
import type { TablesInsert, TablesUpdate } from "@/types/database";

const SELECT = "id,teacher_id,programme_id,status,primary_instructor,assigned_by,assigned_at,created_at,updated_at,teachers!inner(employee_id,profiles!inner(first_name,last_name,email)),programmes!inner(name,slug,status)" as const;

export function listAssignmentRows(filters?: { programmeId?: string; teacherId?: string; status?: string }) {
  let query = createAdminClient().from("teaching_assignments").select(SELECT, { count: "exact" }).order("assigned_at", { ascending: false });
  if (filters?.programmeId) query = query.eq("programme_id", filters.programmeId);
  if (filters?.teacherId) query = query.eq("teacher_id", filters.teacherId);
  if (filters?.status && filters.status !== "all") query = query.eq("status", filters.status as "active" | "inactive");
  return query;
}
export function getAssignmentRow(id: string) { return createAdminClient().from("teaching_assignments").select(SELECT).eq("id", id).maybeSingle(); }
export function insertAssignment(input: TablesInsert<"teaching_assignments">) { return createAdminClient().from("teaching_assignments").insert(input).select(SELECT).single(); }
export function updateAssignmentRow(id: string, input: TablesUpdate<"teaching_assignments">) { return createAdminClient().from("teaching_assignments").update(input).eq("id", id).select(SELECT).single(); }
export function deleteAssignmentRow(id: string) { return createAdminClient().from("teaching_assignments").delete().eq("id", id).select("id").single(); }
export function listAssignableTeachers() { return createAdminClient().from("teachers").select("id,employee_id,employment_status,onboarding_status,profiles!inner(first_name,last_name,email,status)").eq("employment_status", "active").eq("onboarding_status", "active").eq("profiles.status", "active").order("created_at", { ascending: false }); }
