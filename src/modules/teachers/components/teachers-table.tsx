"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { Copy, Eye, Pencil, Plus, Users } from "lucide-react";
import { toast } from "sonner";

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
import { Button } from "@/components/ui/button";
import { useTeachers } from "@/modules/teachers/hooks";
import type { TeacherSummary } from "@/modules/teachers/types";

const teacherStatusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "On leave", value: "on_leave" },
  { label: "Former", value: "former" },
];

function teacherName(teacher: TeacherSummary) {
  return (
    [teacher.firstName, teacher.lastName].filter(Boolean).join(" ") ||
    "Unnamed teacher"
  );
}

function teacherInitials(teacher: TeacherSummary) {
  return (
    `${teacher.firstName?.[0] ?? ""}${teacher.lastName?.[0] ?? ""}`.toUpperCase() ||
    "T"
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(
    new Date(`${value}T00:00:00`),
  );
}

export function TeachersTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const deferredSearch = useDeferredValue(search);
  const pageSize = 10;

  const { data, isLoading, isError, refetch } = useTeachers({
    page,
    pageSize,
    search: deferredSearch || undefined,
    status,
  });

  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / pageSize));

  const columns = useMemo<DataTableColumn<TeacherSummary>[]>(
    () => [
      {
        id: "teacher",
        header: "Teacher",
        cell: (teacher) => (
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary/10 font-display text-xs font-extrabold text-primary">
              {teacherInitials(teacher)}
            </span>
            <div className="min-w-0">
              <p className="truncate font-extrabold text-slate-900">
                {teacherName(teacher)}
              </p>
              <p className="mt-0.5 truncate text-xs text-slate-500">
                {teacher.email}
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "employeeId",
        header: "Employee ID",
        cell: (teacher) => teacher.employeeId,
        className: "font-bold text-slate-700",
      },
      {
        id: "specialization",
        header: "Specialization",
        cell: (teacher) => teacher.specialization || "—",
        className: "text-slate-600",
      },
      {
        id: "hireDate",
        header: "Hire date",
        cell: (teacher) => formatDate(teacher.hireDate),
        className: "text-slate-600",
      },
      {
        id: "account",
        header: "Account",
        cell: (teacher) => <StatusBadge status={teacher.onboardingStatus} />,
      },
      {
        id: "employment",
        header: "Employment",
        cell: (teacher) => <StatusBadge status={teacher.employmentStatus} />,
      },
      {
        id: "actions",
        header: <span className="sr-only">Actions</span>,
        headerClassName: "w-16 text-right",
        className: "text-right",
        cell: (teacher) => (
          <RowActions
            label={`Actions for ${teacherName(teacher)}`}
            actions={[
              {
                label: "View profile",
                icon: Eye,
                href: `/portal/admin/teachers/${teacher.id}`,
              },
              {
                label: "Edit teacher",
                icon: Pencil,
                href: `/portal/admin/teachers/${teacher.id}/edit`,
              },
              {
                label: "Copy email",
                icon: Copy,
                onSelect: async () => {
                  await navigator.clipboard.writeText(teacher.email);
                  toast.success("Teacher email copied.");
                },
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
            id="teacher-search"
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder="Search by name, email or employee ID..."
          />
        }
        filters={
          <FilterSelect
            id="teacher-status-filter"
            value={status}
            onValueChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
            options={teacherStatusOptions}
            placeholder="All statuses"
          />
        }
        actions={
          <Button asChild className="sm:hidden">
            <Link href="/portal/admin/teachers/new">
              <Plus />
              Add teacher
            </Link>
          </Button>
        }
      />

      {isLoading ? (
        <TableLoading />
      ) : isError ? (
        <TableError
          title="Teachers could not be loaded"
          description="Please check your connection and try again."
          onRetry={() => void refetch()}
        />
      ) : (
        <DataTable
          data={data?.teachers ?? []}
          columns={columns}
          getRowId={(teacher) => teacher.id}
          getRowHref={(teacher) => `/portal/admin/teachers/${teacher.id}`}
          emptyState={
            <EmptyState
              icon={Users}
              title="No teachers found"
              description="Add your first teacher or adjust the current search and status filter."
              action={
                <Button asChild>
                  <Link href="/portal/admin/teachers/new">
                    <Plus />
                    Add teacher
                  </Link>
                </Button>
              }
            />
          }
          mobileCard={(teacher) => (
            <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 font-display text-xs font-extrabold text-primary">
                    {teacherInitials(teacher)}
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate font-display font-extrabold text-slate-900">
                      {teacherName(teacher)}
                    </h3>
                    <p className="truncate text-xs text-slate-500">
                      {teacher.email}
                    </p>
                  </div>
                </div>
                <RowActions
                  label={`Actions for ${teacherName(teacher)}`}
                  actions={[
                    {
                      label: "View profile",
                      icon: Eye,
                      href: `/portal/admin/teachers/${teacher.id}`,
                    },
                    {
                      label: "Edit teacher",
                      icon: Pencil,
                      href: `/portal/admin/teachers/${teacher.id}/edit`,
                    },
                    {
                      label: "Copy email",
                      icon: Copy,
                      onSelect: async () => {
                        await navigator.clipboard.writeText(teacher.email);
                        toast.success("Teacher email copied.");
                      },
                    },
                  ]}
                />
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs font-semibold text-slate-400">
                    Employee ID
                  </dt>
                  <dd className="mt-1 font-bold text-slate-700">
                    {teacher.employeeId}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-slate-400">
                    Hire date
                  </dt>
                  <dd className="mt-1 font-semibold text-slate-700">
                    {formatDate(teacher.hireDate)}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 flex flex-wrap gap-2">
                <StatusBadge status={teacher.onboardingStatus} />
                <StatusBadge status={teacher.employmentStatus} />
              </div>
            </article>
          )}
        />
      )}

      {!isLoading && !isError && data && data.total > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={data.total}
          label="teachers"
          onPageChange={setPage}
        />
      )}
    </SectionCard>
  );
}
