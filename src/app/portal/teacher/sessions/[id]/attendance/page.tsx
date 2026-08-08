import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPage, PageBackButton, PageHeader } from "@/components/admin/ui";
import { requireTeacher } from "@/lib/auth/guards";
import { AttendanceSheet } from "@/modules/attendance";
import { getSessionAttendance } from "@/modules/attendance/server";
export const metadata: Metadata = { title: "Take Attendance | Teacher Portal" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) { const teacher = await requireTeacher(); try { const sheet = await getSessionAttendance((await params).id, teacher.id); return <AdminPage><PageBackButton /><PageHeader eyebrow="Attendance" title={sheet.session.title} description={`${sheet.session.lesson.studentName} · ${sheet.session.lesson.programmeName}`} /><AttendanceSheet sheet={sheet} /></AdminPage>; } catch { notFound(); } }
