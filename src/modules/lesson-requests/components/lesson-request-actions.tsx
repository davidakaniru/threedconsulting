"use client";

import { useRouter } from "next/navigation";
import { Radio } from "lucide-react";
import { AssignTutor } from "./assign-tutor";
import { toast } from "sonner";
import { ConfirmDialog, SectionCard } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { toApiError } from "@/lib/api/errors";
import { usePublishLessonRequest } from "../hooks";
import type { LessonRequestDetail } from "../types";

export function LessonRequestActions({
  request,
}: {
  request: LessonRequestDetail;
}) {
  const router = useRouter();
  const publish = usePublishLessonRequest(request.id);
  if (request.status !== "pending_review") return null;

  async function publishNow() {
    try {
      await publish.mutateAsync();
      toast.success("Enrolment published to eligible teachers.");
      router.refresh();
    } catch (error) {
      toast.error(toApiError(error).message);
    }
  }

  return (
    <SectionCard
      title="Admin review"
      description="Review the enrolment, then either assign an eligible tutor directly or publish it so an eligible tutor can accept it."
    >
      <div className="space-y-4">
        <div>
          <p className="text-sm font-bold">Assign directly</p>
          <p className="mt-1 text-sm text-muted-foreground">Only active tutors assigned to at least one selected subject are available.</p>
        </div>
        <AssignTutor requestId={request.id} />
      </div>
      <ConfirmDialog
        title="Publish this enrolment?"
        description={
          <>
            Once published, eligible <strong>{request.subjects.map((subject) => subject.name).join(", ")}</strong>{" "}
            teachers will be able to see and accept this opportunity. The first
            successful acceptance will claim it.
          </>
        }
        confirmLabel="Publish enrolment"
        isPending={publish.isPending}
        onConfirm={publishNow}
        trigger={
          <Button>
            <Radio /> Publish to teachers
          </Button>
        }
      />
    </SectionCard>
  );
}
