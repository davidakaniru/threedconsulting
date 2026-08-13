import "server-only";

import { ApiError } from "@/lib/api/errors";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  ContactInquiry,
  ContactInquiryList,
  ContactInquiryStatus,
} from "@/modules/contact-inquiries/types";

function mapInquiry(row: any): ContactInquiry {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? null,
    subject: row.subject,
    message: row.message,
    status: row.status,
    readAt: row.read_at ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createContactInquiry(input: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const db = createAdminClient();
  const { data, error } = await db
    .from("contact_inquiries")
    .insert({
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone?.trim() || null,
      subject: input.subject.trim(),
      message: input.message.trim(),
    })
    .select("*")
    .single();

  if (error || !data)
    throw new ApiError(
      "CONTACT_SAVE_FAILED",
      "Your message could not be saved right now.",
      500,
    );

  return mapInquiry(data);
}

export async function listContactInquiries(
  status?: ContactInquiryStatus,
): Promise<ContactInquiryList> {
  const db = createAdminClient();

  let query = db
    .from("contact_inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const [{ data, error }, counts] = await Promise.all([
    query,
    Promise.all(
      (["unread", "read", "archived"] as const).map(async (item) => {
        const { count, error: countError } = await db
          .from("contact_inquiries")
          .select("id", { count: "exact", head: true })
          .eq("status", item);
        if (countError)
          throw new ApiError(
            "CONTACT_INQUIRIES_LOAD_FAILED",
            "Contact enquiries could not be loaded.",
            500,
          );
        return [item, count ?? 0] as const;
      }),
    ),
  ]);

  if (error)
    throw new ApiError(
      "CONTACT_INQUIRIES_LOAD_FAILED",
      "Contact enquiries could not be loaded.",
      500,
    );

  const byStatus = Object.fromEntries(counts) as Record<
    ContactInquiryStatus,
    number
  >;

  return {
    inquiries: (data ?? []).map(mapInquiry),
    counts: {
      total: byStatus.unread + byStatus.read + byStatus.archived,
      unread: byStatus.unread,
      read: byStatus.read,
      archived: byStatus.archived,
    },
  };
}

export async function getContactInquiry(id: string): Promise<ContactInquiry> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("contact_inquiries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error)
    throw new ApiError(
      "CONTACT_INQUIRY_LOAD_FAILED",
      "The enquiry could not be loaded.",
      500,
    );
  if (!data)
    throw new ApiError("CONTACT_INQUIRY_NOT_FOUND", "Enquiry not found.", 404);

  if (data.status === "unread") {
    const now = new Date().toISOString();
    const { data: updated, error: updateError } = await db
      .from("contact_inquiries")
      .update({ status: "read", read_at: now, updated_at: now })
      .eq("id", id)
      .select("*")
      .single();

    if (!updateError && updated) return mapInquiry(updated);
  }

  return mapInquiry(data);
}

export async function setContactInquiryStatus(
  id: string,
  status: ContactInquiryStatus,
): Promise<ContactInquiry> {
  const db = createAdminClient();
  const now = new Date().toISOString();
  const { data, error } = await db
    .from("contact_inquiries")
    .update({
      status,
      read_at: status === "unread" ? null : now,
      updated_at: now,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data)
    throw new ApiError(
      "CONTACT_INQUIRY_UPDATE_FAILED",
      "The enquiry could not be updated.",
      500,
    );

  return mapInquiry(data);
}
