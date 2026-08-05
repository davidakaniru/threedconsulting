import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpenCheck,
  CalendarPlus,
  CalendarDays,
  Layers3,
  Users,
} from "lucide-react";

import {
  AdminPage,
  EmptyState,
  PageHeader,
  SectionCard,
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

  return (
    <AdminPage>
      <PageHeader
        eyebrow="Teaching"
        title="My teaching"
        description="View your assigned programmes and the cohorts you teach in one place."
        actions={
          <Button asChild>
            <Link href="/portal/teacher/sessions/new">
              <CalendarPlus />
              Create session
            </Link>
          </Button>
        }
      />

      {assignments.length === 0 ? (
        <EmptyState
          icon={BookOpenCheck}
          title="No teaching assignments"
          description="Programmes and cohorts will appear here after an administrator assigns you to a programme."
        />
      ) : (
        <div className="space-y-6">
          {assignments.map((assignment) => {
            const programmeCohorts = cohorts.filter(
              (cohort) => cohort.teachingAssignmentId === assignment.id,
            );

            return (
              <SectionCard
                key={assignment.id}
                title={assignment.programme.name}
                description={`Assigned ${formatDate(assignment.assignedAt)}`}
                icon={BookOpenCheck}
                action={<StatusBadge status={assignment.status} />}
                contentClassName="p-5 sm:p-6"
              >
                {programmeCohorts.length === 0 ? (
                  <EmptyState
                    compact
                    icon={Layers3}
                    title="No cohorts yet"
                    description="Cohorts created under this teaching assignment will appear here."
                  />
                ) : (
                  <div className="grid gap-4 lg:grid-cols-2">
                    {programmeCohorts.map((cohort) => {
                      const nextSession = upcomingByCohort.get(cohort.id);
                      const nextSessionDate = nextSession
                        ? new Date(
                            `${nextSession.sessionDate}T${nextSession.startTime}`,
                          )
                        : null;

                      return (
                        <article
                          key={cohort.id}
                          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary">
                                {cohort.code}
                              </p>
                              <h2 className="mt-1 font-display text-xl font-extrabold text-foreground">
                                {cohort.name}
                              </h2>
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
                                  <p className="font-bold text-foreground">
                                    {nextSession.title}
                                  </p>
                                  <p className="mt-1 text-xs text-primary">
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

                          <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-4">
                            <Button asChild size="sm">
                              <Link
                                href={`/portal/teacher/sessions/new?cohortId=${cohort.id}`}
                              >
                                <CalendarPlus />
                                Create session
                              </Link>
                            </Button>
                            {nextSession ? (
                              <Button asChild variant="outline" size="sm">
                                <Link
                                  href={`/portal/teacher/sessions/${nextSession.id}`}
                                >
                                  View next session
                                </Link>
                              </Button>
                            ) : null}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </SectionCard>
            );
          })}
        </div>
      )}
    </AdminPage>
  );
}
