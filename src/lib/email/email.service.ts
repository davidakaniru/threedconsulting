import "server-only";

type EmailInput = {
  to: string;
  subject: string;
  html: string;
};

export async function sendTransactionalEmail(
  input: EmailInput,
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.TRANSACTIONAL_EMAIL_FROM;

  if (!apiKey || !from) {
    console.warn(
      "Transactional email skipped: RESEND_API_KEY or TRANSACTIONAL_EMAIL_FROM is not configured.",
    );
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: input.subject,
        html: input.html,
      }),
    });

    if (!response.ok) {
      console.error("Transactional email failed", await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Transactional email failed", error);
    return false;
  }
}
