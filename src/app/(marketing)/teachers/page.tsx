import type { Metadata } from "next";

import { PageHero } from "@/components/shared/page-hero";
import { TeachersGrid } from "@/components/teachers/teachers-grid";
import { getPublicTutors } from "@/modules/teachers/server/teacher.service";

export const metadata: Metadata = {
  title: "Our Tutors",
  description:
    "Meet our qualified tutors who make learning engaging, supportive and fun.",
};

export default async function TeachersPage() {
  const tutors = await getPublicTutors();
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
        subtitle="Every tutor is carefully selected and equipped to bring out the best in young learners."
      />

      <TeachersGrid tutors={tutors} />
    </>
  );
}
