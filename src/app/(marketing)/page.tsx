import { FAQPreview } from "@/components/home/faq-preview";
import { HeroSection } from "@/components/home/hero-section";
import { LearningJourney } from "@/components/home/learning-journey";
import { ProgrammesSection } from "@/components/home/programmes-section";
import { TeachersSection } from "@/components/home/teachers-section";
import { StatsBar } from "@/components/home/stats-bar";
import { WhyParents } from "@/components/home/why-parents";
import { getPublishedProgrammesForPublic } from "@/modules/programmes/server";
import { getActiveTutorsForPublic } from "@/modules/teachers/server";
import { Testimonials } from "@/components/home/testimonials";

export default async function HomePage() {
  const [programmes, tutors] = await Promise.all([
    getPublishedProgrammesForPublic(),
    getActiveTutorsForPublic(),
  ]);

  return (
    <>
      <HeroSection />
      <StatsBar />
      <WhyParents />
      <Testimonials />
      <ProgrammesSection programmes={programmes} />
      <LearningJourney />
      <TeachersSection tutors={tutors} />
      <FAQPreview />
    </>
  );
}
