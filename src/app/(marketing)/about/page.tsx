import type { Metadata } from "next";

import AboutStory from "@/components/about/about-story";
import { AboutValues } from "@/components/about/about-values";
import { LearningApproach } from "@/components/about/learning-approach";
import { MissionVision } from "@/components/about/mission-vision";
import { PageHero } from "@/components/shared/page-hero";
import { StatsBar } from "@/components/home/stats-bar";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about our story, values and joyful approach to helping every child grow in confidence.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title={
          <>
            Big hearts, bright minds and{" "}
            <span className="text-purple">joyful learning</span>
          </>
        }
        subtitle="We create welcoming learning experiences that help every child feel confident, curious and excited to discover more."
      />

      <AboutStory />

      <MissionVision />

      <AboutValues />

      <LearningApproach />

      <StatsBar />
    </>
  );
}
