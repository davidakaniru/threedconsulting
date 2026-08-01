import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type MetricGridProps = {
  children: ReactNode;
  className?: string;
  columns?: 2 | 3 | 4;
};

export function MetricGrid({
  children,
  className,
  columns = 4,
}: MetricGridProps) {
  return (
    <section
      data-slot="admin-metric-grid"
      className={cn(
        "grid gap-4",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 xl:grid-cols-3",
        columns === 4 && "sm:grid-cols-2 xl:grid-cols-4",
        className,
      )}
    >
      {children}
    </section>
  );
}
