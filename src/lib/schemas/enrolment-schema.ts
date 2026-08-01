import * as yup from "yup";

export const enrolmentSchema = yup
  .object({
    childFirstName: yup
      .string()
      .trim()
      .required("Please enter your child’s first name.")
      .min(2, "Name must contain at least 2 characters.")
      .max(50, "Name cannot exceed 50 characters."),

    childAge: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value,
      )
      .typeError("Please enter your child’s age.")
      .required("Please enter your child’s age.")
      .integer("Age must be a whole number.")
      .min(4, "Your child must be at least 4 years old.")
      .max(16, "Our programmes are currently for ages 4–16."),

    preferredFormat: yup
      .string()
      .required("Please select a preferred learning format."),

    programmes: yup
      .array()
      .of(yup.string().required())
      .min(1, "Please select at least one programme.")
      .required(),

    parentName: yup
      .string()
      .trim()
      .required("Please enter the parent or guardian’s name.")
      .min(2, "Name must contain at least 2 characters.")
      .max(80, "Name cannot exceed 80 characters."),

    email: yup
      .string()
      .trim()
      .required("Please enter your email address.")
      .email("Please enter a valid email address."),

    phone: yup
      .string()
      .trim()
      .required("Please enter your phone number.")
      .matches(/^[+\d][\d\s()-]{6,19}$/, "Please enter a valid phone number."),

    additionalInformation: yup
      .string()
      .trim()
      .max(1000, "Additional information cannot exceed 1,000 characters.")
      .optional(),

    acceptedTerms: yup
      .boolean()
      .oneOf([true], "You must agree to the terms and safeguarding policy.")
      .required(),
  })
  .required();

export type EnrolmentFormValues = yup.InferType<typeof enrolmentSchema>;
