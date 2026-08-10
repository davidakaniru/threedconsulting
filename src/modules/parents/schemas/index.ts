import * as yup from "yup";
import { GUARDIAN_RELATIONSHIPS } from "@/modules/parents/constants";
const linkSchema = yup
  .object({
    studentId: yup.string().uuid().required(),
    relationship: yup
      .string()
      .oneOf([...GUARDIAN_RELATIONSHIPS])
      .required(),
    isPrimaryContact: yup.boolean().default(false),
  })
  .required();
const fields = {
  firstName: yup
    .string()
    .trim()
    .required("Please enter the first name.")
    .max(50),
  lastName: yup.string().trim().required("Please enter the last name.").max(50),
  email: yup
    .string()
    .trim()
    .email("Enter a valid email address.")
    .required("Please enter an email address."),
  phone: yup.string().trim().max(20).default(""),
  address: yup.string().trim().max(250).default(""),
  occupation: yup.string().trim().max(100).default(""),
  students: yup
    .array()
    .of(linkSchema)
    .min(1, "Link at least one student.")
    .required(),
};
export const createParentSchema = yup.object(fields).required();
export const updateParentSchema = yup
  .object({ ...fields, email: yup.string().trim().email().required() })
  .required();
export type CreateParentRequest = yup.InferType<typeof createParentSchema>;
export type UpdateParentRequest = yup.InferType<typeof updateParentSchema>;
