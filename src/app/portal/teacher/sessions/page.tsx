import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPage, PageHeader } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { TeacherSessionTimeline } from "@/modules/sessions";
export const metadata: Metadata = { title: "My Sessions | Tutor Portal" };
export default function Page() {
  return (
    <AdminPage>
      <PageHeader
        eyebrow="Teaching"
        title="My sessions"
        description="Plan and manage online sessions for your active one-to-one lessons."
        actions={
          <Button asChild>
            <Link href="/portal/teacher/sessions/new">
              <Plus />
              New session
            </Link>
          </Button>
        }
      />
      <TeacherSessionTimeline />
    </AdminPage>
  );
}
