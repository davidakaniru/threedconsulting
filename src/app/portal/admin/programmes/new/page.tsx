import type { Metadata } from "next";
import {
  AdminPage,
  PageBackButton,
  PageHeader,
  SectionCard,
} from "@/components/admin/ui";
import { ProgrammeForm } from "@/modules/programmes";
export const metadata: Metadata = { title: "Add Subject | Admin Portal" };
export default function Page() {
  return (
    <AdminPage className="max-w-4xl">
      <PageBackButton />
      <PageHeader
        eyebrow="Subjects"
        title="Add a subject"
        description="Create a subject in draft or publish it immediately for future teaching assignments."
      />
      <SectionCard className="p-5 sm:p-8">
        <ProgrammeForm />
      </SectionCard>
    </AdminPage>
  );
}
