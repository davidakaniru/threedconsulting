import type { SelectOption } from "@/types/form";

import type { FieldPath } from "react-hook-form";

import type { EnrolmentFormValues } from "@/lib/schemas/enrolment-schema";

type EnrolmentStep = {
  id: string;
  label: string;
  fields: readonly FieldPath<EnrolmentFormValues>[];
};

export const enrolmentSteps = [
  {
    id: "child",
    label: "Your child",
    fields: ["childFirstName", "childAge", "preferredFormat"],
  },
  {
    id: "programmes",
    label: "Choose programmes",
    fields: ["programmes"],
  },
  {
    id: "parent",
    label: "Your details",
    fields: ["parentName", "email", "phone", "additionalInformation"],
  },
  {
    id: "confirm",
    label: "Confirm",
    fields: ["acceptedTerms"],
  },
] as const satisfies readonly EnrolmentStep[];

export const preferredFormatOptions: SelectOption[] = [
  {
    label: "In person",
    value: "in-person",
  },
  {
    label: "Online",
    value: "online",
  },
  {
    label: "A blend of both",
    value: "blended",
  },
];
