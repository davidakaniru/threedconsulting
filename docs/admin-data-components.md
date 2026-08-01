# Admin data components

Phase 4.1C introduces reusable, typed data-display primitives under `src/components/admin/ui`.

## Core components

- `DataTable<T>` renders typed desktop rows and optional responsive mobile cards.
- `TableToolbar` composes search, filters and page actions.
- `SearchInput` is built on the shared `Input` component.
- `FilterSelect` is built on the shared `SelectField` component.
- `Pagination` provides accessible page navigation.
- `RowActions` provides a Radix dropdown for per-record actions.
- `TableLoading` and `TableError` standardize request states.

## Usage principle

Admin tools must reuse existing form fields. Raw `<input>` and `<select>` controls should not be introduced when the shared `Input`, `SelectField`, or another established field component supports the interaction.

The Teachers table is the first reference implementation and includes a responsive mobile record card, deferred search queries, status filtering, pagination and row actions.

`DataTable<T>` also supports optional controlled row selection through `selectedIds` and `onSelectionChange`. `BulkActionBar` can then present real bulk operations when a module's backend supports them. Selection is intentionally not enabled on Teachers yet because no bulk teacher operation has been implemented.
