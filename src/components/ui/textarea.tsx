import { cn } from "@/lib/utils";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  id: string;
  label?: string;
  info?: string;
  errorMessage?: string;
}

function Textarea({
  className,
  label,
  name,
  id,
  info,
  required,
  errorMessage,
  rows = 5,
  disabled,
  ...props
}: TextareaProps) {
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;

  return (
    <div data-slot="textarea-field" className="flex w-full flex-col gap-2">
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

      <textarea
        {...props}
        id={id}
        name={name}
        rows={rows}
        required={required}
        disabled={disabled}
        data-slot="textarea"
        aria-invalid={Boolean(errorMessage)}
        aria-describedby={
          errorMessage ? errorId : info ? descriptionId : undefined
        }
        className={cn(
          "flex min-h-32 w-full min-w-0 rounded-2xl border",
          "border-border bg-white px-4 py-3",
          "text-sm leading-6 text-foreground",
          "shadow-[0_6px_20px_-14px_rgba(56,116,189,0.35)]",
          "outline-none",
          "transition-[border-color,box-shadow,background-color]",
          "duration-200",

          "placeholder:text-muted-foreground/60",

          "hover:border-primary/40",

          "focus-visible:border-primary",
          "focus-visible:ring-4",
          "focus-visible:ring-primary/10",

          "disabled:pointer-events-none",
          "disabled:cursor-not-allowed",
          "disabled:bg-muted/50",
          "disabled:text-muted-foreground",
          "disabled:opacity-70",

          errorMessage && [
            "border-destructive",
            "bg-destructive/2.5",
            "ring-4 ring-destructive/10",
            "hover:border-destructive",
            "focus-visible:border-destructive",
            "focus-visible:ring-destructive/10",
          ],

          className,
        )}
      />

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

export { Textarea };
