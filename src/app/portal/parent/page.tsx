import type { Metadata } from "next";
import { AdminPage, PageHeader } from "@/components/admin/ui";
import { requireParent } from "@/lib/auth/guards";
import { ParentAcademicDashboardView } from "@/modules/parent-dashboard";
import { getParentAcademicDashboard } from "@/modules/parent-dashboard/server";

export const metadata: Metadata = {
  title: "Parent Dashboard | ThreeD Consulting",
};

export default async function ParentPortalPage() {
  const parent = await requireParent();
  const data = await getParentAcademicDashboard(parent.id);

  return (
    <AdminPage>
      <PageHeader
        eyebrow="Parent portal"
        title="Academic dashboard"
        description="Switch between your children to view upcoming sessions, active lessons and attendance."
      />
      <ParentAcademicDashboardView data={data} />
    </AdminPage>
  );
}
