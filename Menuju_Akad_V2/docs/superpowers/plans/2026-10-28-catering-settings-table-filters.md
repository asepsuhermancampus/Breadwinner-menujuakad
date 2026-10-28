# Catering persistence and column filtering plan

**Goal:** Persist calculation preferences, make numeric input clean, collect catering payment deadlines and selectable portions, and move budget filtering/sorting into the table columns.

**Approach:** Store one validated catering-settings resource per workspace or trial snapshot. Keep confirmed menu quantities as saved snapshots: choosing the current estimate fills portions explicitly; later guest-count changes must not silently reprice saved orders. Catering deadlines originate in catering; legacy budget deadlines are preserved until explicitly edited from the source. Customer notes and generated source details are separate budget fields.

## Tasks

- [x] Add failing account/trial settings persistence, deadline/note projection and column-filter/sort regressions.
- [x] Add settings schema/storage support and explicit save with dirty/error states; normalize number-only fields without spinners or leading zeroes.
- [x] Add guest-list context, explicit estimate/manual portion choice and payment deadline in menu forms/details.
- [x] Synchronize deadlines and actual notes while retaining full generated source details separately; render empty notes in italic.
- [x] Add column-level filtering and ascending/descending sorting for category, amount, purpose, deadline, priority, notes and status. Keep Kebutuhan plain. Preserve controls when results are empty, and support mobile layouts.
- [x] Verify unit tests, TypeScript, lint/format/architecture, production build and isolated browser flows; retain local port 3201 and exclude generated test paths.

## Important checks

- Settings survive refresh for real accounts and browser trials; failed/stale saves preserve draft data.
- Zero-count/manual input has no spinner or forced leading zero. No guest list must not invent a guest count.
- Saved orders and allocated savings never change automatically when the calculation changes.
- Deadlines follow source edits/clears, preserve legacy dates and accept valid past dates for overdue tracking; no fabricated deadline.
- No-note descriptions say Tidak ada catatan in italic while source metadata remains accessible.
- Column filters compose correctly; date/amount ranges, Indonesian string sorting, priority order, empty values and stable ties are tested.
- No sidebar restructuring, commit or push requested.

## Verification results

- Full unit suite: 148 files, 713 tests passed.
- Production build and TypeScript passed using isolated build output.
- Five production browser scenarios passed with isolated account storage and guest contexts.
- Browser checks covered refresh persistence, leading zero normalization, estimate/manual quantities, payment deadlines, italic empty notes, inline filters/sorts, empty results and mobile layout.
- Full lint passed with 17 existing warnings and no errors; architecture passed for 971 modules.
- Scoped changed-file formatting passed. Local port 3201 health returned HTTP 200. Generated build type paths restored.
