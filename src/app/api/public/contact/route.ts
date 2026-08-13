import type { NextRequest } from "next/server";
import { ValidationError } from "yup";

import { apiError, apiSuccess } from "@/lib/api/responses";
import { sendTransactionalEmail } from "@/lib/email/email.service";
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

    const recipient = process.env.CONTACT_EMAIL_TO?.trim();
    if (!recipient) {
      console.error("Contact form unavailable: CONTACT_EMAIL_TO is not configured.");
      return apiError(
        "CONTACT_NOT_CONFIGURED",
        "Our contact form is temporarily unavailable. Please try again shortly.",
        503,
      );
    }

    const sent = await sendTransactionalEmail({
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
    });

    if (!sent)
      return apiError(
        "CONTACT_SEND_FAILED",
        "We couldn't send your message right now. Please try again shortly.",
        503,
      );

    return apiSuccess({ sent: true });
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
