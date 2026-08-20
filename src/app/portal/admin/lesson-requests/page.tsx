import type { Metadata } from "next";
import { AdminPage, PageHeader } from "@/components/admin/ui";
import {
  LessonRequestMetrics,
  LessonRequestsTable,
} from "@/modules/lesson-requests";
import { getLessonRequestMetrics } from "@/modules/lesson-requests/server";

export const metadata: Metadata = { title: "Lesson Requests | Admin Portal" };

export default async function Page() {
  const metrics = await getLessonRequestMetrics();

  return (
    <AdminPage>
      <PageHeader
        eyebrow="Admissions"
        title="Lesson requests"
        description="Review parent lesson requests and publish suitable teaching opportunities to eligible subject teachers."
      />
      <LessonRequestMetrics metrics={metrics} />
      <LessonRequestsTable />
    </AdminPage>
  );
}
