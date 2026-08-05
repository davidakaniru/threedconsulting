import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpenCheck,
  CalendarDays,
  CalendarPlus,
  ClipboardList,
  ListChecks,
  Users,
} from "lucide-react";

import {
  AdminPage,
  EmptyState,
  PageHeader,
  StatusBadge,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { requireTeacher } from "@/lib/auth/guards";
import { formatDate, formatRelative } from "@/lib/date";
import { getCohorts } from "@/modules/cohorts/server";
import { getSessions } from "@/modules/sessions/server";
import { getTeachingAssignments } from "@/modules/teaching-assignments/server";

export const metadata: Metadata = {
  title: "My Teaching | Teacher Portal",
};

export default async function TeacherTeachingPage() {
  const teacher = await requireTeacher();
  const [{ assignments }, { cohorts }, { sessions }] = await Promise.all([
    getTeachingAssignments({ teacherId: teacher.id }),
    getCohorts({ teacherId: teacher.id, pageSize: 100 }),
    getSessions({ teacherId: teacher.id, pageSize: 100 }),
  ]);

  const assignmentById = new Map(
    assignments.map((assignment) => [assignment.id, assignment]),
  );
  const upcomingByCohort = new Map<string, (typeof sessions)[number]>();
  const now = new Date();

  sessions
    .filter((session) => {
      if (session.status !== "scheduled") return false;
      return new Date(`${session.sessionDate}T${session.startTime}`) >= now;
    })
    .sort(
      (a, b) =>
        new Date(`${a.sessionDate}T${a.startTime}`).getTime() -
        new Date(`${b.sessionDate}T${b.startTime}`).getTime(),
    )
    .forEach((session) => {
      if (!upcomingByCohort.has(session.cohortId)) {
        upcomingByCohort.set(session.cohortId, session);
      }
    });

  const sortedCohorts = [...cohorts].sort((a, b) =>
    a.code.localeCompare(b.code),
  );

  return (
    <AdminPage>
      <PageHeader
        eyebrow="Teaching"
        title="My teaching"
        description="Work directly from the cohorts you teach, with programme context and quick access to daily teaching tasks."
        actions={
          <Button asChild>
            <Link href="/portal/teacher/sessions/new">
              <CalendarPlus />
              Create session
            </Link>
          </Button>
        }
      />

      {sortedCohorts.length === 0 ? (
        <EmptyState
          icon={BookOpenCheck}
          title="No teaching assignments yet"
          description="Your administrator will assign programmes and cohorts before classes begin."
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {sortedCohorts.map((cohort) => {
            const assignment = assignmentById.get(cohort.teachingAssignmentId);
            const nextSession = upcomingByCohort.get(cohort.id);
            const nextSessionDate = nextSession
              ? new Date(`${nextSession.sessionDate}T${nextSession.startTime}`)
              : null;

            return (
              <article
                key={cohort.id}
                className="flex h-full flex-col rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
                      {cohort.code}
                    </p>
                    <h2 className="mt-1 truncate font-display text-xl font-extrabold text-foreground">
                      {cohort.name}
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-muted-foreground">
                      {cohort.programme.name}
                    </p>
                  </div>
                  <StatusBadge status={cohort.status} />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                      <Users className="size-4" />
                      Students
                    </div>
                    <p className="mt-2 text-lg font-extrabold text-foreground">
                      {cohort.memberCount} / {cohort.capacity}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                      <CalendarDays className="size-4" />
                      Next session
                    </div>
                    {nextSession && nextSessionDate ? (
                      <div className="mt-2">
                        <p className="truncate text-sm font-bold text-foreground">
                          {nextSession.title}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-primary">
                          {formatRelative(nextSessionDate)}
                        </p>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm font-medium text-slate-500">
                        Not scheduled
                      </p>
                    )}
                  </div>
                </div>

                {assignment ? (
                  <p className="mt-4 text-xs text-muted-foreground">
                    Programme assigned {formatDate(assignment.assignedAt)}
                  </p>
                ) : null}

                <div className="mt-auto grid gap-2 border-t border-slate-100 pt-4 sm:grid-cols-3">
                  <Button asChild size="sm">
                    <Link href={`/portal/teacher/sessions/new?cohortId=${cohort.id}`}>
                      <CalendarPlus />
                      Session
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/portal/teacher/attendance">
                      <ListChecks />
                      Attendance
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/portal/teacher/homework/new">
                      <ClipboardList />
                      Homework
                    </Link>
                  </Button>
                </div>

                {nextSession ? (
                  <Button asChild variant="ghost" size="sm" className="mt-2">
                    <Link href={`/portal/teacher/sessions/${nextSession.id}`}>
                      View next session
                    </Link>
                  </Button>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </AdminPage>
  );
}
