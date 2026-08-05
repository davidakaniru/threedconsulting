import type { Metadata } from "next";
import { AdminPage, PageBackButton, PageHeader, SectionCard } from "@/components/admin/ui";
import { requireTeacher } from "@/lib/auth/guards";
import { getCohorts } from "@/modules/cohorts/server";
import { SessionForm } from "@/modules/sessions";

export const metadata: Metadata = { title: "New Session | Teacher Portal" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ cohortId?: string }>;
}) {
  const teacher = await requireTeacher();
  const [{ cohortId }, { cohorts }] = await Promise.all([
    searchParams,
    getCohorts({ teacherId: teacher.id, pageSize: 100 }),
  ]);
  const availableCohorts = cohorts.filter(
    (cohort) => cohort.status === "open" || cohort.status === "active",
  );
  const initialCohortId = availableCohorts.some(
    (cohort) => cohort.id === cohortId,
  )
    ? cohortId
    : undefined;

  return (
    <AdminPage>
      <PageBackButton />
      <PageHeader
        eyebrow="Sessions"
        title="Create session"
        description="Schedule a strictly online class session for one of your cohorts."
      />
      <SectionCard contentClassName="p-6">
        <SessionForm
          cohorts={availableCohorts}
          initialCohortId={initialCohortId}
        />
      </SectionCard>
    </AdminPage>
  );
}
