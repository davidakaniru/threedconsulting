import { PortalPage } from "@/components/portal/portal-page";
import { requireTeacher } from "@/lib/auth/guards";

export default async function TeacherPortalPage() {
  const user = await requireTeacher();

  return (
    <PortalPage
      user={user}
      title="Teacher dashboard"
      description="Your teacher portal is protected and ready for classes, learners, attendance, learning resources, and progress reporting."
    />
  );
}
