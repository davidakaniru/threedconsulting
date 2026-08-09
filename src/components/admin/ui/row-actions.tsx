"use client";

import type { LucideIcon } from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu } from "radix-ui";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface RowAction {
  label: string;
  icon?: LucideIcon;
  onSelect?: () => void;
  href?: string;
  destructive?: boolean;
  disabled?: boolean;
}

export function RowActions({
  actions,
  label = "Open actions",
}: {
  actions: RowAction[];
  label?: string;
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button type="button" variant="ghost" size="icon-sm" aria-label={label}>
          <MoreHorizontal />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={8}
          align="end"
          className="z-50 min-w-48 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl"
        >
          {actions.map((action) => {
            const Icon = action.icon;
            const className = cn(
              "flex w-full cursor-default items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none",
              "data-highlighted:bg-slate-100",
              action.destructive ? "text-destructive" : "text-slate-700",
              action.disabled && "pointer-events-none opacity-50",
            );

            if (action.href) {
              return (
                <DropdownMenu.Item
                  key={action.label}
                  asChild
                  disabled={action.disabled}
                >
                  <a href={action.href} className={className}>
                    {Icon && <Icon className="size-4" />}
                    {action.label}
                  </a>
                </DropdownMenu.Item>
              );
            }

            return (
              <DropdownMenu.Item
                key={action.label}
                className={className}
                disabled={action.disabled}
                onSelect={action.onSelect}
              >
                {Icon && <Icon className="size-4" />}
                {action.label}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
