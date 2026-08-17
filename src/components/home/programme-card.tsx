import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProgrammeIllustration } from "@/components/shared/programme-illustration";
import type { Programme, ProgrammeTone } from "@/data/programmes";
import { cn } from "@/lib/utils";

const toneStyles: Record<
  ProgrammeTone,
  {
    header: string;
    badge: string;
  }
> = {
  sky: {
    header: "bg-[#e0f2fe]",
    badge: "bg-[#e0f2fe] text-[#0369a1]",
  },
  sun: {
    header: "bg-[#fef3c7]",
    badge: "bg-[#fef3c7] text-[#a16207]",
  },
  grass: {
    header: "bg-[#dcfce7]",
    badge: "bg-[#dcfce7] text-[#15803d]",
  },
  coral: {
    header: "bg-[#ffe4d9]",
    badge: "bg-[#ffe4d9] text-[#c24122]",
  },
  grape: {
    header: "bg-[#ede9fe]",
    badge: "bg-[#ede9fe] text-[#6d28d9]",
  },
  teal: {
    header: "bg-[#ccfbf1]",
    badge: "bg-[#ccfbf1] text-[#0f766e]",
  },
  blush: {
    header: "bg-[#ffe4ee]",
    badge: "bg-[#ffe4ee] text-[#be185d]",
  },
};

type ProgrammeCardProps = {
  programme: Programme;
};

export function ProgrammeCard({ programme }: ProgrammeCardProps) {
  const tone = toneStyles[programme.tone];

  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-3xl
        border border-sky-50/80 bg-white
        shadow-[0_8px_30px_-12px_rgba(56,116,189,0.25)]
        transition-all duration-300
        ease-[cubic-bezier(0.34,1.56,0.64,1)]
        hover:-translate-y-1.5
        hover:shadow-[0_28px_60px_-24px_rgba(56,116,189,0.45)]"
    >
      <div
        className={cn(
          "relative flex items-center justify-center p-8",
          tone.header,
        )}
      >
        <div aria-hidden="true" className="absolute inset-0 opacity-40">
          <span
            className="absolute right-6 top-4 size-3
              rounded-full bg-white/60"
          />

          <span
            className="absolute bottom-6 left-8 size-2
              rounded-full bg-white/60"
          />
        </div>

        <div
          className="relative transition-transform duration-300
            group-hover:-rotate-3 group-hover:scale-110"
        >
          <ProgrammeIllustration
            name={programme.illustration}
            className="size-24"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        {/* <span
          className={cn(
            "mb-3 self-start rounded-full px-3 py-1",
            "font-display text-xs font-bold",
            tone.badge,
          )}
        >
          {programme.ageGroup}
        </span> */}

        <h2
          className="font-display text-xl font-extrabold
            text-foreground"
        >
          {programme.title}
        </h2>

        <p
          className="mt-2 flex-1 text-[15px] leading-relaxed
            text-muted-foreground"
        >
          {programme.description}
        </p>

        <Link
          href={`/programmes/${programme.slug}`}
          className="mt-4 inline-flex items-center gap-1.5
            self-start font-display font-bold text-sky-600
            transition-all hover:gap-3"
        >
          Learn more
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </article>
  );
}
