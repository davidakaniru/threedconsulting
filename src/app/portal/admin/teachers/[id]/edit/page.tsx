import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AdminPage, PageHeader } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { TeacherEditClient } from "@/modules/teachers/components/teacher-edit-client";

export const metadata: Metadata = { title: "Edit Teacher | Admin Portal" };
type Props = { params: Promise<{ id: string }> };

export default async function EditTeacherPage({ params }: Props) {
  const { id } = await params;
  return (
    <AdminPage className="max-w-5xl">
      <PageHeader eyebrow="Teachers" title="Edit teacher" description="Update personal, employment and professional information." actions={<Button variant="outline" asChild><Link href={`/portal/admin/teachers/${id}`}><ArrowLeft />Cancel</Link></Button>} />
      <TeacherEditClient id={id} />
    </AdminPage>
  );
}
