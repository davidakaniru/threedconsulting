# Current Product Model

The production workflow is one-to-one online tutoring.

1. A parent starts from **Enrol your child**. New parents create their account inside the same flow; signed-in parents skip account creation.
2. The enrolment captures the child, current education level, one subject/programme, preferred days, preferred time, duration, and an optional additional message.
3. Admin reviews and publishes the enrolment.
4. Only teachers with an active assignment to that programme can see the opportunity. The first eligible teacher to accept is matched atomically.
5. Acceptance creates or links the student record and creates a persistent `lesson_assignment` linking parent, child, teacher, programme, schedule, education-level snapshot, and lesson period.
6. Teacher sessions belong to the lesson assignment and attendance therefore targets the assigned child directly.
7. Parents manage the child's personal information, current education level and profile image. Admin manages admission-related information only.
8. Parents see active lesson details, upcoming sessions and attendance through the child switcher. A child may have multiple active lessons.
9. Admin monthly teacher reports are generated from lesson-assignment-backed sessions and are filtered by selected teacher and month.
10. Parent accounts originate through the enrolment flow. Teacher accounts originate through Admin invitation. Students originate through the enrolment/lesson-matching workflow.

Homework/assignments, messaging, announcements and cohort-based teaching are outside the current release scope. Historical cohort/homework tables and migrations may remain for database continuity but are not part of the active product model.
