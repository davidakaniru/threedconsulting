# RC-2 — End-to-End QA & UX Polish

This release-candidate pass intentionally adds no new product scope. It focuses on user-facing consistency and resilience across the Admin, Teacher, and Parent portals.

## Changes in this checkpoint
- Corrected portal top-bar context for role-specific `/new` routes instead of labelling every creation screen as **Add teacher**.
- Normalized visible enrolment terminology so internal `lesson_request` naming no longer leaks into the enrolment form or Admin recent activity.
- Added portal-level loading, error-recovery, and not-found states.
- Preserved legacy redirect routes and database compatibility records; no destructive schema cleanup was performed.
- Homework remains out of scope for the current release.

## RC-2 manual QA matrix
1. Parent: new-account enrolment, signed-in existing-child enrolment, child switcher, multiple active lessons, join-window enforcement.
2. Teacher: dashboard limits, lessons tabs and availability badge, opportunity acceptance, session creation/update, attendance.
3. Admin: enrolment review/publish, teacher create/programme management/delete guard, sessions, teacher report filters, dashboard caps.
4. Cross-role: role guards, logout/login transitions, empty states, error recovery, responsive sidebar/navigation.
