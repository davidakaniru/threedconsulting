# Class Sessions

Sessions are strictly online and belong to a `lesson_assignment`. Teachers can create and edit sessions only for their own active lesson assignments. A valid meeting link is required.

When a session becomes scheduled, PostgreSQL creates the pending attendance record for the assignment's child. Admins have read-only oversight at `/portal/admin/sessions`; teachers manage their sessions at `/portal/teacher/sessions`. Historical cohort-backed session rows may remain in the database, but the application only creates and lists lesson-assignment sessions.
