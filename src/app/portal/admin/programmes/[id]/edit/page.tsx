import type { Metadata } from "next";
import {
  AdminPage,
  PageBackButton,
  PageHeader,
  SectionCard,
} from "@/components/admin/ui";
import { ProgrammeForm } from "@/modules/programmes";
import { getProgramme } from "@/modules/programmes/server";
type Props = { params: Promise<{ id: string }> };
export const metadata: Metadata = { title: "Edit Subject | Admin Portal" };
export default async function Page({ params }: Props) {
  const programme = await getProgramme((await params).id);
  return (
    <AdminPage className="max-w-4xl">
      <PageBackButton />
      <PageHeader
        eyebrow="Subjects"
        title={`Edit ${programme.name}`}
        description="Update the subject description or lifecycle status."
      />
      <SectionCard className="p-5 sm:p-8">
        <ProgrammeForm programme={programme} />
      </SectionCard>
    </AdminPage>
  );
}
