"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { SelectOption } from "@/types/form";

interface SelectFieldProps {
  id: string;
  name?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  info?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  errorMessage?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

function SelectField({
  id,
  name,
  label,
  required,
  disabled,
  placeholder = "Select an option",
  info,
  options,
  value,
  defaultValue,
  onValueChange,
  errorMessage,
  className,
  triggerClassName,
  contentClassName,
}: SelectFieldProps) {
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;

  return (
    <div
      data-slot="select-field"
      className={cn("flex w-full flex-col gap-2", className)}
    >
      {label && (
        <label
          htmlFor={id}
          className="font-display text-sm font-bold text-foreground"
        >
          {label}
          {required && (
            <>
              <span aria-hidden="true" className="ml-1 text-coral">
                *
              </span>
              <span className="sr-only"> required</span>
            </>
          )}
        </label>
      )}

      <Select
        name={name}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        required={required}
      >
        <SelectTrigger
          id={id}
          errorMessage={errorMessage}
          className={triggerClassName}
          aria-describedby={
            errorMessage ? errorId : info ? descriptionId : undefined
          }
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent className={contentClassName}>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {errorMessage ? (
        <p
          id={errorId}
          role="alert"
          className="text-xs font-medium text-destructive"
        >
          {errorMessage}
        </p>
      ) : (
        info && (
          <p
            id={descriptionId}
            className="text-xs leading-relaxed text-muted-foreground"
          >
            {info}
          </p>
        )
      )}
    </div>
  );
}

export { SelectField };
