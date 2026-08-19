import type { Metadata } from "next";

import { PageHero } from "@/components/shared/page-hero";
import { TeachersGrid } from "@/components/teachers/teachers-grid";
import { getActiveTutorsForPublic } from "@/modules/teachers/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Teachers",
  description:
    "Meet our degree-qualified, DBS-checked teachers who make learning engaging, supportive and fun.",
};

export default async function TeachersPage() {
  return (
    <>
      <PageHero
        eyebrow="Meet our tutors"
        title={
          <>
            The people who make learning{" "}
            <span className="text-[#ff7a59]">magical</span>
          </>
        }
        subtitle="Every teacher is degree-qualified, DBS-checked and specially trained to bring out the best in young learners."
      />

      <TeachersGrid tutors={await getActiveTutorsForPublic()} />

      <section className="flex items-center justify-center gap-4 pt-10 -mt-8 bg-[#fff8ee] px-5 pb-16 sm:px-8 md:pb-24">
        <Button size="lg" asChild>
          <Link href="/become-a-tutor">Become a tutor</Link>
        </Button>
      </section>
    </>
  );
}
