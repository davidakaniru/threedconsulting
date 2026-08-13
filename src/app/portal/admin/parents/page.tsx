import { AdminPage, PageHeader } from "@/components/admin/ui";
import { ParentMetrics, ParentsTable } from "@/modules/parents";
import { getParentMetrics } from "@/modules/parents/server";

export default async function Page() {
  const metrics = await getParentMetrics();

  return (
    <AdminPage>
      <PageHeader
        eyebrow="Families"
        title="Parents"
        description="Manage parent accounts created through the enrolment process."
      />
      <ParentMetrics metrics={metrics} />
      <ParentsTable />
    </AdminPage>
  );
}
