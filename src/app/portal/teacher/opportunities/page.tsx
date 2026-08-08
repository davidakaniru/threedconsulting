import type { Metadata } from "next";
import { BookOpenCheck, CalendarDays, Clock3, Hourglass } from "lucide-react";
import { AdminPage, EmptyState, PageHeader } from "@/components/admin/ui";
import { requireTeacher } from "@/lib/auth/guards";
import { formatTime } from "@/lib/date";
import { TeacherOpportunityAcceptButton } from "@/modules/lesson-requests/components/teacher-opportunity-accept-button";
import { listTeacherOpportunities } from "@/modules/lesson-requests/server";
import { LessonRequestDetail } from "@/modules/lesson-requests";

export const metadata: Metadata = {
  title: "Available Enrolments | Teacher Portal",
};
const day = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
export default async function TeacherOpportunitiesPage() {
  const teacher = await requireTeacher();
  const opportunities = await listTeacherOpportunities(teacher.id);
  return (
    <AdminPage>
      <PageHeader
        eyebrow="Teaching opportunities"
        title="Available enrolments"
        description="Enrolments for subjects you are assigned to. Accept only when you can commit to the requested schedule for the full lesson period."
      />
      {opportunities.length === 0 ? (
        <EmptyState
          icon={BookOpenCheck}
          title="No available enrolments"
          description="New enrolments matching your assigned subjects will appear here after an administrator publishes them."
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {opportunities.map((item: LessonRequestDetail) => (
            <article
              key={item.id}
              className="flex h-full flex-col rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
                  {item.programme.name}
                </p>
                <h2 className="mt-1 font-display text-xl font-extrabold text-foreground">
                  {item.childName}
                </h2>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">{item.currentEducationLevel}</p>
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
