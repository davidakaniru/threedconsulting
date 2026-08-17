import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  GraduationCap,
  Info,
  Mail,
  FileText,
  MapPin,
  Pencil,
  Phone,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { InfoCard, SectionCard, StatusBadge } from "@/components/admin/ui";
import { TeacherLifecycleActions } from "@/modules/teachers/components/teacher-lifecycle-actions";
import { TeacherProgrammes } from "@/modules/teaching-assignments";
import type { TeacherDetail } from "@/modules/teachers/types";
import Image from "next/image";

function fullName(teacher: TeacherDetail) {
  return (
    [teacher.firstName, teacher.lastName].filter(Boolean).join(" ") ||
    "Unnamed teacher"
  );
}

function formatDate(value: string | null) {
  if (!value) return "Not provided";
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(
    new Date(`${value}T00:00:00`),
  );
}

export function TeacherDetails({ teacher }: { teacher: TeacherDetail }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <SectionCard contentClassName="p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              {teacher.avatarUrl ? (
                <Image
                  src={teacher.avatarUrl}
                  width={112}
                  height={112}
                  alt={`${fullName(teacher)} profile`}
                  className="size-28 shrink-0 overflow-hidden rounded-2xl object-cover"
                />
              ) : (
                <div className="grid size-28 shrink-0 place-items-center rounded-2xl bg-slate-900 text-2xl font-extrabold text-slate-400">
                  {teacher.firstName?.[0]}
                  {teacher.lastName?.[0]}
                </div>
              )}
              <div>
                <h2 className="font-display text-2xl font-extrabold text-slate-900">
                  {fullName(teacher)}
                </h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {teacher.employeeId}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <StatusBadge status={teacher.employmentStatus} />
                  <StatusBadge
                    status={teacher.onboardingStatus}
                    label={`Account ${teacher.onboardingStatus}`}
                  />
                  <StatusBadge
                    status={teacher.accountStatus}
                    label={`Access ${teacher.accountStatus}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Contact information"
          description="General profile and contact details."
          contentClassName="p-5 sm:p-6"
        >
          <dl className="grid gap-5 sm:grid-cols-2">
            <Detail icon={Mail} label="Email" value={teacher.email} />
            <Detail
              icon={Phone}
              label="Phone"
              value={teacher.phone || "Not provided"}
            />
            <Detail
              icon={MapPin}
              label="Address"
              value={teacher.address || "Not provided"}
            />
            <Detail
              icon={UserRound}
              label="Date of birth"
              value={formatDate(teacher.dateOfBirth)}
            />
          </dl>
        </SectionCard>

        <SectionCard
          title="Professional information"
          description="Employment and teaching profile."
          contentClassName="p-5 sm:p-6"
        >
          <dl className="grid gap-5 sm:grid-cols-2">
            <Detail
              icon={GraduationCap}
              label="Qualification"
              value={teacher.qualification || "Not provided"}
            />
            <Detail
              icon={GraduationCap}
              label="Specialization"
              value={teacher.specialization || "Not provided"}
            />
            <Detail
              icon={UserRound}
              label="Gender"
              value={
                teacher.gender === "female"
                  ? "Female"
                  : teacher.gender === "male"
                    ? "Male"
                    : "Not provided"
              }
            />
            <Detail
              icon={CalendarDays}
              label="Hire date"
              value={formatDate(teacher.hireDate)}
            />
            <Detail
              icon={CalendarDays}
              label="Activated"
              value={
                teacher.activatedAt
                  ? new Intl.DateTimeFormat("en-GB", {
                      dateStyle: "medium",
                    }).format(new Date(teacher.activatedAt))
                  : "Not yet activated"
              }
            />
          </dl>
          {teacher.summary && (
            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Profile summary
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {teacher.summary}
              </p>
            </div>
          )}
          {teacher.cvPath && (
            <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-600">
              <FileText className="size-4" /> CV is available from the original
              tutor application.
            </p>
          )}
        </SectionCard>

        <TeacherProgrammes teacherId={teacher.id} />
      </div>

      <aside className="space-y-5">
        <SectionCard
          title="Tutor actions"
          description="Manage employment and account access safely."
          contentClassName="p-5"
        >
          <div>
            <TeacherLifecycleActions teacher={teacher} />
          </div>
        </SectionCard>
      </aside>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-50 text-slate-500">
        <Icon className="size-4" />
      </span>
      <div>
        <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">
          {label}
        </dt>
        <dd className="mt-1 text-sm font-semibold text-slate-800">{value}</dd>
      </div>
    </div>
  );
}
