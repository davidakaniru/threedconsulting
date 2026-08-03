# Admin dashboard metrics

The Admin dashboard uses `getAdminDashboardMetrics()` from
`src/modules/dashboard/server/dashboard.service.ts`.

The service aggregates the existing domain metric services concurrently:

- `getTeacherMetrics()`
- `getStudentMetrics()`
- `getParentMetrics()`

Each domain remains responsible for its own Supabase exact-count queries. This
keeps the dashboard totals consistent with the metric cards shown on the
Teachers, Students and Parents pages and avoids placeholder or duplicated count
logic.
