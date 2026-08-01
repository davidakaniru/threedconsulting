import type { Metadata } from "next";
import { AdminPage, PageHeader, SectionCard } from "@/components/admin/ui";
import { StudentEditClient } from "@/modules/students";
export const metadata:Metadata={title:"Edit Student | Admin Portal"};
export default async function Page({params}:{params:Promise<{id:string}>}){const{id}=await params;return <AdminPage className="max-w-5xl"><PageHeader eyebrow="Students" title="Edit student" description="Update personal, admission and administrative information."/><SectionCard className="p-5 sm:p-8"><StudentEditClient id={id}/></SectionCard></AdminPage>}
