import type { GuardianRelationship } from "@/modules/parents/types";
export const GUARDIAN_RELATIONSHIPS = [
  "mother",
  "father",
  "guardian",
  "foster_parent",
  "other",
] as const;
export const guardianRelationshipOptions = GUARDIAN_RELATIONSHIPS.map(
  (value) => ({
    value,
    label: value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  }),
);
export const relationshipLabel = (value: GuardianRelationship) =>
  guardianRelationshipOptions.find((o) => o.value === value)?.label ?? value;
