import { EventsSection } from "@/components/home/events-section";
import { FAQPreview } from "@/components/home/faq-preview";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { HeroSection } from "@/components/home/hero-section";
import { LearningJourney } from "@/components/home/learning-journey";
import { PlatformPreview } from "@/components/home/platform-preview";
import { ProgrammesSection } from "@/components/home/programmes-section";
import { StatsBar } from "@/components/home/stats-bar";
import { TeachersSection } from "@/components/home/teachers-section";
import { Testimonials } from "@/components/home/testimonials";
import { WhyParents } from "@/components/home/why-parents";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <WhyParents />
      <ProgrammesSection />
      <LearningJourney />
      <TeachersSection />
      <Testimonials />
      <EventsSection />
      <PlatformPreview />
      <GalleryPreview />
      <FAQPreview />
    </>
  );
}
