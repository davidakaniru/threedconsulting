import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-xl",
};

export function AuthCard({ children, className, size = "md" }: AuthCardProps) {
  return (
    <section
      className={cn(
        "w-full rounded-[2.5rem] border border-white/80",
        "bg-white/95 p-6 backdrop-blur-md sm:p-8",
        "shadow-[0_30px_90px_-35px_rgba(56,116,189,0.38)]",
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </section>
  );
}
