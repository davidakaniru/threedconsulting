import { ApiError } from "@/lib/api/errors";
import { writeAuditLog } from "@/lib/audit";
import { nullableText } from "@/lib/mappers";
import { normalizePagination } from "@/lib/modules";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type {
  CreateTeacherRequest,
  UpdateTeacherRequest,
} from "@/modules/teachers/schemas";
import type {
  TeacherAction,
  TeacherDetail,
  TeacherListResult,
  TeacherMetricsI,
} from "@/modules/teachers/types";
import {
  mapTeacherDetail,
  mapTeacherSummary,
  type TeacherJoinedRow,
} from "@/modules/teachers/server/teacher.mapper";
import {
  configureTeacherProfile,
  createTeacherRecord,
  createTeacherProgrammeAssignments,
  employeeIdExists,
  getPublishedProgrammeIds,
  getTeacherRow,
  getTeacherDeletionDependencies,
  deleteTeacherTeachingAssignments,
  listTeacherRows,
  markTeacherActivated,
  updateAccountStatus,
  updateEmploymentStatus,
  updateTeacherRecord,
  getTeacherCount,
} from "@/modules/teachers/server/teacher.repository";

export async function getTeachers(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}): Promise<TeacherListResult> {
  const { page, pageSize, from, to } = normalizePagination(params);
  const { data, error, count } = await listTeacherRows(
    from,
    to,
    params.search,
    params.status,
  );
  if (error) {
    console.error("Unable to list teachers", error);
    throw new ApiError(
      "TEACHERS_LOAD_FAILED",
      "Teachers could not be loaded.",
      500,
    );
  }
  return {
    teachers: ((data ?? []) as unknown as TeacherJoinedRow[]).map(
      mapTeacherSummary,
    ),
    total: count ?? 0,
    page,
    pageSize,
  };
}

export async function getTeacher(id: string): Promise<TeacherDetail> {
  const { data, error } = await getTeacherRow(id);
  if (error)
    throw new ApiError(
      "TEACHER_LOAD_FAILED",
      "The teacher could not be loaded.",
      500,
    );
  if (!data) throw new ApiError("TEACHER_NOT_FOUND", "Teacher not found.", 404);
  return mapTeacherDetail(data as unknown as TeacherJoinedRow);
}

export async function getTeacherMetrics(): Promise<TeacherMetricsI> {
  const [total, active, invited, onLeave] = await Promise.all([
    getTeacherCount(),
    getTeacherCount({ employmentStatus: "active" }),
    getTeacherCount({ onboardingStatus: "invited" }),
    getTeacherCount({ employmentStatus: "on_leave" }),
  ]);
  const failed = [total, active, invited, onLeave].find(
    (result) => result.error,
  );
  if (failed?.error)
    throw new ApiError(
      "TEACHER_METRICS_FAILED",
      "Teacher metrics could not be loaded.",
      500,
    );
  return {
    total: total.count ?? 0,
    active: active.count ?? 0,
    invited: invited.count ?? 0,
    onLeave: onLeave.count ?? 0,
  };
}

export async function inviteTeacher(
  input: CreateTeacherRequest,
  origin: string,
  actorId: string,
) {
  const programmeIds = [...new Set(input.programmeIds)];
  const programmeResult = await getPublishedProgrammeIds(programmeIds);
  if (programmeResult.error)
    throw new ApiError(
      "PROGRAMMES_CHECK_FAILED",
      "Programme assignments could not be validated.",
      500,
    );
  if ((programmeResult.data ?? []).length !== programmeIds.length)
    throw new ApiError(
      "PROGRAMME_NOT_AVAILABLE",
      "One or more selected programmes are no longer available.",
      422,
    );

  const admin = createAdminClient();
  const { data: invite, error: inviteError } =
    await admin.auth.admin.inviteUserByEmail(input.email, {
      redirectTo: `${origin}/auth/confirm?next=/set-password`,
      data: {
        first_name: input.firstName.trim(),
        last_name: input.lastName.trim(),
      },
    });
  if (inviteError || !invite.user) {
    if (inviteError?.message?.toLowerCase().includes("already"))
      throw new ApiError(
        "TEACHER_EMAIL_EXISTS",
        "An account already exists with that email address.",
        409,
      );
    throw new ApiError(
      "TEACHER_INVITE_FAILED",
      "The teacher invitation could not be sent.",
      500,
    );
  }
  try {
    const profileResult = await configureTeacherProfile(invite.user.id, {
      first_name: input.firstName.trim(),
      last_name: input.lastName.trim(),
      email: input.email.trim().toLowerCase(),
    });
    if (profileResult.error) throw profileResult.error;
    const teacherResult = await createTeacherRecord({
      id: invite.user.id,
      qualification: nullableText(input.qualification),
      specialization: nullableText(input.specialization),
      employment_status: "active",
      onboarding_status: "invited",
    });
    if (teacherResult.error) throw teacherResult.error;
    const assignmentResult = await createTeacherProgrammeAssignments(
      invite.user.id,
      programmeIds,
      actorId,
    );
    if (assignmentResult.error) throw assignmentResult.error;
    return { id: invite.user.id, email: input.email };
  } catch (error) {
    await admin.auth.admin.deleteUser(invite.user.id);
    console.error("Teacher provisioning rolled back", error);
    throw new ApiError(
      "TEACHER_PROVISION_FAILED",
      "The teacher account could not be provisioned. No partial account was kept.",
      500,
    );
  }
}


