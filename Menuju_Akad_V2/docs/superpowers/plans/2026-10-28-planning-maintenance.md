# Planning Maintenance Implementation Plan

**Goal:** Extend the existing audited maintenance control to calendar, rundown, and emergency supplies.

**Architecture:** Register only these three resource kinds in a fixed shared catalog. Store independent status, version and audit in SQLite; enforce maintenance within the existing resource write transaction and on customer page rendering. Check the public, minimal status before trial saves. Expose changes exclusively through an authenticated superadmin endpoint.

**Scope:** Preserve existing task settings and data. Keep other features, finance, payments and public invitations outside this control until their dependencies are mapped. Allow authorized resource reads; do not delete existing data.

- [x] Verify independent status, audit, stale updates, write rejection and preservation of data.
- [x] Add server-side status, protected API, public status endpoint, and customer page behavior.
- [x] Add superadmin controls and trial-save checks for registered features.
- [ ] Run targeted browser tests, full unit suite, lint and build.
