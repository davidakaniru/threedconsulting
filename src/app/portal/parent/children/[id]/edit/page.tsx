import type { Metadata } from "next";

import {
  AdminPage,
  PageBackButton,
  PageHeader,
  SectionCard,
} from "@/components/admin/ui";
import { requireParent } from "@/lib/auth/guards";
import { ChildProfileForm } from "@/modules/parent-dashboard/components";
import { getParentStudent } from "@/modules/students/server";

export const metadata: Metadata = {
  title: "Edit Child Profile | Parent Portal",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const parent = await requireParent();
  const { id } = await params;
  const student = await getParentStudent(parent.id, id);

  return (
    <AdminPage className="max-w-5xl">
      <PageBackButton />
      <PageHeader
        eyebrow="My children"
        title="Edit child profile"
        description="Update your child's personal information and profile photo."
      />
      <SectionCard contentClassName="p-5 sm:p-8">
        <ChildProfileForm student={student} />
      </SectionCard>
    </AdminPage>
  );
}
