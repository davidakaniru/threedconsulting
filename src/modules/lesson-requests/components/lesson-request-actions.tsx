"use client";

import { useRouter } from "next/navigation";
import { Radio } from "lucide-react";
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
      description="Confirm that the enrolment is suitable before making it visible to tutors assigned to this subject."
    >
      <ConfirmDialog
        title="Publish this enrolment?"
        description={
          <>
            Once published, eligible <strong>{request.programme.name}</strong>{" "}
            tutors will be able to see and accept this opportunity. The first
            successful acceptance will claim it.
          </>
        }
        confirmLabel="Publish enrolment"
        isPending={publish.isPending}
        onConfirm={publishNow}
        trigger={
          <Button>
            <Radio /> Publish to tutors
          </Button>
        }
      />
    </SectionCard>
  );
}
