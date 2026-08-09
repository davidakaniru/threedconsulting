import type { Metadata } from "next";
import {
  AdminPage,
  PageBackButton,
  PageHeader,
  SectionCard,
} from "@/components/admin/ui";
import { requireTeacher } from "@/lib/auth/guards";
import { getSessions } from "@/modules/sessions/server";
import { HomeworkForm } from "@/modules/homework";
export const metadata: Metadata = { title: "New Homework | Teacher Portal" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ sessionId?: string }>;
}) {
  const teacher = await requireTeacher();
  const { sessions } = await getSessions({
    teacherId: teacher.id,
    pageSize: 100,
  });
  return (
    <AdminPage>
      <PageBackButton />
      <PageHeader
        eyebrow="Homework"
        title="Create homework"
        description="Attach homework to one of your class sessions."
      />
      <SectionCard contentClassName="p-6">
        <HomeworkForm
          sessions={sessions}
          defaultSessionId={(await searchParams).sessionId}
        />
      </SectionCard>
    </AdminPage>
  );
}
