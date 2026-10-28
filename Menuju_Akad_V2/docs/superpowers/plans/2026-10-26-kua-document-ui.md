# KUA document UI implementation plan

**Goal:** Give KUA document creation a clean, modern inline card and replace row edit/delete text with accessible icons.

**Architecture:** Apply scoped CSS Modules to the document variant of CustomerNotes and DocumentEditForm. Retain existing committed updates, validation, field reset, completion, editing conflict checks, and finance presentation. Use the existing Icon and Button components.

- [x] Style the document creation card, field helper, aligned add button, and responsive document rows.
- [x] Replace document edit/delete text with icons and contextual accessible names. Style the existing editor consistently.
- [x] Update the affected existing edit-target browser test. Verify add/edit/complete/delete and reload persistence in a browser, including narrow-screen layout. Confirm save failure handlers remain unchanged in the diff.
- [x] Run focused lint, architecture, TypeScript/build and relevant existing browser coverage.

Use the current workspace as authorized. This is a visual change; no storage, entitlement or API changes are needed.

Validation: production build/TypeScript, focused ESLint and architecture checks passed. Manual browser workflows passed at 1600px and 375px, with screenshots inspected. Three existing browser tests passed: switching KUA edit targets, account document persistence beyond trial limits, and cross-tab logout isolation. Icon buttons have contextual accessible names, native titles, and visible keyboard focus.
