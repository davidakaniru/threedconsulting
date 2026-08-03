import { PortalPage } from "@/components/portal/portal-page";
import { requireTeacher } from "@/lib/auth/guards";

export default async function TeacherPortalPage() {
  const user = await requireTeacher();

  return (
    <PortalPage
      user={user}
      title="Teacher dashboard"
      description="View your assigned programmes now. Cohorts, class sessions, learners and attendance will become available as the academic workflow is completed."
    />
  );
}
