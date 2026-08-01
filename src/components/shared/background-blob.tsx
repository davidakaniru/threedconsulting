import { cn } from "@/lib/utils";

interface BackgroundBlobProps {
  className?: string;
}

export function BackgroundBlob({ className }: BackgroundBlobProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute rounded-[45%_55%_60%_40%/50%_40%_60%_50%]",
        "blur-3xl",
        className,
      )}
    />
  );
}
