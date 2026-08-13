# Migration Reconciliation Manifest

Compared against the connected Supabase project on 2026-08-13.

| Migration | Local version | Remote version | State |
|---|---:|---:|---|
| `create_auth_profiles_foundation` | 20260729213131 | 20260729213131 | Exact |
| `extend_profiles_for_account_management` | 20260731065512 | 20260731065512 | Exact |
| `create_teachers_foundation` | 20260731090000 | 20260731084851 | Timestamp mismatch |
| `allow_admin_teacher_profile_reads` | — | 20260731085129 | Remote-only corrective |
| `remove_recursive_admin_profile_policy` | — | 20260731085152 | Remote-only corrective |
| `default_teacher_hire_date` | 20260801060000 | — | Local-only history; live effect verified |
| `create_students_foundation` | 20260801090000 | 20260801084414 | Timestamp mismatch |
| `generate_student_admission_numbers` | — | 20260801085026 | Remote-only migration |
| `extend_students_with_middle_name_and_notes` | 20260801091000 | 20260801090246 | Timestamp mismatch |
| `fix_student_admission_number_ambiguity` | 20260801160000 | 20260801151626 | Timestamp mismatch |
| `create_parent_management_and_audit_foundation` | 20260801180500 | 20260801162301 | Timestamp mismatch |
| `sync_self_registered_parent_domain_records` | 20260801191500 | 20260801191012 | Timestamp mismatch |
| `create_programme_management` | 20260802210000 | 20260802210800 | Timestamp mismatch |
| `create_teaching_assignments` | 20260803043000 | 20260803043138 | Timestamp mismatch |
| `create_cohort_management` | 20260803053000 | 20260803052504 | Timestamp mismatch |
| `create_enrolment_review_workflow` | 20260803143000 | 20260803133424 | Timestamp mismatch |
| `repair_parent_domain_records_for_enrolments` | 20260803154500 | 20260803135927 | Timestamp mismatch |
| `create_class_sessions_and_attendance_foundation` | 20260803180000 | 20260803181058 | Timestamp mismatch |
| `add_transactional_attendance_updates` | 20260804050000 | 20260803194958 | Timestamp mismatch |
| `create_homework_management` | 20260804100000 | 20260804070944 | Timestamp mismatch |
| `create_organisation_settings` | — | 20260804204208 | Remote-only migration |
| `create_lesson_requests` | 20260807060000 | 20260807054615 | Timestamp mismatch |
| `claim_open_lesson_request` | 20260807190000 | 20260807191915 | Timestamp mismatch |
| `fix_claim_open_lesson_request_eligibility` | — | 20260807191946 | Remote-only corrective |
| `claim_open_lesson_request_audit` | — | 20260807192008 | Remote-only corrective |
| `fix_claim_open_lesson_request_audit` | — | 20260807192034 | Remote-only corrective |
| `claim_open_lesson_request_final` | — | 20260807192109 | Remote-only corrective |
| `create_lesson_assignments` | 20260807200000 | 20260807200735 | Timestamp mismatch |
| `reparent_sessions_to_lesson_assignments` | 20260808043000 | 20260808041943 | Timestamp mismatch |
| `add_current_education_level_to_enrolments` | 20260808082000 | 20260808071929 | Timestamp mismatch |
| `auto_generate_teacher_employee_id` | — | 20260810053619 | Remote-only migration |
| `add_current_education_level_to_students` | 20260813050300 | 20260813050344 | Timestamp mismatch |
| `create_contact_inquiries` | 20260813071905 | 20260813071905 | Exact |

## Interpretation

- Exact rows require no history work.
- Timestamp mismatches may represent equivalent logical migrations, but their SQL must be compared before any `migration repair` action.
- Remote-only corrective migrations must not be discarded just because later local SQL appears to contain their final effect.
- `default_teacher_hire_date` is local-only in migration history, but the live `teachers.hire_date` default was independently verified as `CURRENT_DATE`; this is a concrete example of why history and schema must be reconciled separately.
- The student admission-number trigger and teacher automatic employee-ID default were also verified live.

## Recommended reconciliation strategy

Do not rename the current migration files in-place on the release branch. Create a dedicated `migration-reconcile` Git branch, pull the known-good live schema, and produce a canonical migration chain that can rebuild a fresh database. Once that chain succeeds on a local/disposable database, repair only the remote/local history entries necessary to make `supabase migration list` agree.