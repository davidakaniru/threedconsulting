"use client";
import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { BookOpen, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { programmeStatusOptions } from "@/modules/programmes/constants";
import { useDeleteProgramme, useProgrammes } from "@/modules/programmes/hooks";
import type { ProgrammeSummary } from "@/modules/programmes/types";
const options = [
  { label: "All statuses", value: "all" },
  ...programmeStatusOptions,
];
const date = (v: string) =>
  new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(v));
export function ProgrammesTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const deferred = useDeferredValue(search);
  const pageSize = 10;
  const deleteProgramme = useDeleteProgramme();
  const q = useProgrammes({
    page,
    pageSize,
    search: deferred || undefined,
    status,
  });
  const pages = Math.max(1, Math.ceil((q.data?.total ?? 0) / pageSize));
  const columns = useMemo<DataTableColumn<ProgrammeSummary>[]>(
    () => [
      {
        id: "programme",
        header: "Subject",
        cell: (p) => (
          <div>
            <p className="font-extrabold text-slate-900">{p.title}</p>
            <p className="text-xs text-slate-500">/{p.slug}</p>
          </div>
        ),
      },
      {
        id: "description",
        header: "Description",
        cell: (p) => (
          <span className="line-clamp-2 max-w-md text-slate-600">
            {p.description || "No description"}
          </span>
        ),
      },
      {
        id: "created",
        header: "Created",
        cell: (p) => date(p.createdAt),
        className: "text-slate-600",
      },
      {
        id: "status",
        header: "Status",
        cell: (p) => <StatusBadge status={p.status} />,
      },
      {
        id: "actions",
        header: <span className="sr-only">Actions</span>,
        className: "text-right",
        cell: (p) => (
          <RowActions
            label={`Actions for ${p.title}`}
            actions={[
              {
                label: "View subject",
                icon: Eye,
                href: `/portal/admin/programmes/${p.id}`,
              },
              {
                label: "Edit subject",
                icon: Pencil,
                href: `/portal/admin/programmes/${p.id}/edit`,
              },
              {
                label: "Delete subject",
                icon: Trash2,
                onSelect: async () => {
                  if (!window.confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
                  try {
                    await deleteProgramme.mutateAsync(p.id);
                  } catch (error) {
                    const message = error instanceof Error ? error.message : "The subject could not be deleted.";
                    window.alert(message);
                  }
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
            id="programme-search"
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search subjects..."
          />
        }
        filters={
          <FilterSelect
            id="programme-status"
            value={status}
            onValueChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            options={options}
          />
        }
        actions={
          <Button asChild className="sm:hidden">
            <Link href="/portal/admin/programmes/new">
              <Plus />
              Add subject
            </Link>
          </Button>
        }
      />
      {q.isLoading ? (
        <TableLoading />
      ) : q.isError ? (
        <TableError
          title="Subjects could not be loaded"
          description="Please try again."
          onRetry={() => void q.refetch()}
        />
      ) : (
        <DataTable
          data={q.data?.programmes ?? []}
          columns={columns}
          getRowId={(p) => p.id}
          getRowHref={(p) => `/portal/admin/programmes/${p.id}`}
          emptyState={
            <EmptyState
              icon={BookOpen}
              title="No subjects found"
              description="Create a subject or adjust the filters."
              action={
                <Button asChild>
                  <Link href="/portal/admin/programmes/new">
                    <Plus />
                    Add subject
                  </Link>
                </Button>
              }
            />
          }
          mobileCard={(p) => (
            <article className="rounded-2xl border bg-white p-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-display font-extrabold">{p.title}</h3>
                  <p className="text-xs text-slate-500">/{p.slug}</p>
                </div>
                <RowActions
                  label={`Actions for ${p.title}`}
                  actions={[
                    {
                      label: "View subject",
                      icon: Eye,
                      href: `/portal/admin/programmes/${p.id}`,
                    },
                    {
                      label: "Edit subject",
                      icon: Pencil,
                      href: `/portal/admin/programmes/${p.id}/edit`,
                    },
                  ]}
                />
              </div>
              <div className="mt-4 flex justify-between">
                <span className="text-sm text-slate-500">
                  {date(p.createdAt)}
                </span>
                <StatusBadge status={p.status} />
              </div>
            </article>
          )}
        />
      )}{" "}
      {!q.isLoading && !q.isError && q.data && q.data.total > 0 && (
        <Pagination
          page={page}
          totalPages={pages}
          total={q.data.total}
          label="subjects"
          onPageChange={setPage}
        />
      )}
    </SectionCard>
  );
}
