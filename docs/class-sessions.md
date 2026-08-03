# Class Sessions

Sessions are strictly online and belong to a cohort. Teachers can create and edit sessions only for cohorts attached to their active teaching assignments. A valid HTTPS meeting link is required.

Statuses: draft, scheduled, completed, cancelled.

When a session becomes scheduled, PostgreSQL creates pending attendance rows for every active cohort member. Admins have read-only oversight at `/portal/admin/sessions`; teachers manage their sessions at `/portal/teacher/sessions`.
