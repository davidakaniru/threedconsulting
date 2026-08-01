import * as yup from "yup";

export const forgotPasswordSchema = yup
  .object({
    email: yup
      .string()
      .trim()
      .required("Please enter your email address.")
      .email("Please enter a valid email address."),
  })
  .required();

export type ForgotPasswordFormValues = yup.InferType<
  typeof forgotPasswordSchema
>;
