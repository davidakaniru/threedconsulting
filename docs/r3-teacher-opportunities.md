# R3 — Teacher opportunities and first-come acceptance

Published enrolments are visible only to teachers with an active teaching assignment for the selected programme.

Teachers use `/portal/teacher/opportunities` to review eligible enrolments and accept one. Acceptance is performed by the PostgreSQL `claim_open_lesson_request` function, whose conditional update guarantees that only the first eligible teacher can claim an open enrolment. Later attempts receive a conflict response.

Accepted enrolments appear under `/portal/teacher/teaching`. R4 will formalize these matches as ongoing lesson assignments and re-parent sessions away from legacy cohorts.
