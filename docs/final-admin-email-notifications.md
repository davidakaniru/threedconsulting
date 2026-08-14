# Final admin email notifications

The application now uses `CONTACT_EMAIL_TO` as the admin/client notification recipient for two additional operational events:

1. A new enrolment / lesson request is successfully persisted.
2. A teacher successfully claims an open lesson request.

Both notifications are deliberately post-transaction side effects. Failure to load notification context or failure to send through Resend is logged and never changes the successful enrolment or lesson-claim result.

Each email includes relevant parent/child/programme/schedule context and a direct link to the enrolment in the production Admin Portal. The canonical link uses `NEXT_PUBLIC_SITE_URL` and falls back to `https://www.three-dmanagers.org`.
