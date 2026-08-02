import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  Plus,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

import {
  AdminPage,
  InfoCard,
  MetricCard,
  MetricGrid,
  PageHeader,
  QuickAction,
  SectionCard,
  StatusBadge,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth/guards";
import { getAdminDashboardMetrics } from "@/modules/dashboard/server";

export default async function AdminPortalPage() {
  const [user, metrics] = await Promise.all([
    requireAdmin(),
    getAdminDashboardMetrics(),
  ]);

  return (
    <AdminPage>
      <PageHeader
        eyebrow="Admin portal"
        title={
          <>
            Good to see you
            {user.firstName ? `, ${user.firstName}` : ""}!
          </>
        }
        description="Here’s what is happening across the Three-D Managers Limited learning platform."
        actions={
          <Button asChild>
            <Link href="/portal/admin/students/new">
              <Plus aria-hidden="true" />
              Add student
            </Link>
          </Button>
        }
      />

      <MetricGrid>
        <MetricCard
          label="Teachers"
          value={metrics.teachers.total}
          helper={`${metrics.teachers.active} active teaching staff`}
          icon={GraduationCap}
          tone="blue"
          trend={
            metrics.teachers.invited > 0
              ? {
                  value: String(metrics.teachers.invited),
                  direction: "neutral",
                  label: "awaiting activation",
                }
              : undefined
          }
        />
        <MetricCard
          label="Students"
          value={metrics.students.total}
          helper={`${metrics.students.active} active learner${metrics.students.active === 1 ? "" : "s"}`}
          icon={Users}
          tone="orange"
          trend={
            metrics.students.inactive > 0
              ? {
                  value: String(metrics.students.inactive),
                  direction: "neutral",
                  label: "inactive",
                }
              : undefined
          }
        />
        <MetricCard
          label="Parents"
          value={metrics.parents.total}
          helper={`${metrics.parents.active} active parent account${metrics.parents.active === 1 ? "" : "s"}`}
          icon={UserRound}
          tone="green"
          trend={
            metrics.parents.invited > 0
              ? {
                  value: String(metrics.parents.invited),
                  direction: "neutral",
                  label: "awaiting activation",
                }
              : undefined
          }
        />
        <MetricCard
          label="Classes"
          value="—"
          helper="Class management is planned"
          icon={BookOpen}
          tone="purple"
        />
      </MetricGrid>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
        <SectionCard
          eyebrow="People"
          title="People management"
          description="Manage teachers, students and parent accounts from one connected administration workspace."
          icon={GraduationCap}
          action={<StatusBadge status="active" label="Live modules" />}
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <QuickAction
              href="/portal/admin/teachers"
              icon={GraduationCap}
              title="Manage teachers"
              description="Review staff records and account activation."
            />
            <QuickAction
              href="/portal/admin/students"
              icon={Users}
              title="Manage students"
              description="Review learner and admission records."
            />
            <QuickAction
              href="/portal/admin/parents"
              icon={UserRound}
              title="Manage parents"
              description="Review parent accounts and student links."
            />
          </div>
        </SectionCard>

        <SectionCard
          title="Platform readiness"
          description="A quick view of the administration foundation."
          icon={ShieldCheck}
        >
          <div className="space-y-3">
            <InfoCard
              icon={ShieldCheck}
              title="Live domain counts"
              description="Dashboard totals are now aggregated from the same exact-count services used by each management module."
              tone="green"
            />
            <InfoCard
              icon={CalendarDays}
              title="Automatic records"
              description="Teacher hire dates and student admission numbers are generated automatically."
              tone="blue"
            />
          </div>
        </SectionCard>
      </div>
    </AdminPage>
  );
}