export async function deleteTeacher(id: string, actorId: string) {
  const teacher = await getTeacher(id);
  const dependencies = await getTeacherDeletionDependencies(id);

  if (dependencies.error || !dependencies.data)
    throw new ApiError(
      "TEACHER_DELETE_CHECK_FAILED",
      "The teacher account could not be checked for linked records.",
      500,
    );

  const {
    lessonAssignments,
    matchedRequests,
    sessions,
    cohorts,
  } = dependencies.data;

  if (lessonAssignments || matchedRequests || sessions || cohorts) {
    throw new ApiError(
      "TEACHER_HAS_HISTORY",
      "This teacher has teaching history and cannot be deleted. Mark the teacher as former and suspend the account instead.",
      409,
      {
        lessonAssignments: String(lessonAssignments),
        matchedRequests: String(matchedRequests),
        sessions: String(sessions),
        cohorts: String(cohorts),
      },
    );
  }

  const assignmentDelete = await deleteTeacherTeachingAssignments(id);
  if (assignmentDelete.error)
    throw new ApiError(
      "TEACHER_ASSIGNMENTS_DELETE_FAILED",
      "The teacher's programme assignments could not be removed.",
      500,
    );

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(id);
  if (error)
    throw new ApiError(
      "TEACHER_DELETE_FAILED",
      "The teacher account could not be deleted.",
      500,
    );

  await writeAuditLog({
    actorId,
    action: "teacher.deleted",
    entityType: "teacher",
    entityId: id,
    metadata: {
      employeeId: teacher.employeeId,
      email: teacher.email,
    },
  });

  return {
    id,
    email: teacher.email,
    employeeId: teacher.employeeId,
  };
}

export async function updateTeacher(id: string, input: UpdateTeacherRequest) {
  await getTeacher(id);
  const duplicate = await employeeIdExists(input.employeeId.trim(), id);
  if (duplicate.error)
    throw new ApiError(
      "TEACHER_CHECK_FAILED",
      "Teacher details could not be validated.",
      500,
    );
  if (duplicate.data)
    throw new ApiError(
      "EMPLOYEE_ID_EXISTS",
      "That employee ID is already in use.",
      409,
    );
  const result = await updateTeacherRecord(id, input);
  if (result.error)
    throw new ApiError(
      "TEACHER_UPDATE_FAILED",
      "The teacher could not be updated.",
      500,
    );
  return getTeacher(id);
}

export async function performTeacherAction(
  id: string,
  action: TeacherAction,
  origin: string,
) {
  const teacher = await getTeacher(id);
  if (action.type === "employment_status") {
    const result = await updateEmploymentStatus(id, action.status);
    if (result.error)
      throw new ApiError(
        "TEACHER_STATUS_FAILED",
        "Employment status could not be updated.",
        500,
      );
  } else if (action.type === "account_status") {
    const result = await updateAccountStatus(id, action.status);
    if (result.error)
      throw new ApiError(
        "ACCOUNT_STATUS_FAILED",
        "Account status could not be updated.",
        500,
      );
  } else {
    if (teacher.onboardingStatus !== "invited")
      throw new ApiError(
        "INVITATION_NOT_AVAILABLE",
        "This teacher has already activated the account.",
        409,
      );
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(teacher.email, {
      redirectTo: `${origin}/auth/confirm?next=/set-password`,
    });
    if (error)
      throw new ApiError(
        "INVITATION_RESEND_FAILED",
        "The activation email could not be resent.",
        500,
      );
  }
  return getTeacher(id);
}

export async function setInvitedTeacherPassword(
  userId: string,
  password: string,
) {
  const admin = createAdminClient();
  const { data: teacher, error } = await admin
    .from("teachers")
    .select("onboarding_status")
    .eq("id", userId)
    .maybeSingle();
  if (error || !teacher || teacher.onboarding_status !== "invited")
    throw new ApiError(
      "INVITE_SETUP_UNAVAILABLE",
      "This invitation has already been completed or is not valid.",
      403,
    );
  const { error: passwordError } = await admin.auth.admin.updateUserById(
    userId,
    { password },
  );
  if (passwordError)
    throw new ApiError(
      "PASSWORD_SETUP_FAILED",
      "Your password could not be set.",
      500,
    );
  const activated = await markTeacherActivated(userId);
  if (activated.error)
    throw new ApiError(
      "TEACHER_ACTIVATION_FAILED",
      "Your account was updated, but onboarding could not be completed.",
      500,
    );
}
