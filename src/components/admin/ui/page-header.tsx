import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Breadcrumb = {
  label: string;
};

type PageHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  icon?: LucideIcon;
  breadcrumbs?: Breadcrumb[];
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  icon: Icon,
  breadcrumbs,
  className,
}: PageHeaderProps) {
  return (
    <header
      data-slot="admin-page-header"
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <p className="mb-2 flex flex-wrap items-center gap-2 text-xs font-bold text-muted-foreground">
            {breadcrumbs.map((item, index) => (
              <span
                key={`${item.label}-${index}`}
                className="inline-flex items-center gap-2"
              >
                {index > 0 && <span aria-hidden="true">/</span>}
                <span>{item.label}</span>
              </span>
            ))}
          </p>
        )}

        <div className="flex items-start gap-3">
          {Icon && (
            <span className="mt-0.5 grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Icon aria-hidden="true" className="size-5" />
            </span>
          )}

          <div className="min-w-0">
            {eyebrow && (
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
                {eyebrow}
              </p>
            )}

            <h1
              className={cn(
                "font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl",
                eyebrow && "mt-1",
              )}
            >
              {title}
            </h1>

            {description && (
              <div className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                {description}
              </div>
            )}
          </div>
        </div>
      </div>

      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {actions}
        </div>
      )}
    </header>
  );
}
