"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { Eye, UsersRound } from "lucide-react";
import {
  DataTable,
  type DataTableColumn,
  EmptyState,
  FilterSelect,
  Pagination,
  SearchInput,
  SectionCard,
  StatusBadge,
  TableError,
  TableLoading,
  TableToolbar,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { useTutorApplications } from "@/modules/tutor-applications/hooks/use-tutor-applications";
import type { TutorApplicationSummary } from "@/modules/tutor-applications/types";

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Reviewing", value: "reviewing" },
  { label: "Rejected", value: "rejected" },
];

function name(app: TutorApplicationSummary) {
  return `${app.firstName} ${app.lastName}`.trim();
}
function initials(app: TutorApplicationSummary) {
  return `${app.firstName[0] ?? ""}${app.lastName[0] ?? ""}`.toUpperCase();
}
function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(
    new Date(value),
  );
}

export function TutorApplicationsTable() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const deferredSearch = useDeferredValue(search);
  const { data, isLoading, isError, refetch } = useTutorApplications({
    page,
    pageSize,
    search: deferredSearch || undefined,
    status,
  });
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / pageSize));

  const columns = useMemo<DataTableColumn<TutorApplicationSummary>[]>(
    () => [
      {
        id: "applicant",
        header: "Applicant",
        cell: (app) => (
          <div className="flex min-w-52 items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 font-display text-xs font-extrabold text-primary">
              {initials(app)}
            </span>
            <div className="min-w-0">
              <p className="truncate font-extrabold text-slate-900">
                {name(app)}
              </p>
              <p className="truncate text-xs text-slate-500">{app.email}</p>
            </div>
          </div>
        ),
      },
      {
        id: "qualifications",
        header: "Qualifications",
        cell: (app) => (
          <span className="line-clamp-2 max-w-64 text-sm text-slate-600">
            {app.qualifications}
          </span>
        ),
      },
      {
        id: "submitted",
        header: "Applied",
        cell: (app) => (
          <div className="whitespace-nowrap">
            <p className="font-semibold text-slate-700">
              {formatDate(app.createdAt)}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              {app.gender === "female" ? "Female" : "Male"}
            </p>
          </div>
        ),
      },
      {
        id: "status",
        header: "Status",
        cell: (app) => <StatusBadge status={app.status} />,
      },
      {
        id: "actions",
        header: <span className="sr-only">Actions</span>,
        headerClassName: "w-64 text-right",
        className: "text-right",
        cell: (app) => (
          <div className="flex items-center justify-end gap-2">
            <Button asChild size="sm" variant="ghost">
              <Link href={`/portal/admin/teachers/applications/${app.id}`}>
                <Eye /> Review
              </Link>
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <SectionCard className="overflow-hidden">
      <TableToolbar
        search={
          <SearchInput
            id="tutor-application-search"
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder="Search by name, email or expertise..."
          />
        }
        filters={
          <FilterSelect
            id="tutor-application-status"
            value={status}
            onValueChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
            options={statusOptions}
            placeholder="All statuses"
          />
        }
      />
      {isLoading ? (
        <TableLoading />
      ) : isError ? (
        <TableError
          title="Tutor applications could not be loaded"
          description="Please check your connection and try again."
          onRetry={() => void refetch()}
        />
      ) : (
        <>
          <DataTable
            data={data?.applications ?? []}
            columns={columns}
            getRowId={(app) => app.id}
            getRowHref={(app) =>
              `/portal/admin/teachers/applications/${app.id}`
            }
            emptyState={
              <EmptyState
                icon={UsersRound}
                title="No tutor applications"
                description="Applications submitted through the Become a Tutor form will appear here."
              />
            }
            mobileCard={(app) => (
              <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 font-display text-xs font-extrabold text-primary">
                      {initials(app)}
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate font-display font-extrabold text-slate-900">
                        {name(app)}
                      </h3>
                      <p className="truncate text-xs text-slate-500">
                        {app.email}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Expertise
                    </dt>
                    <dd className="mt-1 line-clamp-2 font-semibold text-slate-700">
                      {app.expertise}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Applied
                    </dt>
                    <dd className="mt-1 font-semibold text-slate-700">
                      {formatDate(app.createdAt)}
                    </dd>
                  </div>
                </dl>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link
                      href={`/portal/admin/teachers/applications/${app.id}`}
                    >
                      <Eye /> View application
                    </Link>
                  </Button>
                </div>
              </article>
            )}
          />
          {totalPages > 1 && (
            <div className="border-t border-slate-100 p-4">
              <Pagination
                total={data?.total ?? 0}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </SectionCard>
  );
}
