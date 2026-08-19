import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { PublicProgramme } from "@/modules/programmes/server/public-programme.service";

type ProgrammeCardProps = {
  programme: PublicProgramme;
};

export function ProgrammeCard({ programme }: ProgrammeCardProps) {
  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-3xl
        border border-sky-50/80 bg-white shadow-[0_8px_30px_-12px_rgba(56,116,189,0.25)]
        transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-24px_rgba(56,116,189,0.45)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {programme.coverImageUrl ? (
          <Image
            src={programme.coverImageUrl}
            alt={`${programme.title} cover`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-sm font-semibold text-muted-foreground">
            {programme.title}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h2 className="font-display text-xl font-extrabold text-foreground">
          {programme.title}
        </h2>

        <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted-foreground">
          {programme.description}
        </p>

        <Link
          href={`/programmes/${programme.slug}`}
          className="mt-4 inline-flex items-center gap-1.5 self-start font-display font-bold text-sky-600 transition-all hover:gap-3"
        >
          Learn more
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </article>
  );
}
