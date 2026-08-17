"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  total?: number;
  label?: string;
  onPageChange: (page: number) => void;
  className?: string;
}

function visiblePages(page: number, totalPages: number) {
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  return [...pages]
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((a, b) => a - b);
}

export function Pagination({
  page,
  totalPages,
  total,
  label = "items",
  onPageChange,
  className,
}: PaginationProps) {
  const singularLabel = label.replace(/s$/, "");
  const pages = visiblePages(page, totalPages);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-slate-100 px-5 py-4 text-sm text-slate-500",
        "sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <span>
        {total} {total === 1 ? singularLabel : label}
      </span>

      <nav
        aria-label={`${label} pagination`}
        className="flex items-center gap-1.5"
      >
        <Button
          variant="outline"
          size="icon-sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft />
        </Button>

        {pages.map((pageNumber, index) => {
          const previousPage = pages[index - 1];
          const showGap = previousPage && pageNumber - previousPage > 1;

          return (
            <span key={pageNumber} className="contents">
              {showGap && <span className="px-1 text-slate-400">…</span>}
              <Button
                variant={pageNumber === page ? "default" : "ghost"}
                size="icon-sm"
                onClick={() => onPageChange(pageNumber)}
                aria-current={pageNumber === page ? "page" : undefined}
                aria-label={`Page ${pageNumber}`}
              >
                {pageNumber}
              </Button>
            </span>
          );
        })}

        <Button
          variant="outline"
          size="icon-sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight />
        </Button>
      </nav>
    </div>
  );
}
