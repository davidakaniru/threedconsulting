# Cohort Management

Cohorts are learner groups attached to a teaching assignment. Programme and teacher details are inherited through the assignment. Cohort codes are generated in PostgreSQL (for example `MAT-001`). Student membership is intentionally deferred to the enrolment review workflow so placements and transfers retain history.

## Routes

- `/portal/admin/cohorts`
- `/portal/admin/cohorts/new`
- `/portal/admin/cohorts/[id]`
- `/portal/admin/cohorts/[id]/edit`
- `/portal/teacher/cohorts`

## Lifecycle

`draft` → `open` → `active` → `completed` → `archived`
