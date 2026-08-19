import type { Metadata } from "next";

import AboutStory from "@/components/about/about-story";
import { AboutServices } from "@/components/about/about-services";
import { LearningApproach } from "@/components/about/learning-approach";
import { MissionVision } from "@/components/about/mission-vision";
import { PageHero } from "@/components/shared/page-hero";
import { StatsBar } from "@/components/home/stats-bar";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Empowering Young Minds. Transforming Businesses. Building Brighter Futures. Learn about Three-dmanagers' story, mission and approach to education and business consulting.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title={
          <>
            Empowering young minds,{" "}
            <span className="text-purple">transforming businesses</span>
          </>
        }
        subtitle="Building brighter futures through quality education, professional expertise and innovative solutions."
      />

      <AboutStory />

      <MissionVision />

      <AboutServices />

      <LearningApproach />

      <section className="bg-foreground px-5 py-16 text-center sm:px-8 md:py-20">
        <div className="mx-auto max-w-3xl">
          <p
            className="font-display text-2xl font-extrabold
              leading-snug text-white sm:text-3xl"
          >
            Three-D Managers — Empowering Young Minds. Transforming Businesses.
            Building Brighter Futures.
          </p>
        </div>
      </section>

      <StatsBar />
    </>
  );
}
