import * as yup from "yup";

export const lessonReviewSchema = yup
  .object({
    rating: yup
      .number()
      .integer()
      .min(1)
      .max(5)
      .required("Please rate the lesson."),
    lessonOutcome: yup
      .string()
      .trim()
      .min(10, "Tell us a little more about the lesson outcome.")
      .max(2000)
      .required("Please describe your child's outcome or progress."),
    teacherFeedback: yup
      .string()
      .trim()
      .min(10, "Tell us a little more about the teacher.")
      .max(2000)
      .required("Please share your feedback about the teacher."),
    wouldRecommend: yup
      .boolean()
      .required("Please tell us whether you would recommend this teacher."),
    additionalComments: yup.string().trim().max(2000).default(""),
  })
  .required();

export type LessonReviewRequest = yup.InferType<typeof lessonReviewSchema>;
