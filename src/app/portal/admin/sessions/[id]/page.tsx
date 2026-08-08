import type { Metadata } from "next";
import { AdminPage, PageBackButton, PageHeader } from "@/components/admin/ui";
import { SessionDetails } from "@/modules/sessions";
import { getSession } from "@/modules/sessions/server";
export const metadata: Metadata = { title: "Session Details | Admin Portal" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const s = await getSession((await params).id);
  return <AdminPage><PageBackButton /><PageHeader eyebrow="Sessions" title={s.title} description={`${s.lessonAssignment.programme.name} · ${s.lessonAssignment.student.name} · ${s.lessonAssignment.teacher.name}`} /><SessionDetails session={s} admin /></AdminPage>;
}
