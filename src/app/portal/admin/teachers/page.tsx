import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { TeachersTable } from "@/modules/teachers";
import { AdminPage, PageHeader } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { getTeacherMetrics } from "@/modules/teachers/server/teacher.service";
import { TeacherMetrics } from "@/modules/teachers/components";

export const metadata: Metadata = { title: "Teachers | Admin Portal" };

export default async function TeachersPage() {
  const metrics = await getTeacherMetrics();
  return (
    <AdminPage>
      <PageHeader
        eyebrow="People"
        title="Teachers"
        description="Invite teachers and manage account onboarding, professional details and employment lifecycle."
        actions={
          <Button asChild>
            <Link href="/portal/admin/teachers/new">
              <Plus />
              Add teacher
            </Link>
          </Button>
        }
      />
      <TeacherMetrics metrics={metrics} />
      <TeachersTable />
    </AdminPage>
  );
}
