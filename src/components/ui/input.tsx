"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  id: string;
  label?: string;
  info?: string;
  errorMessage?: string;
  fieldClassName?: string;
  inputWrapperClassName?: string;
}

function Input({
  className,
  fieldClassName,
  inputWrapperClassName,
  type = "text",
  label,
  name,
  required,
  id,
  info,
  errorMessage,
  disabled,
  ...props
}: InputProps) {
  const [inputType, setInputType] = useState(type);

  const isPassword = type === "password";
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;

  useEffect(() => {
    setInputType(type);
  }, [type]);

  function togglePasswordVisibility() {
    setInputType((currentType) =>
      currentType === "password" ? "text" : "password",
    );
  }

  return (
    <div
      data-slot="input-field"
      className={cn("flex w-full flex-col gap-2", fieldClassName)}
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

      <div className={cn("relative", inputWrapperClassName)}>
        <input
          {...props}
          id={id}
          name={name}
          type={inputType}
          required={required}
          disabled={disabled}
          data-slot="input"
          aria-invalid={Boolean(errorMessage)}
          aria-describedby={
            errorMessage ? errorId : info ? descriptionId : undefined
          }
          className={cn(
            "flex min-h-12 w-full min-w-0 rounded-2xl border",
            "bg-white px-4 py-3 text-sm text-foreground",
            "shadow-[0_6px_20px_-14px_rgba(56,116,189,0.35)]",
            "outline-none transition-[border-color,box-shadow,background-color]",
            "duration-200",
            "placeholder:text-muted-foreground/60",
            "focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10",
            "hover:border-primary/40",
            "disabled:pointer-events-none disabled:cursor-not-allowed",
            "disabled:bg-muted/50 disabled:text-muted-foreground disabled:opacity-70",
            "file:mr-3 file:inline-flex file:h-8 file:rounded-full file:border-0",
            "file:bg-primary/10 file:px-3 file:font-display file:text-sm file:font-bold",
            "file:text-primary",
            isPassword && "pr-12",
            errorMessage && [
              "border-destructive bg-destructive/2.5 ring-4 ring-destructive/10",
              "focus-visible:border-destructive focus-visible:ring-destructive/10",
              "hover:border-destructive",
            ],
            className,
          )}
        />

        {isPassword && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            disabled={disabled}
            aria-label={
              inputType === "password" ? "Show password" : "Hide password"
            }
            aria-pressed={inputType !== "password"}
            className={cn(
              "absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center",
              "rounded-full text-muted-foreground transition-colors",
              "hover:bg-primary/10 hover:text-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
              "disabled:pointer-events-none disabled:opacity-50",
            )}
          >
            {inputType === "password" ? (
              <Eye aria-hidden="true" className="size-4" />
            ) : (
              <EyeOff aria-hidden="true" className="size-4" />
            )}
          </button>
        )}
      </div>

      {errorMessage ? (
        <p id={errorId} role="alert" className="text-xs font-medium text-destructive">
          {errorMessage}
        </p>
      ) : (
        info && (
          <p id={descriptionId} className="text-xs leading-relaxed text-muted-foreground">
            {info}
          </p>
        )
      )}
    </div>
  );
}

export { Input };
