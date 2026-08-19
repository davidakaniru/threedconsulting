import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpenCheck,
  CalendarDays,
  Clock3,
  Hourglass,
  Plus,
} from "lucide-react";
import {
  AdminPage,
  EmptyState,
  PageHeader,
  StatusBadge,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { requireTeacher } from "@/lib/auth/guards";
import { formatDate, formatTime } from "@/lib/date";
import { getTeacherLessonAssignments } from "@/modules/lesson-assignments/server";
import type { TeacherOpportunity } from "@/modules/lesson-requests";
import { TeacherOpportunityAcceptButton } from "@/modules/lesson-requests/components/teacher-opportunity-accept-button";
import { listTeacherOpportunities } from "@/modules/lesson-requests/server";

export const metadata: Metadata = { title: "Lessons | Teacher Portal" };

const day = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

type LessonTab = "mine" | "available";

export default async function TeacherLessonsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const teacher = await requireTeacher();
  const params = await searchParams;
  const activeTab: LessonTab = params.tab === "available" ? "available" : "mine";

  const [assignments, opportunities] = await Promise.all([
    getTeacherLessonAssignments(teacher.id),
    listTeacherOpportunities(teacher.id),
  ]);

  return (
    <AdminPage>
      <PageHeader
        eyebrow="Teaching"
        title="Lessons"
        description="Manage your active one-to-one lessons and review new teaching opportunities in one place."
      />

      <div className="mb-6 flex w-full gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1 sm:w-fit">
        <Link
          href="/portal/teacher/lessons"
          className={`flex min-h-10 flex-1 items-center justify-center rounded-xl px-4 text-sm font-bold transition-colors sm:flex-none ${
            activeTab === "mine"
              ? "bg-white text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          My lessons
        </Link>
        <Link
          href="/portal/teacher/lessons?tab=available"
          className={`flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition-colors sm:flex-none ${
            activeTab === "available"
              ? "bg-white text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Available lessons
          {opportunities.length > 0 ? (
            <span
              className="grid min-w-5 place-items-center rounded-full bg-primary px-1.5 py-0.5 text-[11px] font-extrabold leading-4 text-primary-foreground"
              aria-label={`${opportunities.length} available lesson${opportunities.length === 1 ? "" : "s"}`}
            >
              {opportunities.length}
            </span>
          ) : null}
        </Link>
      </div>

      {activeTab === "mine" ? (
        assignments.length === 0 ? (
          <EmptyState
            icon={BookOpenCheck}
            title="No lessons yet"
            description="Lessons you accept will appear here as active teaching assignments."
            action={
              opportunities.length > 0 ? (
                <Button asChild>
                  <Link href="/portal/teacher/lessons?tab=available">
                    View available lessons
                  </Link>
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
            {assignments.map((item) => (
              <article
                key={item.id}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[.16em] text-primary">
                      {item.programme.name}
                    </p>
                    <h2 className="mt-1 font-display text-xl font-extrabold">
                      {item.studentName}
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-muted-foreground">
                      {item.currentEducationLevel}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                <div className="mt-5 space-y-3 text-sm">
                  <p className="flex gap-2">
                    <CalendarDays className="size-4 text-primary" />
                    <span>
                      <b>Days:</b> {item.preferredDays.map(day).join(", ")}
                    </span>
                  </p>
                  <p className="flex gap-2">
                    <Clock3 className="size-4 text-primary" />
                    <span>
                      <b>Time:</b> {formatTime(item.sessionTime)}
                    </span>
                  </p>
                  <p className="flex gap-2">
                    <Hourglass className="size-4 text-primary" />
                    <span>
                      <b>Lesson period:</b> {formatDate(item.startDate)} –{" "}
                      {formatDate(item.endDate)}
                    </span>
                  </p>
                </div>
                {item.status === "active" ? (
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <Button asChild size="sm">
                      <Link
                        href={`/portal/teacher/sessions/new?lessonAssignmentId=${item.id}`}
                      >
                        <Plus />
                        Create session
                      </Link>
                    </Button>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        )
      ) : opportunities.length === 0 ? (
        <EmptyState
          icon={BookOpenCheck}
          title="No available lessons"
          description="New enrolments matching at least one of your assigned subjects will appear here after an administrator publishes them."
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {opportunities.map((item: TeacherOpportunity) => (
            <article
              key={item.id}
              className="flex h-full flex-col rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
                  {item.subjects.map((subject) => subject.name).join(" · ")}
                </p>
                <h2 className="mt-1 font-display text-xl font-extrabold text-foreground">
                  {item.childName}
                </h2>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">
                  {item.currentEducationLevel}
                </p>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                    <CalendarDays className="size-4" />
                    Preferred days
                  </div>
                  <p className="mt-2 text-sm font-bold text-foreground">
                    {item.preferredDays.map(day).join(" · ")}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                    <Clock3 className="size-4" />
                    Preferred time
                  </div>
                  <p className="mt-2 text-sm font-bold text-foreground">
                    {formatTime(item.preferredTime)}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 sm:col-span-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                    <Hourglass className="size-4" />
                    Duration
                  </div>
                  <p className="mt-2 text-sm font-bold text-foreground">
                    {item.durationMonths}{" "}
                    {item.durationMonths === 1 ? "month" : "months"}
                  </p>
                </div>
              </div>
              {item.additionalMessage ? (
                <div className="mt-4 rounded-xl border border-slate-100 p-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Parent message
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.additionalMessage}
                  </p>
                </div>
              ) : null}
              <div className="mt-auto border-t border-slate-100 pt-4">
                <TeacherOpportunityAcceptButton id={item.id} />
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminPage>
  );
}
