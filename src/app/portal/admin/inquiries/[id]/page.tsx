import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";

import {
  AdminPage,
  InfoCard,
  PageBackButton,
  PageHeader,
  SectionCard,
  StatusBadge,
} from "@/components/admin/ui";
import { InquiryActions } from "@/modules/contact-inquiries/components/inquiry-actions";
import { getContactInquiry } from "@/modules/contact-inquiries/server";

export const metadata: Metadata = { title: "Contact Inquiry | Admin Portal" };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inquiry = await getContactInquiry(id);

  return (
    <AdminPage className="max-w-5xl">
      <PageBackButton />
      <PageHeader
        eyebrow="Contact inquiry"
        title={inquiry.subject}
        description={`Received ${new Intl.DateTimeFormat("en-NG", {
          dateStyle: "full",
          timeStyle: "short",
        }).format(new Date(inquiry.createdAt))}`}
      />

      <SectionCard
        title={inquiry.name}
        description={inquiry.email}
        action={<StatusBadge status={inquiry.status} />}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoCard
            icon={Mail}
            title="Email"
            description={inquiry.email}
          />
          <InfoCard
            icon={Phone}
            title="Phone"
            description={inquiry.phone || "Not provided"}
          />
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 p-5">
          <p className="text-xs font-extrabold uppercase tracking-[.12em] text-muted-foreground">
            Message
          </p>
          <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-700">
            {inquiry.message}
          </p>
        </div>

        <div className="mt-6">
          <InquiryActions id={inquiry.id} status={inquiry.status} />
        </div>
      </SectionCard>
    </AdminPage>
  );
}
