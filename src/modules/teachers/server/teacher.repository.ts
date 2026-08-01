import { createAdminClient } from "@/lib/supabase/admin";
import { sanitizeFilterTerm } from "@/lib/repositories";
import type { TablesInsert } from "@/types/database";
import type { TeacherEmploymentStatus } from "@/modules/teachers/types";
import type { UpdateTeacherRequest } from "@/modules/teachers/schemas";
import type { ProfileStatus } from "@/types/auth";

const TEACHER_SELECT = "id,employee_id,qualification,specialization,hire_date,employment_status,onboarding_status,invited_at,activated_at,created_at,updated_at,profiles!inner(first_name,last_name,email,avatar_url,status,phone,address,date_of_birth)" as const;

export async function listTeacherRows(from: number, to: number, search?: string, status?: string) {
  const supabase = createAdminClient();
  const term = sanitizeFilterTerm(search);
  let matchingProfileIds: string[] = [];

  if (term) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "teacher")
      .or(`first_name.ilike.%${term}%,last_name.ilike.%${term}%,email.ilike.%${term}%`);
    matchingProfileIds = (profiles ?? []).map((profile) => profile.id);
  }

  let query = supabase
    .from("teachers")
    .select(TEACHER_SELECT, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (status && status !== "all") query = query.eq("employment_status", status as TeacherEmploymentStatus);
  if (term) {
    const filters = [`employee_id.ilike.%${term}%`];
    if (matchingProfileIds.length) filters.push(`id.in.(${matchingProfileIds.join(",")})`);
    query = query.or(filters.join(","));
  }

  return query;
}

export async function getTeacherRow(id: string) {
  return createAdminClient().from("teachers").select(TEACHER_SELECT).eq("id", id).maybeSingle();
}

export async function employeeIdExists(employeeId: string, excludeId?: string) {
  let query = createAdminClient().from("teachers").select("id").eq("employee_id", employeeId);
  if (excludeId) query = query.neq("id", excludeId);
  return query.maybeSingle();
}

export async function createTeacherRecord(input: TablesInsert<"teachers">) {
  return createAdminClient().from("teachers").insert(input).select("id").single();
}

export async function configureTeacherProfile(id: string, values: { first_name: string; last_name: string; email: string }) {
  return createAdminClient().from("profiles").update({ ...values, role: "teacher", status: "active" }).eq("id", id).select("id").single();
}

export async function updateTeacherRecord(id: string, input: UpdateTeacherRequest) {
  const admin = createAdminClient();
  const profileResult = await admin.from("profiles").update({
    first_name: input.firstName.trim(),
    last_name: input.lastName.trim(),
    phone: input.phone?.trim() || null,
    address: input.address?.trim() || null,
  }).eq("id", id);
  if (profileResult.error) return profileResult;
  return admin.from("teachers").update({
    employee_id: input.employeeId.trim(),
    qualification: input.qualification?.trim() || null,
    specialization: input.specialization?.trim() || null,
  }).eq("id", id).select("id").single();
}

export async function updateEmploymentStatus(id: string, status: TeacherEmploymentStatus) {
  return createAdminClient().from("teachers").update({ employment_status: status }).eq("id", id).select("id").single();
}

export async function updateAccountStatus(id: string, status: ProfileStatus) {
  return createAdminClient().from("profiles").update({ status }).eq("id", id).select("id").single();
}

export async function markTeacherActivated(id: string) {
  return createAdminClient().from("teachers").update({ onboarding_status: "active", activated_at: new Date().toISOString() }).eq("id", id).eq("onboarding_status", "invited").select("id").single();
}


export async function getTeacherCount(filters?: { employmentStatus?: TeacherEmploymentStatus; onboardingStatus?: "invited" | "active" }) {
  let query = createAdminClient().from("teachers").select("id", { count: "exact", head: true });
  if (filters?.employmentStatus) query = query.eq("employment_status", filters.employmentStatus);
  if (filters?.onboardingStatus) query = query.eq("onboarding_status", filters.onboardingStatus);
  return query;
}
