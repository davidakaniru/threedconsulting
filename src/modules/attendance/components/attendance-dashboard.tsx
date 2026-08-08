"use client";
import Link from "next/link";
import { CalendarCheck2, Clock3 } from "lucide-react";
import { EmptyState, SectionCard, StatusBadge } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { useTeacherSessions } from "@/modules/sessions";

export function AttendanceDashboard() {
  const query = useTeacherSessions({ page: 1, pageSize: 100 });
  const sessions = (query.data?.sessions ?? []).filter((s) => s.status === "scheduled" || s.status === "completed");
  return <SectionCard title="Sessions ready for attendance" description="Open a scheduled or completed session to mark or review attendance." contentClassName="p-0">
    {sessions.length === 0 ? <div className="p-6"><EmptyState icon={CalendarCheck2} title="No attendance sheets yet" description="Schedule a class session to generate an attendance record for the child." /></div> : <div className="divide-y">
      {sessions.map((session) => <Link key={session.id} href={`/portal/teacher/sessions/${session.id}/attendance`} className="flex flex-col gap-3 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between">
        <div><div className="flex flex-wrap items-center gap-2"><p className="font-bold text-slate-950">{session.title}</p><StatusBadge status={session.status} /></div><p className="mt-1 text-sm text-slate-500">{session.lessonAssignment.student.name} · {session.lessonAssignment.programme.name} · {new Date(`${session.sessionDate}T00:00:00`).toLocaleDateString("en-GB")}</p></div>
        <div className="flex items-center gap-3"><span className="inline-flex items-center gap-1 text-sm text-slate-500"><Clock3 className="size-4" />{session.attendance.pending} pending</span><Button size="sm" variant="outline" asChild><span>Open sheet</span></Button></div>
      </Link>)}
    </div>}
  </SectionCard>;
}
