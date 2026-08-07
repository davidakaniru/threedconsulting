import type { Metadata } from "next";
import { BookOpenCheck, CalendarDays, Clock3, Hourglass } from "lucide-react";
import {
  AdminPage,
  EmptyState,
  PageHeader,
  StatusBadge,
} from "@/components/admin/ui";
import { requireTeacher } from "@/lib/auth/guards";
import { formatTime } from "@/lib/date";
import { listMatchedTeacherEnrolments } from "@/modules/lesson-requests/server";
import { LessonRequestDetail } from "@/modules/lesson-requests";

export const metadata: Metadata = { title: "My Teaching | Teacher Portal" };
const day = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
export default async function TeacherTeachingPage() {
  const teacher = await requireTeacher();
  const enrolments = await listMatchedTeacherEnrolments(teacher.id);
  return (
    <AdminPage>
      <PageHeader
        eyebrow="Teaching"
        title="My teaching"
        description="The one-to-one enrolments you have accepted. Session management will move onto these teaching relationships in the next checkpoint."
      />
      {enrolments.length === 0 ? (
        <EmptyState
          icon={BookOpenCheck}
          title="No accepted enrolments yet"
          description="Open enrolments matching your assigned subjects are available under Available enrolments."
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {enrolments.map((item: LessonRequestDetail) => (
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
                    {item.childName}
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
                    <b>Time:</b> {formatTime(item.preferredTime)}
                  </span>
                </p>
                <p className="flex gap-2">
                  <Hourglass className="size-4 text-primary" />
                  <span>
                    <b>Duration:</b> {item.durationMonths}{" "}
                    {item.durationMonths === 1 ? "month" : "months"}
                  </span>
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminPage>
  );
}
