"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpenCheck, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  ConfirmDialog,
  EmptyState,
  SectionCard,
  StatusBadge,
} from "@/components/admin/ui";
import { ComboboxField } from "@/components/forms/combobox-field";
import { Button } from "@/components/ui/button";
import { toApiError } from "@/lib/api/errors";
import { useProgrammes } from "@/modules/programmes/hooks";
import {
  useCreateTeachingAssignment,
  useRemoveTeachingAssignment,
  useTeachingAssignments,
} from "@/modules/teaching-assignments/hooks";

export function TeacherProgrammes({
  teacherId,
  adminView = true,
}: {
  teacherId: string;
  adminView?: boolean;
}) {
  const [programmeId, setProgrammeId] = useState("");
  const query = useTeachingAssignments({ teacherId });
  const programmesQuery = useProgrammes({
    page: 1,
    pageSize: 100,
    status: "published",
  });
  const create = useCreateTeachingAssignment();
  const remove = useRemoveTeachingAssignment();

  const assignedProgrammeIds = useMemo(
    () =>
      new Set(
        (query.data?.assignments ?? []).map(
          (assignment) => assignment.programmeId,
        ),
      ),
    [query.data?.assignments],
  );

  const programmeOptions = useMemo(
    () =>
      (programmesQuery.data?.programmes ?? [])
        .filter((programme) => !assignedProgrammeIds.has(programme.id))
        .map((programme) => ({
          value: programme.id,
          label: programme.name,
        })),
    [assignedProgrammeIds, programmesQuery.data?.programmes],
  );

  async function assignProgramme() {
    if (!programmeId) return;

    try {
      await create.mutateAsync({
        teacherId,
        programmeId,
        primaryInstructor: false,
      });
      setProgrammeId("");
      toast.success("Programme assigned to teacher.");
    } catch (error) {
      toast.error(toApiError(error).message);
    }
  }

  async function removeProgramme(assignmentId: string) {
    try {
      await remove.mutateAsync(assignmentId);
      toast.success("Programme removed from teacher.");
    } catch (error) {
      toast.error(toApiError(error).message);
    }
  }

  return (
    <SectionCard
      title={adminView ? "Assigned programmes" : "My programmes"}
      description={
        adminView
          ? "Manage the programmes this teacher is authorised to teach."
          : "Programmes assigned to you by an administrator."
      }
      contentClassName="p-5 sm:p-6"
    >
      {adminView ? (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <ComboboxField
              label="Add programme"
              options={programmeOptions}
              value={programmeId}
              onValueChange={setProgrammeId}
              placeholder="Select a programme"
              searchPlaceholder="Search programmes..."
              emptyText="No other published programmes available."
            />
          </div>
          <Button
            type="button"
            onClick={assignProgramme}
            disabled={!programmeId || create.isPending}
          >
            <Plus />
            {create.isPending ? "Assigning..." : "Assign programme"}
          </Button>
        </div>
      ) : null}

      {query.isLoading ? (
        <p className="text-sm text-slate-500">Loading programmes…</p>
      ) : query.data?.assignments.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {query.data.assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="rounded-2xl border border-slate-200 p-4 transition hover:border-primary/40 hover:bg-primary/5"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <BookOpenCheck className="size-5" />
                </span>
                <div className="flex items-center gap-2">
                  <StatusBadge status={assignment.status} />
                  {adminView ? (
                    <ConfirmDialog
                      trigger={
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Remove ${assignment.programme.name}`}
                        >
                          <Trash2 />
                        </Button>
                      }
                      title="Remove assigned programme?"
                      description={`Remove ${assignment.programme.name} from this teacher's assigned programmes? The teacher will no longer receive new enrolment opportunities for this programme. Existing lesson records are preserved.`}
                      confirmLabel="Remove programme"
                      tone="destructive"
                      isPending={remove.isPending}
                      onConfirm={() => removeProgramme(assignment.id)}
                    />
                  ) : null}
                </div>
              </div>

              {adminView ? (
                <Link
                  href={`/portal/admin/programmes/${assignment.programmeId}`}
                  className="mt-4 block font-display text-lg font-extrabold text-slate-900 hover:text-primary"
                >
                  {assignment.programme.name}
                </Link>
              ) : (
                <h3 className="mt-4 font-display text-lg font-extrabold text-slate-900">
                  {assignment.programme.name}
                </h3>
              )}

              <p className="mt-1 text-xs text-slate-500">
                Assigned{" "}
                {new Intl.DateTimeFormat("en-GB", {
                  dateStyle: "medium",
                }).format(new Date(assignment.assignedAt))}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpenCheck}
          title="No programmes assigned"
          description={
            adminView
              ? "Assign a published programme to make this teacher eligible for enrolment opportunities."
              : "An administrator has not assigned any programmes yet."
          }
        />
      )}
    </SectionCard>
  );
}
