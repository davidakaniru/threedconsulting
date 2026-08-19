import "server-only";

import { ApiError } from "@/lib/api/errors";
import { writeAuditLog } from "@/lib/audit";
import { normalizePagination } from "@/lib/modules";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  LessonRequestDetail,
  LessonRequestListResult,
  LessonRequestMetricsI,
  LessonRequestSummary,
} from "../types";

const db = () => createAdminClient() as any;

function displayName(profile: any) {
  return (
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    profile?.email ||
    "Parent"
  );
}

async function parentProfiles(parentIds: string[]) {
  if (!parentIds.length) return new Map<string, any>();
  const { data, error } = await db()
    .from("profiles")
    .select("id,first_name,last_name,email,phone")
    .in("id", [...new Set(parentIds)]);
  if (error)
    throw new ApiError(
      "LESSON_REQUEST_PARENTS_LOAD_FAILED",
      "Parent details could not be loaded.",
      500,
    );
  return new Map((data ?? []).map((profile: any) => [profile.id, profile]));
}

async function requestSubjects(requestIds: string[]) {
  if (!requestIds.length) return new Map<string, any[]>();
  const { data, error } = await db().from("lesson_request_programmes").select("lesson_request_id,programme_id,programmes(id,name,slug)").in("lesson_request_id", requestIds);
  if (error) throw new ApiError("LESSON_REQUEST_SUBJECTS_LOAD_FAILED", "Enrolment subjects could not be loaded.", 500);
  const map = new Map<string, any[]>();
  for (const row of data ?? []) {
    const list = map.get(row.lesson_request_id) ?? [];
    if (row.programmes) list.push(row.programmes);
    map.set(row.lesson_request_id, list);
  }
  return map;
}

