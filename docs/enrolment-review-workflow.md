# Enrolment Review Workflow

Parents must be signed in to submit the public enrolment form. Applications remain separate from accepted student records until an administrator approves them.

Approval requires one available cohort for every requested programme. PostgreSQL performs student creation/linking, programme enrolment, capacity checks, cohort placement, and application approval in one transaction.

Routes:

- `/enrolment`
- `/portal/parent/enrolments`
- `/portal/admin/enrolments`
- `/portal/admin/enrolments/[id]`
