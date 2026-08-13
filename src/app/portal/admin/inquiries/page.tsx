import type { Metadata } from "next";
import Link from "next/link";

import {
  AdminPage,
  EmptyState,
  MetricCard,
  MetricGrid,
  PageHeader,
  SectionCard,
  StatusBadge,
} from "@/components/admin/ui";
import { Inbox, MailOpen, Archive, MessagesSquare } from "lucide-react";
import { listContactInquiries } from "@/modules/contact-inquiries/server";
import type { ContactInquiryStatus } from "@/modules/contact-inquiries/types";

export const metadata: Metadata = { title: "Contact Inquiries | Admin Portal" };

function validStatus(value?: string): ContactInquiryStatus | undefined {
  return value === "unread" || value === "read" || value === "archived"
    ? value
    : undefined;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const status = validStatus(params.status);
  const { inquiries, counts } = await listContactInquiries(status);

  return (
    <AdminPage>
      <PageHeader
        eyebrow="Communication"
        title="Contact inquiries"
        description="Read and manage messages submitted through the public contact form."
      />

      <MetricGrid>
        <MetricCard label="All inquiries" value={counts.total} icon={MessagesSquare} />
        <MetricCard label="Unread" value={counts.unread} icon={Inbox} />
        <MetricCard label="Read" value={counts.read} icon={MailOpen} />
        <MetricCard label="Archived" value={counts.archived} icon={Archive} />
      </MetricGrid>

      <SectionCard
        title="Inbox"
        description="Newest website inquiries appear first."
      >
        <div className="mb-5 flex flex-wrap gap-2">
          {[
            ["All", ""],
            ["Unread", "unread"],
            ["Read", "read"],
            ["Archived", "archived"],
          ].map(([label, value]) => (
            <Link
              key={label}
              href={
                value
                  ? `/portal/admin/inquiries?status=${value}`
                  : "/portal/admin/inquiries"
              }
              className={`rounded-full px-3 py-1.5 text-sm font-bold ${
                (status ?? "") === value
                  ? "bg-primary text-primary-foreground"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {!inquiries.length ? (
          <EmptyState
            icon={Inbox}
            title="No inquiries"
            description="There are no contact-form messages in this view."
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {inquiries.map((inquiry) => (
              <Link
                key={inquiry.id}
                href={`/portal/admin/inquiries/${inquiry.id}`}
                className="flex flex-col gap-2 px-1 py-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:px-3"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className={`truncate ${inquiry.status === "unread" ? "font-extrabold" : "font-semibold"}`}>
                      {inquiry.name}
                    </p>
                    <StatusBadge status={inquiry.status} />
                  </div>
                  <p className="mt-1 truncate text-sm font-semibold text-slate-700">
                    {inquiry.subject}
                  </p>
                  <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                    {inquiry.message}
                  </p>
                </div>
                <time className="shrink-0 text-xs font-semibold text-muted-foreground">
                  {new Intl.DateTimeFormat("en-NG", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(inquiry.createdAt))}
                </time>
              </Link>
            ))}
          </div>
        )}
      </SectionCard>
    </AdminPage>
  );
}
