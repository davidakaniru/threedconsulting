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

function mapSummary(row: any, profile: any): LessonRequestSummary {
  return {
    id: row.id,
    childName: `${row.child_first_name} ${row.child_last_name}`.trim(),
    parentName: displayName(profile),
    parentEmail: profile?.email ?? "",
    programme: row.programmes ?? {
      id: row.programme_id,
      name: "Subject",
      slug: "",
    },
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
    .select("*,programmes(id,name,slug)", { count: "exact" })
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
  const requests = (data ?? []).map((row: any) =>
    mapSummary(row, profiles.get(row.parent_id)),
  );

  return { requests, total: count ?? requests.length, page, pageSize };
}

export async function getLessonRequest(
  id: string,
): Promise<LessonRequestDetail> {
  const { data, error } = await db()
    .from("lesson_requests")
    .select("*,programmes(id,name,slug)")
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
  return {
    ...mapSummary(data, profile),
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
    metadata: { programmeId: current.programme.id },
  });
  return data;
}
