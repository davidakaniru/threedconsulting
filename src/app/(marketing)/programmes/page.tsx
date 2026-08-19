import { ProgrammesGrid } from "@/components/programmes/programmes-grid";
import { PageHero } from "@/components/shared/page-hero";

export default function ProgrammesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our subjects"
        title={<>Learning That Grows With You</>}
        subtitle="Specialist-led subjects for ages 4–16, taught in small, supportive classes both in person and online."
      />

      <ProgrammesGrid />
    </>
  );
}
