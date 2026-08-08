import "server-only";

import { ApiError } from "@/lib/api/errors";
import { createAdminClient } from "@/lib/supabase/admin";

const db = () => createAdminClient() as any;

export interface TeacherOpportunity {
  id: string; childName: string; currentEducationLevel: string; programme: { id: string; name: string; slug: string };
  preferredDays: string[]; preferredTime: string; durationMonths: number; additionalMessage: string | null;
  publishedAt: string | null; status: string;
}

function mapOpportunity(row: any): TeacherOpportunity {
  return { id: row.id, childName: `${row.child_first_name} ${row.child_last_name}`.trim(), currentEducationLevel: row.current_education_level,
    programme: row.programmes ?? { id: row.programme_id, name: "Programme", slug: "" },
    preferredDays: row.preferred_days ?? [], preferredTime: row.preferred_time, durationMonths: row.duration_months,
    additionalMessage: row.additional_message, publishedAt: row.published_at, status: row.status };
}

export async function listTeacherOpportunities(teacherId: string) {
  const { data: assignments, error: assignmentError } = await db().from("teaching_assignments")
    .select("programme_id").eq("teacher_id", teacherId).eq("status", "active");
  if (assignmentError) throw new ApiError("OPPORTUNITIES_ELIGIBILITY_FAILED", "Teaching eligibility could not be loaded.", 500);
  const programmeIds = [...new Set((assignments ?? []).map((item: any) => item.programme_id))];
  if (!programmeIds.length) return [];
  const { data, error } = await db().from("lesson_requests").select("*,programmes(id,name,slug)")
    .eq("status", "open").is("matched_teacher_id", null).in("programme_id", programmeIds)
    .order("published_at", { ascending: true });
  if (error) throw new ApiError("OPPORTUNITIES_LOAD_FAILED", "Available teaching opportunities could not be loaded.", 500);
  return (data ?? []).map(mapOpportunity);
}

export async function listMatchedTeacherEnrolments(teacherId: string) {
  const { data, error } = await db().from("lesson_requests").select("*,programmes(id,name,slug)")
    .eq("matched_teacher_id", teacherId).in("status", ["matched", "active"]).order("matched_at", { ascending: false });
  if (error) throw new ApiError("MATCHED_ENROLMENTS_LOAD_FAILED", "Your accepted enrolments could not be loaded.", 500);
  return (data ?? []).map(mapOpportunity);
}

export async function claimTeacherOpportunity(id: string, teacherId: string) {
  const { data, error } = await db().rpc("claim_open_lesson_request", { p_lesson_request_id: id, p_teacher_id: teacherId });
  if (error) {
    const message = String(error.message ?? "");
    if (message.includes("already been taken")) throw new ApiError("OPPORTUNITY_ALREADY_TAKEN", "This enrolment has already been taken by another teacher.", 409);
    if (message.includes("not eligible")) throw new ApiError("OPPORTUNITY_NOT_ELIGIBLE", "You are not eligible for this enrolment.", 403);
    throw new ApiError("OPPORTUNITY_CLAIM_FAILED", "The enrolment could not be accepted.", 500);
  }
  return data;
}
