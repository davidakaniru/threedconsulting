import { ApiError } from "@/lib/api/errors";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { SubmitLessonRequest } from "@/modules/lesson-requests/schemas";
import type {
  ParentEnrolmentChild,
  ParentLessonRequest,
} from "@/modules/lesson-requests/types";

function relationOne<T>(value: T | T[] | null | undefined): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : (value ?? null);
}

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

  if (!parentId && input.childMode === "existing")
    throw new ApiError(
      "PARENT_SIGN_IN_REQUIRED",
      "Please sign in to request another lesson for an existing child.",
      401,
    );

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

  let existingStudentId: string | null = null;
  let childFirstName = input.childFirstName?.trim() ?? "";
  let childLastName = input.childLastName?.trim() ?? "";
  let childDateOfBirth = input.childDateOfBirth ?? "";

  if (input.childMode === "existing") {
    if (!parentId || !input.existingStudentId)
      throw new ApiError(
        "EXISTING_CHILD_REQUIRED",
        "Please select one of the children linked to your parent account.",
        422,
      );

    const { data: link, error: linkError } = await (admin as any)
      .from("student_parents")
      .select(
        "student_id,students!inner(id,first_name,last_name,date_of_birth,status)",
      )
      .eq("parent_id", parentId)
      .eq("student_id", input.existingStudentId)
      .maybeSingle();

    const student = relationOne((link as any)?.students) as any;
    if (linkError || !link || !student || student.status !== "active")
      throw new ApiError(
        "CHILD_NOT_AVAILABLE",
        "That child is not available on your parent account.",
        403,
      );

    existingStudentId = student.id;
    childFirstName = student.first_name;
    childLastName = student.last_name;
    childDateOfBirth = student.date_of_birth;
  }

  if (!childFirstName || !childLastName || !childDateOfBirth)
    throw new ApiError(
      "CHILD_DETAILS_REQUIRED",
      "Please complete your child's details.",
      422,
    );

  const uniqueDays = [...new Set(input.preferredDays)];
  const { data: request, error } = await (admin as any)
    .from("lesson_requests")
    .insert({
      parent_id: parentId,
      existing_student_id: existingStudentId,
      programme_id: input.programmeId,
      child_first_name: childFirstName,
      child_last_name: childLastName,
      child_date_of_birth: childDateOfBirth,
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
      "id,existing_student_id,child_first_name,child_last_name,current_education_level,preferred_days,preferred_time,duration_months,status,created_at,programmes(id,name,slug)",
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
      studentId: row.existing_student_id ?? null,
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

export async function listParentEnrolmentChildren(
  parentId: string,
): Promise<ParentEnrolmentChild[]> {
  const admin = createAdminClient() as any;
  const [
    { data: links, error: linksError },
    { data: assignments, error: assignmentsError },
  ] = await Promise.all([
    admin
      .from("student_parents")
      .select(
        "student_id,students!inner(id,first_name,middle_name,last_name,date_of_birth,status)",
      )
      .eq("parent_id", parentId),
    admin
      .from("lesson_assignments")
      .select("student_id,current_education_level,created_at")
      .eq("parent_id", parentId)
      .order("created_at", { ascending: false }),
  ]);

  if (linksError || assignmentsError)
    throw new ApiError(
      "PARENT_CHILDREN_LOAD_FAILED",
      "Your linked children could not be loaded.",
      500,
    );

  const latestLevel = new Map<string, string>();
  for (const assignment of assignments ?? []) {
    if (!latestLevel.has(assignment.student_id))
      latestLevel.set(
        assignment.student_id,
        assignment.current_education_level ?? "",
      );
  }

  return (links ?? [])
    .flatMap((link: any) => {
      const student = relationOne(link.students) as any;
      if (!student || student.status !== "active") return [];
      return [
        {
          id: student.id,
          firstName: student.first_name,
          middleName: student.middle_name ?? null,
          lastName: student.last_name,
          fullName: [student.first_name, student.middle_name, student.last_name]
            .filter(Boolean)
            .join(" "),
          dateOfBirth: student.date_of_birth,
          currentEducationLevel: latestLevel.get(student.id) ?? "",
        },
      ];
    })
    .sort((a: ParentEnrolmentChild, b: ParentEnrolmentChild) =>
      a.fullName.localeCompare(b.fullName),
    );
}
