import "server-only";

import { ApiError } from "@/lib/api/errors";
import { writeAuditLog } from "@/lib/audit";
import { sendTransactionalEmail } from "@/lib/email";
import { normalizePagination } from "@/lib/modules";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  ApproveEnrolmentRequest,
  SubmitEnrolmentRequest,
} from "../schemas";
import type {
  CohortOption,
  EnrolmentDetail,
  EnrolmentListResult,
  EnrolmentMetricsI,
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
      .map((item: any) => item.programmes)
      .filter(Boolean),
  };
}

export async function submitEnrolment(
  values: SubmitEnrolmentRequest,
  parentId: string,
) {
  const client = db();
  const childFirstName = values.childFirstName.trim();
  const childLastName = values.childLastName.trim();

  const { data: possibleDuplicates, error: duplicateError } = await client
    .from("enrolment_applications")
    .select("id,enrolment_application_programmes(programme_id)")
    .eq("parent_id", parentId)
    .eq("child_date_of_birth", values.childDateOfBirth)
    .ilike("child_first_name", childFirstName)
    .ilike("child_last_name", childLastName)
    .in("status", ["pending", "under_review"]);

  if (duplicateError) {
    throw new ApiError(
      "ENROLMENT_DUPLICATE_CHECK_FAILED",
      "We could not verify existing enrolments.",
      500,
    );
  }

  const requestedProgrammeIds = new Set(values.programmes);
  const hasDuplicate = (possibleDuplicates ?? []).some((application: any) =>
    (application.enrolment_application_programmes ?? []).some((item: any) =>
      requestedProgrammeIds.has(item.programme_id),
    ),
  );

  if (hasDuplicate) {
    throw new ApiError(
      "DUPLICATE_ENROLMENT_APPLICATION",
      "A pending enrolment already exists for this child and one of the selected programmes.",
      409,
    );
  }

  const { data, error } = await client
    .from("enrolment_applications")
    .insert({
      parent_id: parentId,
      child_first_name: childFirstName,
      child_last_name: childLastName,
      child_date_of_birth: values.childDateOfBirth,
      preferred_format: values.preferredFormat,
      parent_name: values.parentName.trim(),
      email: values.email.trim().toLowerCase(),
      phone: values.phone.trim(),
      additional_information: values.additionalInformation?.trim() || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new ApiError(
      "ENROLMENT_CREATE_FAILED",
      "Your enrolment could not be submitted.",
      500,
    );
  }

  const programmeRows = values.programmes.map((programmeId) => ({
    application_id: data.id,
    programme_id: programmeId,
  }));
  const programmeResult = await client
    .from("enrolment_application_programmes")
    .insert(programmeRows);

  if (programmeResult.error) {
    await client.from("enrolment_applications").delete().eq("id", data.id);
    throw new ApiError(
      "ENROLMENT_PROGRAMMES_FAILED",
      "Your programme choices could not be saved.",
      500,
    );
  }

  await writeAuditLog({
    actorId: parentId,
    action: "enrolment.submitted",
    entityType: "enrolment_application",
    entityId: data.id,
    metadata: { programmeIds: values.programmes },
  });

  return { id: data.id };
}

export async function listEnrolments(
  params: any,
): Promise<EnrolmentListResult> {
  const { page, pageSize, from, to } = normalizePagination(params);
  let query = db()
    .from("enrolment_applications")
    .select("*,enrolment_application_programmes(programmes(id,name,slug))", {
      count: "exact",
    })
    .order("submitted_at", { ascending: false })
    .range(from, to);

  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }
  if (params.search) {
    const search = String(params.search).replace(/[%_,()]/g, " ").trim();
    if (search) {
      query = query.or(
        `child_first_name.ilike.%${search}%,child_last_name.ilike.%${search}%,parent_name.ilike.%${search}%,email.ilike.%${search}%`,
      );
    }
  }

  const { data, error, count } = await query;
  if (error) {
    throw new ApiError(
      "ENROLMENTS_LOAD_FAILED",
      "Enrolments could not be loaded.",
      500,
    );
  }

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

  if (error) {
    throw new ApiError(
      "ENROLMENT_LOAD_FAILED",
      "The enrolment could not be loaded.",
      500,
    );
  }
  if (!data) {
    throw new ApiError("ENROLMENT_NOT_FOUND", "Enrolment not found.", 404);
  }

  return map(data);
}

