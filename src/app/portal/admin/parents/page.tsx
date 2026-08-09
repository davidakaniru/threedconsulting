import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPage, PageHeader } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { ParentMetrics, ParentsTable } from "@/modules/parents";
import { getParentMetrics } from "@/modules/parents/server";
export default async function Page() {
  const metrics = await getParentMetrics();
  return (
    <AdminPage>
      <PageHeader
        eyebrow="Families"
        title="Parents"
        description="Invite parent accounts and link them to one or more students."
        actions={
          <Button asChild>
            <Link href="/portal/admin/parents/new">
              <Plus />
              Add parent
            </Link>
          </Button>
        }
      />
      <ParentMetrics metrics={metrics} />
      <ParentsTable />
    </AdminPage>
  );
}
