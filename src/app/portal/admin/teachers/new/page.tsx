import type { Metadata } from "next";
import { CreateTeacherForm } from "@/modules/teachers";
import { AdminPage } from "@/components/admin/ui/admin-page";
import { PageBackButton } from "@/components/admin/ui/page-back-button";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";
import { getProgrammes } from "@/modules/programmes/server";
export const metadata: Metadata = { title: "Add Tutor | Admin Portal" };
export default async function NewTeacherPage() {
  const { programmes } = await getProgrammes({
    page: 1,
    pageSize: 100,
    status: "published",
  });
  return (
    <AdminPage className="max-w-5xl">
      <PageBackButton />
      <PageHeader
        eyebrow="Tutors"
        title="Add a tutor"
        description="Create the employment record, assign the subjects they can teach, and send a secure account activation invitation. Tutor ID and hire date are generated automatically."
      />
      <SectionCard className="p-5 sm:p-8">
        <CreateTeacherForm
          programmes={programmes.map((programme) => ({
            id: programme.id,
            name: programme.name,
          }))}
        />
      </SectionCard>
    </AdminPage>
  );
}
