import { BookOpenCheck } from "lucide-react";
import { AdminPage, EmptyState, PageHeader, SectionCard, StatusBadge } from "@/components/admin/ui";
import { requireTeacher } from "@/lib/auth/guards";
import { getTeachingAssignments } from "@/modules/teaching-assignments/server";
import { TeacherCohorts } from "@/modules/cohorts";
export default async function TeacherProgrammesPage() {
  const teacher = await requireTeacher();
  const result = await getTeachingAssignments({ teacherId: teacher.id });
  return <AdminPage><PageHeader eyebrow="Teaching" title="My programmes" description="Programmes assigned to you by an administrator. Cohorts and class sessions will be created from these assignments."/><SectionCard contentClassName="p-5 sm:p-6">{result.assignments.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{result.assignments.map((assignment) => <article key={assignment.id} className="rounded-2xl border border-slate-200 p-5"><div className="flex items-start justify-between gap-3"><span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"><BookOpenCheck/></span><StatusBadge status={assignment.status}/></div><h2 className="mt-5 font-display text-xl font-extrabold text-slate-900">{assignment.programme.name}</h2><p className="mt-2 text-sm text-slate-500">Assigned {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(assignment.assignedAt))}</p></article>)}</div> : <EmptyState icon={BookOpenCheck} title="No programmes assigned" description="Your assigned programmes will appear here after an administrator creates a teaching assignment."/>}</SectionCard><TeacherCohorts teacherId={teacher.id}/></AdminPage>;
}
