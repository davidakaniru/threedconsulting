import type { ProgrammeStatus } from "@/modules/programmes/types";
export const PROGRAMME_STATUSES = [
  "draft",
  "published",
  "archived",
] as const satisfies readonly ProgrammeStatus[];
export const programmeStatusOptions = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
];
