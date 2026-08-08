# R4 — Lesson Assignments

An accepted enrolment now creates a persistent one-to-one `lesson_assignments` record.

The assignment links the original lesson request, teacher, student, parent and programme and snapshots the accepted schedule, duration and calculated lesson period. Creation is part of the same PostgreSQL transaction used to claim an open enrolment, so a successful teacher claim cannot exist without its assignment.

If the enrolment child does not already exist as a linked student, the transaction creates the student and parent relationship. Existing matched R3 requests are backfilled by the migration.

Teacher **My teaching** now reads from lesson assignments rather than cohorts. Parent **My enrolments** reads from the new lesson-request flow and shows matched teacher details. Admin enrolment details show the matched assignment.

Sessions remain cohort-backed in R4. R5 will re-parent sessions, attendance and homework to lesson assignments after this relationship is verified.
