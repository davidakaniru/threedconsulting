import type { NextRequest } from "next/server";
import { ValidationError } from "yup";

import { apiError, apiSuccess } from "@/lib/api/responses";
import { sendTransactionalEmail } from "@/lib/email/email.service";
import { createContactInquiry } from "@/modules/contact-inquiries/server";
import { contactSchema } from "@/lib/schemas/contact-schema";

export const runtime = "nodejs";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: NextRequest) {
  try {
    const input = await contactSchema.validate(await request.json(), {
      abortEarly: false,
      stripUnknown: true,
    });

    await createContactInquiry({
      name: input.name,
      email: input.email,
      phone: input.phone,
      subject: input.enquiryType,
      message: input.message,
    });

    const recipient = process.env.CONTACT_EMAIL_TO?.trim();
    const sent = recipient
      ? await sendTransactionalEmail({
      to: recipient,
      subject: `Website enquiry: ${input.enquiryType}`,
      html: `
        <h2>New website enquiry</h2>
        <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(input.phone)}</p>
        <p><strong>Enquiry type:</strong> ${escapeHtml(input.enquiryType)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(input.message).replaceAll("\n", "<br />")}</p>
      `,
        })
      : false;

    if (recipient && !sent) {
      console.error(
        "Contact enquiry was saved, but the notification email could not be sent.",
      );
    }

    return apiSuccess({ saved: true, notified: sent });
  } catch (error) {
    if (error instanceof ValidationError) {
      const details = error.inner.reduce<Record<string, string>>(
        (result, item) => {
          if (item.path && !result[item.path]) result[item.path] = item.message;
          return result;
        },
        {},
      );
      return apiError(
        "VALIDATION_ERROR",
        "Please correct the highlighted fields.",
        422,
        details,
      );
    }

    console.error("Contact form submission failed", error);
    return apiError(
      "INTERNAL_SERVER_ERROR",
      "We couldn't send your message right now.",
      500,
    );
  }
}
