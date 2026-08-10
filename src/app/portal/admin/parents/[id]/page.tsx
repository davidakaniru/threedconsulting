import { AdminPage, PageBackButton, PageHeader } from "@/components/admin/ui";
import { ParentDetails } from "@/modules/parents";
import { getParent } from "@/modules/parents/server";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const parent = await getParent((await params).id);
  return (
    <AdminPage>
      <PageBackButton />
      <PageHeader
        eyebrow="Parents"
        title={`${parent.firstName} ${parent.lastName}`}
        description="Parent account and linked students."
      />
      <ParentDetails parent={parent} />
    </AdminPage>
  );
}
