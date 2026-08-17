import type { Metadata } from "next";
import Link from "next/link";
import {
  BarChart3,
  CalendarCheck2,
  CalendarX2,
  Users,
} from "lucide-react";

import {
  AdminPage,
  EmptyState,
  MetricCard,
  MetricGrid,
  PageHeader,
  SectionCard,
  StatusBadge,
} from "@/components/admin/ui";
import { TeacherReportFilters } from "@/modules/reports/teacher-report-filters";
import {
  getMonthlyTeacherActivityReport,
  getTeacherReportOptions,
  normalizeReportMonth,
} from "@/modules/reports/server";

export const metadata: Metadata = {
  title: "Tutor Activity Reports | Admin Portal",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; teacherId?: string }>;
}) {
  const params = await searchParams;
  const month = normalizeReportMonth(params.month);
  const teachers = await getTeacherReportOptions();
  const selectedTeacher = params.teacherId
    ? teachers.find((teacher) => teacher.value === params.teacherId)
    : undefined;

  const report = selectedTeacher
    ? await getMonthlyTeacherActivityReport(month, selectedTeacher.value)
    : null;

  const activity = report?.teachers[0] ?? null;

  return (
    <AdminPage>
      <PageHeader
        eyebrow="Reports"
        title="Tutor activity"
        description="Select a tutor and month to review their teaching activity."
      />

      <SectionCard
        title="Report filters"
        description="Search by tutor name or ID, then choose the reporting month."
      >
        <TeacherReportFilters
          month={month}
          teacherId={selectedTeacher?.value}
          teachers={teachers}
        />
      </SectionCard>

      {!selectedTeacher ? (
        <EmptyState
          icon={BarChart3}
          title="Select a tutor"
          description="Choose a tutor above to view their monthly activity report."
        />
      ) : !activity || !report ? (
        <EmptyState
          icon={BarChart3}
          title="No tutor activity"
          description={`No lesson sessions were recorded for ${selectedTeacher.label} in ${new Intl.DateTimeFormat(
            "en-NG",
            { month: "long", year: "numeric", timeZone: "UTC" },
          ).format(new Date(`${month}-01T00:00:00Z`))}.`}
        />
      ) : (
        <>
          <MetricGrid>
            <MetricCard
              label="Students taught"
              value={activity.studentsTaught}
              icon={Users}
            />
            <MetricCard
              label="Sessions"
              value={activity.sessionsTotal}
              icon={BarChart3}
            />
            <MetricCard
              label="Completed"
              value={activity.completed}
              icon={CalendarCheck2}
            />
            <MetricCard
              label="Cancelled"
              value={activity.cancelled}
              icon={CalendarX2}
            />
          </MetricGrid>

          <SectionCard
            eyebrow="Tutor"
            title={activity.teacherName}
            description={`${activity.email} · ${report.label}`}
            action={
              <Link
                className="text-sm font-bold text-primary hover:underline"
                href={`/portal/admin/teachers/${activity.teacherId}`}
              >
                View teacher
              </Link>
            }
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Mini label="Scheduled" value={activity.scheduled} />
              <Mini label="Completed" value={activity.completed} />
              <Mini label="Cancelled" value={activity.cancelled} />
            </div>

            <div className="mt-5">
              <p className="text-xs font-extrabold uppercase tracking-[.14em] text-muted-foreground">
                Subject breakdown
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {activity.programmes.map((programme) => (
                  <span
                    key={programme.name}
                    className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary"
                  >
                    {programme.name} · {programme.sessions}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-175 text-left text-sm">
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
                  {activity.sessions.map((session) => (
                    <tr
                      key={session.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="py-3 pr-4">{session.date}</td>
                      <td className="py-3 pr-4">
                        <Link
                          href={`/portal/admin/sessions/${session.id}`}
                          className="font-semibold hover:text-primary"
                        >
                          {session.title}
                        </Link>
                      </td>
                      <td className="py-3 pr-4">{session.studentName}</td>
                      <td className="py-3 pr-4">{session.programmeName}</td>
                      <td className="py-3">
                        <StatusBadge status={session.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </>
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
