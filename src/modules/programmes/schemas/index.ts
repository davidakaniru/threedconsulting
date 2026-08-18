import * as yup from "yup";
import { PROGRAMME_STATUSES } from "@/modules/programmes/constants";

const fields = {
  title: yup.string().trim().required("Please enter the subject title.").max(100),
  slug: yup
    .string()
    .trim()
    .required("Please enter a subject slug.")
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only.")
    .max(120),
  description: yup.string().trim().required("Please enter a description.").max(1000),
  coverImageUrl: yup
    .string()
    .trim()
    .url("Please enter a valid image URL.")
    .when("coverImage", {
      is: (value: FileList | undefined) => !value?.length,
      then: (schema) => schema.required("Please upload a cover image."),
      otherwise: (schema) => schema.notRequired(),
    }),
  overview: yup.string().trim().required("Please enter an overview.").max(3000),
  outcomes: yup
    .array()
    .of(yup.string().trim().required("Each outcome must contain text.").max(300))
    .min(1, "Add at least one learning outcome.")
    .required(),
  status: yup.string().oneOf([...PROGRAMME_STATUSES]).required(),
  coverImage: yup
    .mixed<FileList>()
    .test("single-file", "Please select one cover image.", (value) => !value || value.length <= 1)
    .test("type", "Cover image must be JPG, PNG or WebP.", (value) => {
      if (!value?.length) return true;
      return ["image/jpeg", "image/png", "image/webp"].includes(value[0].type);
    })
    .test("size", "Cover image must be 5 MB or smaller.", (value) => {
      if (!value?.length) return true;
      return value[0].size <= 5 * 1024 * 1024;
    }),
};

export const createProgrammeSchema = yup.object(fields).required();
export const updateProgrammeSchema = yup.object(fields).required();
export type CreateProgrammeRequest = yup.InferType<typeof createProgrammeSchema>;
export type UpdateProgrammeRequest = yup.InferType<typeof updateProgrammeSchema>;
