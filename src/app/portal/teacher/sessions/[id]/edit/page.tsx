import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  AdminPage,
  PageBackButton,
  PageHeader,
  SectionCard,
} from "@/components/admin/ui";
import { requireTeacher } from "@/lib/auth/guards";
import { getTeacherLessonAssignments } from "@/modules/lesson-assignments/server";
import { getSession } from "@/modules/sessions/server";
import { SessionForm } from "@/modules/sessions";
export const metadata: Metadata = { title: "Edit Session | Tutor Portal" };
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const teacher = await requireTeacher();
  const s = await getSession((await params).id);
  if (s.lessonAssignment.teacher.id !== teacher.id) notFound();
  const assignments = await getTeacherLessonAssignments(teacher.id);
  return (
    <AdminPage>
      <PageBackButton />
      <PageHeader
        eyebrow="Sessions"
        title="Edit session"
        description={s.title}
      />
      <SectionCard contentClassName="p-6">
        <SessionForm
          session={s}
          lessons={assignments.filter((a) => a.status === "active")}
        />
      </SectionCard>
    </AdminPage>
  );
}
