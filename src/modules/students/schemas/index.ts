import * as yup from "yup";
import { STUDENT_STATUSES } from "@/modules/students/constants";

const studentFields = {
  firstName: yup.string().trim().required("Please enter the student's first name.").max(50),
  middleName: yup.string().trim().max(50).default(""),
  lastName: yup.string().trim().required("Please enter the student's last name.").max(50),
  dateOfBirth: yup.string().required("Please enter the student's date of birth."),
  gender: yup.string().oneOf(["", "male", "female", "other", "prefer_not_to_say"]).default(""),
  admissionDate: yup.string().required("Please enter the admission date."),
  status: yup.string().oneOf([...STUDENT_STATUSES]).required(),
  notes: yup.string().trim().max(1000).default(""),
};

export const createStudentSchema = yup.object(studentFields).required();
export const updateStudentSchema = yup.object(studentFields).required();

export type CreateStudentRequest = yup.InferType<typeof createStudentSchema>;
export type UpdateStudentRequest = yup.InferType<typeof updateStudentSchema>;
