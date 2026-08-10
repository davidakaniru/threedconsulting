import Link from "next/link";
import {
  BookOpen,
  CalendarCheck2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  GraduationCap,
  Plus,
  ListChecks,
  Sparkles,
} from "lucide-react";

import {
  EmptyState,
  MetricCard,
  MetricGrid,
  QuickAction,
  SectionCard,
  StatusBadge,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import {
  formatDate,
  formatDateTime,
  formatRelative,
  formatTime,
} from "@/lib/date";
import type { TeacherDashboardData } from "../types";

interface TeacherDashboardProps {
  firstName: string | null;
  data: TeacherDashboardData;
}

function sessionDateTime(session: { sessionDate: string; startTime: string }) {
  return new Date(`${session.sessionDate}T${session.startTime}`);
}

export function TeacherDashboard({ firstName, data }: TeacherDashboardProps) {
  return (
    <div className="space-y-7">
      <div className="rounded-[1.75rem] border border-primary/10 bg-linear-to-br from-primary/12 via-white to-orange-50 p-6 shadow-[0_18px_50px_-32px_rgba(15,23,42,.45)] sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-primary">
              Teacher workspace
            </p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Welcome back{firstName ? `, ${firstName}` : ""}.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Review today&apos;s teaching priorities, prepare upcoming
              sessions, and keep attendance and homework moving.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/portal/teacher/opportunities">
                <Sparkles />
                Available enrolments
              </Link>
            </Button>
            <Button asChild>
              <Link href="/portal/teacher/sessions/new">
                <Plus />
                Create session
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/portal/teacher/homework/new">
                <ClipboardList />
                Create homework
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <MetricGrid>
        <MetricCard
          label="Assigned programmes"
          value={data.metrics.programmes}
          helper="Active teaching assignments"
          icon={BookOpen}
          tone="blue"
        />
        <MetricCard
          label="Active lessons"
          value={data.metrics.activeLessons}
          helper="Accepted one-to-one lessons"
          icon={GraduationCap}
          tone="purple"
        />
        <MetricCard
          label="Upcoming sessions"
          value={data.metrics.upcomingSessions}
          helper="Next scheduled classes"
          icon={CalendarDays}
          tone="green"
        />
        <MetricCard
          label="Attendance to complete"
          value={data.metrics.attendancePending}
          helper="Sessions with pending records"
          icon={ListChecks}
          tone="orange"
        />
      </MetricGrid>

      <div className="grid gap-7 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,.65fr)]">
        <SectionCard
          title="Upcoming sessions"
          description="Your nearest scheduled online classes."
          icon={CalendarDays}
          action={
            <Button asChild variant="outline" size="sm">
              <Link href="/portal/teacher/sessions">View all</Link>
            </Button>
          }
        >
          {data.upcomingSessions.length === 0 ? (
            <EmptyState
              compact
              icon={CalendarDays}
              title="No upcoming sessions"
              description="Create a scheduled session when you are ready for your next class."
              action={
                <Button asChild size="sm">
                  <Link href="/portal/teacher/sessions/new">
                    Create session
                  </Link>
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {data.upcomingSessions.map((session) => {
                const start = sessionDateTime(session);
                return (
                  <Link
                    key={session.id}
                    href={`/portal/teacher/sessions/${session.id}`}
                    className="group flex flex-col gap-4 rounded-2xl border border-slate-200/80 p-4 transition hover:border-primary/25 hover:bg-primary/2.5 sm:flex-row sm:items-center"
                  >
                    <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                      <CalendarDays className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display font-extrabold text-foreground group-hover:text-primary">
                          {session.title}
                        </h3>
                        <StatusBadge status={session.status} />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {session.lessonAssignment.programme.name} ·{" "}
                        {session.lessonAssignment.student.name}
                      </p>
                    </div>
                    <div className="shrink-0 text-left sm:text-right">
                      <p className="text-sm font-bold text-foreground">
                        {formatDate(session.sessionDate)} ·{" "}
                        {formatTime(session.startTime)}
                      </p>
                      <p className="mt-1 text-xs font-medium text-primary">
                        {formatRelative(start)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Quick actions"
          description="Jump straight into common teaching tasks."
          icon={CheckCircle2}
        >
          <div className="grid gap-3">
            <QuickAction
              href="/portal/teacher/sessions/new"
              icon={Plus}
              title="Create a session"
              description="Schedule the next online class for one of your active lessons."
            />
            <QuickAction
              href="/portal/teacher/attendance"
              icon={ListChecks}
              title="Take attendance"
              description="Complete pending attendance sheets."
            />
            <QuickAction
              href="/portal/teacher/homework/new"
              icon={ClipboardList}
              title="Assign homework"
              description="Create work linked to one of your sessions."
            />
            <QuickAction
              href="/portal/teacher/teaching"
              icon={GraduationCap}
              title="Review my teaching"
              description="See your active one-to-one lessons and agreed schedules."
            />
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-7 lg:grid-cols-2">
        <SectionCard
          title="Attendance requiring attention"
          description="Scheduled or completed sessions with pending learner records."
          icon={CalendarCheck2}
          action={
            <Button asChild variant="outline" size="sm">
              <Link href="/portal/teacher/attendance">Open attendance</Link>
            </Button>
          }
        >
          {data.attendanceAttention.length === 0 ? (
            <EmptyState
              compact
              icon={CheckCircle2}
              title="Attendance is up to date"
              description="There are no sessions with pending attendance records."
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {data.attendanceAttention.map((session) => (
                <Link
                  key={session.id}
                  href={`/portal/teacher/sessions/${session.id}/attendance`}
                  className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-orange-100 text-orange-700">
                    <Clock3 className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-extrabold text-foreground">
                      {session.title}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {session.lessonAssignment.student.name} ·{" "}
                      {formatDate(session.sessionDate)}
                    </span>
                  </span>
                  <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-extrabold text-orange-700">
                    {session.attendance.pending} pending
                  </span>
                </Link>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Published homework"
          description="Assignments currently visible to your lesson students."
          icon={ClipboardList}
          action={
            <Button asChild variant="outline" size="sm">
              <Link href="/portal/teacher/homework">View all</Link>
            </Button>
          }
        >
          {data.homeworkDue.length === 0 ? (
            <EmptyState
              compact
              icon={ClipboardList}
              title="No published homework"
              description="Published assignments will appear here with their due dates."
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {data.homeworkDue.map((homework) => (
                <Link
                  key={homework.id}
                  href={`/portal/teacher/homework/${homework.id}`}
                  className="flex items-center gap-3 py-4 first:pt-0 last:pb-0"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-700">
                    <BookOpen className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-extrabold text-foreground">
                      {homework.title}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {homework.session.lesson.student.name} · Due{" "}
                      {formatDateTime(homework.dueAt)}
                    </span>
                  </span>
                  <StatusBadge status={homework.status} />
                </Link>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <SectionCard
        title="My teaching"
        description="Your active one-to-one lessons and the next scheduled class for each child."
        icon={GraduationCap}
        action={
          <Button asChild variant="outline" size="sm">
            <Link href="/portal/teacher/teaching">View all lessons</Link>
          </Button>
        }
      >
        {data.lessons.length === 0 ? (
          <EmptyState
            compact
            icon={GraduationCap}
            title="No active lessons yet"
            description="Accepted enrolments will appear here as active teaching relationships."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.lessons.map((lesson) => {
              const nextSession = data.upcomingSessions.find(
                (session) => session.lessonAssignmentId === lesson.id,
              );
              return (
                <article
                  key={lesson.id}
                  className="flex h-full flex-col rounded-2xl border border-slate-200/80 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary">
                        {lesson.programme.name}
                      </p>
                      <h3 className="mt-1 truncate font-display text-lg font-extrabold text-foreground">
                        {lesson.studentName}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {lesson.preferredDays
                          .map(
                            (day) => day.charAt(0).toUpperCase() + day.slice(1),
                          )
                          .join(" · ")}{" "}
                        · {formatTime(lesson.sessionTime)}
                      </p>
                    </div>
                    <StatusBadge status={lesson.status} />
                  </div>
                  <div className="mt-4 rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Next session
                    </p>
                    <p className="mt-1 text-sm font-extrabold text-foreground">
                      {nextSession
                        ? formatRelative(sessionDateTime(nextSession))
                        : "Not scheduled"}
                    </p>
                  </div>
                  <div className="mt-auto border-t border-slate-100 pt-4">
                    <Button asChild size="sm" className="w-full">
                      <Link
                        href={`/portal/teacher/sessions/new?lessonAssignmentId=${lesson.id}`}
                      >
                        <Plus />
                        Create session
                      </Link>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
