# RC-2 follow-up — Parent and student ownership

- Parent suspend/reactivate actions update the visible parent profile immediately without a manual refresh, while still invalidating parent list queries.
- Admin parent creation is disabled. Parent accounts originate from the enrolment flow. The legacy `/portal/admin/parents/new` path redirects to the parent list and the admin POST endpoint rejects creation.
- Admins may continue to view/edit parent accounts, manage linked-child relationships, resend invitations where applicable, and suspend/reactivate access.
- Student personal information (name, date of birth, gender) and profile photo are parent-managed.
- Admin student updates are restricted to admission date, student status, and administrative notes. Admission numbers remain system-generated.
- Admin student-photo upload is denied server-side.
- Parent child edits and photo uploads verify the `student_parents` relationship server-side before mutation.
- Parent-facing child profile payloads do not expose other linked guardian contact details.
- Parents can now maintain each child's `current_education_level` from the child profile. The student record is the source of truth for the child's current level; existing lesson assignments retain their historical level snapshots.
- Existing student levels were backfilled from the most recent available lesson assignment during migration.
- New lesson requests for an existing child now prefill the current class / education level from the student profile.
- The first parent-dashboard card now exposes a single `Actions` dropdown containing `Edit child profile` and `Request another lesson`.
