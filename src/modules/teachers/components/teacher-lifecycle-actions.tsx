"use client";

import {
  type LucideIcon,
  MailCheck,
  PauseCircle,
  PlayCircle,
  ShieldBan,
  ShieldCheck,
  UserRoundX,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/ui";
import { useTeacherAction } from "@/hooks/admin/use-teachers";
import { toApiError } from "@/lib/api/errors";
import type {
  TeacherDetail,
  TeacherEmploymentStatus,
} from "@/modules/teachers/types";

export function TeacherLifecycleActions({
  teacher,
}: {
  teacher: TeacherDetail;
}) {
  const mutation = useTeacherAction(teacher.id);

  async function run(
    action: Parameters<typeof mutation.mutateAsync>[0],
    success: string,
  ) {
    try {
      await mutation.mutateAsync(action);
      toast.success(success);
    } catch (error) {
      toast.error(toApiError(error).message);
    }
  }

  const employmentActions = [
    {
      status: "active",
      label: "Mark active",
      icon: PlayCircle,
    },
    {
      status: "on_leave",
      label: "Mark on leave",
      icon: PauseCircle,
    },
    {
      status: "former",
      label: "Mark former",
      icon: UserRoundX,
    },
  ] satisfies ReadonlyArray<{
    status: TeacherEmploymentStatus;
    label: string;
    icon: LucideIcon;
  }>;

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
      {teacher.onboardingStatus === "invited" && (
        <ConfirmDialog
          trigger={
            <Button variant="outline" className="w-full justify-start">
              <MailCheck />
              Resend activation email
            </Button>
          }
          title="Resend activation email?"
          description={`A new password setup email will be sent to ${teacher.email}.`}
          confirmLabel="Resend email"
          isPending={mutation.isPending}
          onConfirm={() =>
            run({ type: "resend_invitation" }, "Activation email resent.")
          }
        />
      )}

      {employmentActions.map(({ status, label, icon: Icon }) => (
        <ConfirmDialog
          key={status}
          trigger={
            <Button variant="outline" className="w-full justify-start">
              <Icon />
              {label}
            </Button>
          }
          title={`${label}?`}
          description="This changes the teacher's employment lifecycle status without deleting the account or record."
          confirmLabel={label}
          isPending={mutation.isPending}
          tone={status === "former" ? "destructive" : "default"}
          onConfirm={() =>
            run(
              { type: "employment_status", status },
              `Teacher marked ${status.replaceAll("_", " ")}.`,
            )
          }
        />
      ))}

      {teacher.accountStatus === "active" ? (
        <ConfirmDialog
          trigger={
            <Button variant="destructive" className="w-full justify-start">
              <ShieldBan />
              Suspend account
            </Button>
          }
          title="Suspend this account?"
          description="The teacher will be blocked from using the portal until an admin reactivates the account."
          confirmLabel="Suspend account"
          tone="destructive"
          isPending={mutation.isPending}
          onConfirm={() =>
            run(
              { type: "account_status", status: "suspended" },
              "Teacher account suspended.",
            )
          }
        />
      ) : (
        <ConfirmDialog
          trigger={
            <Button className="w-full justify-start">
              <ShieldCheck />
              Reactivate account
            </Button>
          }
          title="Reactivate this account?"
          description="The teacher will regain access according to their current role and employment status."
          confirmLabel="Reactivate account"
          isPending={mutation.isPending}
          onConfirm={() =>
            run(
              { type: "account_status", status: "active" },
              "Teacher account reactivated.",
            )
          }
        />
      )}
    </div>
  );
}
