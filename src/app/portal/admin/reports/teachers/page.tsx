import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, CalendarCheck2, GraduationCap, Users } from "lucide-react";
import {
  AdminPage,
  EmptyState,
  MetricCard,
  MetricGrid,
  PageHeader,
  SectionCard,
  StatusBadge,
} from "@/components/admin/ui";
import { TeacherReportMonthPicker } from "@/modules/reports/teacher-report-month-picker";
import { getMonthlyTeacherActivityReport } from "@/modules/reports/server";
export const metadata: Metadata = {
  title: "Teacher Activity Reports | Admin Portal",
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const params = await searchParams;
  const report = await getMonthlyTeacherActivityReport(params.month);
  return (
    <AdminPage>
      <PageHeader
        eyebrow="Reports"
        title="Teacher activity"
        description={`Monthly teaching activity for ${report.label}, generated automatically from lesson sessions.`}
        actions={<TeacherReportMonthPicker month={report.month} />}
      />
      <MetricGrid>
        <MetricCard
          label="Active teachers"
          value={report.totals.teachers}
          icon={GraduationCap}
        />
        <MetricCard
          label="Students taught"
          value={report.totals.students}
          icon={Users}
        />
        <MetricCard
          label="Sessions"
          value={report.totals.sessions}
          icon={BarChart3}
        />
        <MetricCard
          label="Completed"
          value={report.totals.completed}
          icon={CalendarCheck2}
        />
      </MetricGrid>
      {report.teachers.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="No teacher activity"
          description={`There are no lesson-assignment sessions recorded for ${report.label}.`}
        />
      ) : (
        <div className="space-y-5">
          {report.teachers.map((t) => (
            <SectionCard
              key={t.teacherId}
              eyebrow="Teacher"
              title={t.teacherName}
              description={t.email}
              action={
                <Link
                  className="text-sm font-bold text-primary hover:underline"
                  href={`/portal/admin/teachers/${t.teacherId}`}
                >
                  View teacher
                </Link>
              }
            >
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <Mini label="Students" value={t.studentsTaught} />
                <Mini label="Sessions" value={t.sessionsTotal} />
                <Mini label="Completed" value={t.completed} />
                <Mini label="Scheduled" value={t.scheduled} />
                <Mini label="Cancelled" value={t.cancelled} />
              </div>
              <div className="mt-5">
                <p className="text-xs font-extrabold uppercase tracking-[.14em] text-muted-foreground">
                  Subject breakdown
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {t.programmes.map((p) => (
                    <span
                      key={p.name}
                      className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary"
                    >
                      {p.name} · {p.sessions}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="py-3 pr-4">Date</th>
                      <th className="py-3 pr-4">Session</th>
                      <th className="py-3 pr-4">Child</th>
                      <th className="py-3 pr-4">Subject</th>
                      <th className="py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.sessions.map((s) => (
                      <tr
                        key={s.id}
                        className="border-b border-slate-100 last:border-0"
                      >
                        <td className="py-3 pr-4">{s.date}</td>
                        <td className="py-3 pr-4">
                          <Link
                            href={`/portal/admin/sessions/${s.id}`}
                            className="font-semibold hover:text-primary"
                          >
                            {s.title}
                          </Link>
                        </td>
                        <td className="py-3 pr-4">{s.studentName}</td>
                        <td className="py-3 pr-4">{s.programmeName}</td>
                        <td className="py-3">
                          <StatusBadge status={s.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          ))}
        </div>
      )}
    </AdminPage>
  );
}
function Mini({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-2xl font-extrabold text-foreground">{value}</p>
    </div>
  );
}
