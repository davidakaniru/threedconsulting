import { cn } from "@/lib/utils";

const tones = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/15 before:bg-emerald-500",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/15 before:bg-emerald-500",
  invited: "bg-amber-50 text-amber-700 ring-amber-600/15 before:bg-amber-500",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/15 before:bg-amber-500",
  open: "bg-sky-50 text-sky-700 ring-sky-600/15 before:bg-sky-500",
  completed: "bg-violet-50 text-violet-700 ring-violet-600/15 before:bg-violet-500",
  draft: "bg-amber-50 text-amber-700 ring-amber-600/15 before:bg-amber-500",
  published: "bg-emerald-50 text-emerald-700 ring-emerald-600/15 before:bg-emerald-500",
  archived: "bg-slate-100 text-slate-600 ring-slate-500/15 before:bg-slate-400",
  on_leave: "bg-sky-50 text-sky-700 ring-sky-600/15 before:bg-sky-500",
  info: "bg-sky-50 text-sky-700 ring-sky-600/15 before:bg-sky-500",
  former: "bg-slate-100 text-slate-600 ring-slate-500/15 before:bg-slate-400",
  inactive: "bg-slate-100 text-slate-600 ring-slate-500/15 before:bg-slate-400",
  neutral: "bg-slate-100 text-slate-600 ring-slate-500/15 before:bg-slate-400",
  suspended: "bg-rose-50 text-rose-700 ring-rose-600/15 before:bg-rose-500",
  danger: "bg-rose-50 text-rose-700 ring-rose-600/15 before:bg-rose-500",
} as const;

type StatusBadgeProps = {
  status: string;
  label?: string;
  dot?: boolean;
  className?: string;
};

export function StatusBadge({
  status,
  label,
  dot = true,
  className,
}: StatusBadgeProps) {
  const tone =
    tones[status as keyof typeof tones] ??
    "bg-slate-100 text-slate-600 ring-slate-500/15 before:bg-slate-400";

  return (
    <span
      data-slot="admin-status-badge"
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-extrabold capitalize ring-1 ring-inset",
        dot &&
          "before:mr-1.5 before:size-1.5 before:shrink-0 before:rounded-full",
        tone,
        className,
      )}
    >
      {label ?? status.replaceAll("_", " ")}
    </span>
  );
}
