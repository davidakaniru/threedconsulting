import * as yup from "yup";

export const loginSchema = yup
  .object({
    email: yup
      .string()
      .trim()
      .required("Please enter your email address.")
      .email("Please enter a valid email address."),

    password: yup.string().required("Please enter your password."),

    rememberMe: yup.boolean().default(false),
  })
  .required();

export type LoginFormValues = yup.InferType<typeof loginSchema>;
export type LoginRequest = LoginFormValues;
