import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import {
  AdminPage,
  EmptyState,
  PageHeader,
  SectionCard,
  StatusBadge,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { requireParent } from "@/lib/auth/guards";
import { getParentEnrolments } from "@/modules/enrolments/server";
import { EnrolmentDetail } from "@/modules/enrolments";
export const metadata: Metadata = { title: "My Enrolments | Parent Portal" };
export default async function Page() {
  const p = await requireParent();
  const apps = await getParentEnrolments(p.id);
  return (
    <AdminPage>
      <PageHeader
        eyebrow="Admissions"
        title="My enrolments"
        description="Track applications submitted for your children."
        actions={
          <Button asChild>
            <Link href="/enrolment">
              <Plus />
              New enrolment
            </Link>
          </Button>
        }
      />
      <SectionCard>
        {apps.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No enrolments yet"
            description="Submit an enrolment application to get started."
            action={
              <Button asChild>
                <Link href="/enrolment">Submit enrolment</Link>
              </Button>
            }
          />
        ) : (
          <div className="divide-y">
            {apps.map((a: EnrolmentDetail) => (
              <div
                key={a.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-extrabold">{a.childName}</p>
                  <p className="text-sm text-muted-foreground">
                    {a.programmes.map((p) => p.name).join(", ")} ·{" "}
                    {new Date(a.submittedAt).toLocaleDateString("en-GB")}
                  </p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </AdminPage>
  );
}
