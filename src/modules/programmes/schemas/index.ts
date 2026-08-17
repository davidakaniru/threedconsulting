import * as yup from "yup";
import { PROGRAMME_STATUSES } from "@/modules/programmes/constants";
const fields = {
  name: yup
    .string()
    .trim()
    .required("Please enter the subject name.")
    .max(100),
  description: yup.string().trim().max(1000).default(""),
  status: yup
    .string()
    .oneOf([...PROGRAMME_STATUSES])
    .required(),
};
export const createProgrammeSchema = yup.object(fields).required();
export const updateProgrammeSchema = yup.object(fields).required();
export type CreateProgrammeRequest = yup.InferType<
  typeof createProgrammeSchema
>;
export type UpdateProgrammeRequest = yup.InferType<
  typeof updateProgrammeSchema
>;
