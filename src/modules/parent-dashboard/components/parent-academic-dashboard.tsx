"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  History,
  Users,
} from "lucide-react";
import {
  EmptyState,
  MetricCard,
  MetricGrid,
  SectionCard,
  StatusBadge,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChildSwitcher } from "./child-switcher";
import type { ParentAcademicDashboard } from "../types";

const CHILD_STORAGE_KEY = "threed-parent-current-child";

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

function relativeLabel(value: string) {
  const date = new Date(value);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const day = 86_400_000;
  const days = Math.ceil(diff / day);

  if (days < 0) return `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} overdue`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  if (days <= 7) return `Due in ${days} days`;
  return `Due ${dateTimeLabel(value)}`;
}

function sessionCountdown(sessionDate: string, startTime: string) {
  const target = new Date(`${sessionDate}T${startTime}`);
  const diff = target.getTime() - Date.now();
  const hours = Math.ceil(diff / 3_600_000);

  if (hours <= 0) return "Starting now";
  if (hours < 24) return `Starts in ${hours} hour${hours === 1 ? "" : "s"}`;
  const days = Math.ceil(hours / 24);
  return `Starts in ${days} day${days === 1 ? "" : "s"}`;
}

export function ParentAcademicDashboardView({
  data,
}: {
  data: ParentAcademicDashboard;
}) {
  const [childId, setChildId] = useState(data.children[0]?.id ?? "");

  useEffect(() => {
    const stored = window.localStorage.getItem(CHILD_STORAGE_KEY);
    if (stored && data.children.some((child) => child.id === stored)) {
      setChildId(stored);
    }
  }, [data.children]);

  const selectChild = (value: string) => {
    setChildId(value);
    window.localStorage.setItem(CHILD_STORAGE_KEY, value);
  };

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

  const now = Date.now();
  const pendingHomework = child.homework.filter(
    (item) => item.status === "pending" || item.status === "late",
  ).length;
  const overdueHomework = child.homework.filter(
    (item) =>
      (item.status === "pending" || item.status === "late") &&
      new Date(item.dueAt).getTime() < now,
  ).length;
  const nextSession = child.upcomingSessions[0];
  const attendanceRate = child.attendance.rate ?? 0;

  return (
    <div className="space-y-6">
      <SectionCard
        className="overflow-visible"
        contentClassName="grid gap-5 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-center"
      >
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
            Academic overview
          </p>
          <h2 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">
            {child.fullName}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {child.admissionNumber}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {child.programmes.length > 0 ? (
              child.programmes.map((programme) => (
                <span
                  key={`${programme.id}-${programme.cohortCode}`}
                  className="rounded-full border border-primary/15 bg-primary/[0.06] px-3 py-1 text-xs font-bold text-primary"
                >
                  {programme.name} · {programme.cohortCode}
                </span>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">
                Awaiting cohort placement
              </span>
            )}
          </div>
        </div>
        <ChildSwitcher
          children={data.children}
          value={child.id}
          onValueChange={selectChild}
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
          helper={
            overdueHomework > 0
              ? `${overdueHomework} overdue assignment${overdueHomework === 1 ? "" : "s"}`
              : "No overdue assignments"
          }
        />
        <MetricCard
          icon={CheckCircle2}
          label="Attendance"
          value={child.attendance.rate == null ? "—" : `${child.attendance.rate}%`}
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

      <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
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
            <div className="grid gap-3 sm:grid-cols-2">
              {child.upcomingSessions.map((session, index) => (
                <div
                  key={session.id}
                  className={cn(
                    "rounded-2xl border p-4",
                    index === 0
                      ? "border-primary/25 bg-primary/[0.04]"
                      : "border-border bg-background",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-primary">
                      {session.programmeName}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground">
                      {session.cohortCode}
                    </span>
                  </div>
                  <p className="mt-4 font-display text-lg font-extrabold">
                    {session.title}
                  </p>
                  <p className="mt-2 text-sm font-semibold">
                    {dateLabel(session.sessionDate)} · {session.startTime.slice(0, 5)}–
                    {session.endTime.slice(0, 5)}
                  </p>
                  <p className="mt-1 text-xs font-bold text-primary">
                    {sessionCountdown(session.sessionDate, session.startTime)}
                  </p>
                  <Button asChild size="sm" className="mt-4 w-full">
                    <a href={session.meetingLink} target="_blank" rel="noreferrer">
                      Join meeting
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Attendance snapshot"
          description="A quick visual summary of marked sessions."
          icon={CheckCircle2}
        >
          <div className="rounded-2xl border border-border p-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">
                  Overall attendance
                </p>
                <p className="mt-1 font-display text-4xl font-extrabold">
                  {child.attendance.rate == null ? "—" : `${child.attendance.rate}%`}
                </p>
              </div>
              <CheckCircle2 className="size-10 text-primary/70" aria-hidden="true" />
            </div>
            <div
              className="mt-5 h-3 overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={child.attendance.rate ?? 0}
            >
              <div
                className="h-full rounded-full bg-primary transition-[width]"
                style={{ width: `${attendanceRate}%` }}
              />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-emerald-50 p-3">
                <p className="text-xl font-extrabold text-emerald-700">
                  {child.attendance.present}
                </p>
                <p className="text-xs font-bold text-emerald-700/80">Present</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3">
                <p className="text-xl font-extrabold text-amber-700">
                  {child.attendance.late}
                </p>
                <p className="text-xs font-bold text-amber-700/80">Late</p>
              </div>
              <div className="rounded-xl bg-rose-50 p-3">
                <p className="text-xl font-extrabold text-rose-700">
                  {child.attendance.absent}
                </p>
                <p className="text-xs font-bold text-rose-700/80">Absent</p>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
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
              {child.homework.slice(0, 8).map((item) => {
                const isOverdue =
                  (item.status === "pending" || item.status === "late") &&
                  new Date(item.dueAt).getTime() < now;
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "rounded-2xl border p-4",
                      isOverdue
                        ? "border-destructive/25 bg-destructive/[0.03]"
                        : "border-border",
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-xs font-extrabold uppercase tracking-wide text-primary">
                          {item.programmeName}
                        </span>
                        <p className="mt-1 font-extrabold">{item.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.sessionTitle}
                        </p>
                        <p
                          className={cn(
                            "mt-3 text-sm font-bold",
                            isOverdue ? "text-destructive" : "text-foreground",
                          )}
                        >
                          <Clock3 className="mr-1.5 inline size-4" />
                          {relativeLabel(item.dueAt)}
                        </p>
                      </div>
                      <StatusBadge status={isOverdue ? "late" : item.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Recent activity"
          description="A combined timeline of the learner's recent academic updates."
          icon={Activity}
        >
          {child.activity.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No recent activity is available yet.
            </p>
          ) : (
            <div className="relative space-y-1 before:absolute before:bottom-4 before:left-[17px] before:top-4 before:w-px before:bg-border">
              {child.activity.map((item) => (
                <div key={item.id} className="relative flex gap-3 py-3">
                  <span className="z-10 grid size-9 shrink-0 place-items-center rounded-full border border-border bg-background text-primary">
                    {item.type === "homework" ? (
                      <BookOpenCheck className="size-4" />
                    ) : item.type === "attendance" ? (
                      <CheckCircle2 className="size-4" />
                    ) : (
                      <CalendarDays className="size-4" />
                    )}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="font-bold">{item.title}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-muted-foreground">
                      {dateTimeLabel(item.occurredAt)}
                    </p>
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
        icon={History}
      >
        {child.attendance.recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No attendance history is available yet.
          </p>
        ) : (
          <div className="divide-y divide-border">
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
