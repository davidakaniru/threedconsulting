"use client";
import { useState } from "react";
import Link from "next/link";
import { GraduationCap, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/forms/select-field";
import { EmptyState, SectionCard, StatusBadge } from "@/components/admin/ui";
import { useCreateTeachingAssignment, useRemoveTeachingAssignment, useTeachingAssignments, useUpdateTeachingAssignment } from "@/modules/teaching-assignments/hooks";

type TeacherOption = { id: string; firstName: string | null; lastName: string | null; email: string; employeeId: string };
export function ProgrammeAssignmentManager({ programmeId, teachers }: { programmeId: string; teachers: TeacherOption[] }) {
  const [teacherId, setTeacherId] = useState("");
  const query = useTeachingAssignments({ programmeId });
  const create = useCreateTeachingAssignment();
  const update = useUpdateTeachingAssignment();
  const remove = useRemoveTeachingAssignment();
  const assigned = new Set((query.data?.assignments ?? []).map((item) => item.teacherId));
  const options = teachers.filter((teacher) => !assigned.has(teacher.id)).map((teacher) => ({ value: teacher.id, label: `${[teacher.firstName, teacher.lastName].filter(Boolean).join(" ") || teacher.email} · ${teacher.employeeId}` }));
  async function assign() { if (!teacherId) return; await create.mutateAsync({ teacherId, programmeId, primaryInstructor: true }); setTeacherId(""); }
  return <SectionCard title="Teaching assignments" description="Assign active teachers who are allowed to teach this programme." contentClassName="p-5 sm:p-6">
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end"><SelectField id="teacher-assignment" label="Teacher" placeholder="Select a teacher" options={options} value={teacherId} onValueChange={setTeacherId} className="flex-1"/><Button type="button" onClick={assign} disabled={!teacherId || create.isPending}>Assign teacher</Button></div>
    {query.isLoading ? <p className="text-sm text-slate-500">Loading assignments…</p> : query.data?.assignments.length ? <div className="space-y-3">{query.data.assignments.map((assignment) => {
      const name = [assignment.teacher.firstName, assignment.teacher.lastName].filter(Boolean).join(" ") || assignment.teacher.email;
      return <div key={assignment.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"><div><Link href={`/portal/admin/teachers/${assignment.teacherId}`} className="font-bold text-slate-900 hover:text-primary">{name}</Link><p className="mt-1 text-xs text-slate-500">{assignment.teacher.employeeId} · {assignment.teacher.email}</p><div className="mt-2"><StatusBadge status={assignment.status}/></div></div><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => update.mutate({ id: assignment.id, values: { status: assignment.status === "active" ? "inactive" : "active", primaryInstructor: assignment.primaryInstructor } })}>{assignment.status === "active" ? "Deactivate" : "Activate"}</Button><Button variant="ghost" size="icon-sm" aria-label="Remove assignment" onClick={() => remove.mutate(assignment.id)}><Trash2/></Button></div></div>})}</div> : <EmptyState icon={GraduationCap} title="No teachers assigned" description="Assign the first teacher to make this programme available for published enrolments."/>}
  </SectionCard>;
}
