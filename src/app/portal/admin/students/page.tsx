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
        description="Review learner records and manage admission details and lifecycle status."
      />
      <StudentMetrics metrics={metrics} />
      <StudentsTable />
    </AdminPage>
  );
}
