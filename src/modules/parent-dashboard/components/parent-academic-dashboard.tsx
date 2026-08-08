"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  UserRound,
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
import {
  formatDate,
  formatDateTime,
  formatRelative,
  formatTime,
} from "@/lib/date";
import type { ParentAcademicDashboard } from "../types";
import { ChildProvider, useChild } from "../context/child-context";
import { ChildSwitcher } from "./child-switcher";

function DashboardContent() {
  const { child } = useChild();

  const [overdue, setOverdue] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (!child) {
      setOverdue(undefined);
      return;
    }

    const now = Date.now();
    setOverdue(
      child.homework.some(
        (item) =>
          new Date(item.dueAt).getTime() < now &&
          (item.status === "pending" || item.status === "late"),
      ),
    );
  }, [child]);

  if (!child) {
    return (
      <EmptyState
        icon={Users}
        title="No children linked yet"
        description="Once an enrolment is approved and linked to your account, your child's academic information will appear here."
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
  const attendanceRate = child.attendance.rate ?? 0;

  const activity = [
    ...child.homework.slice(0, 4).map((item) => ({
      id: `homework-${item.id}`,
      title: "Homework assigned",
      detail: `${item.programmeName} · ${item.title}`,
      date: item.dueAt,
    })),
    ...child.attendance.recent.slice(0, 4).map((item) => ({
      id: `attendance-${item.id}`,
      title: "Attendance recorded",
      detail: `${item.programmeName} · ${item.sessionTitle}`,
      date: item.sessionDate,
    })),
    ...child.upcomingSessions.slice(0, 3).map((item) => ({
      id: `session-${item.id}`,
      title: "Upcoming session",
      detail: `${item.programmeName} · ${item.title}`,
      date: `${item.sessionDate}T${item.startTime}`,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <SectionCard
        className="overflow-visible"
        contentClassName="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end"
      >
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
            Current child
          </p>
          <h2 className="mt-2 font-display text-2xl font-extrabold">
            {child.fullName}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {child.admissionNumber} ·{" "}
            {child.programmes.map((programme) => programme.name).join(", ") || "No active lessons yet"}
          </p>
        </div>
        <ChildSwitcher />
      </SectionCard>

      {child.programmes.length > 0 && (
        <SectionCard
          title="Active lessons"
          description="Your child's matched teachers and agreed lesson schedules."
          icon={GraduationCap}
        >
          <div className="grid gap-4 lg:grid-cols-2">
            {child.programmes.map((lesson) => (
              <div key={lesson.assignmentId} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary">{lesson.name}</p>
                    <p className="mt-2 flex items-center gap-2 font-extrabold"><UserRound className="size-4 text-primary" />{lesson.teacherName}</p>
                    <p className="mt-1 text-sm font-semibold text-muted-foreground">{lesson.currentEducationLevel}</p>
                    {(lesson.teacherSpecialization || lesson.teacherQualification) && (
                      <p className="mt-1 text-sm text-muted-foreground">{[lesson.teacherSpecialization, lesson.teacherQualification].filter(Boolean).join(" · ")}</p>
                    )}
                  </div>
                  <StatusBadge status="active" />
                </div>
                <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                  <p><CalendarDays className="mr-2 inline size-4" />{lesson.preferredDays.map((d) => d.charAt(0).toUpperCase() + d.slice(1)).join(", ")}</p>
                  <p><Clock3 className="mr-2 inline size-4" />{formatTime(lesson.sessionTime)}</p>
                </div>
                <p className="mt-3 text-xs font-semibold text-muted-foreground">Lesson period: {formatDate(lesson.startDate)} – {formatDate(lesson.endDate)}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      <MetricGrid>
        <MetricCard
          icon={CalendarDays}
          label="Upcoming sessions"
          value={child.upcomingSessions.length}
          helper={
            nextSession
              ? `${nextSession.programmeName} · ${formatDate(nextSession.sessionDate)}`
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
          helper="Active one-to-one lessons"
        />
      </MetricGrid>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard
          title="Upcoming sessions"
          description="Scheduled online lessons for this child."
          icon={CalendarDays}
        >
          {child.upcomingSessions.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No upcoming sessions"
              description="No online sessions are currently scheduled for this child."
            />
          ) : (
            <div className="space-y-3">
              {child.upcomingSessions.map((session, index) => (
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
                        {session.programmeName}
                      </p>
                      <p className="mt-2 text-sm font-semibold">
                        {formatDate(session.sessionDate)} ·{" "}
                        {formatTime(session.startTime)}–
                        {formatTime(session.endTime)}
                      </p>
                      <p className="mt-1 text-xs font-bold text-primary">
                        {formatRelative(
                          `${session.sessionDate}T${session.startTime}`,
                        )}
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
          description="Published assignments for this child."
          icon={BookOpenCheck}
        >
          {child.homework.length === 0 ? (
            <EmptyState
              icon={BookOpenCheck}
              title="No homework yet"
              description="This child doesn't have any published homework at the moment."
            />
          ) : (
            <div className="space-y-3">
              {child.homework.slice(0, 8).map((item) => {
                const itemOverdue = new Date(item.dueAt).getTime() < Date.now() && (item.status === "pending" || item.status === "late");
                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border p-4 ${itemOverdue ? "border-destructive/30 bg-destructive/5" : "border-slate-200"}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-extrabold">{item.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.programmeName} · {item.sessionTitle}
                        </p>
                        <p
                          className={`mt-2 text-sm ${itemOverdue ? "font-bold text-destructive" : ""}`}
                        >
                          <Clock3 className="mr-1.5 inline size-4" />
                          Due {formatDateTime(item.dueAt)} ·{" "}
                          {formatRelative(item.dueAt)}
                        </p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard
          title="Attendance snapshot"
          description="A quick view of this child's marked sessions."
          icon={CheckCircle2}
        >
          {child.attendance.marked === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="No attendance yet"
              description="Attendance will appear after this child's classes begin."
            />
          ) : (
            <div className="space-y-5">
              <div>
                <div className="flex items-end justify-between gap-3">
                  <p className="font-display text-4xl font-extrabold">
                    {attendanceRate}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Attendance rate
                  </p>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${attendanceRate}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl bg-emerald-50 p-3">
                  <p className="text-2xl font-extrabold text-emerald-700">
                    {child.attendance.present}
                  </p>
                  <p className="text-xs font-bold text-emerald-700">Present</p>
                </div>
                <div className="rounded-2xl bg-amber-50 p-3">
                  <p className="text-2xl font-extrabold text-amber-700">
                    {child.attendance.late}
                  </p>
                  <p className="text-xs font-bold text-amber-700">Late</p>
                </div>
                <div className="rounded-2xl bg-rose-50 p-3">
                  <p className="text-2xl font-extrabold text-rose-700">
                    {child.attendance.absent}
                  </p>
                  <p className="text-xs font-bold text-rose-700">Absent</p>
                </div>
              </div>
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Recent activity"
          description="Recent academic updates for this child."
          icon={Clock3}
        >
          {activity.length === 0 ? (
            <EmptyState
              icon={Clock3}
              title="No recent activity"
              description="Academic updates for this child will appear here."
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {activity.map((item) => (
                <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.detail}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                      {formatRelative(item.date)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <SectionCard
        title="Attendance history"
        description="Recent marked sessions for this child."
        icon={CheckCircle2}
      >
        {child.attendance.recent.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="No attendance history"
            description="Attendance records for this child will appear after classes are marked."
          />
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
                    {item.programmeName} · {formatDate(item.sessionDate)}
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

export function ParentAcademicDashboardView({
  data,
}: {
  data: ParentAcademicDashboard;
}) {
  return (
    <ChildProvider linkedChildren={data.children}>
      <DashboardContent />
    </ChildProvider>
  );
}
