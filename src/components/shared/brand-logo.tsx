import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  imageClassName?: string;
  compact?: boolean;
  inverse?: boolean;
  priority?: boolean;
  showText?: boolean;
}

export function BrandLogo({
  className,
  imageClassName,
  compact = false,
  inverse = false,
  priority = false,
  showText = true,
}: BrandLogoProps) {
  return (
    <Link
      href="/"
      aria-label="Three-D Managers Limited home"
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-xl",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4",
        className,
      )}
    >
      <span
        className={cn(
          "relative shrink-0 overflow-hidden",
          "transition-transform duration-200 group-hover:-rotate-2 group-hover:scale-105",
          compact ? "size-10" : "size-12",
          imageClassName,
        )}
      >
        <Image
          src="/brand/three-dmanagers.png"
          alt="Three-D Managers Limited logo"
          fill
          sizes={compact ? "20px" : "20px"}
          className="object-contain"
          priority={priority}
        />
      </span>

      {showText && (
        <span
          className={cn(
            "font-display font-extrabold tracking-tight",
            compact ? "text-base" : "text-xl",
            inverse ? "text-white" : "text-foreground",
          )}
        >
          Three-D{" "}
          {/* <span className={inverse ? "text-primary" : "text-primary"}>
            Managers
          </span> */}
        </span>
      )}
    </Link>
  );
}
