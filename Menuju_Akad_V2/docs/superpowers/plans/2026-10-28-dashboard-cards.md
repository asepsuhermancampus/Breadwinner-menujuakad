# Dashboard Card Controls Implementation Plan

**Goal:** Let superadmins control visibility of registered dashboard metric cards for guest, owner and partner audiences.

**Architecture:** A fixed card catalog and server-side SQLite settings provide safe defaults. Each card/audience setting has a version and audited updates. A superadmin-only API and editor change presentation; dashboard rendering receives the filtered card identifiers from the server. This does not grant or revoke access to underlying features or data.

- [x] Test defaults, audience isolation, stale updates, audit and authorization.
- [x] Implement the registered card settings and guarded API.
- [x] Apply settings on dashboard and add clear superadmin controls.
- [x] Run unit, UI, lint and build verification.
