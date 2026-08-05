import Link from "next/link";
import {
  AlertTriangle,
  BookOpen,
  CalendarDays,
  FileCheck2,
  GraduationCap,
  Layers3,
  Plus,
  UserRound,
  Users,
} from "lucide-react";

import {
  AdminPage,
  EmptyState,
  MetricCard,
  MetricGrid,
  PageHeader,
  QuickAction,
  SectionCard,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/guards";
import { formatDateTime, formatTime } from "@/lib/date";
import { getAdminDashboardOverview } from "@/modules/dashboard/server";

function activityLabel(action: string) {
  return action
    .replaceAll("_", " ")
    .replaceAll(".", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function AdminPortalPage() {
  const [user, overview] = await Promise.all([
    requireAdmin(),
    getAdminDashboardOverview(),
  ]);
  const { metrics } = overview;

  return (
    <AdminPage>
      <PageHeader
        eyebrow="Admin portal"
        title={<>Good to see you{user.firstName ? `, ${user.firstName}` : ""}!</>}
        description="Review what needs attention today and move quickly into the academy's core operations."
        actions={
          <Button asChild>
            <Link href="/portal/admin/enrolments">
              <FileCheck2 aria-hidden="true" />
              Review enrolments
            </Link>
          </Button>
        }
      />

      <MetricGrid>
        <MetricCard label="Teachers" value={metrics.teachers.total} helper={`${metrics.teachers.active} active`} icon={GraduationCap} tone="blue" />
        <MetricCard label="Students" value={metrics.students.total} helper={`${metrics.students.active} active`} icon={Users} tone="orange" />
        <MetricCard label="Parents" value={metrics.parents.total} helper={`${metrics.parents.active} active accounts`} icon={UserRound} tone="green" />
        <MetricCard label="Active cohorts" value={overview.activeCohorts} helper="Currently delivering programmes" icon={Layers3} tone="purple" />
      </MetricGrid>

      <SectionCard
        eyebrow="Shortcuts"
        title="Common admin actions"
        description="Start the tasks administrators perform most often."
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <QuickAction href="/portal/admin/teachers/new" icon={GraduationCap} title="Add teacher" description="Create a teacher account and send their invitation." />
          <QuickAction href="/portal/admin/programmes/new" icon={BookOpen} title="Create programme" description="Add a subject and prepare it for assignments." />
          <QuickAction href="/portal/admin/cohorts/new" icon={Layers3} title="Create cohort" description="Open a new intake under a teaching assignment." />
          <QuickAction href="/portal/admin/enrolments" icon={FileCheck2} title="Review enrolments" description="Approve applications and place children into cohorts." />
        </div>
      </SectionCard>

      <div className="grid gap-5 xl:grid-cols-2">
        <SectionCard
          title="Pending enrolments"
          description="Applications waiting for review or a final decision."
          icon={FileCheck2}
          action={<Button asChild variant="outline"><Link href="/portal/admin/enrolments">View queue</Link></Button>}
          contentClassName="p-0"
        >
          {overview.pendingEnrolments.length ? (
            <div className="divide-y divide-slate-100">
              {overview.pendingEnrolments.map((application) => (
                <Link key={application.id} href={`/portal/admin/enrolments/${application.id}`} className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-slate-50 sm:px-6">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-900">{application.childName}</p>
                    <p className="mt-1 truncate text-sm text-slate-500">Submitted by {application.parentName}</p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-slate-400">{formatDateTime(application.submittedAt)}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6"><EmptyState icon={FileCheck2} title="Enrolment queue is clear" description="New parent applications will appear here." /></div>
          )}
        </SectionCard>

        <SectionCard
          title="Today's sessions"
          description="Scheduled classes taking place today."
          icon={CalendarDays}
          action={<Button asChild variant="outline"><Link href="/portal/admin/sessions">All sessions</Link></Button>}
          contentClassName="p-0"
        >
          {overview.todaySessions.length ? (
            <div className="divide-y divide-slate-100">
              {overview.todaySessions.map((session) => (
                <Link key={session.id} href={`/portal/admin/sessions/${session.id}`} className="flex items-start justify-between gap-4 px-5 py-4 transition hover:bg-slate-50 sm:px-6">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-900">{session.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{session.programmeName} · {session.cohortCode} · {session.teacherName}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-extrabold text-primary">{formatTime(session.startTime)}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6"><EmptyState icon={CalendarDays} title="No sessions today" description="Scheduled classes for today will appear here." /></div>
          )}
        </SectionCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-[.85fr_1.15fr]">
        <SectionCard title="Capacity alerts" description="Active cohorts at 80% capacity or higher." icon={AlertTriangle} contentClassName="p-0">
          {overview.capacityAlerts.length ? (
            <div className="divide-y divide-slate-100">
              {overview.capacityAlerts.map((cohort) => {
                const percentage = Math.round((cohort.memberCount / cohort.capacity) * 100);
                return (
                  <Link key={cohort.id} href={`/portal/admin/cohorts/${cohort.id}`} className="block px-5 py-4 transition hover:bg-slate-50 sm:px-6">
                    <div className="flex items-center justify-between gap-4">
                      <div><p className="font-bold text-slate-900">{cohort.code} · {cohort.name}</p><p className="mt-1 text-sm text-slate-500">{cohort.programmeName}</p></div>
                      <span className="text-sm font-extrabold text-amber-700">{cohort.memberCount}/{cohort.capacity}</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-amber-500" style={{ width: `${Math.min(percentage, 100)}%` }} /></div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-6"><EmptyState icon={Layers3} title="No capacity alerts" description="All active cohorts currently have sufficient space." /></div>
          )}
        </SectionCard>

        <SectionCard title="Recent activity" description="The latest recorded changes across the platform." icon={CalendarDays} contentClassName="p-0">
          {overview.recentActivity.length ? (
            <div className="divide-y divide-slate-100">
              {overview.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
                  <div className="min-w-0"><p className="truncate font-bold text-slate-900">{activityLabel(activity.action)}</p><p className="mt-1 text-sm capitalize text-slate-500">{activity.entityType.replaceAll("_", " ")}</p></div>
                  <span className="shrink-0 text-xs font-semibold text-slate-400">{formatDateTime(activity.createdAt)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6"><EmptyState icon={CalendarDays} title="No recent activity" description="Administrative and academic actions will appear here." /></div>
          )}
        </SectionCard>
      </div>
    </AdminPage>
  );
}
