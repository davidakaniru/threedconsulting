"use client";
import Link from "next/link";
import { BookOpenCheck } from "lucide-react";
import { EmptyState, SectionCard, StatusBadge } from "@/components/admin/ui";
import { useTeachingAssignments } from "@/modules/teaching-assignments/hooks";
export function TeacherProgrammes({ teacherId, adminView = true }: { teacherId: string; adminView?: boolean }) {
  const query = useTeachingAssignments({ teacherId });
  return <SectionCard title={adminView ? "Assigned programmes" : "My programmes"} description={adminView ? "Programmes this teacher is currently authorised to teach." : "Programmes assigned to you by an administrator."} contentClassName="p-5 sm:p-6">{query.isLoading ? <p className="text-sm text-slate-500">Loading programmes…</p> : query.data?.assignments.length ? <div className="grid gap-4 sm:grid-cols-2">{query.data.assignments.map((assignment) => <Link key={assignment.id} href={adminView ? `/portal/admin/programmes/${assignment.programmeId}` : "#"} className="rounded-2xl border border-slate-200 p-4 transition hover:border-primary/40 hover:bg-primary/5"><div className="flex items-start justify-between gap-3"><span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><BookOpenCheck className="size-5"/></span><StatusBadge status={assignment.status}/></div><h3 className="mt-4 font-display text-lg font-extrabold text-slate-900">{assignment.programme.name}</h3><p className="mt-1 text-xs text-slate-500">Assigned {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(assignment.assignedAt))}</p></Link>)}</div> : <EmptyState icon={BookOpenCheck} title="No programmes assigned" description="An administrator has not assigned any programmes yet."/>}</SectionCard>;
}
