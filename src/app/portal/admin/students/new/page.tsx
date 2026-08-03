import type { Metadata } from "next";
import { AdminPage, PageBackButton, PageHeader, SectionCard } from "@/components/admin/ui";
import { CreateStudentForm } from "@/modules/students";
export const metadata:Metadata={title:"Add Student | Admin Portal"};
export default function Page(){return <AdminPage className="max-w-5xl"><PageBackButton /><PageHeader eyebrow="Students" title="Add a student" description="Create a learner record. The admission number is generated automatically in STD-YYYY-#### format."/><SectionCard className="p-5 sm:p-8"><CreateStudentForm/></SectionCard></AdminPage>}
