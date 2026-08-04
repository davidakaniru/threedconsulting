# Teacher Dashboard

The Teacher Portal dashboard is the operational landing page for authenticated teachers.

It aggregates existing teaching data without introducing a new database table:

- active teaching assignments
- open and active cohorts
- upcoming scheduled sessions
- sessions with pending attendance
- published homework

## Server aggregation

`getTeacherDashboard(teacherId)` loads the teacher's assignments, cohorts, sessions, and homework concurrently. The dashboard remains scoped to the authenticated teacher through existing service filters and ownership rules.

## Primary actions

Teachers can create sessions, take attendance, create homework, and open their cohorts directly from the dashboard.
