import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BulkActionBarProps {
  selectedCount: number;
  onClear: () => void;
  actions?: ReactNode;
  className?: string;
  itemLabel?: string;
}

export function BulkActionBar({
  selectedCount,
  onClear,
  actions,
  className,
  itemLabel = "record",
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b border-primary/10 bg-primary/4 px-4 py-3",
        "sm:flex-row sm:items-center sm:justify-between sm:px-5",
        className,
      )}
    >
      <p className="text-sm font-bold text-primary">
        {selectedCount} {selectedCount === 1 ? itemLabel : `${itemLabel}s`}{" "}
        selected
      </p>
      <div className="flex items-center gap-2">
        {actions}
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          Clear selection
        </Button>
      </div>
    </div>
  );
}
