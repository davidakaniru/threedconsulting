# Domain module blueprint

Use this structure for business modules after Teachers:

```text
modules/<entity>/
├── components/       # Entity-specific UI
├── constants/        # Labels, statuses, options
├── hooks/            # React Query hooks; client-safe
├── schemas/          # Yup request/form schemas
├── server/           # Repository, mapper and service; server-only imports
├── types/            # Application DTOs and domain unions
└── index.ts          # Public client-safe exports only
```

Rules:

1. Database rows remain inside `server/`.
2. The mapper converts database snake_case rows into application camelCase DTOs.
3. Repositories perform Supabase calls but do not make HTTP decisions.
4. Services enforce business rules and translate failures into `ApiError`.
5. Route handlers validate HTTP input and call services.
6. Hooks call route handlers and own cache invalidation.
7. `index.ts` must not export server files. Server Components and route handlers import from `@/modules/<entity>/server`.
8. Reuse shared pagination, query-key, mapper and repository helpers only when the behaviour is genuinely common.
