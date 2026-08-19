import type { Metadata } from "next";

import { AdminPage } from "@/components/admin/ui";
import { requireTeacher } from "@/lib/auth/guards";
import { TeacherDashboard } from "@/modules/teacher-dashboard";
import { getTeacherDashboard } from "@/modules/teacher-dashboard/server";

export const metadata: Metadata = {
  title: "Teacher Dashboard | Portal",
};

export default async function TeacherPortalPage() {
  const teacher = await requireTeacher();
  const dashboard = await getTeacherDashboard(teacher.id);

  return (
    <AdminPage>
      <TeacherDashboard firstName={teacher.firstName} data={dashboard} />
    </AdminPage>
  );
}
