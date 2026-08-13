import * as yup from "yup";

export const resetPasswordSchema = yup
  .object({
    password: yup
      .string()
      .required("Please enter your new password.")
      .min(8, "Password must contain at least 8 characters.")
      .matches(/[a-z]/, "Password must include a lowercase letter.")
      .matches(/[A-Z]/, "Password must include an uppercase letter.")
      .matches(/[0-9]/, "Password must include a number."),
    confirmPassword: yup
      .string()
      .required("Please confirm your new password.")
      .oneOf([yup.ref("password")], "Passwords do not match."),
  })
  .required();

export type ResetPasswordFormValues = yup.InferType<typeof resetPasswordSchema>;
