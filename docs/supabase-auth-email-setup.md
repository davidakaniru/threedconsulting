# Supabase Auth Email Setup

The application uses Supabase Auth with SSR/PKCE for parent confirmation, teacher invitations and password recovery.

## URL configuration

In Supabase Dashboard → Authentication → URL Configuration:

- Set **Site URL** to the canonical production origin, not localhost or a preview deployment.
- Add `http://localhost:3000/**` only for local development.
- Add the canonical production origin pattern, for example `https://your-domain.com/**`.
- Add preview URL patterns only when preview authentication is intentionally supported.

The application's recovery flow sends users through `/auth/recovery` and then `/reset-password`, so the production origin must be allowed by Supabase Auth.

## Confirm signup template

The confirmation template should return the token to the application confirmation route. Keep the existing Supabase template variables intact.

```html
<h2>Confirm your email address</h2>
<p>Follow the link below to finish creating your parent account.</p>
<p>
  <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next={{ .RedirectTo }}">
    Confirm email address
  </a>
</p>
```

## Password recovery

The application calls `resetPasswordForEmail` with `/auth/recovery?next=/reset-password`. The recovery route exchanges/verifies the Supabase recovery credential, creates the temporary recovery session, and then allows the user to choose a new password.

Request a fresh recovery email during production smoke testing and verify the link resolves to the canonical production domain.

## Production mail delivery

Configure production SMTP/email delivery in Supabase Auth before launch and verify confirmation, invitation and recovery messages with real inboxes.
