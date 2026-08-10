# Pre-RC2 — Teacher account deletion

Admins can permanently delete a teacher from the teacher profile.

Deletion is intentionally guarded:
- programme-only teaching assignments are removed automatically;
- teachers with lesson assignments, matched enrolments, sessions, or legacy cohort history cannot be hard-deleted;
- for teachers with history, use **Mark former** and suspend account access so operational/audit history remains intact;
- successful deletion removes the Supabase Auth user, which cascades through the profile/teacher account records;
- an audit event is recorded before deletion.
