import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type PublicSubject = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImageUrl: string;
};

export function SubjectCard({ subject }: { subject: PublicSubject }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-sky-50/80 bg-white shadow-[0_8px_30px_-12px_rgba(56,116,189,0.25)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-24px_rgba(56,116,189,0.45)]">
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        {subject.coverImageUrl ? (
          <img src={subject.coverImageUrl} alt={subject.title} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="grid size-full place-items-center text-sm font-semibold text-muted-foreground">No cover image</div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h2 className="font-display text-xl font-extrabold text-foreground">{subject.title}</h2>
        <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted-foreground">{subject.description || `Explore our ${subject.title} tutoring.`}</p>
        <Link href={`/programmes/${subject.slug}`} className="mt-4 inline-flex items-center gap-1.5 self-start font-display font-bold text-sky-600 transition-all hover:gap-3">Learn more<ArrowRight aria-hidden="true" className="size-4" /></Link>
      </div>
    </article>
  );
}
