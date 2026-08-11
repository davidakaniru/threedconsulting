import * as yup from "yup";
import { TEACHER_EMPLOYMENT_STATUSES } from "@/modules/teachers/constants";

export const createTeacherSchema = yup
  .object({
    firstName: yup
      .string()
      .trim()
      .required("Please enter the teacher's first name.")
      .max(50),
    lastName: yup
      .string()
      .trim()
      .required("Please enter the teacher's last name.")
      .max(50),
    email: yup
      .string()
      .trim()
      .lowercase()
      .email("Please enter a valid email address.")
      .required("Please enter an email address."),
    qualification: yup.string().trim().max(120).default(""),
    specialization: yup.string().trim().max(120).default(""),
    programmeIds: yup
      .array()
      .of(yup.string().uuid().required())
      .min(1, "Assign at least one programme.")
      .required("Assign at least one programme."),
  })
  .required();

export const updateTeacherSchema = yup
  .object({
    firstName: yup
      .string()
      .trim()
      .required("Please enter the teacher's first name.")
      .max(50),
    lastName: yup
      .string()
      .trim()
      .required("Please enter the teacher's last name.")
      .max(50),
    employeeId: yup
      .string()
      .trim()
      .required("Please enter an employee ID.")
      .min(2)
      .max(40),
    phone: yup.string().trim().max(20).default(""),
    address: yup.string().trim().max(250).default(""),
    qualification: yup.string().trim().max(120).default(""),
    specialization: yup.string().trim().max(120).default(""),
  })
  .required();

export const teacherActionSchema = yup
  .object({
    type: yup
      .string()
      .oneOf(["employment_status", "account_status", "resend_invitation"])
      .required(),
    status: yup.string().when("type", {
      is: "employment_status",
      then: (schema) =>
        schema.oneOf([...TEACHER_EMPLOYMENT_STATUSES]).required(),
      otherwise: (schema) =>
        schema.when("type", {
          is: "account_status",
          then: (s) => s.oneOf(["active", "inactive", "suspended"]).required(),
          otherwise: (s) => s.strip(),
        }),
    }),
  })
  .required();

export const setInvitedPasswordSchema = yup
  .object({
    password: yup
      .string()
      .required("Please enter your password.")
      .min(8, "Password must contain at least 8 characters.")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter.")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .matches(/\d/, "Password must contain at least one number."),

    confirmPassword: yup
      .string()
      .required("Please confirm your password.")
      .oneOf([yup.ref("password")], "Passwords do not match."),
  })
  .required();

export type SetInvitedPasswordRequest = yup.InferType<
  typeof setInvitedPasswordSchema
>;
export type CreateTeacherRequest = yup.InferType<typeof createTeacherSchema>;
export type UpdateTeacherRequest = yup.InferType<typeof updateTeacherSchema>;
export type TeacherActionRequest = yup.InferType<typeof teacherActionSchema>;
