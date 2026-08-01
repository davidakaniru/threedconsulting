import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

interface ProgrammeCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function ProgrammeCheckbox({
  id,
  label,
  checked,
  onCheckedChange,
}: ProgrammeCheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "group flex cursor-pointer items-center gap-3",
        "rounded-2xl border-2 px-4 py-3.5",
        "transition-[border-color,background-color,box-shadow]",
        checked
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-primary/10 bg-white hover:border-primary/35",
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onCheckedChange(event.target.checked)}
        className="peer sr-only"
      />

      <span
        aria-hidden="true"
        className={cn(
          "grid size-5 shrink-0 place-items-center",
          "rounded-md border-2 transition-colors",
          checked
            ? "border-primary bg-primary text-white"
            : "border-primary/25 bg-white",
        )}
      >
        {checked && <Check className="size-3.5" strokeWidth={3} />}
      </span>

      <span className="font-display text-sm font-bold text-foreground">
        {label}
      </span>
    </label>
  );
}
