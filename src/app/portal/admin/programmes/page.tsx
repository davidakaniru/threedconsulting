import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPage, PageHeader } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { ProgrammeMetrics, ProgrammesTable } from "@/modules/programmes";
import { getProgrammeMetrics } from "@/modules/programmes/server";
export const metadata: Metadata = { title: "Subjects | Admin Portal" };
export default async function Page() {
  const metrics = await getProgrammeMetrics();
  return (
    <AdminPage>
      <PageHeader
        eyebrow="Academic"
        title="Subjects"
        description="Create and manage the subjects offered, then publish them for teaching assignments and enrolment."
        actions={
          <Button asChild>
            <Link href="/portal/admin/programmes/new">
              <Plus />
              Add subject
            </Link>
          </Button>
        }
      />
      <ProgrammeMetrics metrics={metrics} />
      <ProgrammesTable />
    </AdminPage>
  );
}
