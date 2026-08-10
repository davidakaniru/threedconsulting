import * as yup from "yup";
import { TEACHING_ASSIGNMENT_STATUSES } from "@/modules/teaching-assignments/constants";

export const createTeachingAssignmentSchema = yup
  .object({
    teacherId: yup.string().uuid().required("Please select a teacher."),
    programmeId: yup.string().uuid().required("Please select a programme."),
    primaryInstructor: yup.boolean().default(true),
  })
  .required();

export const updateTeachingAssignmentSchema = yup
  .object({
    status: yup
      .string()
      .oneOf([...TEACHING_ASSIGNMENT_STATUSES])
      .required(),
    primaryInstructor: yup.boolean().required(),
  })
  .required();

export type CreateTeachingAssignmentRequest = yup.InferType<
  typeof createTeachingAssignmentSchema
>;
export type UpdateTeachingAssignmentRequest = yup.InferType<
  typeof updateTeachingAssignmentSchema
>;
