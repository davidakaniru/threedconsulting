import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import {
  AdminPage,
  MetricCard,
  MetricGrid,
  PageHeader,
} from "@/components/admin/ui";
import { AdminSessionsTable } from "@/modules/sessions";
import { getSessionMetrics } from "@/modules/sessions/server";
import { getProgrammes } from "@/modules/programmes/server";
import { getTeachers } from "@/modules/teachers/server";

export const metadata: Metadata = { title: "Sessions | Admin Portal" };

export default async function Page() {
  const [m, p, t] = await Promise.all([
    getSessionMetrics(),
    getProgrammes({ pageSize: 100 }),
    getTeachers({ pageSize: 100 }),
  ]);
  const programmes = p.programmes.map((x) => ({ value: x.id, label: x.title }));
  const teachers = t.teachers.map((x) => ({
    value: x.id,
    label: [x.firstName, x.lastName].filter(Boolean).join(" ") || x.email,
  }));
  return (
    <AdminPage>
      <PageHeader
        eyebrow="Academic"
        title="Class sessions"
        description="Monitor online sessions across subjects and tutors."
      />
      <MetricGrid>
        <MetricCard label="Total" value={m.total} icon={CalendarDays} />
        <MetricCard label="Scheduled" value={m.scheduled} icon={CalendarDays} />
        <MetricCard label="Completed" value={m.completed} icon={CalendarDays} />
        <MetricCard
          label="Draft / Cancelled"
          value={m.draft + m.cancelled}
          icon={CalendarDays}
        />
      </MetricGrid>
      <AdminSessionsTable programmes={programmes} teachers={teachers} />
    </AdminPage>
  );
}
