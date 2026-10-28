# Customer Budget Targets Implementation Plan

> **For agentic workers:** Use independent file ownership for the schema/export and table presentation tasks; root integrates forms, filtering, persistence, and validation.

**Goal:** Expand customer budgets into filterable funding targets with manual funds-collected status.

**Architecture:** Backward-compatible optional metadata, shared Zod schema, pure filter/summary helpers, a controlled form dialog, and responsive table/cards. Continue saving through existing committed list and API/trial adapters.

**Tech Stack:** React, TypeScript, CSS Modules, Zod, Vitest, Playwright.

**Spec:** ../specs/2026-10-26-budget-targets-design.md

## Global Constraints

- Tercapai means dana terkumpul and is manually reversible.
- New Target/purpose/date/priority/description/status fields must survive trial/account persistence.
- Preserve old rows and notes; no invented creation dates for old records.
- Duplicate is a draft until saved; new id/date and reset status. Delete confirms.
- Icon actions need accessible names; full notes must remain available on touch/keyboard.
- Avoid page-wide horizontal overflow; use cards on mobile.

## Review Focus

- Invalid date/priority/amount rejected by account and trial validation.
- Failed save or revision conflict preserves draft and old data.
- Combined filters, empty results, overdue dates, and old missing fields behave consistently.
- Marking achieved moves the row out of the default pending filter without deleting data.
- Duplicate and delete never mutate the source before confirmation/save.

## Tasks

- [x] Define shared schema/types, validate metadata persistence, and update printable output.
- [x] Test and implement pure filtering, summary, and new/edit/duplicate construction helpers.
- [x] Implement responsive table/cards, description disclosure, and accessible icon/status actions.
- [x] Integrate form dialog, manual status, filters, metrics, duplicate draft, and confirmed delete.
- [x] Verify unit/API/trial tests, browser flows, mobile appearance, types/lint/format, and focused review.

Ruling: The user's confirmation of funds-collected semantics completes the proposed design. Continue implementation in the current local workspace, preserving unrelated edits and leaving work uncommitted for review.

Validation: 115 Vitest suites / 599 tests passed, including Premium API metadata round-trip, account/trial schema compatibility, filters, duplicate identity/status, and printable output. All five browser flows passed across runs; one status reload timed out during a concurrent build and passed in isolation afterward. Browser checks cover create/edit/reload, full descriptions, reversible collected status, duplicate draft/cancel/save, confirmed delete, old data, combined filters, and storage-failure draft retention. Inspected table/card screenshots at 1440/375/320px; confirmed no page overflow and actual description truncation. TypeScript, focused ESLint/Prettier, and production build passed. Reviewed integration boundaries and save/error flows locally after worker tasks ended.

Build artifacts remain in the ignored .next-reviews/budget-targets directory. Restored generated Next TypeScript imports and includes to the dev-server configuration afterward.
