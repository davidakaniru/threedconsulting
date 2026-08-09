"use client";

import { useRouter } from "next/navigation";
import type { KeyboardEvent, MouseEvent, ReactNode } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string;
  getRowHref?: (row: T) => string;
  mobileCard?: (row: T) => ReactNode;
  emptyState?: ReactNode;
  className?: string;
  rowClassName?: (row: T) => string | undefined;
  selectedIds?: Set<string>;
  onSelectionChange?: (selectedIds: Set<string>) => void;
  isRowSelectable?: (row: T) => boolean;
}

const interactiveSelector = [
  "a",
  "button",
  "input",
  "select",
  "textarea",
  "[role='button']",
  "[role='menuitem']",
  "[data-row-click-ignore]",
].join(",");

function isInteractiveTarget(target: EventTarget | null) {
  return (
    target instanceof Element && Boolean(target.closest(interactiveSelector))
  );
}

export function DataTable<T>({
  data,
  columns,
  getRowId,
  getRowHref,
  mobileCard,
  emptyState,
  className,
  rowClassName,
  selectedIds,
  onSelectionChange,
  isRowSelectable = () => true,
}: DataTableProps<T>) {
  const router = useRouter();

  if (!data.length) return <>{emptyState}</>;

  const selectionEnabled = Boolean(selectedIds && onSelectionChange);
  const selectableRows = data.filter(isRowSelectable);
  const selectedOnPage = selectableRows.filter((row) =>
    selectedIds?.has(getRowId(row)),
  ).length;
  const allSelected =
    selectableRows.length > 0 && selectedOnPage === selectableRows.length;
  const someSelected = selectedOnPage > 0 && !allSelected;

  function toggleAll(checked: boolean) {
    if (!selectedIds || !onSelectionChange) return;
    const next = new Set(selectedIds);
    selectableRows.forEach((row) => {
      const id = getRowId(row);
      if (checked) next.add(id);
      else next.delete(id);
    });
    onSelectionChange(next);
  }

  function toggleRow(row: T, checked: boolean) {
    if (!selectedIds || !onSelectionChange) return;
    const next = new Set(selectedIds);
    const id = getRowId(row);
    if (checked) next.add(id);
    else next.delete(id);
    onSelectionChange(next);
  }

  function openRow(row: T) {
    const href = getRowHref?.(row);
    if (href) router.push(href);
  }

  function handleRowClick(event: MouseEvent, row: T) {
    if (!getRowHref || isInteractiveTarget(event.target)) return;
    openRow(row);
  }

  function handleRowKeyDown(event: KeyboardEvent, row: T) {
    if (!getRowHref || isInteractiveTarget(event.target)) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openRow(row);
    }
  }

  return (
    <div className={className}>
      {mobileCard && (
        <div className="grid gap-3 p-4 md:hidden">
          {data.map((row) => {
            const id = getRowId(row);
            const selectable = isRowSelectable(row);
            const rowIsClickable = Boolean(getRowHref?.(row));
            return (
              <div key={id} className="relative">
                {selectionEnabled && selectable && (
                  <Checkbox
                    checked={selectedIds?.has(id)}
                    onCheckedChange={(checked) =>
                      toggleRow(row, checked === true)
                    }
                    aria-label={`Select record ${id}`}
                    className="absolute top-4 left-4 z-10"
                    data-row-click-ignore
                  />
                )}
                <div
                  role={rowIsClickable ? "link" : undefined}
                  tabIndex={rowIsClickable ? 0 : undefined}
                  onClick={(event) => handleRowClick(event, row)}
                  onKeyDown={(event) => handleRowKeyDown(event, row)}
                  className={cn(
                    selectionEnabled && selectable && "pl-8",
                    rowIsClickable &&
                      "cursor-pointer rounded-2xl outline-none transition focus-visible:ring-2 focus-visible:ring-primary/40",
                  )}
                >
                  {mobileCard(row)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className={cn("overflow-x-auto", mobileCard && "hidden md:block")}>
        <table className="w-full min-w-210 text-left text-sm">
          <thead className="bg-slate-50/90 text-xs font-extrabold uppercase tracking-[.08em] text-slate-500">
            <tr>
              {selectionEnabled && (
                <th scope="col" className="w-12 px-5 py-3.5">
                  <Checkbox
                    checked={
                      allSelected
                        ? true
                        : someSelected
                          ? "indeterminate"
                          : false
                    }
                    onCheckedChange={(checked) => toggleAll(checked === true)}
                    aria-label="Select all records on this page"
                    data-row-click-ignore
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={cn(
                    "px-5 py-3.5",
                    column.hideOnMobile && "hidden lg:table-cell",
                    column.headerClassName,
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row) => {
              const id = getRowId(row);
              const selectable = isRowSelectable(row);
              const rowIsClickable = Boolean(getRowHref?.(row));
              return (
                <tr
                  key={id}
                  role={rowIsClickable ? "link" : undefined}
                  tabIndex={rowIsClickable ? 0 : undefined}
                  onClick={(event) => handleRowClick(event, row)}
                  onKeyDown={(event) => handleRowKeyDown(event, row)}
                  className={cn(
                    "transition hover:bg-slate-50/70",
                    rowIsClickable &&
                      "cursor-pointer outline-none focus-visible:bg-slate-50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40",
                    rowClassName?.(row),
                  )}
                >
                  {selectionEnabled && (
                    <td className="w-12 px-5 py-4">
                      <Checkbox
                        checked={selectedIds?.has(id)}
                        disabled={!selectable}
                        onCheckedChange={(checked) =>
                          toggleRow(row, checked === true)
                        }
                        aria-label={`Select record ${id}`}
                        data-row-click-ignore
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={cn(
                        "px-5 py-4",
                        column.hideOnMobile && "hidden lg:table-cell",
                        column.className,
                      )}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
