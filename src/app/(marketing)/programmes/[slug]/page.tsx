import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Laptop,
  Layers3,
  Users,
} from "lucide-react";

import { ProgrammeCard } from "@/components/home/programme-card";
import { ProgrammeIllustration } from "@/components/shared/programme-illustration";
import { Button } from "@/components/ui/button";
import {
  getProgrammeBySlug,
  programmes,
  type ProgrammeTone,
} from "@/data/programmes";
import { cn } from "@/lib/utils";

type ProgrammePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const toneStyles: Record<
  ProgrammeTone,
  {
    hero: string;
    soft: string;
    text: string;
    icon: string;
  }
> = {
  sky: {
    hero: "from-sky-100 via-white to-[#fff8ee]",
    soft: "bg-sky-100",
    text: "text-sky-600",
    icon: "bg-sky-100 text-sky-600",
  },
  sun: {
    hero: "from-amber-100 via-white to-[#fff8ee]",
    soft: "bg-amber-100",
    text: "text-amber-600",
    icon: "bg-amber-100 text-amber-700",
  },
  grass: {
    hero: "from-green-100 via-white to-[#fff8ee]",
    soft: "bg-green-100",
    text: "text-green-600",
    icon: "bg-green-100 text-green-700",
  },
  coral: {
    hero: "from-orange-100 via-white to-[#fff8ee]",
    soft: "bg-orange-100",
    text: "text-[#f85e38]",
    icon: "bg-orange-100 text-[#f85e38]",
  },
  grape: {
    hero: "from-violet-100 via-white to-[#fff8ee]",
    soft: "bg-violet-100",
    text: "text-violet-600",
    icon: "bg-violet-100 text-violet-600",
  },
  teal: {
    hero: "from-teal-100 via-white to-[#fff8ee]",
    soft: "bg-teal-100",
    text: "text-teal-600",
    icon: "bg-teal-100 text-teal-700",
  },
  blush: {
    hero: "from-pink-100 via-white to-[#fff8ee]",
    soft: "bg-pink-100",
    text: "text-pink-600",
    icon: "bg-pink-100 text-pink-600",
  },
};

