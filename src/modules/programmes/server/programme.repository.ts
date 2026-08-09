import { createAdminClient } from "@/lib/supabase/admin";
import { sanitizeFilterTerm } from "@/lib/repositories";
import type { TablesInsert, TablesUpdate } from "@/types/database";
import type { ProgrammeStatus } from "@/modules/programmes/types";
const SELECT =
  "id,name,slug,description,status,created_by,created_at,updated_at" as const;
export function listProgrammeRows(
  from: number,
  to: number,
  search?: string,
  status?: string,
) {
  const term = sanitizeFilterTerm(search);
  let q = createAdminClient()
    .from("programmes")
    .select(SELECT, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);
  if (status && status !== "all") q = q.eq("status", status as ProgrammeStatus);
  if (term)
    q = q.or(
      `name.ilike.%${term}%,slug.ilike.%${term}%,description.ilike.%${term}%`,
    );
  return q;
}
export function getProgrammeRow(id: string) {
  return createAdminClient()
    .from("programmes")
    .select(SELECT)
    .eq("id", id)
    .maybeSingle();
}
export function insertProgramme(input: TablesInsert<"programmes">) {
  return createAdminClient()
    .from("programmes")
    .insert(input)
    .select(SELECT)
    .single();
}
export function updateProgrammeRow(
  id: string,
  input: TablesUpdate<"programmes">,
) {
  return createAdminClient()
    .from("programmes")
    .update(input)
    .eq("id", id)
    .select(SELECT)
    .single();
}
export function getProgrammeCount(status?: ProgrammeStatus) {
  let q = createAdminClient()
    .from("programmes")
    .select("id", { count: "exact", head: true });
  if (status) q = q.eq("status", status);
  return q;
}
