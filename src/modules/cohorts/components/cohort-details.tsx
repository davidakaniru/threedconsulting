import Link from "next/link";
import { CalendarDays, GraduationCap, Pencil, Users } from "lucide-react";

import { EmptyState, InfoCard, SectionCard, StatusBadge } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import type { CohortDetail } from "@/modules/cohorts/types";

function fullName(member: CohortDetail["members"][number]) {
  return [member.firstName, member.middleName, member.lastName]
    .filter(Boolean)
    .join(" ");
}

export function CohortDetails({ cohort }: { cohort: CohortDetail }) {
  return (
    <div className="space-y-6">
      <SectionCard contentClassName="p-6">
        <div className="flex justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-primary">{cohort.code}</p>
            <h2 className="font-display text-2xl font-extrabold">{cohort.name}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {cohort.programme.name} · {cohort.teacher.name}
            </p>
            <div className="mt-3">
              <StatusBadge status={cohort.status} />
            </div>
          </div>
          <Button variant="outline" asChild>
            <Link href={`/portal/admin/cohorts/${cohort.id}/edit`}>
              <Pencil />
              Edit cohort
            </Link>
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="Cohort information" contentClassName="p-6">
        <p className="text-sm leading-7 text-slate-600">
          {cohort.description || "No description has been added."}
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard icon={GraduationCap} title="Programme" description={cohort.programme.name} />
          <InfoCard icon={Users} title="Teacher" description={cohort.teacher.name} />
          <InfoCard
            icon={Users}
            title="Capacity"
            description={`${cohort.memberCount} of ${cohort.capacity} students`}
          />
          <InfoCard
            icon={CalendarDays}
            title="Start date"
            description={new Date(cohort.startDate).toLocaleDateString("en-GB")}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Students"
        description="Learners currently or historically linked to this cohort."
        contentClassName="p-0"
      >
        {cohort.members.length ? (
          <div className="divide-y divide-slate-100">
            {cohort.members.map((member) => (
              <Link
                key={member.membershipId}
                href={`/portal/admin/students/${member.studentId}`}
                className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40"
              >
                <div className="min-w-0">
                  <p className="truncate font-bold text-slate-900">{fullName(member)}</p>
                  <p className="mt-1 text-sm text-slate-500">{member.admissionNumber}</p>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <StatusBadge status={member.status} />
                  <span className="hidden text-sm text-slate-500 sm:inline">
                    Joined {new Date(member.joinedAt).toLocaleDateString("en-GB")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-6">
            <EmptyState
              icon={Users}
              title="No cohort members yet"
              description="Approved learners assigned to this cohort will appear here."
            />
          </div>
        )}
      </SectionCard>
    </div>
  );
}
