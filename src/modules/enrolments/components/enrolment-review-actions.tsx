"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SelectField } from "@/components/forms/select-field";
import { SectionCard } from "@/components/admin/ui";
import { toApiError } from "@/lib/api/errors";
import {
  useApproveEnrolment,
  useCohortOptions,
  useRejectEnrolment,
} from "../hooks/use-enrolments";
import type { EnrolmentDetail } from "../types";

export function EnrolmentReviewActions({ application }: { application: EnrolmentDetail }) {
  const router = useRouter();
  const cohortOptions = useCohortOptions(application.id);
  const approve = useApproveEnrolment(application.id);
  const reject = useRejectEnrolment(application.id);
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");

  const groups = useMemo(
    () =>
      application.programmes.map((programme) => ({
        programme,
        options: (cohortOptions.data ?? [])
          .filter((cohort) => cohort.programmeId === programme.id)
          .map((cohort) => ({
            label: `${cohort.code} — ${cohort.name} (${cohort.memberCount}/${cohort.capacity})`,
            value: cohort.id,
          })),
      })),
    [application.programmes, cohortOptions.data],
  );

  if (!["pending", "under_review"].includes(application.status)) return null;

  async function approveNow() {
    try {
      await approve.mutateAsync({
        assignments: application.programmes.map((programme) => ({
          programmeId: programme.id,
          cohortId: assignments[programme.id],
        })),
        reviewNotes: notes,
      });
      toast.success("Enrolment approved and student placed in cohort(s).");
      router.refresh();
    } catch (error) {
      toast.error(toApiError(error).message);
    }
  }

  async function rejectNow() {
    try {
      await reject.mutateAsync(notes);
      toast.success("Enrolment application rejected.");
      router.refresh();
    } catch (error) {
      toast.error(toApiError(error).message);
    }
  }

  const ready = application.programmes.every((programme) => assignments[programme.id]);

  return (
    <SectionCard
      title="Review application"
      description="Choose one available cohort for every requested programme before approval."
    >
      <div className="space-y-4">
        {groups.map((group) => (
          <SelectField
            key={group.programme.id}
            id={`cohort-${group.programme.id}`}
            label={group.programme.name}
            placeholder={group.options.length ? "Choose a cohort" : "No available cohort"}
            options={group.options}
            value={assignments[group.programme.id]}
            onValueChange={(value) =>
              setAssignments((current) => ({ ...current, [group.programme.id]: value }))
            }
          />
        ))}

        <Textarea
          id="review-notes"
          label="Review notes"
          rows={4}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Optional for approval; required when rejecting."
        />

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={approveNow}
            disabled={!ready || approve.isPending || cohortOptions.isLoading}
          >
            <CheckCircle2 />
            Approve and place student
          </Button>
          <Button
            variant="destructive"
            onClick={rejectNow}
            disabled={!notes.trim() || reject.isPending}
          >
            <XCircle />
            Reject application
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}
