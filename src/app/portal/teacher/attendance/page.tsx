import type { Metadata } from "next";
import { CalendarCheck2 } from "lucide-react";
import { AdminPage, PageHeader } from "@/components/admin/ui";
import { requireTeacher } from "@/lib/auth/guards";
import { AttendanceDashboard } from "@/modules/attendance";
export const metadata: Metadata = { title: "Attendance | Teacher Portal" };
export default async function Page() {
  await requireTeacher();
  return (
    <AdminPage>
      <PageHeader
        eyebrow="Teaching"
        title="Attendance"
        description="Mark and review attendance for your scheduled and completed sessions."
        icon={CalendarCheck2}
      />
      <AttendanceDashboard />
    </AdminPage>
  );
}
