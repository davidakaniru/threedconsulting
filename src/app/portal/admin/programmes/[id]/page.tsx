import type { Metadata } from "next";
import { AdminPage, PageBackButton, PageHeader } from "@/components/admin/ui";
import { ProgrammeDetails } from "@/modules/programmes";
import { getProgramme } from "@/modules/programmes/server";
import { ProgrammeAssignmentManager } from "@/modules/teaching-assignments";
import { ProgrammeCohorts } from "@/modules/cohorts";
import { getAssignableTeachers } from "@/modules/teaching-assignments/server";
type Props = { params: Promise<{ id: string }> };
export const metadata: Metadata = { title: "Programme Details | Admin Portal" };
export default async function Page({ params }: Props) {
  const { id } = await params;
  const [programme, teachers] = await Promise.all([getProgramme(id), getAssignableTeachers()]);
  return <AdminPage><PageBackButton /><PageHeader eyebrow="Programmes" title={programme.name} description="Review the programme, manage teaching assignments and prepare future cohorts."/><ProgrammeDetails programme={programme}/><ProgrammeAssignmentManager programmeId={programme.id} teachers={teachers}/><ProgrammeCohorts programmeId={programme.id}/></AdminPage>;
}
