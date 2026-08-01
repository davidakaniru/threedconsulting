import { PortalPage } from "@/components/portal/portal-page";
import { requireParent } from "@/lib/auth/guards";

export default async function ParentPortalPage() {
  const user = await requireParent();

  return (
    <PortalPage
      user={user}
      title="Parent dashboard"
      description="Your parent portal is protected and ready for enrolments, learner progress, messages, notifications, and account settings."
    />
  );
}
