"use client";

import { SelectField } from "@/components/forms/select-field";
import type { SelectOption } from "@/types/form";

interface FilterSelectProps {
  id: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function FilterSelect({
  id,
  value,
  onValueChange,
  options,
  placeholder = "Filter",
  className,
  disabled,
}: FilterSelectProps) {
  return (
    <SelectField
      id={id}
      value={value}
      onValueChange={onValueChange}
      options={options}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
      triggerClassName="min-h-11 min-w-44 shadow-none"
      contentClassName="min-w-52"
    />
  );
}