function mapSummary(row: any, profile: any): LessonRequestSummary {
  return {
    id: row.id,
    childName: `${row.child_first_name} ${row.child_last_name}`.trim(),
    parentName: displayName(profile),
    parentEmail: profile?.email ?? "",
    programme: row._subjects?.[0] ?? { id: row.programme_id, name: "Subject", slug: "" },
    subjects: row._subjects ?? [],
    preferredDays: row.preferred_days ?? [],
    preferredTime: row.preferred_time,
    durationMonths: row.duration_months,
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function listLessonRequests(
  params: Record<string, unknown>,
): Promise<LessonRequestListResult> {
  const { page, pageSize, from, to } = normalizePagination(params);
  let query = db()
    .from("lesson_requests")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (params.status && params.status !== "all")
    query = query.eq("status", params.status);
  if (params.search) {
    const search = String(params.search)
      .replace(/[%_,()]/g, " ")
      .trim();
    if (search)
      query = query.or(
        `child_first_name.ilike.%${search}%,child_last_name.ilike.%${search}%`,
      );
  }

  const { data, error, count } = await query;
  if (error)
    throw new ApiError(
      "LESSON_REQUESTS_LOAD_FAILED",
      "Enrolments could not be loaded.",
      500,
    );
  const profiles = await parentProfiles(
    (data ?? []).map((row: any) => row.parent_id),
  );
  const subjectMap = await requestSubjects((data ?? []).map((row: any) => row.id));
  const requests = (data ?? []).map((row: any) => mapSummary({ ...row, _subjects: subjectMap.get(row.id) ?? [] }, profiles.get(row.parent_id)));

  return { requests, total: count ?? requests.length, page, pageSize };
}

export async function getLessonRequest(
  id: string,
): Promise<LessonRequestDetail> {
  const { data, error } = await db()
    .from("lesson_requests")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error)
    throw new ApiError(
      "LESSON_REQUEST_LOAD_FAILED",
      "The enrolment could not be loaded.",
      500,
    );
  if (!data)
    throw new ApiError("LESSON_REQUEST_NOT_FOUND", "Enrolment not found.", 404);
  const profiles = await parentProfiles([data.parent_id]);
  const profile = profiles.get(data.parent_id);
  const subjectMap = await requestSubjects([data.id]);
  const subjects = subjectMap.get(data.id) ?? [];
  return {
    ...mapSummary({ ...data, _subjects: subjects }, profile),
    childFirstName: data.child_first_name,
    childLastName: data.child_last_name,
    childDateOfBirth: data.child_date_of_birth,
    currentEducationLevel: data.current_education_level,
    parentPhone: profile?.phone ?? null,
    additionalMessage: data.additional_message,
    reviewedAt: data.reviewed_at,
    publishedAt: data.published_at,
    matchedTeacherId: data.matched_teacher_id,
    matchedAt: data.matched_at,
    matchedProgrammeId: data.matched_programme_id ?? null,
    matchedTutorName: null,
  };
}

export async function getLessonRequestMetrics(): Promise<LessonRequestMetricsI> {
  const statuses = [undefined, "pending_review", "open", "matched"] as const;
  const results = await Promise.all(
    statuses.map((status) => {
      let query = db()
        .from("lesson_requests")
        .select("id", { count: "exact", head: true });
      if (status) query = query.eq("status", status);
      return query;
    }),
  );
  if (results.some((result: any) => result.error))
    throw new ApiError(
      "LESSON_REQUEST_METRICS_FAILED",
      "Enrolment metrics could not be loaded.",
      500,
    );
  return {
    total: results[0].count ?? 0,
    pendingReview: results[1].count ?? 0,
    open: results[2].count ?? 0,
    matched: results[3].count ?? 0,
  };
}

export async function publishLessonRequest(id: string, actorId: string) {
  const client = db();
  const current = await getLessonRequest(id);
  if (current.status !== "pending_review") {
    throw new ApiError(
      "LESSON_REQUEST_NOT_PUBLISHABLE",
      "Only enrolments awaiting review can be published.",
      409,
    );
  }
  const now = new Date().toISOString();
  const { data, error } = await client
    .from("lesson_requests")
    .update({
      status: "open",
      reviewed_by: actorId,
      reviewed_at: now,
      published_at: now,
    })
    .eq("id", id)
    .eq("status", "pending_review")
    .select("id,status,published_at")
    .maybeSingle();
  if (error)
    throw new ApiError(
      "LESSON_REQUEST_PUBLISH_FAILED",
      "The enrolment could not be published.",
      500,
    );
  if (!data)
    throw new ApiError(
      "LESSON_REQUEST_ALREADY_CHANGED",
      "This enrolment has already changed. Refresh and try again.",
      409,
    );
  await writeAuditLog({
    actorId,
    action: "lesson_request.published",
    entityType: "lesson_request",
    entityId: id,
    metadata: { programmeId: current.matchedProgrammeId ?? current.programme?.id ?? null, subjectIds: current.subjects.map((subject) => subject.id) },
  });
  return data;
}


export async function listEligibleTutors(id: string) {
  const request = await getLessonRequest(id);
  const subjectIds = request.subjects.map((s) => s.id);
  if (!subjectIds.length) return [];
  const { data, error } = await db()
    .from("teaching_assignments")
    .select("teacher_id,programme_id,teachers!inner(id,employee_id,employment_status,onboarding_status,profiles!inner(first_name,last_name,email,status)),programmes!inner(id,name,slug)")
    .in("programme_id", subjectIds)
    .eq("status", "active")
    .eq("teachers.employment_status", "active")
    .eq("teachers.onboarding_status", "active")
    .eq("teachers.profiles.status", "active");
  if (error) throw new ApiError("ELIGIBLE_TUTORS_LOAD_FAILED", "Eligible tutors could not be loaded.", 500);
  const seen = new Set<string>();
  return (data ?? []).filter((row: any) => { if (seen.has(row.teacher_id)) return false; seen.add(row.teacher_id); return true; }).map((row: any) => ({ id: row.teacher_id, name: [row.teachers?.profiles?.first_name,row.teachers?.profiles?.last_name].filter(Boolean).join(" ") || row.teachers?.employee_id || "Tutor", email: row.teachers?.profiles?.email ?? "", matchingSubject: row.programmes?.name ?? null }));
}

export async function assignLessonRequest(id: string, teacherId: string, actorId: string) {
  const { data, error } = await db().rpc("admin_assign_lesson_request", { p_lesson_request_id: id, p_teacher_id: teacherId, p_actor_id: actorId });
  if (error) {
    const message = String(error.message ?? "");
    if (message.includes("not eligible")) throw new ApiError("LESSON_REQUEST_TUTOR_NOT_ELIGIBLE", "This tutor is not assigned to any subject selected for the enrolment.", 403);
    throw new ApiError("LESSON_REQUEST_ASSIGN_FAILED", "The tutor could not be assigned to this enrolment.", 409);
  }
  return data;
}
