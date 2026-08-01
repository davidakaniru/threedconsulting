# Admin UI foundation

Phase 4.1B establishes reusable presentation primitives for portal modules.

## Components

All components are exported from `@/components/admin/ui`.

- `AdminPage`: consistent maximum width and vertical rhythm.
- `PageHeader`: title, description, optional breadcrumbs, icon and actions.
- `MetricGrid`: responsive metric layout.
- `MetricCard`: metric value, helper text, trend and optional action.
- `SectionCard`: structured card with optional header, action and footer.
- `StatusBadge`: shared visual status vocabulary.
- `EmptyState`: reusable no-data/no-results state.
- `LoadingState`: list and card skeletons.
- `InfoCard`: contextual information or notices.
- `QuickAction`: navigational action card.
- `ConfirmDialog`: reusable confirmation for destructive or sensitive actions.

## Page convention

Portal management pages should generally follow:

1. `PageHeader`
2. `MetricGrid` where metrics add useful context
3. Toolbar/data controls (Phase 4.1C)
4. `SectionCard` containing the primary content
5. Pagination or footer actions

Keep domain logic outside these components. The same primitives should support teachers, students, parents, classes, events, enrolments and payments.