export async function getEnrolmentMetrics(): Promise<EnrolmentMetricsI> {
  const client = db();
  const statuses = [
    undefined,
    "pending",
    "under_review",
    "approved",
    "rejected",
  ] as const;

  const results = await Promise.all(
    statuses.map((status) => {
      let query = client
        .from("enrolment_applications")
        .select("id", { count: "exact", head: true });
      if (status) query = query.eq("status", status);
      return query;
    }),
  );

  if (results.some((result: any) => result.error)) {
    throw new ApiError(
      "ENROLMENT_METRICS_FAILED",
      "Enrolment metrics could not be loaded.",
      500,
    );
  }

  return {
    total: results[0].count ?? 0,
    pending: results[1].count ?? 0,
    underReview: results[2].count ?? 0,
    approved: results[3].count ?? 0,
    rejected: results[4].count ?? 0,
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

  if (error) {
    throw new ApiError(
      "COHORT_OPTIONS_FAILED",
      "Available cohorts could not be loaded.",
      500,
    );
  }

  return (data ?? [])
    .map((cohort: any) => ({
      id: cohort.id,
      code: cohort.code,
      name: cohort.name,
      programmeId: cohort.teaching_assignments?.programme_id,
      programmeName:
        cohort.teaching_assignments?.programmes?.name ?? "Programme",
      memberCount: (cohort.cohort_students ?? []).filter(
        (member: any) => member.status === "active",
      ).length,
      capacity: cohort.capacity,
      status: cohort.status,
    }))
    .filter(
      (cohort: any) =>
        programmeIds.includes(cohort.programmeId) &&
        cohort.memberCount < cohort.capacity,
    );
}

export async function approveEnrolment(
  id: string,
  values: ApproveEnrolmentRequest,
  actorId: string,
) {
  const application = await getEnrolment(id);
  const { data, error } = await db().rpc("approve_enrolment_application", {
    p_application_id: id,
    p_assignments: values.assignments,
    p_reviewer_id: actorId,
    p_review_notes: values.reviewNotes?.trim() || null,
  });

  if (error) {
    throw new ApiError(
      "ENROLMENT_APPROVAL_FAILED",
      error.message || "The enrolment could not be approved.",
      409,
    );
  }

  await writeAuditLog({
    actorId,
    action: "enrolment.approved",
    entityType: "enrolment_application",
    entityId: id,
    metadata: { studentId: data, assignments: values.assignments },
  });
  await sendTransactionalEmail({
    to: application.email,
    subject: `Enrolment approved for ${application.childName}`,
    html: `<p>Hello ${application.parentName},</p><p>The enrolment application for <strong>${application.childName}</strong> has been approved.</p><p>You can sign in to your parent portal to view the updated status.</p>`,
  });

  return { studentId: data };
}

export async function rejectEnrolment(
  id: string,
  notes: string,
  actorId: string,
) {
  const application = await getEnrolment(id);
  const { data, error } = await db()
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

  if (error || !data) {
    throw new ApiError(
      "ENROLMENT_REJECT_FAILED",
      "Only pending applications can be rejected.",
      409,
    );
  }

  await writeAuditLog({
    actorId,
    action: "enrolment.rejected",
    entityType: "enrolment_application",
    entityId: id,
    metadata: { reason: notes },
  });
  await sendTransactionalEmail({
    to: application.email,
    subject: `Update on ${application.childName}'s enrolment`,
    html: `<p>Hello ${application.parentName},</p><p>The enrolment application for <strong>${application.childName}</strong> was not approved at this time.</p><p><strong>Review note:</strong> ${notes}</p><p>Please contact the team if you need clarification.</p>`,
  });

  return { id };
}

export async function getParentEnrolments(parentId: string) {
  const { data, error } = await db()
    .from("enrolment_applications")
    .select("*,enrolment_application_programmes(programmes(id,name,slug))")
    .eq("parent_id", parentId)
    .order("submitted_at", { ascending: false });

  if (error) {
    throw new ApiError(
      "PARENT_ENROLMENTS_FAILED",
      "Your enrolments could not be loaded.",
      500,
    );
  }

  return (data ?? []).map(map);
}
