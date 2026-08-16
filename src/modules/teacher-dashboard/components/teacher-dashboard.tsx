import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Plus,
  ListChecks,
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
  formatRelative,
  formatTime,
} from "@/lib/date";
import type { TeacherDashboardData } from "../types";
import { SessionJoinButton } from "@/modules/sessions/components/session-join-button";

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
              sessions, and keep attendance up to date.
            </p>
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
          label="Attendance records"
          value={data.metrics.attendancePending}
          helper="Recorded automatically from meeting joins"
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
              {data.upcomingSessions.slice(0, 2).map((session, index) => {
                return (
                  <div
                    key={session.id}
                    className={`rounded-2xl border p-4 ${index === 0 ? "border-primary/30 bg-primary/5" : "border-slate-200"}`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-extrabold">{session.title}</p>
                          {index === 0 && (
                            <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-primary">
                              Next
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {session.lessonAssignment.programme.name} · {""}
                          {session.lessonAssignment.student.name}
                        </p>
                        <p className="mt-2 text-sm font-semibold">
                          {formatDate(session.sessionDate)} · {""}
                          {formatTime(session.startTime)}–
                          {formatTime(session.endTime)}
                        </p>
                        <p className="mt-1 text-xs font-bold text-primary">
                          {formatRelative(
                            `${session.sessionDate}T${session.startTime}`,
                          )}
                        </p>
                      </div>
                      <SessionJoinButton
                        sessionId={session.id}
                        sessionDate={session.sessionDate}
                        startTime={session.startTime}
                        endTime={session.endTime}
                        status={session.status}
                        role="teacher"
                        className="shrink-0"
                      />
                    </div>
                  </div>
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
              title="View attendance"
              description="Review attendance recorded automatically from meeting joins."
            />
            <QuickAction
              href="/portal/teacher/lessons"
              icon={GraduationCap}
              title="Review my teaching"
              description="See your active one-to-one lessons and agreed schedules."
            />
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="My lessons"
        description="Your active one-to-one lessons and the next scheduled class for each child."
        icon={GraduationCap}
        action={
          <Button asChild variant="outline" size="sm">
            <Link href="/portal/teacher/lessons">View all lessons</Link>
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
