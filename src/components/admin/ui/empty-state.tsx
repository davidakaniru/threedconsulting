import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  className?: string;
  compact?: boolean;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      data-slot="admin-empty-state"
      className={cn(
        "grid place-items-center text-center",
        compact ? "min-h-52 p-6" : "min-h-72 p-8",
        className,
      )}
    >
      <div>
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary ring-8 ring-primary/[0.035]">
          <Icon aria-hidden="true" className="size-6" />
        </span>
        <h3 className="mt-5 font-display text-lg font-extrabold text-foreground">
          {title}
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          {description}
        </p>

        {(action || secondaryAction) && (
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {action}
            {secondaryAction}
          </div>
        )}
      </div>
    </div>
  );
}
