import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminPageProps = {
  children: ReactNode;
  className?: string;
  spacing?: "default" | "compact";
};

export function AdminPage({
  children,
  className,
  spacing = "default",
}: AdminPageProps) {
  return (
    <div
      data-slot="admin-page"
      className={cn(
        "mx-auto w-full max-w-370",
        spacing === "default" ? "space-y-7" : "space-y-5",
        className,
      )}
    >
      {children}
    </div>
  );
}
