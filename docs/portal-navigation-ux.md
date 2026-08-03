# Portal navigation UX

## Clickable records

`DataTable` accepts an optional `getRowHref` callback. When supplied, desktop rows and mobile record cards navigate to the entity details page on click or keyboard activation.

Interactive controls inside a row—links, buttons, checkboxes, inputs, selects and menu items—are excluded from row navigation so context menus and selection remain independent.

## Back navigation

`PageBackButton` is the shared top-left navigation control for entity create, details and edit pages. It calls `router.back()` so the user returns to the exact previous list, filter or parent context rather than a hard-coded route.
