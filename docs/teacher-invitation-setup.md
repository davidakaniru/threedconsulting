# Teacher invitation email setup

Teacher accounts are provisioned with Supabase Admin Auth on the server. The application never emails a temporary password.

## Required server secret

Add the project's Supabase secret key to `.env.local`:

```env
SUPABASE_SECRET_KEY=sb_secret_...
```

Never prefix this variable with `NEXT_PUBLIC_`.

## Supabase Auth URL configuration

Add your local and production URLs to Authentication → URL Configuration, including `http://localhost:3000/**` during development.

## Invite user email template

In Authentication → Email Templates → Invite user, make the CTA point to the app confirmation route using the token hash:

```html
<a href="{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=invite">
  Activate teacher account
</a>
```

The confirmation route verifies the invite token, establishes the SSR session, and sends the teacher to `/set-password` to choose their own password.
