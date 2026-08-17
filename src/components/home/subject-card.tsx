import Link from "next/link";
import { ArrowRight, Atom, BookOpen, Calculator, FlaskConical, Globe2, Languages, Music, Palette, Pencil, Code2, GraduationCap } from "lucide-react";

export type PublicSubject = { id: string; name: string; slug: string; description: string | null };
const icons = [Calculator, BookOpen, Atom, FlaskConical, Globe2, Languages, Music, Palette, Pencil, Code2, GraduationCap];
const tones = ["bg-sky-100 text-sky-700", "bg-amber-100 text-amber-700", "bg-green-100 text-green-700", "bg-orange-100 text-orange-700", "bg-violet-100 text-violet-700", "bg-teal-100 text-teal-700"];
export function SubjectCard({ subject, index }: { subject: PublicSubject; index: number }) {
  const Icon = icons[index % icons.length];
  return <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-sky-50/80 bg-white shadow-[0_8px_30px_-12px_rgba(56,116,189,0.25)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-24px_rgba(56,116,189,0.45)]">
    <div className={`relative flex items-center justify-center p-8 ${tones[index % tones.length]}`}><Icon aria-hidden="true" className="relative size-20 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110" /></div>
    <div className="flex flex-1 flex-col p-6">
      <h2 className="font-display text-xl font-extrabold text-foreground">{subject.name}</h2>
      <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted-foreground">{subject.description || `Explore our ${subject.name} tutoring.`}</p>
      <Link href={`/programmes/${subject.slug}`} className="mt-4 inline-flex items-center gap-1.5 self-start font-display font-bold text-sky-600 transition-all hover:gap-3">Learn more<ArrowRight aria-hidden="true" className="size-4" /></Link>
    </div>
  </article>;
}
