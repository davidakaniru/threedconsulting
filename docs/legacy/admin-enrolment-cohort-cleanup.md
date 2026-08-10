# Admin Enrolment & Cohort Cleanup

The Admin Portal now uses **Enrolments** as the user-facing name for the parent tutoring-request workflow. Internal `lesson_requests` table/module/API names are intentionally retained during the staged refactor.

## Routes

- `/portal/admin/enrolments` is the active admin admissions queue.
- `/portal/admin/enrolments/[id]` is the active review page.
- Legacy `/portal/admin/lesson-requests` routes redirect to the corresponding Enrolments routes.

## Cohorts

Cohorts have been removed from the Admin Portal navigation and active admin workflow. Programme details no longer expose cohort management, dashboard cohort metrics/capacity alerts are removed, and admin session screens no longer surface cohort filters or labels. The legacy database/module remains temporarily because teacher sessions are still internally cohort-backed until the later lesson-assignment migration.
