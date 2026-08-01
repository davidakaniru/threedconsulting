import * as yup from "yup";

export const registerSchema = yup
  .object({
    firstName: yup
      .string()
      .trim()
      .required("Please enter your first name.")
      .max(50, "First name must be 50 characters or fewer."),
    lastName: yup
      .string()
      .trim()
      .required("Please enter your last name.")
      .max(50, "Last name must be 50 characters or fewer."),
    email: yup
      .string()
      .trim()
      .lowercase()
      .required("Please enter your email address.")
      .email("Please enter a valid email address."),
    password: yup
      .string()
      .required("Please create a password.")
      .min(8, "Password must contain at least 8 characters.")
      .matches(/[a-z]/, "Password must include a lowercase letter.")
      .matches(/[A-Z]/, "Password must include an uppercase letter.")
      .matches(/[0-9]/, "Password must include a number."),
    confirmPassword: yup
      .string()
      .required("Please confirm your password.")
      .oneOf([yup.ref("password")], "Passwords must match."),
    acceptedTerms: yup
      .boolean()
      .oneOf([true], "You must accept the terms to create an account.")
      .required(),
  })
  .required();

export type RegisterFormValues = yup.InferType<typeof registerSchema>;
export type RegisterRequest = Omit<RegisterFormValues, "confirmPassword">;
