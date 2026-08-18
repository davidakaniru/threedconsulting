import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  SubjectCard,
  type PublicSubject,
} from "@/components/home/subject-card";
import Image from "next/image";

type Props = { params: Promise<{ slug: string }> };

async function getSubject(slug: string) {
  const { data } = await createAdminClient()
    .from("programmes")
    .select("id,title,slug,description,cover_image_url,overview,outcomes")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data;
}

export async function generateStaticParams() {
  const { data } = await createAdminClient()
    .from("programmes")
    .select("slug")
    .eq("status", "published");
  return (data ?? []).map((subject) => ({ slug: subject.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const subject = await getSubject(slug);
  if (!subject) return { title: "Subject not found" };
  return {
    title: `${subject.title} Subject`,
    description: subject.description ?? undefined,
    alternates: { canonical: `/programmes/${subject.slug}` },
  };
}

export default async function SubjectPage({ params }: Props) {
  const { slug } = await params;
  const subject = await getSubject(slug);
  if (!subject) notFound();

  const { data: related } = await createAdminClient()
    .from("programmes")
    .select("id,title,slug,description,cover_image_url,overview,outcomes")
    .eq("status", "published")
    .neq("id", subject.id)
    .order("title")
    .limit(3);

  const outcomes = Array.isArray(subject.outcomes)
    ? subject.outcomes.filter(
        (value): value is string => typeof value === "string",
      )
    : [];

  const subjectCards: PublicSubject[] = (related ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    description: item.description,
    coverImageUrl: item.cover_image_url,
  }));

  return (
    <>
      <section className="bg-linear-to-b from-sky-50 to-[#fff8ee] px-5 py-12 sm:px-8 md:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div>
            <Link
              href="/programmes"
              className="inline-flex items-center gap-2 font-display text-sm font-bold text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" /> Back to subjects
            </Link>
            <h1 className="mt-7 font-display text-4xl font-extrabold leading-tight text-foreground sm:text-5xl md:text-6xl">
              {subject.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              {subject.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href={`/enrolment?programme=${subject.slug}`}>
                  Enrol your child <ArrowRight />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">Ask a question</Link>
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-[3rem] bg-white shadow-[0_30px_80px_-35px_rgba(56,116,189,0.45)]">
            {subject.cover_image_url ? (
              <Image
                src={subject.cover_image_url}
                alt={subject.title}
                width={640}
                height={480}
                className="aspect-4/3 w-full object-cover"
              />
            ) : (
              <div className="grid aspect-4/3 place-items-center text-muted-foreground">
                No cover image
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 md:py-24">
        <div className="mx-auto max-w-4xl">
          <span className="font-display text-sm font-bold uppercase tracking-wider text-primary">
            About the subject
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground md:text-4xl">
            Learning that builds real confidence
          </h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            {subject.overview}
          </p>
          {outcomes.length > 0 && (
            <>
              <h3 className="mt-12 font-display text-2xl font-extrabold text-foreground">
                What your child will develop
              </h3>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {outcomes.map((outcome) => (
                  <li
                    key={outcome}
                    className="flex items-start gap-3 rounded-2xl border border-sky-50 bg-[#fffdf8] p-4"
                  >
                    <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-sky-100 text-sky-600">
                      <Check className="size-4" />
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
      </section>

      {subjectCards.length > 0 && (
        <section className="bg-[#fff8ee] px-5 py-16 sm:px-8 md:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <span className="font-display text-sm font-bold uppercase tracking-wider text-primary">
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
                View all subjects <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {subjectCards.map((item) => (
                <SubjectCard key={item.id} subject={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
