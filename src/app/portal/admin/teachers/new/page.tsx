import type { Metadata } from "next";
import { CreateTeacherForm } from "@/modules/teachers";
import { AdminPage } from "@/components/admin/ui/admin-page";
import { PageBackButton } from "@/components/admin/ui/page-back-button";
import { PageHeader } from "@/components/admin/ui/page-header";
import { SectionCard } from "@/components/admin/ui/section-card";
export const metadata: Metadata={title:"Add Teacher | Admin Portal"};
export default function NewTeacherPage(){return <AdminPage className="max-w-5xl"><PageBackButton /><PageHeader eyebrow="Teachers" title="Add a teacher" description="Create the employment record and send a secure account activation invitation. The hire date is recorded automatically today."/><SectionCard className="p-5 sm:p-8"><CreateTeacherForm/></SectionCard></AdminPage>}
