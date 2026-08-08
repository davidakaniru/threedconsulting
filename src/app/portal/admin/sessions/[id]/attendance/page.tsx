import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPage, PageBackButton, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth/guards";
import { AttendanceSheet } from "@/modules/attendance";
import { getAdminSessionAttendance } from "@/modules/attendance/server";
export const metadata: Metadata = { title: "Session Attendance | Admin Portal" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) { await requireAdmin(); try { const sheet = await getAdminSessionAttendance((await params).id); return <AdminPage><PageBackButton /><PageHeader eyebrow="Attendance oversight" title={sheet.session.title} description={`${sheet.session.lesson.studentName} · ${sheet.session.lesson.programmeName}`} /><AttendanceSheet sheet={sheet} readOnly /></AdminPage>; } catch { notFound(); } }
