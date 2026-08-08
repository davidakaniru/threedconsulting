# RC Cleanup

This checkpoint removes the remaining cohort-era application paths after the tutoring-marketplace refactor.

- Teacher and parent portal sections now have role-level layouts, preventing cross-role page access before page data is evaluated.
- Teacher Dashboard uses active lesson assignments instead of cohorts.
- Admin Dashboard today's-session data uses lesson assignments.
- Teacher session/homework API ownership checks use the lesson-assignment teacher.
- Dormant cohort CRUD APIs and the obsolete pre-R1 enrolment APIs/modules were removed.
- Session and homework domain types no longer expose synthetic cohort compatibility objects.
- Historical cohort database columns/types and migrations are retained to preserve old records and migration history.
- Legacy browser routes such as `/portal/admin/cohorts` remain redirect-only for saved-link compatibility; they do not expose cohort functionality.
