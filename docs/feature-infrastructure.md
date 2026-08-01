# Phase 5.5 — Feature infrastructure

The completed Teachers module is now the reference shape for future domain modules.

## Shared utilities

- `createEntityQueryKeys()` standardises list/detail React Query cache keys.
- `normalizePagination()` owns page-size limits and PostgREST ranges.
- mapper helpers handle nullable text and one-to-one relation output.
- repository helpers sanitise PostgREST search filters.
- portal navigation is configuration-driven and contains optional future permission identifiers.

## Module boundaries

The root module barrel is client-safe. It exports components, hooks, schemas, constants and DTOs, but never repository/service files. Server code is imported explicitly through `@/modules/<entity>/server`.

Compatibility re-exports remain temporarily in the previous Teacher locations. New code should import from `@/modules/teachers` or `@/modules/teachers/server`.

## Deliberate non-abstraction

There is no generic CRUD repository class. Supabase queries differ significantly once joins, search and RLS enter the picture. Shared helpers cover proven repetition without hiding entity-specific queries or weakening generated database types.
