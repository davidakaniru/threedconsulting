import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPage, PageHeader } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { getTeacherMetrics } from "@/modules/teachers/server/teacher.service";
import { TeacherMetrics } from "@/modules/teachers/components";
import { AdminTutorsTabs } from "@/modules/tutor-applications/components";
import { getTutorApplicationsForAdmin } from "@/modules/tutor-applications/server/admin-tutor-application.service";

export const metadata: Metadata = { title: "Tutors | Admin Portal" };

export default async function TeachersPage() {
  const [metrics, applications] = await Promise.all([
    getTeacherMetrics(),
    getTutorApplicationsForAdmin(),
  ]);

  return (
    <AdminPage>
      <PageHeader
        eyebrow="People"
        title="Tutors"
        description="Review tutor applications and manage active tutors."
        actions={
          <Button asChild>
            <Link href="/portal/admin/teachers/new">
              <Plus />
              Add tutor
            </Link>
          </Button>
        }
      />
      <TeacherMetrics metrics={metrics} />
      <AdminTutorsTabs applications={applications} />
    </AdminPage>
  );
}
