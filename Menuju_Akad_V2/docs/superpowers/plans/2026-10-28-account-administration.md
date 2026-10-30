# Account Administration Implementation Plan

**Goal:** Allow a superadmin to manage customer and admin account roles and active status with audit and session revocation.

**Architecture:** A server-side transactional account operation validates the current state, protects superadmin accounts and the acting identity, records before/after and reason, and deletes the target's sessions. A same-origin, superadmin-only API exposes the operation; a confirmation form in the account directory provides explicit controls. Customer data and workspace records are retained.

- [x] Test role and status changes, authorization, stale edits, protected identities, sessions and audit.
- [x] Implement transactional operations and the protected API.
- [x] Add an understandable account management form and error recovery.
- [x] Verify unit, browser, lint and build results.
