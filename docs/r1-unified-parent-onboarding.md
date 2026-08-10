# R1 — Unified Parent Onboarding + Lesson Request

The public **Enrol your child** journey is now the primary parent acquisition flow. New parents create their account inside the same multi-step experience used to submit a lesson request. Signed-in parents skip account creation.

A lesson request records the child, one subject/programme, one or more preferred weekdays (Monday–Saturday), preferred time, requested duration in months, and an optional additional message. New requests start as `pending_review` for the R2 admin publishing workflow.

Cohort and legacy enrolment structures remain in the database for safe migration, but the public enrolment path no longer depends on them. `/register` redirects to `/enrolment`.
