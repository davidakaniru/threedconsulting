"use client";

import { Check, UserRoundX } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/ui";
import { toApiError } from "@/lib/api/errors";
import { useTutorApplicationAction } from "@/modules/tutor-applications/hooks/use-tutor-applications";

export function TutorApplicationDetailActions({
  applicationId,
  applicantName,
  email,
}: {
  applicationId: string;
  applicantName: string;
  email: string;
}) {
  const mutation = useTutorApplicationAction();
  async function run(type: "accept" | "reject") {
    try {
      await mutation.mutateAsync({ id: applicationId, action: { type } });
      toast.success(
        type === "accept"
          ? "Tutor application accepted and activation email sent."
          : "Tutor application rejected.",
      );
    } catch (error) {
      toast.error(toApiError(error).message);
    }
  }
  return (
    <div className="flex items-center justify-end gap-3">
      <ConfirmDialog
        trigger={
          <Button className="w-fit justify-start">
            <Check /> Accept application
          </Button>
        }
        title="Accept this tutor application?"
        description={`This will create an active tutor account for ${applicantName} and send an account activation email to ${email}.`}
        confirmLabel="Accept application"
        isPending={mutation.isPending}
        onConfirm={() => run("accept")}
      />
      <ConfirmDialog
        trigger={
          <Button variant="destructive" className="w-fit justify-start">
            <UserRoundX /> Reject application
          </Button>
        }
        title="Reject this tutor application?"
        description={`The application from ${applicantName} will be marked as rejected.`}
        confirmLabel="Reject application"
        tone="destructive"
        isPending={mutation.isPending}
        onConfirm={() => run("reject")}
      />
    </div>
  );
}
