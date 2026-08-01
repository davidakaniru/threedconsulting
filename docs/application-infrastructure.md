# Application Infrastructure

Phase 2.5 establishes conventions that every feature module should reuse.

## API responses

Successful routes return `{ success: true, data }`. Failed routes return
`{ success: false, error: { code, message, details? } }`.

Use `apiSuccess` and `apiError` from `src/lib/api/responses.ts` in route handlers.

## Client requests

Use the shared Axios instance from `src/lib/api/client.ts`. It supplies the API
base URL, JSON headers, credentials, request IDs, timeout, and typed error mapping.
Do not create feature-specific Axios instances.

## Query conventions

Create query keys in `src/lib/query/query-keys.ts`. React Query defaults live in
`src/lib/query/query-client.ts`; feature hooks should override them only when the
resource has a concrete reason to behave differently.

## Environment variables

Access Supabase public configuration through `getPublicEnvironment()` rather than
reading `process.env` throughout the application. Copy `.env.example` to
`.env.local` and fill in the project values.

## Shared constants

Database-backed roles and statuses are exposed from `src/lib/constants/auth.ts`.
Keep route paths and repeated domain constants in dedicated constant modules rather
than scattering string literals through components and services.
