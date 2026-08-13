# RC-2 — Password recovery flow

The existing forgot-password and reset-password screens are now connected to Supabase Auth.

Flow:
1. The user submits their email at `/forgot-password`.
2. `/api/auth/forgot-password` calls `resetPasswordForEmail` and points the recovery link to `/auth/recovery?next=/reset-password`.
3. `/auth/recovery` exchanges a PKCE auth code for a session (and also supports a `token_hash` recovery link for SSR email templates).
4. A short-lived HTTP-only recovery marker is set and the user is redirected to `/reset-password`.
5. The reset page only enables the form when that marker exists.
6. `/api/auth/reset-password` validates the recovery marker and authenticated recovery session, updates the password with Supabase Auth, signs the temporary session out, and clears the marker.

Security/UX notes:
- The forgot-password success state does not reveal whether an email address exists.
- Reset passwords require at least 8 characters, an uppercase letter, a lowercase letter, and a number.
- Invalid or expired recovery links send the user back to the forgot-password screen with a request-new-link message.
- The Supabase Auth redirect URL used by the recovery email must be allowed in the project's Authentication URL Configuration.
