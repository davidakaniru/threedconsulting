import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  AdminPage,
  PageBackButton,
  PageHeader,
  SectionCard,
} from "@/components/admin/ui";
import { requireTeacher } from "@/lib/auth/guards";
import { getHomework } from "@/modules/homework/server";
import { getSessions } from "@/modules/sessions/server";
import { HomeworkForm } from "@/modules/homework";
export const metadata: Metadata = { title: "Edit Homework | Teacher Portal" };
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const teacher = await requireTeacher();
  const h = await getHomework((await params).id);
  if (h.session.lesson.teacher.id !== teacher.id) notFound();
  const { sessions } = await getSessions({
    teacherId: teacher.id,
    pageSize: 100,
  });
  return (
    <AdminPage>
      <PageBackButton />
      <PageHeader
        eyebrow="Homework"
        title="Edit homework"
        description={h.title}
      />
      <SectionCard contentClassName="p-6">
        <HomeworkForm homework={h} sessions={sessions} />
      </SectionCard>
    </AdminPage>
  );
}
