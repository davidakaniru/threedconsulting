import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenCheck, CalendarDays, Clock3, Hourglass, Plus } from "lucide-react";
import {
  AdminPage,
  EmptyState,
  PageHeader,
  StatusBadge,
} from "@/components/admin/ui";
import { requireTeacher } from "@/lib/auth/guards";
import { Button } from "@/components/ui/button";
import { formatDate, formatTime } from "@/lib/date";
import { getTeacherLessonAssignments } from "@/modules/lesson-assignments/server";

export const metadata: Metadata = { title: "My Teaching | Teacher Portal" };
const day = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
export default async function TeacherTeachingPage() {
  const teacher = await requireTeacher();
  const assignments = await getTeacherLessonAssignments(teacher.id);
  return (
    <AdminPage>
      <PageHeader
        eyebrow="Teaching"
        title="My teaching"
        description="Your accepted one-to-one teaching assignments and the schedules you committed to."
      />
      {assignments.length === 0 ? (
        <EmptyState
          icon={BookOpenCheck}
          title="No teaching assignments yet"
          description="Accepted enrolments will appear here as active teaching assignments."
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
                    <Link href={`/portal/teacher/sessions/new?lessonAssignmentId=${item.id}`}><Plus />Create session</Link>
                  </Button>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </AdminPage>
  );
}
