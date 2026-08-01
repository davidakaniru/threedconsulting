import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  imageClassName?: string;
  compact?: boolean;
  inverse?: boolean;
  priority?: boolean;
}

export function BrandLogo({
  className,
  imageClassName,
  compact = false,
  inverse = false,
  priority = false,
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
          "relative shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5",
          "transition-transform duration-200 group-hover:-rotate-2 group-hover:scale-105",
          compact ? "size-10" : "size-12",
          imageClassName,
        )}
      >
        <Image
          src="/brand/threed-consulting.jpeg"
          alt=""
          fill
          sizes={compact ? "40px" : "48px"}
          className="object-contain"
          priority={priority}
        />
      </span>

      <span
        className={cn(
          "font-display font-extrabold tracking-tight",
          compact ? "text-base" : "text-xl",
          inverse ? "text-white" : "text-foreground",
        )}
      >
        ThreeD{" "}
        {/* <span className={inverse ? "text-primary" : "text-primary"}>
          Consulting
        </span> */}
      </span>
    </Link>
  );
}
