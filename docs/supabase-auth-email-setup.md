# Supabase Auth email setup

Phase 2.1 uses Supabase's SSR/PKCE confirmation flow.

## URL configuration

In Supabase Dashboard → Authentication → URL Configuration:

- Set **Site URL** to your production origin.
- Add `http://localhost:3000/**` for local development.
- Add your production origin pattern, for example `https://example.com/**`.

## Confirm signup template

In Authentication → Email Templates → Confirm signup, use a confirmation link that sends the token hash to the Next.js route:

```html
<h2>Confirm your email address</h2>
<p>Follow the link below to finish creating your parent account.</p>
<p>
  <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next={{ .RedirectTo }}">
    Confirm email address
  </a>
</p>
```

The application verifies the token in `src/app/auth/confirm/route.ts`, writes the Supabase session cookies, and redirects to the parent portal.
