import * as yup from "yup";
import { STUDENT_STATUSES } from "@/modules/students/constants";

const personalFields = {
  firstName: yup
    .string()
    .trim()
    .required("Please enter the student's first name.")
    .max(50),
  middleName: yup.string().trim().max(50).default(""),
  lastName: yup
    .string()
    .trim()
    .required("Please enter the student's last name.")
    .max(50),
  dateOfBirth: yup
    .string()
    .required("Please enter the student's date of birth."),
  gender: yup
    .string()
    .oneOf(["", "male", "female", "other", "prefer_not_to_say"])
    .default(""),
};

const admissionFields = {
  admissionDate: yup.string().required("Please enter the admission date."),
  status: yup
    .string()
    .oneOf([...STUDENT_STATUSES])
    .required(),
  notes: yup.string().trim().max(1000).default(""),
};

export const createStudentSchema = yup
  .object({ ...personalFields, ...admissionFields })
  .required();

export const updateStudentSchema = yup.object(admissionFields).required();

export const updateStudentPersonalSchema = yup
  .object({
    ...personalFields,
    currentEducationLevel: yup
      .string()
      .trim()
      .required("Please enter the student's current class or education level.")
      .max(100),
  })
  .required();

export type CreateStudentRequest = yup.InferType<typeof createStudentSchema>;
export type UpdateStudentRequest = yup.InferType<typeof updateStudentSchema>;
export type UpdateStudentPersonalRequest = yup.InferType<
  typeof updateStudentPersonalSchema
>;
