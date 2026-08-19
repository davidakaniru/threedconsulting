
import * as yup from "yup";

export const tutorApplicationSchema = yup
  .object({
    firstName: yup
      .string()
      .trim()
      .required("Please enter your first name.")
      .max(80),
    lastName: yup
      .string()
      .trim()
      .required("Please enter your last name.")
      .max(80),
    email: yup
      .string()
      .trim()
      .lowercase()
      .email("Please enter a valid email address.")
      .required("Please enter your email address."),
    phone: yup
      .string()
      .trim()
      .required("Please enter your phone number.")
      .min(7)
      .max(30),
    addressLine1: yup
      .string()
      .trim()
      .required("Please enter your address.")
      .max(180),
    city: yup.string().trim().required("Please enter your city.").max(100),
    country: yup.string().trim().required("Please enter your country.").max(100),

    gender: yup
      .string()
      .oneOf(
        ["female", "male"],
        "Please select an option.",
      )
      .required("Please select your gender."),
    dateOfBirth: yup
      .string()
      .required("Please enter your date of birth.")
      .matches(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date of birth."),
    summary: yup
      .string()
      .trim()
      .required("Please provide a brief summary about yourself.")
      .min(30, "Please provide at least 30 characters.")
      .max(1000, "Please keep your summary under 1,000 characters."),

    expertise: yup
      .string()
      .trim()
      .required("Please tell us your areas of expertise.")
      .min(2)
      .max(1000),
    qualifications: yup
      .string()
      .trim()
      .required("Please tell us about your qualifications.")
      .min(2)
      .max(1000),
  })
  .required();

export type TutorApplicationValues = yup.InferType<typeof tutorApplicationSchema>;
