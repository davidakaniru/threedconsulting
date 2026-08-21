"use client";

import { useEffect } from "react";

import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled application error", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-extrabold">Something went wrong</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          We had trouble loading this page. This is usually temporary — please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
