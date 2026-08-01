"use client";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Baby, CalendarDays, Camera, FileText, GraduationCap, Pencil, School, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { InfoCard, SectionCard, StatusBadge } from "@/components/admin/ui";
import { toApiError } from "@/lib/api/errors";
import { useUploadStudentPhoto } from "@/modules/students/hooks";
import type { StudentDetail } from "@/modules/students/types";

function name(s:StudentDetail){return [s.firstName,s.middleName,s.lastName].filter(Boolean).join(" ");}
function date(v:string){return new Intl.DateTimeFormat("en-GB",{dateStyle:"medium"}).format(new Date(`${v}T00:00:00`));}
type StudentParent={id:string;firstName:string;lastName:string;email:string;phone:string|null;relationship:string;isPrimaryContact:boolean};
export function StudentDetails({student,parents=[]}:{student:StudentDetail;parents?:StudentParent[]}){
 const upload=useUploadStudentPhoto(student.id);
 async function choose(file?:File){if(!file)return;try{await upload.mutateAsync(file);toast.success("Student photo updated.");}catch(e){toast.error(toApiError(e).message);}}
 return <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]"><div className="space-y-6">
  <SectionCard contentClassName="p-6 sm:p-8"><div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div className="flex items-center gap-4">
   <div className="relative size-20 overflow-hidden rounded-[1.5rem] bg-primary/10">{student.photoUrl?<img src={student.photoUrl} alt={name(student)} className="size-full object-cover"/>:<span className="grid size-full place-items-center font-display text-xl font-extrabold text-primary">{student.firstName[0]}{student.lastName[0]}</span>}</div>
   <div><h2 className="font-display text-2xl font-extrabold text-slate-900">{name(student)}</h2><p className="mt-1 text-sm font-semibold text-slate-500">{student.admissionNumber}</p><div className="mt-3"><StatusBadge status={student.status}/></div></div>
  </div><div className="flex gap-2"><label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-4xl border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"><Camera className="size-4"/>{upload.isPending?"Uploading...":"Photo"}<input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={upload.isPending} onChange={(e)=>void choose(e.target.files?.[0])}/></label><Button asChild variant="outline"><Link href={`/portal/admin/students/${student.id}/edit`}><Pencil/>Edit</Link></Button></div></div></SectionCard>
  <SectionCard title="Personal information" description="Identity and basic learner details." contentClassName="p-5 sm:p-6"><dl className="grid gap-5 sm:grid-cols-2"><Detail icon={Baby} label="Full name" value={name(student)}/><Detail icon={CalendarDays} label="Date of birth" value={date(student.dateOfBirth)}/><Detail icon={UserRound} label="Gender" value={student.gender?student.gender.replaceAll("_"," "):"Not specified"}/><Detail icon={GraduationCap} label="Admission date" value={date(student.admissionDate)}/></dl></SectionCard>
  <SectionCard title="Administrative notes" contentClassName="p-5 sm:p-6"><p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">{student.notes||"No administrative notes have been added."}</p></SectionCard>
  <div className="grid gap-5 md:grid-cols-3"><div className="rounded-2xl border bg-white p-5"><div className="mb-3 flex items-center gap-2 font-display font-extrabold"><UserRound className="size-4"/>Parents</div>{parents.length?<div className="space-y-3">{parents.map(parent=><Link key={parent.id} href={`/portal/admin/parents/${parent.id}`} className="block rounded-xl bg-slate-50 p-3 hover:bg-slate-100"><p className="font-bold text-slate-900">{parent.firstName} {parent.lastName}</p><p className="text-xs capitalize text-slate-500">{parent.relationship.replaceAll("_"," ")}{parent.isPrimaryContact?" · Primary contact":""}</p></Link>)}</div>:<p className="text-sm text-slate-500">No parent or guardian linked yet.</p>}</div><InfoCard icon={School} title="Class" description="Class assignment will appear after the Classes and Enrollment modules."/><InfoCard icon={FileText} title="Documents" description="Student document management will be added in a later checkpoint."/></div>
 </div><aside><InfoCard icon={GraduationCap} title="Admission record" description={`Created ${date(student.admissionDate)} with system-generated number ${student.admissionNumber}.`}/></aside></div>;
}
function Detail({icon:Icon,label,value}:{icon:LucideIcon;label:string;value:string}){return <div className="flex gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-50 text-slate-500"><Icon className="size-4"/></span><div><dt className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-1 text-sm font-semibold capitalize text-slate-800">{value}</dd></div></div>}
