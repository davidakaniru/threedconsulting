import * as yup from "yup";

export const profileSchema = yup
  .object({
    firstName: yup.string().trim().required("Please enter your first name.").max(50),
    lastName: yup.string().trim().required("Please enter your last name.").max(50),
    phone: yup
      .string()
      .trim()
      .max(20, "Phone number must be 20 characters or fewer.")
      .matches(/^[+0-9()\-\s]*$/, "Please enter a valid phone number."),
    dateOfBirth: yup
      .string()
      .trim()
      .test("not-future", "Date of birth cannot be in the future.", (value) => {
        if (!value) return true;
        return new Date(`${value}T00:00:00`) <= new Date();
      }),
    address: yup.string().trim().max(250, "Address must be 250 characters or fewer."),
    preferredLanguage: yup.mixed<"en">().oneOf(["en"]).required(),
  })
  .required();

export type ProfileFormValues = yup.InferType<typeof profileSchema>;
export type ProfileUpdateRequest = ProfileFormValues;

export const passwordChangeSchema = yup
  .object({
    currentPassword: yup.string().required("Please enter your current password."),
    newPassword: yup
      .string()
      .required("Please enter a new password.")
      .min(8, "Password must contain at least 8 characters.")
      .matches(/[a-z]/, "Password must include a lowercase letter.")
      .matches(/[A-Z]/, "Password must include an uppercase letter.")
      .matches(/[0-9]/, "Password must include a number."),
    confirmPassword: yup
      .string()
      .required("Please confirm your new password.")
      .oneOf([yup.ref("newPassword")], "Passwords must match."),
  })
  .required();

export type PasswordChangeFormValues = yup.InferType<typeof passwordChangeSchema>;

export const passwordChangeRequestSchema = yup
  .object({
    currentPassword: yup.string().required("Please enter your current password."),
    newPassword: yup
      .string()
      .required("Please enter a new password.")
      .min(8, "Password must contain at least 8 characters.")
      .matches(/[a-z]/, "Password must include a lowercase letter.")
      .matches(/[A-Z]/, "Password must include an uppercase letter.")
      .matches(/[0-9]/, "Password must include a number."),
  })
  .required();

export type PasswordChangeRequest = yup.InferType<typeof passwordChangeRequestSchema>;
