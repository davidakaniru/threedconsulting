"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { ClipboardList } from "lucide-react";
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
import { formatDateTime, formatTime } from "@/lib/date";
import { useLessonRequests } from "../hooks";
import type { LessonRequestSummary } from "../types";

const statuses = [
  { label: "All statuses", value: "all" },
  { label: "Awaiting review", value: "pending_review" },
  { label: "Open", value: "open" },
  { label: "Matched", value: "matched" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

function days(days: string[]) {
  return days.map((day) => day.slice(0, 3)).join(" · ");
}

export function LessonRequestsTable() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const query = useLessonRequests({
    page,
    pageSize: 10,
    search: useDeferredValue(search) || undefined,
    status,
  });
  const columns = useMemo<DataTableColumn<LessonRequestSummary>[]>(
    () => [
      {
        id: "child",
        header: "Child / subject",
        cell: (request) => (
          <div>
            <p className="font-extrabold">{request.childName}</p>
            <p className="text-xs text-slate-500">{request.subjects.map((subject) => subject.name).join(" · ")}</p>
          </div>
        ),
      },
      {
        id: "schedule",
        header: "Preferred schedule",
        cell: (request) => (
          <div>
            <p className="font-semibold capitalize">
              {days(request.preferredDays)}
            </p>
            <p className="text-xs text-slate-500">
              {formatTime(request.preferredTime)} · {request.durationMonths}{" "}
              {request.durationMonths === 1 ? "month" : "months"}
            </p>
          </div>
        ),
      },
      {
        id: "parent",
        header: "Parent",
        cell: (request) => (
          <div>
            <p>{request.parentName}</p>
            <p className="text-xs text-slate-500">{request.parentEmail}</p>
          </div>
        ),
      },
      {
        id: "submitted",
        header: "Submitted",
        cell: (request) => formatDateTime(request.createdAt),
      },
      {
        id: "status",
        header: "Status",
        cell: (request) => (
          <StatusBadge
            status={request.status}
            label={
              request.status === "pending_review"
                ? "Awaiting review"
                : undefined
            }
          />
        ),
      },
    ],
    [],
  );
  const totalPages = Math.max(1, Math.ceil((query.data?.total ?? 0) / 10));

  return (
    <SectionCard className="overflow-hidden">
      <TableToolbar
        search={
          <SearchInput
            id="lesson-request-search"
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder="Search by child name..."
          />
        }
        filters={
          <FilterSelect
            id="lesson-request-status"
            value={status}
            onValueChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
            options={statuses}
          />
        }
      />
      {query.isLoading ? (
        <TableLoading />
      ) : query.isError ? (
        <TableError
          title="Enrolments could not be loaded"
          description="Please try again."
          onRetry={() => query.refetch()}
        />
      ) : (
        <DataTable
          data={query.data?.requests ?? []}
          columns={columns}
          getRowId={(request) => request.id}
          getRowHref={(request) => `/portal/admin/lesson-requests/${request.id}`}
          emptyState={
            <EmptyState
              icon={ClipboardList}
              title="No enrolments"
              description="New parent enrolments will appear here."
            />
          }
        />
      )}
      {!query.isLoading &&
        !query.isError &&
        query.data &&
        query.data.total > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            total={query.data.total}
            label="enrolments"
            onPageChange={setPage}
          />
        )}
    </SectionCard>
  );
}
