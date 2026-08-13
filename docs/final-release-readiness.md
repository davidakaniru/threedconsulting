# Final Release Readiness Pass

This pass intentionally adds no new tutoring feature scope. It aligns the active codebase with the agreed production model and removes release-blocking placeholder behaviour.

## Hardened in this pass

- Admin-side student creation is retired. Student records originate from the enrolment/lesson-matching workflow; Admin retains admission-only editing.
- The public Contact form now submits to a server route and uses the existing transactional email service instead of logging input and displaying a fake success state.
- Placeholder UK contact details are removed. Contact information and opening hours are production environment configuration and are omitted when not configured.
- Baseline response security headers are added in `src/proxy.ts`: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, plus HSTS in production.
- Deployment/environment/current-product documentation is updated to reflect the active release rather than retired cohort/homework flows.

## Manual deployment responsibilities

The repository cannot enforce infrastructure settings outside the app. Before production traffic, verify Supabase Auth Site URL/redirect allow-list, production SMTP, deployment secrets, database backups, host-level monitoring and abuse/rate limiting for public write endpoints.

## Connected Supabase verification

The connected production project was checked during this pass:

- RLS is enabled on the active public tables checked: profiles, teachers, parents, students, student-parent links, programmes, teaching assignments, lesson requests, lesson assignments, class sessions, attendance and audit logs.
- `student-photos` is a private storage bucket.
- `avatars` is currently public, which matches the existing profile-avatar URL model; confirm that public avatar visibility is acceptable for the client before launch.

## Release blocker: migration-history reconciliation

The live Supabase migration history and the timestamped SQL files in this archive are not aligned. Several logically equivalent migrations have different timestamps, the remote history contains corrective migrations that are not represented as separate local files, and the local folder contains historical entries that do not share the remote version IDs.

Do **not** run `supabase db push` against the live project from this migration folder until the histories are reconciled. First use the Supabase CLI from the complete Git repository to compare local/remote history (`supabase migration list`). Then reconcile from the known-good live schema using the documented Supabase workflow (`db pull` and, only when the actual schema state has been verified, `migration repair`). Test the reconciled migration chain with a local reset or disposable branch before enabling database migration automation in CI.


## Contact inquiry inbox follow-up

Public Contact submissions are now persisted in `contact_inquiries` before optional email notification. Admin has a dedicated Contact inquiries inbox with unread/read/archived states. Opening an unread inquiry marks it read; Admin can mark it unread again or archive it. The table has RLS enabled and no browser-facing policies; application access is through authenticated Admin server code using the service-role client.
