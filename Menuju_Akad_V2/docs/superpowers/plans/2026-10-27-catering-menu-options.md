# Catering menu options implementation plan

**Goal:** Let customers record individual dishes from categorized suggestions or a whole vendor package, using guest quotas to avoid repeated entry.

**Architecture:** Keep catering in the existing versioned planning resource for account and trial. Add optional metadata for backward compatibility; calculate package totals explicitly. Dedicated catering dialog supports a batch of draft dishes and one atomic save. Read guest quotas only on the catering route and share calculator estimates with the dialog.

**Tech stack:** Next.js, React, Zod, existing Dialog/Field/Button and Vitest/Playwright.

**Design decisions:** Suggestions are editable examples without assumed prices. Categories: buffet, stalls, dessert, drinks, snacks, custom. One click selects a dish; repeated clicks do not create duplicates. Packages support total price or price per guest and included dish names. Guest estimates use CRM invitation count and summed quota plus the calculator's visible buffer; manual entry remains available. Saved portions are snapshots and never silently change when guest data changes.

## Tasks

- [x] Test and implement compatible catering schema, cost calculation, and guest quota aggregation. Cover legacy items, mixed package/unit totals, invalid input, empty guest list.
- [x] Implement categorized editable menu selection and package dialog; retain drafts on failed saves, prevent repeated submission, preserve metadata on edit.
- [x] Connect trial/account guest data and shared calculator estimates; present package details and accurate costs in saved list.
- [x] Verify unit tests, types, lint/architecture, browser create/edit/reload/delete, mobile layout and calculator synchronization.

## Review focus

- Total package prices must never be multiplied by guest counts.
- Changing mode must not discard an existing item's identity or leave stale pricing metadata.
- Guest loading/failure must allow manual calculation and explain the fallback.
- Bulk selection must save once and not duplicate suggested dishes.
- Existing records without metadata must retain prior totals and remain editable.

## Verification

- 649 unit tests across 131 files passed.
- Production build passed using the separate customer-consistency output directory; local development configuration restored afterward.
- Scoped ESLint, TypeScript and architecture checks passed (902 modules).
- Four browser tests passed on trial and account modes with an isolated database. These cover multi-category selection, duplicate prevention, formatted prices, guest quota defaults, manual override, legacy totals, package total/per-guest costs, editing, reload persistence, deletion, mobile width, Escape and focus restoration.
- Inspected desktop and mobile popup screenshots. No deployment or customer account data changes.
