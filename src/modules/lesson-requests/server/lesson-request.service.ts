import { ApiError } from "@/lib/api/errors";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { SubmitLessonRequest } from "@/modules/lesson-requests/schemas";
import type { ParentLessonRequest } from "@/modules/lesson-requests/types";

async function currentParentId() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("id,role,status")
    .eq("id", data.user.id)
    .maybeSingle();
  if (!profile || profile.role !== "parent" || profile.status !== "active")
    throw new ApiError(
      "PARENT_ACCOUNT_REQUIRED",
      "Please use a parent account to enrol a child.",
      403,
    );
  return profile.id;
}

export async function submitUnifiedLessonRequest(
  input: SubmitLessonRequest,
  origin: string,
) {
  let parentId = await currentParentId();
  let requiresEmailConfirmation = false;
  const admin = createAdminClient();
  let createdUserId: string | null = null;

  if (!parentId) {
    if (
      !input.email ||
      !input.password ||
      !input.parentFirstName ||
      !input.parentLastName ||
      !input.phone
    )
      throw new ApiError(
        "ACCOUNT_DETAILS_REQUIRED",
        "Please complete your parent account details.",
        422,
      );
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email: input.email.trim().toLowerCase(),
      password: input.password,
      options: {
        emailRedirectTo: `${origin}/portal/parent`,
        data: {
          first_name: input.parentFirstName.trim(),
          last_name: input.parentLastName.trim(),
        },
      },
    });
    if (error || !data.user)
      throw new ApiError(
        "ACCOUNT_CREATE_FAILED",
        error?.message ?? "Your parent account could not be created.",
        error?.status === 422 ? 409 : 500,
      );
    if (
      Array.isArray(data.user.identities) &&
      data.user.identities.length === 0
    )
      throw new ApiError(
        "ACCOUNT_EXISTS",
        "An account already exists with this email. Please sign in to enrol another child.",
        409,
      );
    parentId = data.user.id;
    createdUserId = data.user.id;
    requiresEmailConfirmation = data.session === null;
    await (admin as any)
      .from("profiles")
      .update({ phone: input.phone.trim() })
      .eq("id", parentId);
  }

  const uniqueDays = [...new Set(input.preferredDays)];
  const { data: request, error } = await (admin as any)
    .from("lesson_requests")
    .insert({
      parent_id: parentId,
      programme_id: input.programmeId,
      child_first_name: input.childFirstName.trim(),
      child_last_name: input.childLastName.trim(),
      child_date_of_birth: input.childDateOfBirth,
      current_education_level: input.currentEducationLevel.trim(),
      preferred_days: uniqueDays,
      preferred_time: input.preferredTime,
      duration_months: input.durationMonths,
      additional_message: input.additionalMessage?.trim() || null,
      status: "pending_review",
    })
    .select("id,status")
    .single();

  if (error || !request) {
    if (createdUserId) await admin.auth.admin.deleteUser(createdUserId);
    console.error("Lesson request creation failed", error);
    throw new ApiError(
      "LESSON_REQUEST_CREATE_FAILED",
      "Your lesson request could not be submitted. Please try again.",
      500,
    );
  }

  return {
    id: request.id as string,
    status: request.status as string,
    requiresEmailConfirmation,
  };
}

export async function listParentLessonRequests(
  parentId: string,
): Promise<ParentLessonRequest[]> {
  const { data, error } = await (createAdminClient() as any)
    .from("lesson_requests")
    .select(
      "id,child_first_name,child_last_name,current_education_level,preferred_days,preferred_time,duration_months,status,created_at,programmes(id,name,slug)",
    )
    .eq("parent_id", parentId)
    .order("created_at", { ascending: false });
  if (error)
    throw new ApiError(
      "PARENT_LESSON_REQUESTS_LOAD_FAILED",
      "Your enrolments could not be loaded.",
      500,
    );
  return (data ?? []).map(
    (row: any): ParentLessonRequest => ({
      id: row.id,
      childName: `${row.child_first_name} ${row.child_last_name}`.trim(),
      currentEducationLevel: row.current_education_level,
      programme: row.programmes ?? { id: "", name: "Programme", slug: "" },
      preferredDays: row.preferred_days ?? [],
      preferredTime: row.preferred_time,
      durationMonths: row.duration_months,
      status: row.status,
      createdAt: row.created_at,
    }),
  );
}
