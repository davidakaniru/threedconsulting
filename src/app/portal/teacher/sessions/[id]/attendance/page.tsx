import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPage, PageBackButton, PageHeader } from "@/components/admin/ui";
import { requireTeacher } from "@/lib/auth/guards";
import { AttendanceSheet } from "@/modules/attendance";
import { getSessionAttendance } from "@/modules/attendance/server";
export const metadata: Metadata = { title: "View Attendance | Teacher Portal" };
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const teacher = await requireTeacher();
  let sheet;
  try {
    sheet = await getSessionAttendance((await params).id, teacher.id);
  } catch {
    notFound();
  }
  return (
    <AdminPage>
      <PageBackButton />
      <PageHeader
        eyebrow="Attendance"
        title={sheet.session.title}
        description={`${sheet.session.lesson.studentName} · ${sheet.session.lesson.programmeName}`}
      />
      <AttendanceSheet sheet={sheet} />
    </AdminPage>
  );
}
