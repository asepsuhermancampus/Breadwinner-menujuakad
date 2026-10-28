# Catering tabs and connected expense budgets implementation plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task by task.

**Goal:** Separate catering estimation from saved-menu management, show menu names beside selected details, and centralize financial targets and completion in categorized budgets.

**Architecture:** Canonical expense rows are derived from saved catering and seserahan records with stable source references. Source saves synchronize budgets atomically, while finance allocations exclusively control completion. Existing records are synchronized on finance reads without duplicating targets, and trial storage follows the same domain rules in a single storage commit.

**Tech stack:** Existing Next.js/React, TypeScript, SQLite, Zod and trial local storage.

**Spec:** Current user request and existing catering readability plan. Sidebar restructuring remains deferred. An optional scope question was sent; pending clarification, the user's stated financial-centralization direction is interpreted as covering catering and seserahan, which both already store explicit quantities and prices. Vendor favorites/quotes are not treated as confirmed expenses.

## Constraints and review focus

- Preserve existing cards, white surfaces, primary-green SVG pattern, popup menu creation and data.
- Keep each module within the existing 200-line architecture limit.
- Preserve one source row per expense, stable IDs, manual budgets and financial history.
- Reject price/quantity changes or deletion of funded expenses until allocation is released; failures must roll back source and budget together.
- Protect linked source fields against forged direct finance edits; allow priority, purpose and due-date edits in Anggaran.
- Keep schema compatibility for legacy budgets with no category/source, and display them as Lainnya.
- Verify existing records, zero/large prices, multiple-vendor/per-person/total-package pricing, stale revisions, source removal, reverse allocations, trial quotas and both partner permissions.

## Tasks

- [x] Write failing category/filter and account/trial source-sync regression tests.
- [x] Add category/source metadata and shared expense projection/immutability rules.
- [x] Synchronize account source saves/finance reads and trial reads/commits atomically.
- [x] Add category column, filter and form; protect linked budget fields and keep status actions in Anggaran.
- [x] Add catering tabs and tab-aligned add button; implement names-only left panel and selected detail/status panel on the right.
- [x] Verify focused and full unit tests, TypeScript/lint/format/architecture, and browser flows with isolated guest/account test data. Inspect desktop/mobile layouts.

## Validation results

- Observed category/source synchronization tests fail before implementation; subsequent account and trial regressions passed.
- Full unit suite passed: 145 files / 708 tests. Covered legacy backfill, stable source IDs and ordering, complete long descriptions, manual records, package pricing, invalid prices, paid-source rollback, release/repricing, forged linked fields and metadata edits.
- Production build, TypeScript, scoped ESLint and architecture passed (960 modules, at most 200 lines each).
- A complete browser trial flow passed tabs/add-button placement, name-only navigation, full details, automatic categorized budgets, category filtering, read-only source fields, funding/status round trip, paid-edit rejection and release/repricing; desktop/mobile screenshots were inspected.
- Production browser account integration passed with its own SQLite/auth databases. Existing guest/account catering catalog and mixed pricing regressions both passed after adapting old selectors for the two-panel layout. Test data and screenshots remain isolated from customer records.
- Temporary Next-generated type paths are removed after the isolated build. No commit or push performed.

No commit or push is requested for this task.
