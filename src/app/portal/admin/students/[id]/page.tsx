import type { Metadata } from "next";
import { AdminPage, PageHeader } from "@/components/admin/ui";
import { StudentDetailClient } from "@/modules/students";
export const metadata:Metadata={title:"Student Details | Admin Portal"};
export default async function Page({params}:{params:Promise<{id:string}>}){const{id}=await params;return <AdminPage><PageHeader eyebrow="Students" title="Student profile" description="Review admission and learner information."/><StudentDetailClient id={id}/></AdminPage>}
