# Environment Variables

Configure secrets in the deployment platform and keep local values in `.env.local`. Never commit secret values.

## Required application/auth

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
```

`SUPABASE_SECRET_KEY` is server-only and must never use the `NEXT_PUBLIC_` prefix.

## Transactional email

Required when the application should send operational email through Resend:

```env
RESEND_API_KEY=
TRANSACTIONAL_EMAIL_FROM="ThreeD <noreply@your-domain.com>"
CONTACT_EMAIL_TO=
```

`CONTACT_EMAIL_TO` receives an optional email notification for public website enquiries. The inquiry itself is persisted first and remains available in Admin → Contact inquiries even when notification email is not configured or delivery fails.

## Public contact details

Set only the details that should be displayed publicly. Unconfigured items are omitted from the Contact page instead of falling back to placeholder data.

```env
NEXT_PUBLIC_CONTACT_EMAIL=
NEXT_PUBLIC_CONTACT_PHONE=
NEXT_PUBLIC_CONTACT_WHATSAPP=
NEXT_PUBLIC_CONTACT_ADDRESS=
NEXT_PUBLIC_CONTACT_HOURS_WEEKDAYS=
NEXT_PUBLIC_CONTACT_HOURS_SATURDAY=
NEXT_PUBLIC_CONTACT_HOURS_SUNDAY=
```

For WhatsApp, use the international number. Formatting characters are stripped when the `wa.me` URL is created.

## Bootstrap-only admin credentials

Only set these while running the one-time bootstrap script; remove them from the production environment afterward.

```env
ADMIN_BOOTSTRAP_EMAIL=
ADMIN_BOOTSTRAP_PASSWORD=
```

## Optional public social profiles

Only configure profiles the client actually uses. Missing values are hidden from the footer.

```env
NEXT_PUBLIC_SOCIAL_INSTAGRAM=
NEXT_PUBLIC_SOCIAL_FACEBOOK=
NEXT_PUBLIC_SOCIAL_LINKEDIN=
NEXT_PUBLIC_SOCIAL_YOUTUBE=
```

Use complete `https://` profile URLs rather than generic social-network homepages.

## Preflight

From the complete repository with production environment variables loaded:

```bash
node scripts/production-preflight.mjs
```

A non-zero exit code means required production configuration is missing or malformed.
