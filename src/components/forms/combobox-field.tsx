"use client";

import { Combobox } from "@/components/ui/combobox";
import { SelectOption } from "@/types/form";

interface ComboboxFieldProps {
  label?: string;
  required?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  options: SelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  errorMessage?: string;
}

function ComboboxField({
  label,
  required,
  placeholder,
  searchPlaceholder,
  emptyText,
  options,
  value,
  onValueChange,
  errorMessage,
}: ComboboxFieldProps) {
  return (
    <div className="flex w-full flex-col gap-1">
      {label && (
        <label className="flex gap-0.5 font-medium text-xs text-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      )}

      <Combobox
        options={options}
        value={value}
        onValueChange={onValueChange}
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        emptyText={emptyText}
        errorMessage={errorMessage}
      />

      {errorMessage && (
        <p className="text-xs text-destructive">{errorMessage}</p>
      )}
    </div>
  );
}

export { ComboboxField };
