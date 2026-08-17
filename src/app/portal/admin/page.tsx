import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  FileCheck2,
  GraduationCap,
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
    .replaceAll("lesson_request", "enrolment")
    .replaceAll("teaching_assignment", "subject assignment")
    .replaceAll("_", " ")
    .replaceAll(".", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function activityEntityLabel(entityType: string) {
  const labels: Record<string, string> = {
    lesson_request: "Enrolment",
    teaching_assignment: "Subject assignment",
  };
  return labels[entityType] ?? entityType.replaceAll("_", " ");
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
        title={
          <>Good to see you{user.firstName ? `, ${user.firstName}` : ""}!</>
        }
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
        <MetricCard
          label="Tutors"
          value={metrics.teachers.total}
          helper={`${metrics.teachers.active} active`}
          icon={GraduationCap}
          tone="blue"
        />
        <MetricCard
          label="Students"
          value={metrics.students.total}
          helper={`${metrics.students.active} active`}
          icon={Users}
          tone="orange"
        />
        <MetricCard
          label="Parents"
          value={metrics.parents.total}
          helper={`${metrics.parents.active} active accounts`}
          icon={UserRound}
          tone="green"
        />
        <MetricCard
          label="Subjects"
          value={metrics.programmes.total}
          helper={`${metrics.programmes.published} published`}
          icon={BookOpen}
          tone="purple"
        />
      </MetricGrid>

      <SectionCard
        eyebrow="Shortcuts"
        title="Common admin actions"
        description="Start the tasks administrators perform most often."
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <QuickAction
            href="/portal/admin/teachers?tab=applications"
            icon={GraduationCap}
            title="Review tutor applications"
            description="Review applications and accept suitable tutors."
          />
          <QuickAction
            href="/portal/admin/programmes/new"
            icon={BookOpen}
            title="Create subject"
            description="Add a subject and make tutors eligible to teach it."
          />
          <QuickAction
            href="/portal/admin/enrolments"
            icon={FileCheck2}
            title="Review enrolments"
            description="Review parent enrolments and review suitable enrolments."
          />
          <QuickAction
            href="/portal/admin/sessions"
            icon={CalendarDays}
            title="View sessions"
            description="Monitor scheduled and completed online lessons."
          />
        </div>
      </SectionCard>

      <div className="grid gap-5 xl:grid-cols-2">
        <SectionCard
          title="Enrolments awaiting review"
          description="Parent enrolments waiting to be reviewed and published."
          icon={FileCheck2}
          action={
            <Button asChild variant="outline">
              <Link href="/portal/admin/enrolments">View queue</Link>
            </Button>
          }
          contentClassName="p-0"
        >
          {overview.pendingLessonRequests.length ? (
            <div className="divide-y divide-slate-100">
              {overview.pendingLessonRequests.slice(0, 3).map((application) => (
                <Link
                  key={application.id}
                  href={`/portal/admin/enrolments/${application.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-slate-50 sm:px-6"
                >
                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-900">
                      {application.childName}
                    </p>
                    <p className="mt-1 truncate text-sm text-slate-500">
                      {application.programmeName} · Submitted by{" "}
                      {application.parentName}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-slate-400">
                    {formatDateTime(application.submittedAt)}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6">
              <EmptyState
                icon={FileCheck2}
                title="Review queue is clear"
                description="New parent enrolments will appear here."
              />
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Today's sessions"
          description="Scheduled classes taking place today."
          icon={CalendarDays}
          action={
            <Button asChild variant="outline">
              <Link href="/portal/admin/sessions">All sessions</Link>
            </Button>
          }
          contentClassName="p-0"
        >
          {overview.todaySessions.length ? (
            <div className="divide-y divide-slate-100">
              {overview.todaySessions.slice(0, 3).map((session) => (
                <Link
                  key={session.id}
                  href={`/portal/admin/sessions/${session.id}`}
                  className="flex items-start justify-between gap-4 px-5 py-4 transition hover:bg-slate-50 sm:px-6"
                >
                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-900">
                      {session.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {session.programmeName} · {session.teacherName}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-extrabold text-primary">
                    {formatTime(session.startTime)}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6">
              <EmptyState
                icon={CalendarDays}
                title="No sessions today"
                description="Scheduled classes for today will appear here."
              />
            </div>
          )}
        </SectionCard>
      </div>

      <SectionCard
        title="Recent activity"
        description="The latest recorded changes across the platform."
        icon={CalendarDays}
        contentClassName="p-0"
      >
        {overview.recentActivity.length ? (
          <div className="divide-y divide-slate-100">
            {overview.recentActivity.slice(0, 5).map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
              >
                <div className="min-w-0">
                  <p className="truncate font-bold text-slate-900">
                    {activityLabel(activity.action)}
                  </p>
                  <p className="mt-1 text-sm capitalize text-slate-500">
                    {activityEntityLabel(activity.entityType)}
                  </p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-slate-400">
                  {formatDateTime(activity.createdAt)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6">
            <EmptyState
              icon={CalendarDays}
              title="No recent activity"
              description="Administrative and academic actions will appear here."
            />
          </div>
        )}
      </SectionCard>
    </AdminPage>
  );
}
