# Deployment

1. Create a database backup/snapshot before applying release migrations.
2. Configure all production environment variables listed in `docs/environment.md`.
3. In Supabase Authentication → URL Configuration, set the production Site URL and allow the production origin for authentication redirects. Keep localhost/preview patterns only where they are intentionally needed.
4. Configure production SMTP/email delivery for Supabase Auth so confirmation, invitation and password-recovery emails are not dependent on development mail limits.
5. Apply pending Supabase migrations in order and verify there are no failed migrations.
6. Run `npm ci`, `npm run build`, and the project's test suite from the complete repository.
7. Deploy the Next.js application over HTTPS.
8. Verify public contact details and submit one real Contact-form enquiry.
9. Run the cross-role smoke tests in `docs/production-checklist.md`.
10. Confirm host-level monitoring/logging and rate limiting are enabled for public write endpoints such as enrolment and contact submission.
