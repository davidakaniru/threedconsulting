import type { Metadata } from "next";
import { AdminPage, PageBackButton, PageHeader } from "@/components/admin/ui";
import { TeacherEditClient } from "@/modules/teachers/components/teacher-edit-client";

export const metadata: Metadata = { title: "Edit Teacher | Admin Portal" };
type Props = { params: Promise<{ id: string }> };

export default async function EditTeacherPage({ params }: Props) {
  const { id } = await params;
  return (
    <AdminPage className="max-w-5xl">
      <PageBackButton />
      <PageHeader
        eyebrow="Teachers"
        title="Edit teacher"
        description="Update personal, employment and professional information."
      />
      <TeacherEditClient id={id} />
    </AdminPage>
  );
}
