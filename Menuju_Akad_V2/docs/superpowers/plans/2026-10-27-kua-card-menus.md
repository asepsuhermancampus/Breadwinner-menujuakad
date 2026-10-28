# KUA card action menus

Move reset and template release into a compact three-dot menu to the right of each card's progress count. Remove the global clear-checklist button and global reset controls. Reset affects only that card; release continues to remove only template-origin rows in that card, preserving custom documents. Both actions use confirmation and existing revision protection. Menus support keyboard navigation, outside dismissal, viewport bounds and focus restoration. Archived template rows remain releasable from the card even if no active rows remain.

Verify scoped reset, group isolation, menu position on mobile/desktop, keyboard operation, cancellation, failed-save retention, persistence and reapplication. Preserve the existing checklist/template layout.

Results: production build, 663 unit tests, scoped ESLint/format/architecture checks passed. Three card-menu browser tests passed after fixing menu placement during scroll; the three existing KUA flow tests also passed. Inspected mobile and desktop menu screenshots. Development type configuration restored after isolated builds.
