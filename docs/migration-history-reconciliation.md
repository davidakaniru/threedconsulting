# Migration History Reconciliation Before Production Automation

## Why this is required

The connected Supabase project is schema-current, but its applied migration version IDs do not line up with every file under `supabase/migrations` in this project snapshot. Supabase migration deployment compares migration **timestamps/version IDs**, not only migration names or SQL content. A normal `db push` can therefore report sync errors or attempt work that was already applied under a different version.

## Safe workflow

1. Work from the complete Git repository, not this partial transfer archive.
2. Back up the production database.
3. Link the Supabase CLI to the correct project.
4. Run `supabase migration list` and preserve the output for review.
5. Compare the live schema with the repository migration chain.
6. Use `supabase db pull` when the live schema is the known-good source that needs to be captured locally.
7. Use `supabase migration repair` only for migration-history records whose actual schema effect has already been independently verified. `migration repair` changes history tracking; it does not execute or undo the migration SQL.
8. Run `supabase db reset` locally, or create a disposable Supabase branch, to prove the reconciled chain can build the schema from scratch.
9. Only after that verification should CI/CD run `supabase db push` automatically.

Do not rename/delete migration history or mark versions applied merely to make the list look clean. The goal is a reproducible schema, not only matching history rows.
