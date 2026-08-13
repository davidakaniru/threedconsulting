# Production Rollout Runbook

This runbook starts from the current clean-build release candidate.

## Phase 1 — Freeze and backup

1. Freeze feature changes.
2. Tag or commit the clean-build candidate.
3. Create a Supabase database backup/snapshot.
4. Export/save the current `supabase migration list` output.
5. Create a `migration-reconcile` Git branch. Do not perform migration-history experimentation on the release branch.

## Phase 2 — Production environment

Configure the deployment platform with:

### Required Supabase
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY` (server-only)

### Transactional email / contact notification
- `RESEND_API_KEY`
- `TRANSACTIONAL_EMAIL_FROM`
- `CONTACT_EMAIL_TO` (optional notification recipient; inquiries remain stored in Admin even if absent)

### Public contact information
- `NEXT_PUBLIC_CONTACT_EMAIL`
- `NEXT_PUBLIC_CONTACT_PHONE`
- `NEXT_PUBLIC_CONTACT_WHATSAPP`
- `NEXT_PUBLIC_CONTACT_ADDRESS`
- `NEXT_PUBLIC_CONTACT_HOURS_WEEKDAYS`
- `NEXT_PUBLIC_CONTACT_HOURS_SATURDAY`
- `NEXT_PUBLIC_CONTACT_HOURS_SUNDAY`

Remove `ADMIN_BOOTSTRAP_EMAIL` and `ADMIN_BOOTSTRAP_PASSWORD` after the one-time bootstrap has completed.

## Phase 3 — Supabase Auth production settings

Follow `docs/supabase-production-auth-config.md` with the final production domain.

In Authentication → URL Configuration:
- Set **Site URL** to the canonical production HTTPS origin.
- Allow the production auth callback/recovery destinations.
- Keep localhost/preview redirect patterns only if intentionally required.

Configure production SMTP and test:
1. teacher invitation;
2. parent/account confirmation where applicable;
3. forgot-password recovery;
4. expired/invalid recovery behaviour.

## Phase 4 — Migration-history reconciliation

Follow `docs/migration-reconciliation-manifest.md` and `docs/migration-history-reconciliation.md`.

Recommended sequence from the complete repository:

```bash
supabase link --project-ref ftocxmbnabidlalbokfk
supabase migration list
git checkout -b migration-reconcile
supabase db pull
```

Then compare the pulled/live baseline with the repository chain. Use `supabase migration repair` only after verifying that the target migration's schema effect is already present or absent as claimed.

Proof requirement before production automation:

```bash
supabase db reset
```

against a local stack, or recreate the schema on a disposable Supabase development branch. A fresh database must reach the expected release schema without manual fixes.

Only after that proof:

```bash
supabase migration list
supabase db push
```

should become a normal deployment step.

## Phase 5 — Application deployment

1. Load the production environment and run `node scripts/production-preflight.mjs`.
2. Run the complete repository's tests.
3. Run `npm ci`.
4. Run `npm run build`.
5. Deploy over HTTPS.
6. Confirm security headers in the deployed response.
7. Confirm no server-only secret appears in browser bundles or public API payloads.

## Phase 6 — Production smoke test

### Public
- Open the home/contact/enrolment pages on desktop and mobile.
- Submit a real contact inquiry.
- Confirm it appears under Admin → Contact inquiries.
- If Resend notification is configured, confirm the notification email arrives.

### Parent
- Create/sign in through the intended enrolment flow.
- Edit linked child's personal details/current education level/photo.
- Submit another lesson request.
- Confirm matched lesson/session/attendance behaviour.
- Verify join-button time window.

### Teacher
- Complete invitation/password setup.
- Verify eligible Available Lessons only.
- Accept one enrolment.
- Create a session.
- Mark attendance.

### Admin
- Review/publish enrolment.
- Create teacher with generated ID and multiple programmes.
- Add/remove programme eligibility.
- Suspend/reactivate a parent and confirm immediate UI state.
- Verify admission-only child editing.
- Open and manage Contact inquiries.
- Run a teacher monthly report.

### Auth
- Sign out/sign in all roles.
- Run Forgot password → email → reset page → new password → sign in.
- Confirm invalid/expired recovery doesn't land on a dashboard.

## Phase 7 — Observe and close

For the first production window:
- monitor application/server logs;
- monitor Supabase Auth/database logs;
- watch email delivery failures;
- verify public write endpoints are protected by host/WAF rate limiting;
- retain the pre-deploy database rollback point until the smoke-test window is complete.
