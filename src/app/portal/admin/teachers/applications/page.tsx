import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPage, PageHeader } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { getTeacherMetrics } from "@/modules/teachers/server/teacher.service";
import { TeacherMetrics } from "@/modules/teachers/components";
import { AdminTutorsTabs } from "@/modules/tutor-applications/components/admin-tutors-tabs";

export const metadata: Metadata = {
  title: "Teacher Applications | Admin Portal",
};

export default async function TeacherApplicationsPage() {
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
      <AdminTutorsTabs />
    </AdminPage>
  );
}
