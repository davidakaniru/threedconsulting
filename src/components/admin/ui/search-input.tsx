"use client";

import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function SearchInput({
  id,
  value,
  onChange,
  placeholder = "Search...",
  className,
  disabled,
}: SearchInputProps) {
  return (
    <div className={cn("relative min-w-0 flex-1", className)}>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground"
      />

      <Input
        id={id}
        type="search"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        fieldClassName="gap-0"
        className="min-h-11 pr-11 pl-10 shadow-none"
      />

      {value && !disabled && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label="Clear search"
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2"
        >
          <X aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}