export function generateStaticParams() {
  return programmes.map((programme) => ({
    slug: programme.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProgrammePageProps): Promise<Metadata> {
  const { slug } = await params;
  const programme = getProgrammeBySlug(slug);

  if (!programme) {
    return {
      title: "Programme not found",
    };
  }

  return {
    title: `${programme.title} Programme`,
    description: programme.description,
    alternates: {
      canonical: `/programmes/${programme.slug}`,
    },
  };
}

export default async function ProgrammePage({ params }: ProgrammePageProps) {
  const { slug } = await params;
  const programme = getProgrammeBySlug(slug);

  if (!programme) {
    notFound();
  }

  const tone = toneStyles[programme.tone];

  const relatedProgrammes = programmes
    .filter((item) => item.slug !== programme.slug)
    .filter(
      (item) =>
        item.tone === programme.tone || item.ageGroup === programme.ageGroup,
    )
    .slice(0, 3);

  const fallbackRelated = programmes
    .filter((item) => item.slug !== programme.slug)
    .slice(0, 3);

  const displayedRelated =
    relatedProgrammes.length === 3 ? relatedProgrammes : fallbackRelated;

  return (
    <>
      <section
        className={cn("relative overflow-hidden bg-linear-to-b", tone.hero)}
      >
        <div
          aria-hidden="true"
          className={cn(
            "absolute -left-24 top-12 size-72 rounded-full",
            "blur-3xl opacity-60",
            tone.soft,
          )}
        />

        <div
          aria-hidden="true"
          className={cn(
            "absolute -right-24 bottom-4 size-80 rounded-full",
            "blur-3xl opacity-60",
            tone.soft,
          )}
        />

        <div
          className="relative mx-auto grid max-w-7xl items-center
            gap-10 px-5 pb-20 pt-12
            sm:px-8 md:pb-28 md:pt-20
            lg:grid-cols-[1.15fr_0.85fr]"
        >
          <div>
            <Link
              href="/programmes"
              className="inline-flex items-center gap-2
                font-display text-sm font-bold text-muted-foreground
                transition-colors hover:text-foreground"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back to programmes
            </Link>

            <span
              className={cn(
                "mt-8 inline-flex rounded-full px-4 py-1.5",
                "font-display text-sm font-bold",
                tone.soft,
                tone.text,
              )}
            >
              {programme.ageGroup}
            </span>

            <h1
              className="mt-5 font-display text-4xl font-extrabold
                leading-tight text-foreground
                sm:text-5xl md:text-6xl"
            >
              {programme.title}
            </h1>

            <p
              className="mt-5 max-w-2xl text-lg leading-relaxed
                text-muted-foreground md:text-xl"
            >
              {programme.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href={`/enrolment?programme=${programme.slug}`}>
                  Enrol your child
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>

              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">Ask a question</Link>
              </Button>
            </div>
          </div>

          <div
            className={cn(
              "relative mx-auto grid aspect-square w-full",
              "max-w-110 place-items-center rounded-[3rem]",
              tone.soft,
              "shadow-[0_30px_80px_-35px_rgba(56,116,189,0.45)]",
            )}
          >
            <span
              aria-hidden="true"
              className="absolute left-[12%] top-[15%]
                size-5 rounded-full bg-white/70"
            />

            <span
              aria-hidden="true"
              className="absolute bottom-[18%] right-[14%]
                size-8 rounded-full bg-white/60"
            />

            <ProgrammeIllustration
              name={programme.illustration}
              className="relative size-52 sm:size-64"
            />
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 md:py-24">
        <div
          className="mx-auto grid max-w-7xl gap-12
            lg:grid-cols-[1fr_360px]"
        >
          <div>
            <span
              className={cn(
                "font-display text-sm font-bold uppercase",
                "tracking-wider",
                tone.text,
              )}
            >
              About the programme
            </span>

            <h2
              className="mt-3 font-display text-3xl font-extrabold
                text-foreground md:text-4xl"
            >
              Learning that builds real confidence
            </h2>

            <p
              className="mt-5 max-w-3xl text-lg leading-8
                text-muted-foreground"
            >
              {programme.overview}
            </p>

            <h3
              className="mt-12 font-display text-2xl font-extrabold
                text-foreground"
            >
              What your child will develop
            </h3>

            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {programme.outcomes.map((outcome) => (
                <li
                  key={outcome}
                  className="flex items-start gap-3 rounded-2xl
                    border border-sky-50 bg-[#fffdf8] p-4"
                >
                  <span
                    className={cn(
                      "mt-0.5 grid size-7 shrink-0 place-items-center",
                      "rounded-full",
                      tone.icon,
                    )}
                  >
                    <Check aria-hidden="true" className="size-4" />
                  </span>

                  <span className="font-semibold leading-relaxed">
                    {outcome}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <aside
            className="h-fit rounded-3xl border border-sky-50
              bg-[#fff8ee] p-6
              shadow-[0_16px_45px_-24px_rgba(56,116,189,0.4)]
              lg:sticky lg:top-28"
          >
            <h2
              className="font-display text-xl font-extrabold
                text-foreground"
            >
              Programme details
            </h2>

            <dl className="mt-6 space-y-5">
              <DetailItem
                icon={Users}
                label="Class size"
                value={programme.classSize}
                iconClassName={tone.icon}
              />

              <DetailItem
                icon={Clock3}
                label="Lesson duration"
                value={programme.duration}
                iconClassName={tone.icon}
              />

              <DetailItem
                icon={Laptop}
                label="Delivery"
                value={programme.delivery}
                iconClassName={tone.icon}
              />

              <DetailItem
                icon={Layers3}
                label="Age range"
                value={programme.ageGroup}
                iconClassName={tone.icon}
              />
            </dl>

            <div className="mt-7 border-t border-black/5 pt-6">
              <p
                className="font-display text-sm font-bold
                  text-foreground"
              >
                Available levels
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {programme.levels.map((level) => (
                  <span
                    key={level}
                    className={cn(
                      "rounded-full px-3 py-1.5",
                      "text-xs font-bold",
                      tone.soft,
                      tone.text,
                    )}
                  >
                    {level}
                  </span>
                ))}
              </div>
            </div>

            <Button fullWidth size="lg" className="mt-7" asChild>
              <Link href={`/enrolment?programme=${programme.slug}`}>
                Start enrolment
              </Link>
            </Button>
          </aside>
        </div>
      </section>

      <section
        className="bg-[#fff8ee] px-5 py-16
          sm:px-8 md:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div
            className="flex flex-col justify-between gap-5
              sm:flex-row sm:items-end"
          >
            <div>
              <span
                className={cn(
                  "font-display text-sm font-bold uppercase",
                  "tracking-wider",
                  tone.text,
                )}
              >
                Keep exploring
              </span>

              <h2
                className="mt-3 font-display text-3xl
                  font-extrabold text-foreground md:text-4xl"
              >
                Other programmes your child may enjoy
              </h2>
            </div>

            <Link
              href="/programmes"
              className="inline-flex items-center gap-2
                font-display font-bold text-primary"
            >
              View all programmes
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          <div
            className="mt-10 grid gap-6
              sm:grid-cols-2 lg:grid-cols-3"
          >
            {displayedRelated.map((item) => (
              <ProgrammeCard key={item.slug} programme={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8 md:py-24">
        <div
          className={cn(
            "relative mx-auto max-w-5xl overflow-hidden",
            "rounded-[2.5rem] px-6 py-12 text-center",
            "sm:px-12 md:py-16",
            tone.soft,
          )}
        >
          <div
            aria-hidden="true"
            className="absolute -left-8 -top-8 size-32
              rounded-full bg-white/40"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-12 -right-8 size-44
              rounded-full bg-white/40"
          />

          <div className="relative">
            <h2
              className="font-display text-3xl font-extrabold
                text-foreground md:text-4xl"
            >
              Ready to begin {programme.title}?
            </h2>

            <p
              className="mx-auto mt-4 max-w-2xl text-lg
                leading-relaxed text-muted-foreground"
            >
              Start enrolment today or speak with our team to find the right
              level for your child.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button size="lg" asChild>
                <Link href={`/enrolment?programme=${programme.slug}`}>
                  Start enrolment
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>

              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">Contact our team</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

type DetailItemProps = {
  icon: typeof Users;
  label: string;
  value: string;
  iconClassName: string;
};

function DetailItem({
  icon: Icon,
  label,
  value,
  iconClassName,
}: DetailItemProps) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-xl",
          iconClassName,
        )}
      >
        <Icon aria-hidden="true" className="size-5" />
      </span>

      <div>
        <dt className="text-sm text-muted-foreground">{label}</dt>

        <dd className="mt-0.5 font-display font-bold text-foreground">
          {value}
        </dd>
      </div>
    </div>
  );
}
