import { FAQPreview } from "@/components/home/faq-preview";
import { HeroSection } from "@/components/home/hero-section";
import { LearningJourney } from "@/components/home/learning-journey";
import { ProgrammesSection } from "@/components/home/programmes-section";
import { StatsBar } from "@/components/home/stats-bar";
import { WhyParents } from "@/components/home/why-parents";
import { TeachersSection } from "@/components/home/teachers-section";
import { getPublicTutors } from "@/modules/teachers/server/teacher.service";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function HomePage() {
  const supabase = createAdminClient();
  const [{ data: subjects }, tutors] = await Promise.all([
    supabase.from("programmes").select("id,title,slug,description,cover_image_url").eq("status", "published").order("title"),
    getPublicTutors(),
  ]);

  return (
    <>
      <HeroSection />
      <StatsBar />
      <WhyParents />
      <ProgrammesSection subjects={(subjects ?? []).map((subject) => ({ id: subject.id, title: subject.title, slug: subject.slug, description: subject.description, coverImageUrl: subject.cover_image_url }))} />
      <LearningJourney />
      <TeachersSection tutors={tutors} />
      {/* <Testimonials /> */}
      {/* <EventsSection /> */}
      {/* <PlatformPreview /> */}
      {/* <GalleryPreview /> */}
      <FAQPreview />
    </>
  );
}
