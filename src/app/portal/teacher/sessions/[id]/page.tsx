import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPage, PageBackButton, PageHeader } from "@/components/admin/ui";
import { requireTeacher } from "@/lib/auth/guards";
import { getSession } from "@/modules/sessions/server";
import { SessionDetails } from "@/modules/sessions";
export const metadata: Metadata = { title: "Session Details | Tutor Portal" };
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const teacher = await requireTeacher();
  const s = await getSession((await params).id);
  if (s.lessonAssignment.teacher.id !== teacher.id) notFound();
  return (
    <AdminPage>
      <PageBackButton />
      <PageHeader
        eyebrow="Sessions"
        title={s.title}
        description={`${s.lessonAssignment.student.name} · ${s.lessonAssignment.programme.name}`}
      />
      <SessionDetails session={s} />
    </AdminPage>
  );
}
