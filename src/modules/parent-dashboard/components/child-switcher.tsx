"use client";

import { SelectField } from "@/components/forms/select-field";
import { useChild } from "../context/child-context";

export function ChildSwitcher() {
  const { childId, children, setChildId } = useChild();
  if (children.length <= 1) return null;

  return (
    <SelectField
      id="switch-child"
      label="Switch child"
      value={childId}
      onValueChange={setChildId}
      options={children.map((child) => ({
        value: child.id,
        label: child.fullName,
      }))}
    />
  );
}
