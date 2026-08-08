import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarDays,
  Clock3,
  FileText,
  GraduationCap,
  Hourglass,
  Plus,
} from "lucide-react";
import {
  AdminPage,
  EmptyState,
  PageHeader,
  SectionCard,
  StatusBadge,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { requireParent } from "@/lib/auth/guards";
import { formatDate, formatTime } from "@/lib/date";
import { listParentLessonRequests } from "@/modules/lesson-requests/server";
import { getParentLessonAssignments } from "@/modules/lesson-assignments/server";

export const metadata: Metadata = { title: "My Enrolments | Parent Portal" };
const day = (v: string) => v.charAt(0).toUpperCase() + v.slice(1);
export default async function Page() {
  const parent = await requireParent();
  const [requests, assignments] = await Promise.all([
    listParentLessonRequests(parent.id),
    getParentLessonAssignments(parent.id),
  ]);
  const assignmentByRequest = new Map(
    assignments.map((a) => [a.lessonRequestId, a]),
  );
  return (
    <AdminPage>
      <PageHeader
        eyebrow="Lessons"
        title="My enrolments"
        description="Track your lesson requests and see the teacher matched with your child."
        actions={
          <Button asChild>
            <Link href="/enrolment">
              <Plus />
              New enrolment
            </Link>
          </Button>
        }
      />
      <SectionCard>
        {requests.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No enrolments yet"
            description="Submit an enrolment to find a teacher for your child."
            action={
              <Button asChild>
                <Link href="/enrolment">Submit enrolment</Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {requests.map((request) => {
              const assignment = assignmentByRequest.get(request.id);
              return (
                <article
                  key={request.id}
                  className="rounded-2xl border border-slate-200 p-4 sm:p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[.14em] text-primary">
                        {request.programme.name}
                      </p>
                      <h2 className="mt-1 font-display text-lg font-extrabold">
                        {request.childName}
                      </h2>
                    </div>
                    <StatusBadge
                      status={assignment?.status ?? request.status}
                      label={
                        assignment
                          ? "Teacher matched"
                          : request.status === "pending_review"
                            ? "Awaiting review"
                            : undefined
                      }
                    />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <CalendarDays className="size-4" />
                      {request.preferredDays.map(day).join(", ")}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock3 className="size-4" />
                      {formatTime(request.preferredTime)}
                    </span>
                    <span className="flex items-center gap-2">
                      <Hourglass className="size-4" />
                      {request.durationMonths} {request.durationMonths === 1 ? "month" : "months"}
                    </span>
                  </div>
                  {assignment ? (
                    <div className="mt-4 rounded-xl bg-primary/6 p-4">
                      <div className="flex items-start gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                          <GraduationCap className="size-4" />
                        </span>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                            Matched teacher
                          </p>
                          <p className="mt-1 font-extrabold">
                            {assignment.teacherName}
                          </p>
                          {assignment.teacherSpecialization ||
                          assignment.teacherQualification ? (
                            <p className="mt-1 text-sm text-muted-foreground">
                              {[
                                assignment.teacherSpecialization,
                                assignment.teacherQualification,
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          ) : null}
                          <p className="mt-2 text-xs font-semibold text-muted-foreground">
                            Active {formatDate(assignment.startDate)} – {formatDate(assignment.endDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </SectionCard>
    </AdminPage>
  );
}
