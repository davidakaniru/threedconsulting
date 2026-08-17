import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList, UsersRound } from "lucide-react";
import { TeachersTable } from "@/modules/teachers";
import { TutorApplicationsTable } from "@/modules/tutor-applications";
import { AdminPage, PageHeader } from "@/components/admin/ui";
import { getTeacherMetrics } from "@/modules/teachers/server/teacher.service";
import { TeacherMetrics } from "@/modules/teachers/components";

export const metadata: Metadata = { title: "Tutors | Admin Portal" };

type Props = { searchParams: Promise<{ tab?: string }> };

export default async function TeachersPage({ searchParams }: Props) {
  const metrics = await getTeacherMetrics();
  const { tab } = await searchParams;
  const activeTab = tab === "applications" ? "applications" : "active";

  return (
    <AdminPage>
      <PageHeader
        eyebrow="People"
        title="Tutors"
        description="Review tutor applications and manage active tutor accounts."
      />
      <TeacherMetrics metrics={metrics} />

      <div className="mt-6 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        <Link
          href="/portal/admin/teachers?tab=active"
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-extrabold transition ${activeTab === "active" ? "bg-primary text-primary-foreground shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}
        >
          <UsersRound className="size-4" />
          Active Tutors
        </Link>
        <Link
          href="/portal/admin/teachers?tab=applications"
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-extrabold transition ${activeTab === "applications" ? "bg-primary text-primary-foreground shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}
        >
          <ClipboardList className="size-4" />
          Tutor Applications
        </Link>
      </div>

      <div className="mt-6">
        {activeTab === "applications" ? <TutorApplicationsTable /> : <TeachersTable />}
      </div>
    </AdminPage>
  );
}
