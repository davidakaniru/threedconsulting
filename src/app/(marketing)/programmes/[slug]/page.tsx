import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { ProgrammeCard } from "@/components/home/programme-card";
import { Button } from "@/components/ui/button";
import {
  getPublishedProgrammeBySlugForPublic,
  getPublishedProgrammesForPublic,
} from "@/modules/programmes/server";

type ProgrammePageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const programmes = await getPublishedProgrammesForPublic();
  return programmes.map((programme) => ({ slug: programme.slug }));
}

export async function generateMetadata({
  params,
}: ProgrammePageProps): Promise<Metadata> {
  const { slug } = await params;
  const programme = await getPublishedProgrammeBySlugForPublic(slug);
  if (!programme) return { title: "Subject not found" };
  return {
    title: `${programme.title} | Three-dmanagers`,
    description: programme.description ?? undefined,
    alternates: { canonical: `/programmes/${programme.slug}` },
  };
}

export default async function ProgrammePage({ params }: ProgrammePageProps) {
  const { slug } = await params;
  const programme = await getPublishedProgrammeBySlugForPublic(slug);
  if (!programme) notFound();

  const relatedProgrammes = (await getPublishedProgrammesForPublic())
    .filter((item) => item.slug !== programme.slug)
    .slice(0, 3);

  return (
    <>
      <section className="bg-[#fff8ee] px-5 py-12 sm:px-8 md:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <Link
              href="/programmes"
              className="inline-flex items-center gap-2 font-display text-sm font-bold text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back to subjects
            </Link>
            <h1 className="mt-8 font-display text-4xl font-extrabold leading-tight text-foreground sm:text-5xl md:text-6xl">
              {programme.title}
            </h1>
            {programme.description && (
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                {programme.description}
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href={`/enrolment?programme=${programme.slug}`}>
                  Enrol your child <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">Ask a question</Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-4/3 overflow-hidden rounded-[2.5rem] bg-slate-100 shadow-[0_30px_80px_-35px_rgba(56,116,189,0.45)]">
            {programme.coverImageUrl ? (
              <Image
                src={programme.coverImageUrl}
                alt={`${programme.title} cover`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center p-8 text-center font-display text-xl font-bold text-muted-foreground">
                {programme.title}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_360px]">
          <div>
            <span className="font-display text-sm font-bold uppercase tracking-wider text-sky-600">
              About the subject
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground md:text-4xl">
              Overview
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
              {programme.overview ||
                programme.description ||
                "Learn more about this subject and what your child can achieve."}
            </p>
            {programme.outcomes.length > 0 && (
              <>
                <h3 className="mt-12 font-display text-2xl font-extrabold text-foreground">
                  Learning outcomes
                </h3>
                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                  {programme.outcomes.map((outcome: string) => (
                    <li
                      key={outcome}
                      className="flex items-start gap-3 rounded-2xl border border-sky-50 bg-[#fffdf8] p-4"
                    >
                      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-sky-100 text-sky-600">
                        <Check aria-hidden="true" className="size-4" />
                      </span>
                      <span className="font-semibold leading-relaxed">
                        {outcome}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <aside className="h-fit rounded-3xl border border-sky-50 bg-[#fff8ee] p-6 shadow-[0_16px_45px_-24px_rgba(56,116,189,0.4)] lg:sticky lg:top-28">
            <h2 className="font-display text-xl font-extrabold text-foreground">
              Subject details
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Explore the subject overview and learning outcomes, then start an
              enrolment for your child.
            </p>
            <Button fullWidth size="lg" className="mt-7" asChild>
              <Link href={`/enrolment?programme=${programme.slug}`}>
                Start enrolment
              </Link>
            </Button>
          </aside>
        </div>
      </section>

      {relatedProgrammes.length > 0 && (
        <section className="bg-[#fff8ee] px-5 py-16 sm:px-8 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <span className="font-display text-sm font-bold uppercase tracking-wider text-sky-600">
                  Keep exploring
                </span>
                <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground md:text-4xl">
                  Other subjects your child may enjoy
                </h2>
              </div>
              <Link
                href="/programmes"
                className="inline-flex items-center gap-2 font-display font-bold text-primary"
              >
                View all subjects{" "}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProgrammes.map((item) => (
                <ProgrammeCard key={item.slug} programme={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white px-5 py-16 sm:px-8 md:py-24">
        <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-sky-100 px-6 py-12 text-center sm:px-12 md:py-16">
          <h2 className="font-display text-3xl font-extrabold text-foreground md:text-4xl">
            Ready to begin {programme.title}?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Start enrolment today or speak with our team to find the right
            subject for your child.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button size="lg" asChild>
              <Link href={`/enrolment?programme=${programme.slug}`}>
                Start enrolment <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">Contact our team</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
