import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

interface EnrolmentStepperProps {
  steps: readonly {
    id: string;
    label: string;
  }[];
  currentStep: number;
}

export function EnrolmentStepper({
  steps,
  currentStep,
}: EnrolmentStepperProps) {
  return (
    <nav aria-label="Enrolment progress">
      <ol className="flex items-start">
        {steps.map((step, index) => {
          const isComplete = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <li
              key={step.id}
              className={cn(
                "flex items-start",
                index < steps.length - 1 && "flex-1",
              )}
            >
              <div className="flex shrink-0 flex-col items-center">
                <span
                  aria-current={isCurrent ? "step" : undefined}
                  className={cn(
                    "grid size-10 place-items-center rounded-full",
                    "font-display text-sm font-extrabold",
                    "transition-colors duration-200",
                    isComplete && "bg-turquoise text-white",
                    isCurrent && "bg-primary text-white",
                    !isComplete && !isCurrent && "bg-primary/10 text-primary",
                  )}
                >
                  {isComplete ? (
                    <>
                      <Check
                        aria-hidden="true"
                        className="size-5"
                        strokeWidth={3}
                      />

                      <span className="sr-only">Completed</span>
                    </>
                  ) : (
                    index + 1
                  )}
                </span>

                <span
                  className={cn(
                    "mt-2 hidden max-w-24 text-center text-xs",
                    "font-semibold sm:block",
                    isCurrent ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "mx-2 mt-4.5 h-1 flex-1 rounded-full",
                    "transition-colors duration-200",
                    index < currentStep ? "bg-turquoise" : "bg-primary/10",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
