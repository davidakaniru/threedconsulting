import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPage, PageHeader } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { StudentMetrics, StudentsTable } from "@/modules/students";
import { getStudentMetrics } from "@/modules/students/server";
export const metadata:Metadata={title:"Students | Admin Portal"};
export default async function StudentsPage(){const metrics=await getStudentMetrics();return <AdminPage><PageHeader eyebrow="Admissions" title="Students" description="Create and manage learner records, admission details, photos and lifecycle status." actions={<Button asChild><Link href="/portal/admin/students/new"><Plus/>Add student</Link></Button>}/><StudentMetrics metrics={metrics}/><StudentsTable/></AdminPage>}
