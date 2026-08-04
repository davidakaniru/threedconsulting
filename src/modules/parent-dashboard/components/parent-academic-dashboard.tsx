"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Users,
} from "lucide-react";
import {
  EmptyState,
  MetricCard,
  MetricGrid,
  SectionCard,
  StatusBadge,
} from "@/components/admin/ui";
import { SelectField } from "@/components/forms/select-field";
import { Button } from "@/components/ui/button";
import type { ParentAcademicDashboard } from "../types";

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(
    new Date(`${value}T00:00:00`),
  );
}
function dateTimeLabel(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function ParentAcademicDashboardView({
  data,
}: {
  data: ParentAcademicDashboard;
}) {
  const [childId, setChildId] = useState(data.children[0]?.id ?? "");
  const child = useMemo(
    () => data.children.find((item) => item.id === childId) ?? data.children[0],
    [childId, data.children],
  );

  if (!child) {
    return (
      <EmptyState
        icon={Users}
        title="No linked learners yet"
        description="Once an enrolment is approved and linked to your account, the learner's academic information will appear here."
        action={
          <Button asChild>
            <Link href="/enrolment">Submit an enrolment</Link>
          </Button>
        }
      />
    );
  }

  const pendingHomework = child.homework.filter(
    (item) => item.status === "pending" || item.status === "late",
  ).length;
  const nextSession = child.upcomingSessions[0];

  return (
    <div className="space-y-6">
      <SectionCard
        className="overflow-visible"
        contentClassName="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end"
      >
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
            Current learner
          </p>
          <h2 className="mt-2 font-display text-2xl font-extrabold">
            {child.fullName}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {child.admissionNumber} ·{" "}
            {child.programmes
              .map((p) => `${p.name} (${p.cohortCode})`)
              .join(", ") || "Awaiting cohort placement"}
          </p>
        </div>
        <SelectField
          id="switch-learner"
          label="Switch learner"
          value={child.id}
          onValueChange={setChildId}
          options={data.children.map((item) => ({
            value: item.id,
            label: item.fullName,
          }))}
        />
      </SectionCard>

      <MetricGrid>
        <MetricCard
          icon={CalendarDays}
          label="Upcoming sessions"
          value={child.upcomingSessions.length}
          helper={
            nextSession
              ? `${nextSession.programmeName} · ${dateLabel(nextSession.sessionDate)}`
              : "No scheduled sessions"
          }
        />
        <MetricCard
          icon={BookOpenCheck}
          label="Homework due"
          value={pendingHomework}
          tone="orange"
          helper={`${child.homework.length} published assignment${child.homework.length === 1 ? "" : "s"}`}
        />
        <MetricCard
          icon={CheckCircle2}
          label="Attendance"
          value={
            child.attendance.rate == null ? "—" : `${child.attendance.rate}%`
          }
          tone="green"
          helper={`${child.attendance.attended} attended of ${child.attendance.marked} marked`}
        />
        <MetricCard
          icon={GraduationCap}
          label="Programmes"
          value={child.programmes.length}
          tone="purple"
          helper="Active cohort memberships"
        />
      </MetricGrid>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title="Upcoming sessions"
          description="Scheduled online lessons for the selected learner."
          icon={CalendarDays}
        >
          {child.upcomingSessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No upcoming sessions have been scheduled.
            </p>
          ) : (
            <div className="space-y-3">
              {child.upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-extrabold">{session.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {session.programmeName} · {session.cohortCode}
                      </p>
                      <p className="mt-2 text-sm font-semibold">
                        {dateLabel(session.sessionDate)} ·{" "}
                        {session.startTime.slice(0, 5)}–
                        {session.endTime.slice(0, 5)}
                      </p>
                    </div>
                    <Button asChild size="sm">
                      <a
                        href={session.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Join meeting
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Homework"
          description="Published assignments for the selected learner."
          icon={BookOpenCheck}
        >
          {child.homework.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No published homework at the moment.
            </p>
          ) : (
            <div className="space-y-3">
              {child.homework.slice(0, 8).map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-extrabold">{item.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.programmeName} · {item.sessionTitle}
                      </p>
                      <p className="mt-2 text-sm">
                        <Clock3 className="mr-1.5 inline size-4" />
                        Due {dateTimeLabel(item.dueAt)}
                      </p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <SectionCard
        title="Attendance history"
        description="Recent marked sessions for the selected learner."
        icon={CheckCircle2}
      >
        {child.attendance.recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No attendance history is available yet.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {child.attendance.recent.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-bold">{item.sessionTitle}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.programmeName} · {dateLabel(item.sessionDate)}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
