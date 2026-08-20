import "server-only";

import { ApiError } from "@/lib/api/errors";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyAdminLessonAccepted } from "@/lib/email/admin-notifications";
import type { TeacherOpportunity } from "../types";

const db = () => createAdminClient() as any;


function mapOpportunity(row: any): TeacherOpportunity {
  return {
    id: row.id,
    childName: `${row.child_first_name} ${row.child_last_name}`.trim(),
    currentEducationLevel: row.current_education_level,
    programme: row.programmes ?? { id: row.programme_id, name: "Subject", slug: "" },
    subjects: row._subjects ?? (row.programmes ? [row.programmes] : []),
    matchedProgrammeId: row.matched_programme_id ?? null,
    preferredDays: row.preferred_days ?? [],
    preferredTime: row.preferred_time,
    durationMonths: row.duration_months,
    additionalMessage: row.additional_message,
    publishedAt: row.published_at,
    status: row.status,
  };
}

export async function listTeacherOpportunities(teacherId: string) {
  const { data: assignments, error: assignmentError } = await db()
    .from("teaching_assignments")
    .select("programme_id")
    .eq("teacher_id", teacherId)
    .eq("status", "active");
  if (assignmentError)
    throw new ApiError(
      "OPPORTUNITIES_ELIGIBILITY_FAILED",
      "Teaching eligibility could not be loaded.",
      500,
    );
  const programmeIds = [
    ...new Set((assignments ?? []).map((item: any) => item.programme_id)),
  ];
  if (!programmeIds.length) return [];
  const { data, error } = await db()
    .from("lesson_requests")
    .select("*,programmes!lesson_requests_programme_id_fkey(id,name,slug)")
    .eq("status", "open")
    .is("matched_teacher_id", null)
    .order("published_at", { ascending: true });
  if (error)
    throw new ApiError(
      "OPPORTUNITIES_LOAD_FAILED",
      "Available teaching opportunities could not be loaded.",
      500,
    );
  const requests = (data ?? []).filter((row: any) => programmeIds.includes(row.programme_id));
  const ids = requests.map((row: any) => row.id);
  const subjectMap = new Map<string, any[]>();
  if (ids.length) {
    const { data: selected } = await db().from("lesson_request_programmes").select("lesson_request_id,programme_id,programmes(id,name,slug)").in("lesson_request_id", ids);
    for (const row of selected ?? []) subjectMap.set(row.lesson_request_id, [...(subjectMap.get(row.lesson_request_id) ?? []), row.programmes]);
  }
  return requests.filter((row: any) => (subjectMap.get(row.id) ?? []).some((subject: any) => programmeIds.includes(subject.id))).map((row: any) => mapOpportunity({ ...row, _subjects: subjectMap.get(row.id) ?? [] }));
}

export async function listMatchedTeacherEnrolments(teacherId: string) {
  const { data, error } = await db()
    .from("lesson_requests")
    .select("*,programmes!lesson_requests_programme_id_fkey(id,name,slug)")
    .eq("matched_teacher_id", teacherId)
    .in("status", ["matched", "active"])
    .order("matched_at", { ascending: false });
  if (error)
    throw new ApiError(
      "MATCHED_ENROLMENTS_LOAD_FAILED",
      "Your accepted enrolments could not be loaded.",
      500,
    );
  return (data ?? []).map(mapOpportunity);
}

export async function claimTeacherOpportunity(id: string, teacherId: string) {
  const { data, error } = await db().rpc("claim_open_lesson_request", {
    p_lesson_request_id: id,
    p_teacher_id: teacherId,
  });
  if (error) {
    const message = String(error.message ?? "");
    if (message.includes("already been taken"))
      throw new ApiError(
        "OPPORTUNITY_ALREADY_TAKEN",
        "This enrolment has already been taken by another teacher.",
        409,
      );
    if (message.includes("not eligible"))
      throw new ApiError(
        "OPPORTUNITY_NOT_ELIGIBLE",
        "You are not eligible for this enrolment.",
        403,
      );
    throw new ApiError(
      "OPPORTUNITY_CLAIM_FAILED",
      "The enrolment could not be accepted.",
      500,
    );
  }

  await notifyAdminLessonAccepted(id, teacherId);
  return data;
}
