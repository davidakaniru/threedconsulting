"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageBackButtonProps {
  label?: string;
  className?: string;
}

export function PageBackButton({
  label = "Back",
  className,
}: PageBackButtonProps) {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => router.back()}
      className={cn(
        "mb-1 -ml-2 w-fit gap-2 text-slate-600 hover:text-slate-950",
        className,
      )}
    >
      <ArrowLeft className="size-4" />
      {label}
    </Button>
  );
}
