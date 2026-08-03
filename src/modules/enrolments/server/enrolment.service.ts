import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { ApiError } from "@/lib/api/errors";
import { writeAuditLog } from "@/lib/audit";
import { normalizePagination } from "@/lib/modules";
import type {
  SubmitEnrolmentRequest,
  ApproveEnrolmentRequest,
} from "../schemas";
import type {
  EnrolmentDetail,
  EnrolmentListResult,
  EnrolmentMetricsI,
  CohortOption,
} from "../types";
const db = () => createAdminClient() as any;
function map(row: any): EnrolmentDetail {
  return {
    id: row.id,
    childName: `${row.child_first_name} ${row.child_last_name}`,
    childFirstName: row.child_first_name,
    childLastName: row.child_last_name,
    childDateOfBirth: row.child_date_of_birth,
    parentName: row.parent_name,
    email: row.email,
    phone: row.phone,
    preferredFormat: row.preferred_format,
    additionalInformation: row.additional_information,
    status: row.status,
    submittedAt: row.submitted_at,
    reviewNotes: row.review_notes,
    approvedStudentId: row.approved_student_id,
    programmes: (row.enrolment_application_programmes ?? [])
      .map((x: any) => x.programmes)
      .filter(Boolean),
  };
}
export async function submitEnrolment(
  v: SubmitEnrolmentRequest,
  parentId: string,
) {
  const s = db();
  const { data, error } = await s
    .from("enrolment_applications")
    .insert({
      parent_id: parentId,
      child_first_name: v.childFirstName,
      child_last_name: v.childLastName,
      child_date_of_birth: v.childDateOfBirth,
      preferred_format: v.preferredFormat,
      parent_name: v.parentName,
      email: v.email,
      phone: v.phone,
      additional_information: v.additionalInformation?.trim() || null,
    })
    .select("id")
    .single();
  if (error || !data)
    throw new ApiError(
      "ENROLMENT_CREATE_FAILED",
      "Your enrolment could not be submitted.",
      500,
    );
  const rows = v.programmes.map((programme_id) => ({
    application_id: data.id,
    programme_id,
  }));
  const r = await s.from("enrolment_application_programmes").insert(rows);
  if (r.error) {
    await s.from("enrolment_applications").delete().eq("id", data.id);
    throw new ApiError(
      "ENROLMENT_PROGRAMMES_FAILED",
      "Your programme choices could not be saved.",
      500,
    );
  }
  return { id: data.id };
}
export async function listEnrolments(
  params: any,
): Promise<EnrolmentListResult> {
  const { page, pageSize, from, to } = normalizePagination(params);
  let q = db()
    .from("enrolment_applications")
    .select("*,enrolment_application_programmes(programmes(id,name,slug))", {
      count: "exact",
    })
    .order("submitted_at", { ascending: false })
    .range(from, to);
  if (params.status && params.status !== "all")
    q = q.eq("status", params.status);
  if (params.search) {
    const s = String(params.search)
      .replace(/[%_,()]/g, " ")
      .trim();
    if (s)
      q = q.or(
        `child_first_name.ilike.%${s}%,child_last_name.ilike.%${s}%,parent_name.ilike.%${s}%,email.ilike.%${s}%`,
      );
  }
  const { data, error, count } = await q;
  if (error)
    throw new ApiError(
      "ENROLMENTS_LOAD_FAILED",
      "Enrolments could not be loaded.",
      500,
    );
  return {
    applications: (data ?? []).map(map),
    total: count ?? 0,
    page,
    pageSize,
  };
}
export async function getEnrolment(id: string) {
  const { data, error } = await db()
    .from("enrolment_applications")
    .select("*,enrolment_application_programmes(programmes(id,name,slug))")
    .eq("id", id)
    .maybeSingle();
  if (error)
    throw new ApiError(
      "ENROLMENT_LOAD_FAILED",
      "The enrolment could not be loaded.",
      500,
    );
  if (!data)
    throw new ApiError("ENROLMENT_NOT_FOUND", "Enrolment not found.", 404);
  return map(data);
}
export async function getEnrolmentMetrics(): Promise<EnrolmentMetricsI> {
  const s = db();
  const statuses = [
    undefined,
    "pending",
    "under_review",
    "approved",
    "rejected",
  ] as const;
  const r = await Promise.all(
    statuses.map((st) => {
      let q = s
        .from("enrolment_applications")
        .select("id", { count: "exact", head: true });
      if (st) q = q.eq("status", st);
      return q;
    }),
  );
  if (r.some((x: any) => x.error))
    throw new ApiError(
      "ENROLMENT_METRICS_FAILED",
      "Enrolment metrics could not be loaded.",
      500,
    );
  return {
    total: r[0].count ?? 0,
    pending: r[1].count ?? 0,
    underReview: r[2].count ?? 0,
    approved: r[3].count ?? 0,
    rejected: r[4].count ?? 0,
  };
}
export async function getAvailableCohorts(
  programmeIds: string[],
): Promise<CohortOption[]> {
  const { data, error } = await db()
    .from("cohorts")
    .select(
      "id,code,name,capacity,status,teaching_assignments(programme_id,programmes(name)),cohort_students(id,status)",
    )
    .in("status", ["open", "active"]);
  if (error)
    throw new ApiError(
      "COHORT_OPTIONS_FAILED",
      "Available cohorts could not be loaded.",
      500,
    );
  return (data ?? [])
    .map((c: any) => ({
      id: c.id,
      code: c.code,
      name: c.name,
      programmeId: c.teaching_assignments?.programme_id,
      programmeName: c.teaching_assignments?.programmes?.name ?? "Programme",
      memberCount: (c.cohort_students ?? []).filter(
        (m: any) => m.status === "active",
      ).length,
      capacity: c.capacity,
      status: c.status,
    }))
    .filter(
      (c: any) =>
        programmeIds.includes(c.programmeId) && c.memberCount < c.capacity,
    );
}
export async function approveEnrolment(
  id: string,
  v: ApproveEnrolmentRequest,
  actorId: string,
) {
  const { data, error } = await db().rpc("approve_enrolment_application", {
    p_application_id: id,
    p_assignments: v.assignments,
    p_reviewer_id: actorId,
    p_review_notes: v.reviewNotes?.trim() || null,
  });
  if (error)
    throw new ApiError(
      "ENROLMENT_APPROVAL_FAILED",
      error.message || "The enrolment could not be approved.",
      409,
    );
  await writeAuditLog({
    actorId,
    action: "enrolment.approved",
    entityType: "enrolment_application",
    entityId: id,
    metadata: { studentId: data },
  });
  return { studentId: data };
}
export async function rejectEnrolment(
  id: string,
  notes: string,
  actorId: string,
) {
  const s = db();
  const { data, error } = await s
    .from("enrolment_applications")
    .update({
      status: "rejected",
      review_notes: notes.trim(),
      reviewed_by: actorId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .in("status", ["pending", "under_review"])
    .select("id")
    .maybeSingle();
  if (error || !data)
    throw new ApiError(
      "ENROLMENT_REJECT_FAILED",
      "Only pending applications can be rejected.",
      409,
    );
  await writeAuditLog({
    actorId,
    action: "enrolment.rejected",
    entityType: "enrolment_application",
    entityId: id,
    metadata: { reason: notes },
  });
  return { id };
}
export async function getParentEnrolments(parentId: string) {
  const { data, error } = await db()
    .from("enrolment_applications")
    .select("*,enrolment_application_programmes(programmes(id,name,slug))")
    .eq("parent_id", parentId)
    .order("submitted_at", { ascending: false });
  if (error)
    throw new ApiError(
      "PARENT_ENROLMENTS_FAILED",
      "Your enrolments could not be loaded.",
      500,
    );
  return (data ?? []).map(map);
}
