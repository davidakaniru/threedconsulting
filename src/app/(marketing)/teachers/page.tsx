import type { Metadata } from "next";

import { PageHero } from "@/components/shared/page-hero";
import { TeachersGrid } from "@/components/teachers/teachers-grid";
import { getActiveTutorsForPublic } from "@/modules/teachers/server";

export const metadata: Metadata = {
  title: "Our Teachers",
  description:
    "Meet our degree-qualified, DBS-checked teachers who make learning engaging, supportive and fun.",
};

export default async function TeachersPage() {
  return (
    <>
      <PageHero
        eyebrow="Meet our teachers"
        title={
          <>
            The people who make learning{" "}
            <span className="text-[#ff7a59]">magical</span>
          </>
        }
        subtitle="Every teacher is degree-qualified, DBS-checked and specially trained to bring out the best in young learners."
      />

      <TeachersGrid tutors={await getActiveTutorsForPublic()} />
    </>
  );
}
