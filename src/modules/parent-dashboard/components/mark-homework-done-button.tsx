"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function MarkHomeworkDoneButton({
  submissionId,
}: {
  submissionId: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function markDone() {
    setPending(true);
    try {
      const response = await fetch(
        `/api/parent/homework/${submissionId}/done`,
        {
          method: "POST",
        },
      );
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          payload?.error?.message ?? "Unable to mark homework as done.",
        );
      }
      toast.success("Homework marked as done.");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to mark homework as done.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <Button size="sm" variant="outline" onClick={markDone} disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
      {pending ? "Saving…" : "Mark as done"}
    </Button>
  );
}
