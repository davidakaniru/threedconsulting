import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const tones = {
  blue: {
    icon: "bg-primary/10 text-primary",
    accent: "from-primary/16 via-primary/5 to-transparent",
  },
  orange: {
    icon: "bg-orange-100 text-orange-600",
    accent: "from-orange-400/18 via-orange-300/5 to-transparent",
  },
  green: {
    icon: "bg-emerald-100 text-emerald-700",
    accent: "from-emerald-400/18 via-emerald-300/5 to-transparent",
  },
  purple: {
    icon: "bg-violet-100 text-violet-700",
    accent: "from-violet-400/18 via-violet-300/5 to-transparent",
  },
  rose: {
    icon: "bg-rose-100 text-rose-700",
    accent: "from-rose-400/18 via-rose-300/5 to-transparent",
  },
} as const;

type MetricCardProps = {
  label: string;
  value: ReactNode;
  helper?: ReactNode;
  icon: LucideIcon;
  tone?: keyof typeof tones;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
    label?: string;
  };
  action?: ReactNode;
  className?: string;
};

export function MetricCard({
  label,
  value,
  helper,
  icon: Icon,
  tone = "blue",
  trend,
  action,
  className,
}: MetricCardProps) {
  const TrendIcon =
    trend?.direction === "up"
      ? ArrowUpRight
      : trend?.direction === "down"
        ? ArrowDownRight
        : Minus;

  return (
    <article
      data-slot="admin-metric-card"
      className={cn(
        "group relative isolate overflow-hidden rounded-[1.4rem] border border-slate-200/80 bg-white p-5",
        "shadow-[0_12px_35px_-24px_rgba(15,23,42,.35)] transition-[transform,box-shadow,border-color] duration-200",
        "hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_20px_45px_-26px_rgba(15,23,42,.45)]",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 -z-10 h-24 bg-linear-to-b opacity-80",
          tones[tone].accent,
        )}
      />

      <div className="flex items-start justify-between gap-4">
        <span
          className={cn(
            "grid size-11 place-items-center rounded-2xl",
            tones[tone].icon,
          )}
        >
          <Icon aria-hidden="true" className="size-5" />
        </span>

        {action}
      </div>

      <p className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950">
        {value}
      </p>
      <p className="mt-1 text-sm font-bold text-slate-700">{label}</p>

      {(helper || trend) && (
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs leading-5">
          {trend && (
            <span
              className={cn(
                "inline-flex items-center gap-1 font-extrabold",
                trend.direction === "up" && "text-emerald-700",
                trend.direction === "down" && "text-rose-700",
                trend.direction === "neutral" && "text-slate-500",
              )}
            >
              <TrendIcon aria-hidden="true" className="size-3.5" />
              {trend.value}
              {trend.label && (
                <span className="font-medium text-slate-500">
                  {trend.label}
                </span>
              )}
            </span>
          )}

          {helper && <span className="text-slate-500">{helper}</span>}
        </div>
      )}
    </article>
  );
}
