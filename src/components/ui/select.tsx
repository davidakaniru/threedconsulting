"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

interface SelectTriggerProps extends React.ComponentProps<
  typeof SelectPrimitive.Trigger
> {
  errorMessage?: string;
}

function SelectTrigger({
  className,
  errorMessage,
  children,
  ...props
}: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      aria-invalid={Boolean(errorMessage)}
      className={cn(
        "flex min-h-12 w-full items-center justify-between gap-3",
        "rounded-2xl border border-border bg-white px-4 py-3",
        "text-left text-sm text-foreground",
        "shadow-[0_6px_20px_-14px_rgba(56,116,189,0.35)]",
        "outline-none",
        "transition-[border-color,box-shadow,background-color]",
        "duration-200",

        "data-placeholder:text-muted-foreground/60",

        "hover:border-primary/40",

        "focus-visible:border-primary",
        "focus-visible:ring-4",
        "focus-visible:ring-primary/10",

        "disabled:pointer-events-none",
        "disabled:cursor-not-allowed",
        "disabled:bg-muted/50",
        "disabled:text-muted-foreground",
        "disabled:opacity-70",

        "[&>span]:line-clamp-1",

        errorMessage && [
          "border-destructive",
          "bg-destructive/2.5",
          "ring-4 ring-destructive/10",
          "hover:border-destructive",
          "focus-visible:border-destructive",
          "focus-visible:ring-destructive/10",
        ],

        className,
      )}
      {...props}
    >
      {children}

      <SelectPrimitive.Icon asChild>
        <ChevronDown
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground
            transition-transform duration-200
            group-data-[state=open]:rotate-180"
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        sideOffset={sideOffset}
        className={cn(
          "relative z-50 max-h-72 overflow-hidden",
          "rounded-2xl border border-border/80",
          "bg-popover text-popover-foreground",
          "shadow-[0_22px_60px_-20px_rgba(56,116,189,0.4)]",

          "data-[state=open]:animate-in",
          "data-[state=open]:fade-in-0",
          "data-[state=open]:zoom-in-95",

          "data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0",
          "data-[state=closed]:zoom-out-95",

          "data-[side=bottom]:slide-in-from-top-2",
          "data-[side=top]:slide-in-from-bottom-2",
          "data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2",

          position === "popper" && "min-w-(--radix-select-trigger-width)",

          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport
          className={cn(
            "p-1.5",
            position === "popper" &&
              "w-full min-w-(--radix-select-trigger-width)",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(
        "px-3 py-2 text-xs font-bold uppercase",
        "tracking-wider text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default select-none",
        "items-center gap-3 rounded-xl py-2.5 pl-3 pr-9",
        "text-sm text-foreground outline-none",
        "transition-colors",

        "data-highlighted:bg-primary/10",
        "data-highlighted:text-primary",

        "data-[state=checked]:font-semibold",
        "data-[state=checked]:text-primary",

        "data-disabled:pointer-events-none",
        "data-disabled:opacity-50",

        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>

      <span
        className="absolute right-3 grid size-5
          place-items-center"
      >
        <SelectPrimitive.ItemIndicator>
          <Check aria-hidden="true" className="size-4" strokeWidth={3} />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
