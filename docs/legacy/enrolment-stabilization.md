# Enrolment workflow stabilization

This checkpoint adds three resilience and UX fixes:

1. Parent enrolment submission calls `ensureParentRecord()` before inserting an application. This repairs a missing parent-domain row without relying exclusively on the Auth signup trigger.
2. Cohort detail responses now include joined student membership records from `cohort_students` and `students`.
3. Successful application approval invalidates enrolment, cohort, student, and programme query caches so affected tables and detail pages refresh immediately.
