"use client";

import { useMemo, useState } from "react";
import { Eye, FileText, Search, UserRound } from "lucide-react";

import { SectionCard, StatusBadge } from "@/components/admin/ui";
import type { TutorApplicationSummary } from "@/modules/tutor-applications/types";
import { Input } from "@/components/ui/input";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(
    new Date(value),
  );
}

export function AdminTutorApplications({
  applications,
}: {
  applications: TutorApplicationSummary[];
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return applications;
    return applications.filter((application) =>
      [
        application.firstName,
        application.lastName,
        application.email,
        application.phone,
        application.expertise,
        application.qualifications,
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [applications, search]);

  return (
    <SectionCard className="overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-extrabold text-slate-950">
            Tutor Applications
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Review people who have applied to become tutors.
          </p>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            id="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search applications..."
            className="pl-9"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="grid min-h-40 place-items-center p-8 text-center">
          <div>
            <UserRound className="mx-auto size-8 text-slate-300" />
            <p className="mt-3 font-bold text-slate-800">
              No applications found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Applications submitted through the Become a Tutor form will appear
              here.
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {filtered.map((application) => (
            <article
              key={application.id}
              className="flex flex-col gap-4 p-4 transition-colors hover:bg-slate-50/70 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="flex min-w-0 items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <UserRound className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-extrabold text-slate-900">
                    {application.firstName} {application.lastName}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {application.email}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Applied {formatDate(application.createdAt)}
                  </p>
                </div>
              </div>

              <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2 lg:min-w-120">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Expertise
                  </p>
                  <p className="mt-0.5 line-clamp-2">{application.expertise}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Qualifications
                  </p>
                  <p className="mt-0.5 line-clamp-2">
                    {application.qualifications}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <StatusBadge status={application.status} />
                <span title="Application details">
                  <Eye className="size-4 text-slate-400" />
                </span>
                <span title="CV available when supplied">
                  <FileText className="size-4 text-slate-400" />
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
