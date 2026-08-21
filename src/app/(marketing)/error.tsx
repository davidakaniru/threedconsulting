"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Marketing route error", error);
  }, [error]);

  return (
    <div className="mx-auto grid min-h-[60vh] w-full max-w-370 place-items-center px-4">
      <div className="w-full max-w-lg rounded-3xl border bg-background p-7 text-center shadow-sm">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-rose-50 text-rose-700">
          <AlertTriangle className="size-6" aria-hidden="true" />
        </span>
        <h2 className="mt-5 font-display text-2xl font-extrabold text-foreground">
          Something went wrong
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          We had trouble loading this page. This is usually temporary — please try again.
        </p>
        <Button type="button" className="mt-6" onClick={reset}>
          <RotateCcw />
          Try again
        </Button>
      </div>
    </div>
  );
}
