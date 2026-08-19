import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";

import type { EventItem } from "@/data/events";
import type { ProgrammeTone } from "@/data/programmes";
import { cn } from "@/lib/utils";

type ToneStyles = {
  stripe: string;
  badge: string;
};

const toneStyles: Record<ProgrammeTone, ToneStyles> = {
  sky: {
    stripe: "bg-sky-500",
    badge: "bg-sky-100 text-sky-700",
  },
  sun: {
    stripe: "bg-amber-400",
    badge: "bg-amber-100 text-amber-700",
  },
  grass: {
    stripe: "bg-green-500",
    badge: "bg-green-100 text-green-700",
  },
  coral: {
    stripe: "bg-[#ff7a59]",
    badge: "bg-orange-100 text-[#d95432]",
  },
  grape: {
    stripe: "bg-violet-500",
    badge: "bg-violet-100 text-violet-700",
  },
  teal: {
    stripe: "bg-teal-500",
    badge: "bg-teal-100 text-teal-700",
  },
  blush: {
    stripe: "bg-pink-500",
    badge: "bg-pink-100 text-pink-700",
  },
};

type EventCardProps = {
  event: EventItem;
};

export function EventCard({ event }: EventCardProps) {
  const tone = toneStyles[event.tone];

  return (
    <article
      className="group flex h-full overflow-hidden rounded-3xl
        border border-sky-50 bg-white
        shadow-[0_8px_30px_-12px_rgba(56,116,189,0.25)]
        transition-all duration-300
        ease-[cubic-bezier(0.34,1.56,0.64,1)]
        hover:-translate-y-1.5
        hover:shadow-[0_28px_60px_-24px_rgba(56,116,189,0.4)]"
    >
      <div aria-hidden="true" className={cn("w-2 shrink-0", tone.stripe)} />

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <span
            className={cn(
              "rounded-full px-3 py-1",
              "font-display text-xs font-bold",
              tone.badge,
            )}
          >
            {event.type}
          </span>

          <span className="text-xs font-bold text-green-600">
            {event.spots}
          </span>
        </div>

        <h2
          className="mt-3 font-display text-lg font-extrabold
            text-foreground"
        >
          {event.title}
        </h2>

        <div
          className="mt-3 space-y-1.5 text-sm
            text-muted-foreground"
        >
          <p className="flex items-center gap-2">
            <CalendarDays aria-hidden="true" className="size-4" />

            {event.date}
          </p>

          <p className="flex items-center gap-2">
            <Clock3 aria-hidden="true" className="size-4" />

            {event.time}
          </p>
        </div>

        <Link
          href="/contact"
          className="mt-4 inline-flex items-center gap-1.5
            self-start font-display font-bold text-sky-600
            transition-all hover:gap-3"
        >
          Reserve a place
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </article>
  );
}
