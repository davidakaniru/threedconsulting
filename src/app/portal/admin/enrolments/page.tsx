import type { Metadata } from "next";
import { AdminPage, PageHeader } from "@/components/admin/ui";
import { EnrolmentMetrics, EnrolmentsTable } from "@/modules/enrolments";
import { getEnrolmentMetrics } from "@/modules/enrolments/server";
export const metadata: Metadata = { title: "Enrolments | Admin Portal" };
export default async function Page() {
  const metrics = await getEnrolmentMetrics();
  return (
    <AdminPage>
      <PageHeader
        eyebrow="Admissions"
        title="Enrolment applications"
        description="Review parent applications and place approved learners into suitable cohorts."
      />
      <EnrolmentMetrics metrics={metrics} />
      <EnrolmentsTable />
    </AdminPage>
  );
}
