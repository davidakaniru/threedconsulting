# Teacher Management

Phase 5 establishes the first complete business module.

## Module boundary

Teacher application types, schemas, constants, mapping and server logic live under `src/modules/teachers`. Legacy exports remain temporarily as compatibility shims while imports migrate to the module boundary.

## Lifecycle model

Employment status (`active`, `on_leave`, `former`) is independent from profile account status (`active`, `inactive`, `suspended`) and onboarding status (`invited`, `active`). No teacher is destructively deleted because future class, attendance and reporting records will depend on this history.

## Activation email resend

The resend action uses Supabase password recovery for an existing invited account and redirects to `/auth/confirm?next=/set-password`. Configure the hosted **Recovery** email template so its link uses `TokenHash`, `type=recovery`, and the requested redirect. The set-password endpoint still verifies that the account belongs to a teacher whose onboarding status is `invited`.

## Routes

- `/portal/admin/teachers`
- `/portal/admin/teachers/new`
- `/portal/admin/teachers/[id]`
- `/portal/admin/teachers/[id]/edit`

## API

- `GET/POST /api/admin/teachers`
- `GET/PATCH /api/admin/teachers/[id]`
- `POST /api/admin/teachers/[id]/actions`
