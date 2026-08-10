# Current Product Model

The production workflow is one-to-one online tutoring.

1. A parent starts from **Enrol your child**. New parents create their account inside the same flow; signed-in parents skip account creation.
2. The enrolment captures the child, one subject/programme, preferred days, preferred time, duration, and an optional additional message.
3. Admin reviews and publishes the enrolment.
4. Only teachers with an active assignment to that programme can see the opportunity. The first eligible teacher to accept is matched atomically.
5. Acceptance creates a persistent `lesson_assignment` linking parent, child, teacher, programme, schedule, and lesson period.
6. Teacher sessions belong to the lesson assignment. Attendance and homework therefore target the assigned child directly.
7. Parents see active lesson details, upcoming sessions, attendance, and homework through the child switcher.
8. Admin monthly teacher reports are generated from lesson-assignment-backed sessions.

Cohort tables and historical migrations remain only for database continuity. Cohorts are not part of the active application model.
