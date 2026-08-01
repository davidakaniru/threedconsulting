import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type QuickActionProps = {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
};

export function QuickAction({
  href,
  icon: Icon,
  title,
  description,
  className,
}: QuickActionProps) {
  return (
    <Link
      href={href}
      data-slot="admin-quick-action"
      className={cn(
        "group flex items-start gap-4 rounded-[1.25rem] border border-slate-200/80 bg-white p-4",
        "transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_14px_35px_-24px_rgba(15,23,42,.45)]",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15",
        className,
      )}
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
        <Icon aria-hidden="true" className="size-5" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block font-display text-sm font-extrabold text-foreground">
          {title}
        </span>
        <span className="mt-1 block text-xs leading-5 text-muted-foreground">
          {description}
        </span>
      </span>

      <ArrowUpRight
        aria-hidden="true"
        className="mt-0.5 size-4 shrink-0 text-slate-300 transition-colors group-hover:text-primary"
      />
    </Link>
  );
}
