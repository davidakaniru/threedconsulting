import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AdminPage, PageHeader } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { TeacherDetailClient } from "@/modules/teachers/components/teacher-detail-client";

export const metadata: Metadata = { title: "Teacher Details | Admin Portal" };
type Props = { params: Promise<{ id: string }> };

export default async function TeacherDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <AdminPage>
      <PageHeader eyebrow="Teachers" title="Teacher profile" description="Review professional details, account access and employment lifecycle." actions={<Button variant="outline" asChild><Link href="/portal/admin/teachers"><ArrowLeft />Back to teachers</Link></Button>} />
      <TeacherDetailClient id={id} />
    </AdminPage>
  );
}
