"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function TeacherOpportunityAcceptButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  async function accept() {
    setPending(true);
    try {
      const response = await fetch(`/api/teacher/opportunities/${id}/accept`, {
        method: "POST",
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok)
        throw new Error(
          payload?.error?.message ??
            payload?.message ??
            "Unable to accept this enrolment.",
        );
      toast.success("Enrolment accepted. It is now part of your teaching.");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to accept this enrolment.",
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <Button onClick={accept} disabled={pending} className="w-full sm:w-auto">
      {pending ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}{" "}
      {pending ? "Accepting…" : "Accept enrolment"}
    </Button>
  );
}
