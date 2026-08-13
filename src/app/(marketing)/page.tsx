import { FAQPreview } from "@/components/home/faq-preview";
import { HeroSection } from "@/components/home/hero-section";
import { LearningJourney } from "@/components/home/learning-journey";
import { ProgrammesSection } from "@/components/home/programmes-section";
import { StatsBar } from "@/components/home/stats-bar";
import { WhyParents } from "@/components/home/why-parents";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <WhyParents />
      <ProgrammesSection />
      <LearningJourney />
      {/* <TeachersSection /> */}
      {/* <Testimonials /> */}
      {/* <EventsSection /> */}
      {/* <PlatformPreview /> */}
      {/* <GalleryPreview /> */}
      <FAQPreview />
    </>
  );
}
