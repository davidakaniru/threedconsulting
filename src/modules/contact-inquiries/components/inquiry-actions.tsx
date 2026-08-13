"use client";

import { useRouter } from "next/navigation";
import { Archive, MailOpen, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type {
  ContactInquiryStatus,
} from "@/modules/contact-inquiries/types";

export function InquiryActions({
  id,
  status,
}: {
  id: string;
  status: ContactInquiryStatus;
}) {
  const router = useRouter();

  async function update(nextStatus: ContactInquiryStatus) {
    const response = await fetch(`/api/admin/contact-inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      toast.error(
        payload?.error?.message || "The enquiry could not be updated.",
      );
      return;
    }

    toast.success(
      nextStatus === "archived"
        ? "Enquiry archived."
        : nextStatus === "unread"
          ? "Enquiry marked unread."
          : "Enquiry marked read.",
    );
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status !== "read" && (
        <Button variant="outline" onClick={() => void update("read")}>
          <MailOpen />
          Mark read
        </Button>
      )}
      {status !== "unread" && (
        <Button variant="outline" onClick={() => void update("unread")}>
          <RotateCcw />
          Mark unread
        </Button>
      )}
      {status !== "archived" && (
        <Button variant="outline" onClick={() => void update("archived")}>
          <Archive />
          Archive
        </Button>
      )}
    </div>
  );
}
