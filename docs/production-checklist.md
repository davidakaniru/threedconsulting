# Production Release Checklist

## Build and configuration

- [ ] Clean `npm run build` from the complete repository.
- [ ] Automated tests pass.
- [ ] Production Supabase URL and publishable key are configured.
- [ ] `SUPABASE_SECRET_KEY` exists only in server-side deployment secrets.
- [ ] `ADMIN_BOOTSTRAP_EMAIL` and `ADMIN_BOOTSTRAP_PASSWORD` are removed after bootstrap.
- [ ] Resend variables are configured if transactional website email is enabled.
- [ ] Public contact environment variables contain real client details; no placeholder contact data is displayed.
- [ ] Production Site URL and allowed redirect URLs are configured in Supabase Auth.
- [ ] Production SMTP is configured for Supabase Auth emails.
- [ ] Database backup/snapshot completed before migration/deployment.
- [ ] All migrations are applied successfully.

## Security and permissions

- [ ] Anonymous user cannot access `/portal/*` routes.
- [ ] Parent cannot access Admin or Teacher portal pages/APIs.
- [ ] Teacher cannot access Admin or Parent portal pages/APIs.
- [ ] Admin cannot edit a child's parent-owned personal information or upload the child's profile image.
- [ ] Parent can edit/upload only for children linked to their own account.
- [ ] Teacher opportunity acceptance is restricted to eligible programme assignments.
- [ ] Parent meeting join endpoint rejects access outside the 30-min-before to 10-min-after window.
- [ ] Suspended accounts cannot use protected portal/API routes.
- [ ] Security response headers are present in production.
- [ ] Host/WAF rate limiting is enabled for public enrolment/contact endpoints.

## Authentication smoke tests

- [ ] New parent completes account creation inside enrolment.
- [ ] Existing parent can submit another enrolment without duplicate account creation.
- [ ] Teacher invitation → password setup → sign-in works.
- [ ] Sign-in routes each role to the correct portal.
- [ ] Sign-out clears the authenticated session.
- [ ] Forgot password email → recovery callback → reset-password page → new password sign-in works.
- [ ] Invalid/expired recovery link returns to Forgot password instead of a dashboard.
- [ ] Admin suspend/reactivate parent updates immediately and affects access correctly.

## Parent workflow

- [ ] Parent can switch between linked children.
- [ ] Parent can edit child's personal information, current education level and profile image.
- [ ] Parent can request multiple active lessons for the same child.
- [ ] Parent sees matched teacher and active lesson details after acceptance.
- [ ] Upcoming sessions, attendance and recent activity display correct child-specific data.
- [ ] Join button appears only inside the permitted session window.

## Teacher workflow

- [ ] Available Lessons badge appears when at least one eligible opportunity exists.
- [ ] Teacher cannot see opportunities outside assigned programmes.
- [ ] First eligible teacher to accept receives the lesson; subsequent acceptance is rejected safely.
- [ ] Accepted lesson appears in My lessons.
- [ ] Teacher can create/manage sessions only for their own active lessons.
- [ ] Attendance updates persist and are visible to the linked parent.

## Admin workflow

- [ ] Dashboard entity caps are correct.
- [ ] Admin can review and publish an enrolment.
- [ ] Admin can create a teacher with automatically generated teacher ID and multiple programme assignments.
- [ ] Admin can add/remove teacher programme eligibility from the teacher profile.
- [ ] Teacher hard-delete works only for accounts without protected teaching history.
- [ ] Admin cannot manually create parent accounts.
- [ ] Admin cannot manually create student records; students originate from the enrolment/lesson workflow.
- [ ] Admin can update only admission-related student information.
- [ ] Teacher reports load only the selected teacher and selected month.

## Public website

- [ ] Enrolment CTA reaches the unified enrolment flow.
- [ ] Published programmes load successfully.
- [ ] Contact page displays real configured contact information.
- [ ] Contact form sends a real email and shows an error when delivery fails.
- [ ] Responsive/keyboard QA completed on critical public and portal pages.

## Post-deploy

- [ ] Review application/server logs after the first production smoke test.
- [ ] Verify no secret values are exposed in browser bundles or response payloads.
- [ ] Verify password recovery and email links use the production domain, not localhost/preview URLs.
- [ ] Confirm a rollback point/database backup is available.
