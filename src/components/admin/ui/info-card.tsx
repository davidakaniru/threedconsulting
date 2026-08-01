import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const tones = {
  blue: "border-primary/15 bg-primary/[0.045] text-primary",
  green: "border-emerald-200 bg-emerald-50/70 text-emerald-700",
  amber: "border-amber-200 bg-amber-50/70 text-amber-700",
  rose: "border-rose-200 bg-rose-50/70 text-rose-700",
  slate: "border-slate-200 bg-slate-50 text-slate-700",
} as const;

type InfoCardProps = {
  icon: LucideIcon;
  title: string;
  description: ReactNode;
  action?: ReactNode;
  tone?: keyof typeof tones;
  className?: string;
};

export function InfoCard({
  icon: Icon,
  title,
  description,
  action,
  tone = "blue",
  className,
}: InfoCardProps) {
  return (
    <article
      data-slot="admin-info-card"
      className={cn(
        "flex flex-col gap-4 rounded-[1.35rem] border p-5 sm:flex-row sm:items-start",
        tones[tone],
        className,
      )}
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/85 shadow-sm">
        <Icon aria-hidden="true" className="size-5" />
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="font-display text-base font-extrabold text-foreground">
          {title}
        </h3>
        <div className="mt-1 text-sm leading-6 text-muted-foreground">
          {description}
        </div>
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </article>
  );
}
