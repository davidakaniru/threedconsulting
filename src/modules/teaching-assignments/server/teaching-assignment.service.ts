import { ApiError } from "@/lib/api/errors";
import { writeAuditLog } from "@/lib/audit";
import type {
  CreateTeachingAssignmentRequest,
  UpdateTeachingAssignmentRequest,
} from "@/modules/teaching-assignments/schemas";
import type { TeachingAssignmentListResult } from "@/modules/teaching-assignments/types";
import {
  mapTeachingAssignment,
  type TeachingAssignmentRow,
} from "./teaching-assignment.mapper";
import * as repo from "./teaching-assignment.repository";

export async function getTeachingAssignments(filters?: {
  programmeId?: string;
  teacherId?: string;
  status?: string;
}): Promise<TeachingAssignmentListResult> {
  const { data, error, count } = await repo.listAssignmentRows(filters);
  if (error)
    throw new ApiError(
      "ASSIGNMENTS_LOAD_FAILED",
      "Teaching assignments could not be loaded.",
      500,
    );
  return {
    assignments: ((data ?? []) as unknown as TeachingAssignmentRow[]).map(
      mapTeachingAssignment,
    ),
    total: count ?? 0,
  };
}

export async function getAssignableTeachers() {
  const { data, error } = await repo.listAssignableTeachers();
  if (error)
    throw new ApiError(
      "TEACHERS_LOAD_FAILED",
      "Tutors could not be loaded.",
      500,
    );
  return (data ?? []).map((row) => {
    const profile = Array.isArray(row.profiles)
      ? row.profiles[0]
      : row.profiles;
    return {
      id: row.id,
      employeeId: row.employee_id,
      firstName: profile.first_name,
      lastName: profile.last_name,
      email: profile.email,
    };
  });
}

export async function createTeachingAssignment(
  values: CreateTeachingAssignmentRequest,
  actorId: string,
) {
  const { data, error } = await repo.insertAssignment({
    teacher_id: values.teacherId,
    programme_id: values.programmeId,
    primary_instructor: values.primaryInstructor,
    assigned_by: actorId,
  });
  if (error || !data) {
    if (error?.code === "23505")
      throw new ApiError(
        "ASSIGNMENT_EXISTS",
        "This teacher is already assigned to the programme.",
        409,
      );
    throw new ApiError(
      "ASSIGNMENT_CREATE_FAILED",
      "The teaching assignment could not be created.",
      500,
    );
  }
  await writeAuditLog({
    actorId,
    action: "teaching_assignment.created",
    entityType: "teaching_assignment",
    entityId: data.id,
    metadata: { teacherId: values.teacherId, programmeId: values.programmeId },
  });
  return mapTeachingAssignment(data as unknown as TeachingAssignmentRow);
}

export async function updateTeachingAssignment(
  id: string,
  values: UpdateTeachingAssignmentRequest,
  actorId: string,
) {
  const { data, error } = await repo.updateAssignmentRow(id, {
    status: values.status,
    primary_instructor: values.primaryInstructor,
  });
  if (error || !data)
    throw new ApiError(
      "ASSIGNMENT_UPDATE_FAILED",
      "The teaching assignment could not be updated.",
      500,
    );
  await writeAuditLog({
    actorId,
    action: "teaching_assignment.updated",
    entityType: "teaching_assignment",
    entityId: id,
    metadata: values,
  });
  return mapTeachingAssignment(data as unknown as TeachingAssignmentRow);
}

export async function removeTeachingAssignment(id: string, actorId: string) {
  const { error } = await repo.deleteAssignmentRow(id);
  if (error)
    throw new ApiError(
      "ASSIGNMENT_DELETE_FAILED",
      "The teaching assignment could not be removed. Deactivate it instead if active lesson relationships may depend on it.",
      409,
    );
  await writeAuditLog({
    actorId,
    action: "teaching_assignment.removed",
    entityType: "teaching_assignment",
    entityId: id,
  });
  return { id };
}
