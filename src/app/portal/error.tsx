"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PortalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  void error;
  return (
    <div className="mx-auto grid min-h-[45vh] w-full max-w-370 place-items-center">
      <div className="w-full max-w-lg rounded-3xl border bg-background p-7 text-center shadow-sm">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-rose-50 text-rose-700">
          <AlertTriangle className="size-6" aria-hidden="true" />
        </span>
        <h2 className="mt-5 font-display text-2xl font-extrabold text-foreground">Something went wrong</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">We could not load this portal view. Your data has not been changed.</p>
        <Button type="button" className="mt-6" onClick={reset}>
          <RotateCcw />
          Try again
        </Button>
      </div>
    </div>
  );
}
