import type { Metadata } from "next";
import { AdminPage, PageBackButton, PageHeader } from "@/components/admin/ui";
import { TeacherDetailClient } from "@/modules/teachers/components/teacher-detail-client";

export const metadata: Metadata = { title: "Teacher Details | Admin Portal" };
type Props = { params: Promise<{ id: string }> };

export default async function TeacherDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <AdminPage>
      <PageBackButton />
      <PageHeader
        eyebrow="Teachers"
        title="Teacher profile"
        description="Review professional details, account access and employment lifecycle."
      />
      <TeacherDetailClient id={id} />
    </AdminPage>
  );
}
