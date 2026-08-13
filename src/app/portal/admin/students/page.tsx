import type { Metadata } from "next";
import { AdminPage, PageHeader } from "@/components/admin/ui";
import { StudentMetrics, StudentsTable } from "@/modules/students";
import { getStudentMetrics } from "@/modules/students/server";
export const metadata: Metadata = { title: "Students | Admin Portal" };
export default async function StudentsPage() {
  const metrics = await getStudentMetrics();
  return (
    <AdminPage>
      <PageHeader
        eyebrow="Admissions"
        title="Students"
        description="Create and manage learner records, admission details, photos and lifecycle status."
      />
      <StudentMetrics metrics={metrics} />
      <StudentsTable />
    </AdminPage>
  );
}
