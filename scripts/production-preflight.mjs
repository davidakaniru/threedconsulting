const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SECRET_KEY",
];

const optionalUrls = [
  "NEXT_PUBLIC_SOCIAL_INSTAGRAM",
  "NEXT_PUBLIC_SOCIAL_FACEBOOK",
  "NEXT_PUBLIC_SOCIAL_LINKEDIN",
  "NEXT_PUBLIC_SOCIAL_YOUTUBE",
];

const failures = [];
const warnings = [];

for (const name of required) {
  if (!process.env[name]?.trim()) failures.push(`Missing ${name}`);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
if (supabaseUrl) {
  try {
    const url = new URL(supabaseUrl);
    if (url.protocol !== "https:") failures.push("NEXT_PUBLIC_SUPABASE_URL must use HTTPS.");
  } catch {
    failures.push("NEXT_PUBLIC_SUPABASE_URL is not a valid URL.");
  }
}

for (const name of optionalUrls) {
  const value = process.env[name]?.trim();
  if (!value) continue;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") warnings.push(`${name} should use HTTPS.`);
  } catch {
    failures.push(`${name} is not a valid URL.`);
  }
}

if (process.env.ADMIN_BOOTSTRAP_EMAIL || process.env.ADMIN_BOOTSTRAP_PASSWORD) {
  warnings.push(
    "Bootstrap admin credentials are still configured. Remove them after one-time bootstrap.",
  );
}

if (!process.env.RESEND_API_KEY || !process.env.TRANSACTIONAL_EMAIL_FROM) {
  warnings.push(
    "Resend transactional email is not fully configured. Contact inquiries will still persist, but notification email will be unavailable.",
  );
}

if (!process.env.CONTACT_EMAIL_TO) {
  warnings.push(
    "CONTACT_EMAIL_TO is not configured. Admin inbox persistence still works; no contact notification email will be sent.",
  );
}

const publicContactKeys = [
  "NEXT_PUBLIC_CONTACT_EMAIL",
  "NEXT_PUBLIC_CONTACT_PHONE",
  "NEXT_PUBLIC_CONTACT_WHATSAPP",
  "NEXT_PUBLIC_CONTACT_ADDRESS",
];
if (!publicContactKeys.some((key) => process.env[key]?.trim())) {
  warnings.push("No public contact details are configured.");
}

if (failures.length) {
  console.error("\nProduction preflight FAILED:\n");
  failures.forEach((item) => console.error(`  ✗ ${item}`));
}

if (warnings.length) {
  console.warn("\nProduction preflight warnings:\n");
  warnings.forEach((item) => console.warn(`  ! ${item}`));
}

if (!failures.length) {
  console.log("\nProduction preflight passed required configuration checks.");
}

process.exitCode = failures.length ? 1 : 0;
