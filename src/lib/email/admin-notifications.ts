import "server-only";

import { sendTransactionalEmail } from "@/lib/email/email.service";
import { createAdminClient } from "@/lib/supabase/admin";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function relationOne<T>(value: T | T[] | null | undefined): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : (value ?? null);
}

function siteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ||
    "https://www.three-dmanagers.org"
  );
}

async function adminRecipient() {
  return process.env.CONTACT_EMAIL_TO?.trim() || null;
}

export async function notifyAdminNewLessonRequest(requestId: string) {
  try {
    const to = await adminRecipient();
    if (!to) {
      console.warn(
        "New enrolment notification skipped: CONTACT_EMAIL_TO is not configured.",
      );
      return;
    }

    const db = createAdminClient() as any;
    const { data: request, error } = await db
      .from("lesson_requests")
      .select(
        "id,parent_id,child_first_name,child_last_name,current_education_level,preferred_days,preferred_time,duration_months,additional_message,programmes(name)",
      )
      .eq("id", requestId)
      .maybeSingle();

    if (error || !request) {
      console.error("Unable to load enrolment for admin notification", error);
      return;
    }

    const { data: parent } = await db
      .from("profiles")
      .select("first_name,last_name,email,phone")
      .eq("id", request.parent_id)
      .maybeSingle();

    const programme = relationOne(request.programmes) as any;
    const parentName =
      [parent?.first_name, parent?.last_name].filter(Boolean).join(" ") ||
      "Parent";
    const childName =
      [request.child_first_name, request.child_last_name]
        .filter(Boolean)
        .join(" ") || "Child";
    const programmeName = programme?.name || "Programme";
    const days = (request.preferred_days ?? []).join(", ") || "Not specified";
    const adminUrl = `${siteUrl()}/portal/admin/enrolments/${request.id}`;

    await sendTransactionalEmail({
      to,
      subject: `New enrolment — ${programmeName} for ${childName}`,
      html: `
        <h2>New enrolment received</h2>
        <p>A new lesson request has been submitted and is waiting for review.</p>
        <p><strong>Parent:</strong> ${escapeHtml(parentName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(parent?.email || "Not available")}</p>
        <p><strong>Phone:</strong> ${escapeHtml(parent?.phone || "Not available")}</p>
        <p><strong>Child:</strong> ${escapeHtml(childName)}</p>
        <p><strong>Current class / education level:</strong> ${escapeHtml(
          request.current_education_level || "Not specified",
        )}</p>
        <p><strong>Programme:</strong> ${escapeHtml(programmeName)}</p>
        <p><strong>Preferred days:</strong> ${escapeHtml(days)}</p>
        <p><strong>Preferred time:</strong> ${escapeHtml(
          request.preferred_time || "Not specified",
        )}</p>
        <p><strong>Duration:</strong> ${escapeHtml(
          `${request.duration_months} month${request.duration_months === 1 ? "" : "s"}`,
        )}</p>
        ${
          request.additional_message
            ? `<p><strong>Additional message:</strong><br />${escapeHtml(
                request.additional_message,
              ).replaceAll("\n", "<br />")}</p>`
            : ""
        }
        <p><a href="${adminUrl}">View enrolment in Admin Portal</a></p>
      `,
    });
  } catch (error) {
    console.error("New enrolment admin notification failed", error);
  }
}

export async function notifyAdminLessonAccepted(
  requestId: string,
  teacherId: string,
) {
  try {
    const to = await adminRecipient();
    if (!to) {
      console.warn(
        "Lesson accepted notification skipped: CONTACT_EMAIL_TO is not configured.",
      );
      return;
    }

    const db = createAdminClient() as any;
    const [{ data: request, error: requestError }, { data: teacher }] =
      await Promise.all([
        db
          .from("lesson_requests")
          .select(
            "id,child_first_name,child_last_name,current_education_level,preferred_days,preferred_time,duration_months,programmes(name)",
          )
          .eq("id", requestId)
          .maybeSingle(),
        db
          .from("profiles")
          .select("first_name,last_name,email")
          .eq("id", teacherId)
          .maybeSingle(),
      ]);

    if (requestError || !request) {
      console.error(
        "Unable to load accepted enrolment for admin notification",
        requestError,
      );
      return;
    }

    const programme = relationOne(request.programmes) as any;
    const teacherName =
      [teacher?.first_name, teacher?.last_name].filter(Boolean).join(" ") ||
      "Teacher";
    const childName =
      [request.child_first_name, request.child_last_name]
        .filter(Boolean)
        .join(" ") || "Child";
    const programmeName = programme?.name || "Programme";
    const adminUrl = `${siteUrl()}/portal/admin/enrolments/${request.id}`;

    await sendTransactionalEmail({
      to,
      subject: `Lesson accepted — ${programmeName} for ${childName}`,
      html: `
        <h2>Lesson request accepted</h2>
        <p>A teacher has accepted an available lesson request.</p>
        <p><strong>Teacher:</strong> ${escapeHtml(teacherName)}</p>
        <p><strong>Teacher email:</strong> ${escapeHtml(
          teacher?.email || "Not available",
        )}</p>
        <p><strong>Child:</strong> ${escapeHtml(childName)}</p>
        <p><strong>Current class / education level:</strong> ${escapeHtml(
          request.current_education_level || "Not specified",
        )}</p>
        <p><strong>Programme:</strong> ${escapeHtml(programmeName)}</p>
        <p><strong>Preferred days:</strong> ${escapeHtml(
          (request.preferred_days ?? []).join(", ") || "Not specified",
        )}</p>
        <p><strong>Preferred time:</strong> ${escapeHtml(
          request.preferred_time || "Not specified",
        )}</p>
        <p><strong>Duration:</strong> ${escapeHtml(
          `${request.duration_months} month${request.duration_months === 1 ? "" : "s"}`,
        )}</p>
        <p><a href="${adminUrl}">View enrolment in Admin Portal</a></p>
      `,
    });
  } catch (error) {
    console.error("Lesson accepted admin notification failed", error);
  }
}
