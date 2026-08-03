"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";

import {
  DataTable,
  FilterSelect,
  SearchInput,
  SectionCard,
  StatusBadge,
  TableToolbar,
} from "@/components/admin/ui";
import type { DataTableColumn } from "@/components/admin/ui/data-table";
import { Pagination } from "@/components/admin/ui/pagination";
import { Input } from "@/components/ui/input";
import { classSessionStatusOptions } from "../constants";
import { useAdminSessions } from "../hooks";
import type { ClassSession } from "../types";

type Option = { value: string; label: string };

export function AdminSessionsTable({
  programmes,
  teachers,
  cohorts,
}: {
  programmes: Option[];
  teachers: Option[];
  cohorts: Option[];
}) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [programmeId, setProgrammeId] = useState("all");
  const [teacherId, setTeacherId] = useState("all");
  const [cohortId, setCohortId] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const query = useAdminSessions({
    page,
    pageSize: 10,
    search,
    status,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    programmeId: programmeId === "all" ? undefined : programmeId,
    teacherId: teacherId === "all" ? undefined : teacherId,
    cohortId: cohortId === "all" ? undefined : cohortId,
  });

  const columns: DataTableColumn<ClassSession>[] = [
    {
      id: "session",
      header: "Session",
      cell: (session) => (
        <div>
          <p className="font-bold">{session.title}</p>
          <p className="text-sm text-slate-500">
            {session.cohort.code} · {session.cohort.programme.name}
          </p>
        </div>
      ),
    },
    {
      id: "teacher",
      header: "Teacher",
      cell: (session) => session.cohort.teacher.name,
    },
    {
      id: "date",
      header: "Date",
      cell: (session) =>
        `${new Date(`${session.sessionDate}T00:00:00`).toLocaleDateString("en-GB")} · ${session.startTime.slice(0, 5)}`,
    },
    {
      id: "status",
      header: "Status",
      cell: (session) => <StatusBadge status={session.status} />,
    },
  ];

  return (
    <SectionCard contentClassName="p-0">
      <TableToolbar
        search={
          <SearchInput
            id="session-search"
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder="Search sessions..."
          />
        }
        filters={
          <>
            <FilterSelect
              id="session-status"
              value={status}
              onValueChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
              options={[{ value: "all", label: "All statuses" }, ...classSessionStatusOptions]}
            />
            <FilterSelect
              id="session-programme"
              value={programmeId}
              onValueChange={(value) => {
                setProgrammeId(value);
                setPage(1);
              }}
              options={[{ value: "all", label: "All programmes" }, ...programmes]}
            />
            <FilterSelect
              id="session-teacher"
              value={teacherId}
              onValueChange={(value) => {
                setTeacherId(value);
                setPage(1);
              }}
              options={[{ value: "all", label: "All teachers" }, ...teachers]}
            />
            <FilterSelect
              id="session-cohort"
              value={cohortId}
              onValueChange={(value) => {
                setCohortId(value);
                setPage(1);
              }}
              options={[{ value: "all", label: "All cohorts" }, ...cohorts]}
            />
            <Input
              id="session-date-from"
              type="date"
              value={dateFrom}
              onChange={(event) => {
                setDateFrom(event.target.value);
                setPage(1);
              }}
              className="min-w-40"
            />
            <Input
              id="session-date-to"
              type="date"
              value={dateTo}
              onChange={(event) => {
                setDateTo(event.target.value);
                setPage(1);
              }}
              className="min-w-40"
            />
          </>
        }
      />

      <DataTable
        columns={columns}
        data={query.data?.sessions ?? []}
        getRowId={(session) => session.id}
        getRowHref={(session) => `/portal/admin/sessions/${session.id}`}
        emptyState={
          <div className="p-6">
            <CalendarDays className="mb-3 size-6 text-slate-400" />
            <p className="font-bold">No sessions found</p>
            <p className="text-sm text-slate-500">
              Teacher-created sessions will appear here.
            </p>
          </div>
        }
      />

      {query.data && (
        <Pagination
          page={query.data.page}
          totalPages={Math.max(1, Math.ceil(query.data.total / query.data.pageSize))}
          total={query.data.total}
          label="sessions"
          onPageChange={setPage}
        />
      )}
    </SectionCard>
  );
}
