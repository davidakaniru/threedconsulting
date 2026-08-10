import {
  AdminPage,
  PageBackButton,
  PageHeader,
  SectionCard,
} from "@/components/admin/ui";
import { ParentForm } from "@/modules/parents";
import { getParent, getParentStudentOptions } from "@/modules/parents/server";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const [parent, students] = await Promise.all([
    getParent(id),
    getParentStudentOptions(),
  ]);
  return (
    <AdminPage>
      <PageBackButton />
      <PageHeader
        eyebrow="Parents"
        title="Edit parent"
        description="Update contact information and student relationships."
      />
      <SectionCard contentClassName="p-6">
        <ParentForm
          parentId={id}
          students={students}
          initial={{
            firstName: parent.firstName,
            lastName: parent.lastName,
            email: parent.email,
            phone: parent.phone ?? "",
            address: parent.address ?? "",
            occupation: parent.occupation ?? "",
            students: parent.students.map((s) => ({
              studentId: s.id,
              relationship: s.relationship,
              isPrimaryContact: s.isPrimaryContact,
            })),
          }}
        />
      </SectionCard>
    </AdminPage>
  );
}
