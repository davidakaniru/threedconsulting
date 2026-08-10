import type { HomeworkStatus } from "../types";
export const homeworkStatusOptions: Array<{
  label: string;
  value: HomeworkStatus;
}> = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Closed", value: "closed" },
];
