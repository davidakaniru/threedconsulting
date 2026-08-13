"use client";
import { useDeferredValue, useMemo, useState } from "react";
import { Eye, Pencil, Users } from "lucide-react";
import {
  DataTable,
  type DataTableColumn,
  EmptyState,
  FilterSelect,
  Pagination,
  RowActions,
  SearchInput,
  SectionCard,
  StatusBadge,
  TableError,
  TableLoading,
  TableToolbar,
} from "@/components/admin/ui";
import { studentStatusOptions } from "@/modules/students/constants";
import { useStudents } from "@/modules/students/hooks";
import type { StudentSummary } from "@/modules/students/types";
import Image from "next/image";
const options = [
  { label: "All statuses", value: "all" },
  ...studentStatusOptions,
];
function name(s: StudentSummary) {
  return [s.firstName, s.middleName, s.lastName].filter(Boolean).join(" ");
}
function format(v: string) {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(
    new Date(`${v}T00:00:00`),
  );
}
export function StudentsTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const deferred = useDeferredValue(search);
  const pageSize = 10;
  const q = useStudents({
    page,
    pageSize,
    search: deferred || undefined,
    status,
  });
  const totalPages = Math.max(1, Math.ceil((q.data?.total ?? 0) / pageSize));
  const columns = useMemo<DataTableColumn<StudentSummary>[]>(
    () => [
      {
        id: "student",
        header: "Student",
        cell: (s) => (
          <div className="flex items-center gap-3">
            {s.photoUrl ? (
              <Image
                src={s.photoUrl}
                alt={name(s)}
                width={40}
                height={40}
                quality={100}
                priority
                sizes="40px"
                style={{ objectFit: "cover" }}
                className="size-10 rounded-2xl object-cover"
              />
            ) : (
              <span className="grid size-10 place-items-center rounded-2xl bg-primary/10 font-display text-xs font-extrabold text-primary">
                {s.firstName[0]}
                {s.lastName[0]}
              </span>
            )}
            <div>
              <p className="font-extrabold text-slate-900">{name(s)}</p>
              <p className="text-xs text-slate-500">{s.admissionNumber}</p>
            </div>
          </div>
        ),
      },
      {
        id: "dob",
        header: "Date of birth",
        cell: (s) => format(s.dateOfBirth),
        className: "text-slate-600",
      },
      {
        id: "admitted",
        header: "Admission date",
        cell: (s) => format(s.admissionDate),
        className: "text-slate-600",
      },
      {
        id: "status",
        header: "Status",
        cell: (s) => <StatusBadge status={s.status} />,
      },
      {
        id: "actions",
        header: <span className="sr-only">Actions</span>,
        className: "text-right",
        cell: (s) => (
          <RowActions
            label={`Actions for ${name(s)}`}
            actions={[
              {
                label: "View student",
                icon: Eye,
                href: `/portal/admin/students/${s.id}`,
              },
              {
                label: "Edit student",
                icon: Pencil,
                href: `/portal/admin/students/${s.id}/edit`,
              },
            ]}
          />
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
            id="student-search"
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search by name or admission number..."
          />
        }
        filters={
          <FilterSelect
            id="student-status-filter"
            value={status}
            onValueChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            options={options}
            placeholder="All statuses"
          />
        }
      />
      {q.isLoading ? (
        <TableLoading />
      ) : q.isError ? (
        <TableError
          title="Students could not be loaded"
          description="Please check your connection and try again."
          onRetry={() => void q.refetch()}
        />
      ) : (
        <DataTable
          data={q.data?.students ?? []}
          columns={columns}
          getRowId={(s) => s.id}
          getRowHref={(s) => `/portal/admin/students/${s.id}`}
          emptyState={
            <EmptyState
              icon={Users}
              title="No students found"
              description="Students will appear here after they are created through the enrolment and lesson-matching workflow."
            />
          }
          mobileCard={(s) => (
            <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-display font-extrabold text-slate-900">
                    {name(s)}
                  </h3>
                  <p className="text-xs text-slate-500">{s.admissionNumber}</p>
                </div>
                <RowActions
                  label={`Actions for ${name(s)}`}
                  actions={[
                    {
                      label: "View student",
                      icon: Eye,
                      href: `/portal/admin/students/${s.id}`,
                    },
                    {
                      label: "Edit student",
                      icon: Pencil,
                      href: `/portal/admin/students/${s.id}/edit`,
                    },
                  ]}
                />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  Admitted {format(s.admissionDate)}
                </span>
                <StatusBadge status={s.status} />
              </div>
            </article>
          )}
        />
      )}{" "}
      {!q.isLoading && !q.isError && q.data && q.data.total > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={q.data.total}
          label="students"
          onPageChange={setPage}
        />
      )}
    </SectionCard>
  );
}
