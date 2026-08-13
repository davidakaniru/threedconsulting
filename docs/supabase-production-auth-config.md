# Supabase Production Auth Configuration

Let `https://YOUR-PRODUCTION-DOMAIN` be the canonical deployed application origin.

## Authentication → URL Configuration

Set:

**Site URL**
```text
https://YOUR-PRODUCTION-DOMAIN
```

Allow redirect destinations that cover the application's server-side auth endpoints:

```text
https://YOUR-PRODUCTION-DOMAIN/auth/confirm
https://YOUR-PRODUCTION-DOMAIN/auth/recovery
https://YOUR-PRODUCTION-DOMAIN/portal/parent
```

The application creates password-reset links using `/auth/recovery?next=/reset-password`. Signup/confirmation uses `/auth/confirm` when the PKCE token-hash email template is used.

Do not leave a broad preview-domain wildcard enabled in production unless preview deployments intentionally share the production Supabase project.

## Email templates

For SSR/PKCE confirmation, the email template should route token hashes through the application `/auth/confirm` endpoint rather than dropping a session token directly into a public page.

Password recovery must ultimately enter `/auth/recovery`, which verifies/exchanges the recovery token and establishes the temporary recovery session before `/reset-password`.

## SMTP

Configure a production SMTP provider for Supabase Auth emails and disable provider link tracking if it rewrites Supabase authentication links.

Test production-domain emails for:
- parent signup/confirmation where enabled;
- teacher invitation/password setup;
- forgot-password recovery;
- expired or already-used links.

## After configuration

Use an incognito browser and a real mailbox. Confirm every email link points to the production HTTPS origin and never to localhost or a preview deployment.
