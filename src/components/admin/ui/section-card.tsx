import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionCardProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  title?: ReactNode;
  description?: ReactNode;
  eyebrow?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  footer?: ReactNode;
  padded?: boolean;
};

export function SectionCard({
  children,
  className,
  contentClassName,
  title,
  description,
  eyebrow,
  icon: Icon,
  action,
  footer,
  padded = true,
}: SectionCardProps) {
  const hasHeader = title || description || eyebrow || Icon || action;

  return (
    <section
      data-slot="admin-section-card"
      className={cn(
        "overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white",
        "shadow-[0_12px_40px_-28px_rgba(15,23,42,.45)]",
        className,
      )}
    >
      {hasHeader && (
        <header className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            {Icon && (
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Icon aria-hidden="true" className="size-5" />
              </span>
            )}

            <div className="min-w-0">
              {eyebrow && (
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
                  {eyebrow}
                </p>
              )}
              {title && (
                <h2 className={cn("font-display text-xl font-extrabold text-foreground", eyebrow && "mt-1")}>
                  {title}
                </h2>
              )}
              {description && (
                <div className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {description}
                </div>
              )}
            </div>
          </div>

          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}

      <div className={cn(padded && "p-5 sm:p-6", contentClassName)}>
        {children}
      </div>

      {footer && (
        <footer className="border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:px-6">
          {footer}
        </footer>
      )}
    </section>
  );
}
