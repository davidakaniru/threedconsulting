import { ProgrammesGrid } from "@/components/programmes/programmes-grid";
import { PageHero } from "@/components/shared/page-hero";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function ProgrammesPage() {
  const { data: subjects } = await createAdminClient()
    .from("programmes")
    .select("id,name,slug,description")
    .eq("status", "published")
    .order("name");

  return (
    <>
      <PageHero
        eyebrow="Our subjects"
        title={<>Explore our <span className="text-sky-500">subjects</span></>}
        subtitle="Explore the subjects currently offered by Three-dmanagers, taught by specialists in supportive one-to-one classes."
      />
      <ProgrammesGrid subjects={subjects ?? []} />
    </>
  );
}
