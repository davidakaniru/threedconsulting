# Migration History Reconciliation Before Production Automation

## Current state

The connected Supabase project is schema-current and the latest `create_contact_inquiries` migration has been applied. However, older migration **version IDs/timestamps** in the live project do not line up with every SQL filename in this transfer snapshot. The live project also contains corrective migrations that are not represented one-for-one by local files.

This is a history/reproducibility problem, not evidence that the live schema is currently missing those features.

## Rule

Do **not** run `supabase db push` against the live project from the current migration folder until the complete Git repository's history has been reconciled.

## Reconciliation procedure

1. Work from the complete Git repository and create a production database backup.
2. Link the Supabase CLI to the correct project.
3. Save the output of:
   `supabase migration list`
4. Treat the live production schema as the known-good schema for this release.
5. Compare each local migration version with the remote migration list. Do not match by filename/name alone.
6. Pull the remote schema into a safe local reconciliation branch with the Supabase CLI when needed (`supabase db pull`). Do not overwrite the release branch blindly.
7. For a local migration whose schema effect is **already present and independently verified** in production, use `supabase migration repair` only to reconcile the migration-history record. Repair changes migration tracking; it does not execute/undo the SQL.
8. Preserve remote corrective migrations unless their effects have been intentionally folded into a new reproducible baseline.
9. After history alignment, prove reproducibility using either:
   - `supabase db reset` against a local Supabase stack, or
   - a disposable Supabase development branch.
   A fresh database must reach the same expected schema from the reconciled chain.
10. Re-run `supabase migration list`. Local and remote histories intended for production automation must now agree.
11. Only then enable/use `supabase db push` in deployment or CI.

## Verification points before repairing history

For high-risk historical migrations, verify the actual live object rather than assuming it exists because the feature works. Examples include generated teacher IDs/defaults, student admission-number triggers, lesson-claim RPCs, RLS policies, and student current-education-level columns.

During this release pass, the connected project was checked to confirm that the teacher `employee_id` default is `private.next_teacher_employee_id()`, teacher `hire_date` defaults to `CURRENT_DATE`, and the student admission-number trigger exists. These checks support the conclusion that the live schema contains effects represented by historical local migrations even where timestamps differ.

## New inquiry migration

`create_contact_inquiries` was applied directly to the connected project during this pass and its SQL is included in `supabase/migrations` in this candidate. Do not reapply it manually; include its version in the migration-history comparison/reconciliation.

The goal is not merely a migration list that looks clean. The goal is a chain that can recreate the production schema reliably from an empty database.
