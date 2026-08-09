import * as yup from "yup";

const password = yup.string().when("hasParentAccount", {
  is: false,
  then: (schema) =>
    schema
      .required("Please create a password.")
      .min(8, "Password must contain at least 8 characters.")
      .matches(/[a-z]/, "Password must include a lowercase letter.")
      .matches(/[A-Z]/, "Password must include an uppercase letter.")
      .matches(/[0-9]/, "Password must include a number."),
  otherwise: (schema) => schema.optional(),
});

export const enrolmentSchema = yup
  .object({
    hasParentAccount: yup.boolean().required(),
    childMode: yup.string().oneOf(["existing", "new"]).required(),
    existingStudentId: yup.string().when(["hasParentAccount", "childMode"], {
      is: (hasParentAccount: boolean, childMode: string) =>
        hasParentAccount && childMode === "existing",
      then: (schema) =>
        schema.uuid().required("Please select the child this lesson is for."),
      otherwise: (schema) => schema.optional(),
    }),
    parentFirstName: yup.string().when("hasParentAccount", {
      is: false,
      then: (s) => s.trim().required("Please enter your first name.").max(50),
      otherwise: (s) => s.optional(),
    }),
    parentLastName: yup.string().when("hasParentAccount", {
      is: false,
      then: (s) => s.trim().required("Please enter your last name.").max(50),
      otherwise: (s) => s.optional(),
    }),
    email: yup.string().when("hasParentAccount", {
      is: false,
      then: (s) =>
        s
          .trim()
          .lowercase()
          .email("Please enter a valid email address.")
          .required("Please enter your email address."),
      otherwise: (s) => s.optional(),
    }),
    phone: yup.string().when("hasParentAccount", {
      is: false,
      then: (s) =>
        s
          .trim()
          .required("Please enter your phone number.")
          .matches(
            /^[+\d][\d\s()-]{6,19}$/,
            "Please enter a valid phone number.",
          ),
      otherwise: (s) => s.optional(),
    }),
    password,
    confirmPassword: yup.string().when("hasParentAccount", {
      is: false,
      then: (s) =>
        s
          .required("Please confirm your password.")
          .oneOf([yup.ref("password")], "Passwords must match."),
      otherwise: (s) => s.optional(),
    }),
    childFirstName: yup.string().when("childMode", {
      is: "new",
      then: (schema) =>
        schema.trim().required("Please enter your child’s first name.").max(50),
      otherwise: (schema) => schema.optional(),
    }),
    childLastName: yup.string().when("childMode", {
      is: "new",
      then: (schema) =>
        schema.trim().required("Please enter your child’s last name.").max(50),
      otherwise: (schema) => schema.optional(),
    }),
    childDateOfBirth: yup.string().when("childMode", {
      is: "new",
      then: (schema) =>
        schema
          .required("Please enter your child’s date of birth.")
          .test(
            "past",
            "Date of birth cannot be in the future.",
            (value) => !value || new Date(value) <= new Date(),
          ),
      otherwise: (schema) => schema.optional(),
    }),
    currentEducationLevel: yup
      .string()
      .trim()
      .required("Please enter your child’s current class or education level.")
      .max(100, "Please keep the education level under 100 characters."),
    programmeId: yup.string().uuid().required("Please select a subject."),
    preferredDays: yup
      .array()
      .of(
        yup
          .string()
          .oneOf([
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
          ])
          .required(),
      )
      .min(1, "Please select at least one preferred day.")
      .required(),
    preferredTime: yup.string().required("Please select a preferred time."),
    durationMonths: yup
      .number()
      .integer()
      .min(1)
      .max(24)
      .required("Please select how long you want the lessons to run."),
    additionalMessage: yup
      .string()
      .trim()
      .max(2000, "Please keep your message under 2,000 characters.")
      .optional(),
    acceptedTerms: yup
      .boolean()
      .oneOf([true], "You must agree to the terms and privacy policy.")
      .required(),
  })
  .required();

export type EnrolmentFormValues = yup.InferType<typeof enrolmentSchema>;
