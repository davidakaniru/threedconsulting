# R2 — Admin Lesson Request Review & Publishing

R2 replaces the old cohort-placement enrolment review experience in the Admin Portal with the tutoring marketplace workflow confirmed by the client.

## Admin flow

1. Parent submits a lesson request through the unified enrolment flow.
2. The request appears in `/portal/admin/lesson-requests` with status `pending_review`.
3. Admin opens the request and reviews the child, subject, preferred days/time, duration, parent contact details, and optional additional message.
4. Admin publishes a suitable request.
5. Publishing atomically changes the request to `open`, records review/publish timestamps and the reviewing admin, and writes an audit log.
6. R3 will expose `open` requests only to teachers with an active teaching assignment for the selected programme and will implement first-come acceptance.

## Legacy behaviour

The old Admin Enrolments route redirects to the Lesson Requests queue. Cohort and legacy enrolment database structures are intentionally retained during the refactor but are no longer part of the new admin lesson-request review path.
