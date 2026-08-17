import type { Metadata } from "next";
import {
  AdminPage,
  PageBackButton,
  PageHeader,
  SectionCard,
} from "@/components/admin/ui";
import { requireTeacher } from "@/lib/auth/guards";
import { getTeacherLessonAssignments } from "@/modules/lesson-assignments/server";
import { SessionForm } from "@/modules/sessions";
export const metadata: Metadata = { title: "New Session | Tutor Portal" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ lessonAssignmentId?: string }>;
}) {
  const teacher = await requireTeacher();
  const [{ lessonAssignmentId }, assignments] = await Promise.all([
    searchParams,
    getTeacherLessonAssignments(teacher.id),
  ]);
  const lessons = assignments.filter((a) => a.status === "active");
  const initial = lessons.some((a) => a.id === lessonAssignmentId)
    ? lessonAssignmentId
    : undefined;
  return (
    <AdminPage>
      <PageBackButton />
      <PageHeader
        eyebrow="Sessions"
        title="Create session"
        description="Schedule an online one-to-one session for one of your active lessons."
      />
      <SectionCard contentClassName="p-6">
        <SessionForm lessons={lessons} initialLessonAssignmentId={initial} />
      </SectionCard>
    </AdminPage>
  );
}
