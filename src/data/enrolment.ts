import type { FieldPath } from "react-hook-form";
import type { EnrolmentFormValues } from "@/lib/schemas/enrolment-schema";

type EnrolmentStep = {
  id: string;
  label: string;
  fields: readonly FieldPath<EnrolmentFormValues>[];
};

export function getEnrolmentSteps(hasParentAccount: boolean) {
  const steps: EnrolmentStep[] = [];
  if (!hasParentAccount)
    steps.push({
      id: "parent",
      label: "Your account",
      fields: [
        "parentFirstName",
        "parentLastName",
        "email",
        "phone",
        "password",
        "confirmPassword",
      ],
    });
  steps.push(
    {
      id: "child",
      label: "Your child",
      fields: [
        "childMode",
        "existingStudentId",
        "childFirstName",
        "childLastName",
        "childDateOfBirth",
        "currentEducationLevel",
      ],
    },
    {
      id: "lesson",
      label: "Lesson request",
      fields: [
        "programmeIds",
        "preferredDays",
        "preferredTime",
        "durationMonths",
        "additionalMessage",
      ],
    },
    { id: "confirm", label: "Review", fields: ["acceptedTerms"] },
  );
  return steps;
}

export const lessonDays = [
  { label: "Monday", value: "monday" },
  { label: "Tuesday", value: "tuesday" },
  { label: "Wednesday", value: "wednesday" },
  { label: "Thursday", value: "thursday" },
  { label: "Friday", value: "friday" },
  { label: "Saturday", value: "saturday" },
] as const;

export const durationOptions = [1, 2, 3, 6, 12].map((months) => ({
  label: `${months} ${months === 1 ? "month" : "months"}`,
  value: String(months),
}));
