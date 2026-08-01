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
import { getTeachers } from "@/modules/teachers/server";

export default async function AdminPortalPage() {
  const user = await requireAdmin();
  const teacherResult = await getTeachers({ page: 1, pageSize: 5 });
  const invitedTeachers = teacherResult.teachers.filter(
    (teacher) => teacher.onboardingStatus === "invited",
  ).length;

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
        description="Here’s what is happening across the ThreeD Consulting learning platform."
        actions={
          <Button asChild>
            <Link href="/portal/admin/teachers/new">
              <Plus aria-hidden="true" />
              Add teacher
            </Link>
          </Button>
        }
      />

      <MetricGrid>
        <MetricCard
          label="Teachers"
          value={teacherResult.total}
          helper="Active and invited teaching staff"
          icon={GraduationCap}
          tone="blue"
          trend={
            invitedTeachers > 0
              ? {
                  value: String(invitedTeachers),
                  direction: "neutral",
                  label: "awaiting activation",
                }
              : undefined
          }
        />
        <MetricCard
          label="Students"
          value="—"
          helper="Student management is coming next"
          icon={Users}
          tone="orange"
        />
        <MetricCard
          label="Parents"
          value="—"
          helper="Parent records will follow students"
          icon={UserRound}
          tone="green"
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
          title="Teacher management"
          description="Invite teachers, monitor account activation, and keep employment records organised from one workspace."
          icon={GraduationCap}
          action={<StatusBadge status="active" label="Live module" />}
          footer={
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/portal/admin/teachers">Manage teachers</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/portal/admin/teachers/new">
                  <Plus aria-hidden="true" />
                  Invite teacher
                </Link>
              </Button>
            </div>
          }
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <QuickAction
              href="/portal/admin/teachers"
              icon={Users}
              title="View teaching team"
              description="Search, filter and review teacher records."
            />
            <QuickAction
              href="/portal/admin/teachers/new"
              icon={Plus}
              title="Invite a teacher"
              description="Create a staff record and send a secure invite."
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
              title="Secure administration"
              description="Admin-only APIs and role guards protect teacher provisioning and future management tools."
              tone="green"
            />
            <InfoCard
              icon={CalendarDays}
              title="Automatic staff records"
              description="Teacher hire dates are assigned automatically when an account is created."
              tone="blue"
            />
          </div>
        </SectionCard>
      </div>
    </AdminPage>
  );
}
