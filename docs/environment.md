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

`CONTACT_EMAIL_TO` receives public website enquiries. The contact form returns an unavailable state rather than pretending a message was sent when email delivery is not configured.

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
