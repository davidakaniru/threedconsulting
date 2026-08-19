import { ApiError } from "@/lib/api/errors";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { notifyAdminNewLessonRequest } from "@/lib/email/admin-notifications";
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
  const programmeIds = [...new Set(input.programmeIds ?? [input.programmeId])].filter(Boolean);
  if (!programmeIds.length)
    throw new ApiError("SUBJECTS_REQUIRED", "Please select at least one subject.", 422);

  const { data: request, error } = await (admin as any)
    .from("lesson_requests")
    .insert({
      parent_id: parentId,
      existing_student_id: existingStudentId,
      programme_id: programmeIds[0],
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

  const { error: subjectLinkError } = await (admin as any)
    .from("lesson_request_programmes")
    .insert(programmeIds.map((programmeId) => ({
      lesson_request_id: request.id,
      programme_id: programmeId,
    })));

  if (subjectLinkError) {
    await admin.from("lesson_requests").delete().eq("id", request.id);
    if (createdUserId) await admin.auth.admin.deleteUser(createdUserId);
    console.error("Lesson request subject links creation failed", subjectLinkError);
    throw new ApiError(
      "LESSON_REQUEST_SUBJECTS_CREATE_FAILED",
      "Your selected subjects could not be saved. Please try again.",
      500,
    );
  }

  await notifyAdminNewLessonRequest(request.id as string);

  return {
    id: request.id as string,
    status: request.status as string,
    requiresEmailConfirmation,
  };
}

export async function listParentLessonRequests(
  parentId: string,
): Promise<ParentLessonRequest[]> {
  const admin = createAdminClient() as any;
  const { data, error } = await admin
    .from("lesson_requests")
    .select(
      "id,existing_student_id,child_first_name,child_last_name,current_education_level,preferred_days,preferred_time,duration_months,status,created_at,programme_id",
    )
    .eq("parent_id", parentId)
    .order("created_at", { ascending: false });

  if (error)
    throw new ApiError(
      "PARENT_LESSON_REQUESTS_LOAD_FAILED",
      "Your enrolments could not be loaded.",
      500,
    );

  const requestIds = (data ?? []).map((row: any) => row.id);
  const subjectMap = new Map<string, { id: string; name: string; slug: string }[]>();

  if (requestIds.length) {
    const { data: selected, error: subjectError } = await admin
      .from("lesson_request_programmes")
      .select("lesson_request_id,programme_id,programmes(id,name,title,slug)")
      .in("lesson_request_id", requestIds);

    if (subjectError)
      throw new ApiError(
        "PARENT_LESSON_REQUEST_SUBJECTS_LOAD_FAILED",
        "Your enrolment subjects could not be loaded.",
        500,
      );

    for (const row of selected ?? []) {
      const programme = Array.isArray(row.programmes)
        ? row.programmes[0]
        : row.programmes;
      if (!programme) continue;
      const subject = {
        id: programme.id,
        name: programme.title ?? programme.name ?? "Subject",
        slug: programme.slug ?? "",
      };
      subjectMap.set(row.lesson_request_id, [
        ...(subjectMap.get(row.lesson_request_id) ?? []),
        subject,
      ]);
    }
  }

  return (data ?? []).map(
    (row: any): ParentLessonRequest => {
      const subjects = subjectMap.get(row.id) ?? [];
      const programme =
        subjects[0] ??
        (row.programme_id
          ? { id: row.programme_id, name: "Subject", slug: "" }
          : { id: "", name: "Subject", slug: "" });

      return {
        id: row.id,
        studentId: row.existing_student_id ?? null,
        childName: `${row.child_first_name} ${row.child_last_name}`.trim(),
        currentEducationLevel: row.current_education_level,
        programme,
        subjects,
        preferredDays: row.preferred_days ?? [],
        preferredTime: row.preferred_time,
        durationMonths: row.duration_months,
        status: row.status,
        createdAt: row.created_at,
      };
    },
  );
}

export async function listParentEnrolmentChildren(
  parentId: string,
): Promise<ParentEnrolmentChild[]> {
  const admin = createAdminClient() as any;
  const { data: links, error: linksError } = await admin
    .from("student_parents")
    .select(
      "student_id,students!inner(id,first_name,middle_name,last_name,date_of_birth,current_education_level,status)",
    )
    .eq("parent_id", parentId);

  if (linksError)
    throw new ApiError(
      "PARENT_CHILDREN_LOAD_FAILED",
      "Your linked children could not be loaded.",
      500,
    );

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
          currentEducationLevel: student.current_education_level ?? "",
        },
      ];
    })
    .sort((a: ParentEnrolmentChild, b: ParentEnrolmentChild) =>
      a.fullName.localeCompare(b.fullName),
    );
}
