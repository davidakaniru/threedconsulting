import { createAdminClient } from "@/lib/supabase/admin";
import { sanitizeFilterTerm } from "@/lib/repositories";
import type { TablesInsert } from "@/types/database";
import type { TeacherEmploymentStatus } from "@/modules/teachers/types";
import type { UpdateTeacherRequest } from "@/modules/teachers/schemas";
import type { ProfileStatus } from "@/types/auth";

const TEACHER_SELECT =
  "id,employee_id,qualification,specialization,expertise,qualifications,address_line_1,city,country,gender,summary,cv_path,hire_date,employment_status,onboarding_status,invited_at,activated_at,created_at,updated_at,profiles!inner(first_name,last_name,email,avatar_url,status,phone,address,date_of_birth)" as const;

export async function listTeacherRows(
  from: number,
  to: number,
  search?: string,
  status?: string,
) {
  const supabase = createAdminClient();
  const term = sanitizeFilterTerm(search);
  let matchingProfileIds: string[] = [];

  if (term) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "teacher")
      .or(
        `first_name.ilike.%${term}%,last_name.ilike.%${term}%,email.ilike.%${term}%`,
      );
    matchingProfileIds = (profiles ?? []).map((profile) => profile.id);
  }

  let query = supabase
    .from("teachers")
    .select(TEACHER_SELECT, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (status && status !== "all")
    query = query.eq("employment_status", status as TeacherEmploymentStatus);
  if (term) {
    const filters = [`employee_id.ilike.%${term}%`];
    if (matchingProfileIds.length)
      filters.push(`id.in.(${matchingProfileIds.join(",")})`);
    query = query.or(filters.join(","));
  }

  return query;
}

export async function getTeacherRow(id: string) {
  return createAdminClient()
    .from("teachers")
    .select(TEACHER_SELECT)
    .eq("id", id)
    .maybeSingle();
}

export async function employeeIdExists(employeeId: string, excludeId?: string) {
  let query = createAdminClient()
    .from("teachers")
    .select("id")
    .eq("employee_id", employeeId);
  if (excludeId) query = query.neq("id", excludeId);
  return query.maybeSingle();
}

export async function createTeacherRecord(input: TablesInsert<"teachers">) {
  return createAdminClient()
    .from("teachers")
    .insert(input)
    .select("id")
    .single();
}

export async function createTeacherProgrammeAssignments(
  teacherId: string,
  programmeIds: string[],
  actorId: string,
) {
  return createAdminClient()
    .from("teaching_assignments")
    .insert(
      programmeIds.map((programmeId) => ({
        teacher_id: teacherId,
        programme_id: programmeId,
        primary_instructor: false,
        assigned_by: actorId,
      })),
    )
    .select("id");
}

export async function getPublishedProgrammeIds(programmeIds: string[]) {
  return createAdminClient()
    .from("programmes")
    .select("id")
    .in("id", programmeIds)
    .eq("status", "published");
}


export async function getTeacherDeletionDependencies(id: string) {
  const admin = createAdminClient() as any;
  const [lessonAssignments, matchedRequests, sessions, teachingAssignments] =
    await Promise.all([
      admin
        .from("lesson_assignments")
        .select("id", { count: "exact", head: true })
        .eq("teacher_id", id),
      admin
        .from("lesson_requests")
        .select("id", { count: "exact", head: true })
        .eq("matched_teacher_id", id),
      admin
        .from("class_sessions")
        .select("id", { count: "exact", head: true })
        .eq("created_by", id),
      admin
        .from("teaching_assignments")
        .select("id")
        .eq("teacher_id", id),
    ]);

  const failed = [
    lessonAssignments,
    matchedRequests,
    sessions,
    teachingAssignments,
  ].find((result) => result.error);

  if (failed?.error) return { error: failed.error, data: null };

  const assignmentIds = (
    (teachingAssignments.data ?? []) as Array<{ id: string }>
  ).map((assignment) => assignment.id);

  let cohortCount = 0;
  if (assignmentIds.length) {
    const cohorts = await admin
      .from("cohorts")
      .select("id", { count: "exact", head: true })
      .in("teaching_assignment_id", assignmentIds);
    if (cohorts.error) return { error: cohorts.error, data: null };
    cohortCount = cohorts.count ?? 0;
  }

  return {
    error: null,
    data: {
      lessonAssignments: lessonAssignments.count ?? 0,
      matchedRequests: matchedRequests.count ?? 0,
      sessions: sessions.count ?? 0,
      cohorts: cohortCount,
      teachingAssignmentIds: assignmentIds,
    },
  };
}

