import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface TableToolbarProps {
  search?: ReactNode;
  filters?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function TableToolbar({
  search,
  filters,
  actions,
  className,
}: TableToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b border-slate-100 p-4 sm:p-5",
        "lg:flex-row lg:items-center lg:justify-between",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row">
        {search}
        {filters && (
          <div className="flex flex-col gap-3 sm:flex-row">{filters}</div>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
