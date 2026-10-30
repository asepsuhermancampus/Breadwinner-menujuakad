# Task Maintenance Control Implementation Plan

**Goal:** Give the superadmin a safe first feature-maintenance control for customer tasks.

**Architecture:** Persist a global active/maintenance setting and an append-only audit record in the existing workspace database. A guarded superadmin endpoint changes it with optimistic concurrency; the task page displays maintenance, and the resource service rejects task writes while preserving reads and data. Existing authorization and plan rules remain in force. Only tasks are registered until other features and entry points are individually mapped.

**Tech stack:** Next.js, React, SQLite, TypeScript, Vitest.

**Spec:** `ANALISIS-SIDEBAR-DAN-SUPERADMIN.md`, sections 8 and 9.

## Checks

- [x] Test persistence, stale updates, audit, and blocked writes with preserved data.
- [x] Implement the database-backed setting and guarded server-side task write enforcement.
- [x] Add a superadmin-only endpoint and page with a reason, current version, and clear scope.
- [x] Display maintenance on the task page for both guest and account users; preserve data.
- [ ] Test authorization, origin validation, customer behavior, and run the project checks.

## Constraints

This first slice does not hide tasks, control other modules, alter payments or public invitation endpoints, or grant new permissions. Existing data remains readable through authorized APIs and export. Configuration is global within the current SQLite deployment; multi-instance distribution is not promised.
