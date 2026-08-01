import { cn } from "@/lib/utils";

type LoadingStateProps = {
  rows?: number;
  className?: string;
  variant?: "cards" | "list";
};

export function LoadingState({
  rows = 4,
  className,
  variant = "list",
}: LoadingStateProps) {
  return (
    <div
      data-slot="admin-loading-state"
      aria-busy="true"
      aria-label="Loading content"
      className={cn("animate-pulse", className)}
    >
      {variant === "cards" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: rows }, (_, index) => (
            <div
              key={index}
              className="h-40 rounded-[1.4rem] border border-slate-200/80 bg-white p-5"
            >
              <div className="size-11 rounded-2xl bg-slate-100" />
              <div className="mt-5 h-8 w-20 rounded-lg bg-slate-100" />
              <div className="mt-3 h-4 w-32 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {Array.from({ length: rows }, (_, index) => (
            <div key={index} className="flex items-center gap-4 px-5 py-4 sm:px-6">
              <div className="size-10 shrink-0 rounded-full bg-slate-100" />
              <div className="min-w-0 flex-1">
                <div className="h-4 w-40 max-w-full rounded bg-slate-100" />
                <div className="mt-2 h-3 w-56 max-w-[75%] rounded bg-slate-100" />
              </div>
              <div className="hidden h-7 w-20 rounded-full bg-slate-100 sm:block" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