export async function deleteTeacherTeachingAssignments(teacherId: string) {
  return createAdminClient()
    .from("teaching_assignments")
    .delete()
    .eq("teacher_id", teacherId);
}

export async function configureTeacherProfile(
  id: string,
  values: { first_name: string; last_name: string; email: string },
) {
  return createAdminClient()
    .from("profiles")
    .update({ ...values, role: "teacher", status: "active" })
    .eq("id", id)
    .select("id")
    .single();
}

export async function updateTeacherRecord(
  id: string,
  input: UpdateTeacherRequest,
) {
  const admin = createAdminClient();
  const profileResult = await admin
    .from("profiles")
    .update({
      first_name: input.firstName.trim(),
      last_name: input.lastName.trim(),
      phone: input.phone?.trim() || null,
      address: input.address?.trim() || null,
    })
    .eq("id", id);
  if (profileResult.error) return profileResult;
  return admin
    .from("teachers")
    .update({
      employee_id: input.employeeId.trim(),
      qualification: input.qualification?.trim() || null,
      specialization: input.specialization?.trim() || null,
      expertise: input.specialization?.trim() || null,
      qualifications: input.qualification?.trim() || null,
    })
    .eq("id", id)
    .select("id")
    .single();
}

export async function updateTeacherSelfProfile(
  id: string,
  input: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    addressLine1: string;
    city: string;
    country: string;
    gender: "male" | "female";
    dateOfBirth: string;
    summary: string;
    expertise: string;
    qualifications: string;
  },
) {
  const admin = createAdminClient();
  const authResult = await admin.auth.admin.updateUserById(id, { email: input.email.trim().toLowerCase() });
  if (authResult.error) return { error: authResult.error, data: null };

  const profileResult = await admin
    .from("profiles")
    .update({
      first_name: input.firstName.trim(),
      last_name: input.lastName.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim() || null,
      date_of_birth: input.dateOfBirth || null,
      address: input.addressLine1.trim() || null,
    })
    .eq("id", id);
  if (profileResult.error) return { error: profileResult.error, data: null };

  return admin
    .from("teachers")
    .update({
      address_line_1: input.addressLine1.trim(),
      city: input.city.trim(),
      country: input.country.trim(),
      gender: input.gender,
      summary: input.summary.trim(),
      expertise: input.expertise.trim(),
      qualifications: input.qualifications.trim(),
      // Keep legacy fields in sync for existing public/admin consumers.
      specialization: input.expertise.trim(),
      qualification: input.qualifications.trim(),
    })
    .eq("id", id)
    .select("id")
    .single();
}

export async function updateTeacherCvPath(id: string, cvPath: string | null) {
  return createAdminClient()
    .from("teachers")
    .update({ cv_path: cvPath })
    .eq("id", id)
    .select("id")
    .single();
}

export async function updateEmploymentStatus(
  id: string,
  status: TeacherEmploymentStatus,
) {
  return createAdminClient()
    .from("teachers")
    .update({ employment_status: status })
    .eq("id", id)
    .select("id")
    .single();
}

export async function updateAccountStatus(id: string, status: ProfileStatus) {
  return createAdminClient()
    .from("profiles")
    .update({ status })
    .eq("id", id)
    .select("id")
    .single();
}

export async function markTeacherActivated(id: string) {
  return createAdminClient()
    .from("teachers")
    .update({
      onboarding_status: "active",
      activated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("onboarding_status", "invited")
    .select("id")
    .single();
}

export async function getTeacherCount(filters?: {
  employmentStatus?: TeacherEmploymentStatus;
  onboardingStatus?: "invited" | "active";
}) {
  let query = createAdminClient()
    .from("teachers")
    .select("id", { count: "exact", head: true });
  if (filters?.employmentStatus)
    query = query.eq("employment_status", filters.employmentStatus);
  if (filters?.onboardingStatus)
    query = query.eq("onboarding_status", filters.onboardingStatus);
  return query;
}
