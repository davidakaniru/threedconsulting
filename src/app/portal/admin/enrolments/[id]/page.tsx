import type { Metadata } from "next";
import { AdminPage, PageBackButton, PageHeader } from "@/components/admin/ui";
import { LessonRequestDetails } from "@/modules/lesson-requests";
import { getLessonRequest } from "@/modules/lesson-requests/server";

export const metadata: Metadata = { title: "Enrolment Review | Admin Portal" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const request = await getLessonRequest((await params).id);
  return (
    <AdminPage>
      <PageBackButton />
      <PageHeader eyebrow="Enrolments" title={request.childName} description={`${request.programme.name} · enrolment from ${request.parentName}`} />
      <LessonRequestDetails request={request} />
    </AdminPage>
  );
}
