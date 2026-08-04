"use client";

import { Baby, ChevronsUpDown } from "lucide-react";
import { SelectField } from "@/components/forms/select-field";
import type { ParentDashboardChild } from "../types";

export function ChildSwitcher({
  children,
  value,
  onValueChange,
}: {
  children: ParentDashboardChild[];
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-primary/15 bg-primary/[0.04] p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
          <Baby className="size-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary">
            Current learner
          </p>
          <p className="text-xs text-muted-foreground">
            Switch to update the whole academic view
          </p>
        </div>
        <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" aria-hidden="true" />
      </div>
      <SelectField
        id="parent-current-child"
        value={value}
        onValueChange={onValueChange}
        options={children.map((child) => ({ value: child.id, label: child.fullName }))}
      />
    </div>
  );
}
