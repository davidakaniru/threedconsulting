import * as yup from "yup";

export const contactSchema = yup
  .object({
    name: yup
      .string()
      .trim()
      .required("Please enter your name.")
      .min(2, "Name must contain at least 2 characters."),

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

    enquiryType: yup.string().required("Please select an enquiry option."),

    message: yup
      .string()
      .trim()
      .required("Please enter your message.")
      .min(10, "Message must contain at least 10 characters.")
      .max(1000, "Message cannot exceed 1,000 characters."),
  })
  .required();

export type ContactFormValues = yup.InferType<typeof contactSchema>;
