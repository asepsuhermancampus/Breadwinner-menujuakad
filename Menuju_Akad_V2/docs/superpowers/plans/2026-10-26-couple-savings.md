# Couple Savings Implementation Plan

> **For agentic workers:** Shared types are defined in finance-ledger.ts. Keep backend/reducer, savings/report UI, and root integration ownership separate.

**Goal:** Couple savings with own-side manual actions, shared budget allocation, complete history and readable PDF report.

**Architecture:** Authenticated command API with a pure ledger reducer; atomic storage of ledger and existing budget resource. A shared client adapter covers real account and explicitly marked trial simulation. Existing budget table/form remains integrated.

**Tech Stack:** Next.js, React, TypeScript, Zod, SQLite, Vitest, Playwright, printable HTML/PDF.

**Spec:** ../specs/2026-10-26-couple-savings-design.md

## Tasks

- [x] Shared ledger schema/reducer, authenticated service/route, generic API guard and security tests.
- [x] Savings cards, adjustment form, compact histories, currency formatting and PDF report.
- [x] Trial atomic storage and account refresh/idempotent adapter.
- [x] Integrate tabs, balances/summary, allocation/reversal dialogs and funded edit/delete safeguards.
- [x] Verify data/API/unit tests, browser role and allocation flows, desktop/mobile appearance, lint/types/build.

User clarified that budget spending may use either side without approval; only manual savings adjustments are restricted to the account's own side. Existing unrelated changes remain intact; no commits or deployment.

## Verification

- Vitest: 123 files, 635 tests passed.
- Production build and TypeScript passed with isolated output directory.
- Scoped ESLint and Prettier passed; architecture check passed (873 modules, max 200 lines, boundaries and cycles).
- Playwright on the production build with isolated databases: 8 tests passed, including two real accounts, cross-side manual denial, cross-side allocation without approval, reversal, trial storage failure and PDF quota, and budget regressions.
- Desktop and mobile screenshots inspected; two columns on desktop, stacked cards without horizontal overflow on mobile.
- Read-only review completed; pre-ledger generic completion bypass and shared trial PDF quota findings fixed and covered by regressions.

Summary presentation follow-up: create-budget button and budget list appear only in Anggaran. Removed the funding-readiness CTA panel. Both rows of summary cards share the savings card stylesheet, square corners, uppercase label typography and matching amounts; Total tabungan tersedia and Total target retain the accented border/background. Removed unused CTA/progress CSS. Desktop/mobile browser checks passed for all six cards and tab-specific button visibility. Five budget browser regressions, scoped lint/formatting, TypeScript and architecture check passed.

The existing trial quota browser test was updated for the dedicated Anggaran tab, current target input/row actions and scoped modal close control; five successful saves and sixth-save denial with preserved draft passed, with a separate task quota still available.

Ornament/toolbar follow-up: the create-budget action now sits at the right of the finance tab toolbar with matching 40px height, outside the semantic tablist. Narrow layouts wrap the right-aligned action without horizontal overflow. Four supplied corner PNGs were traced into real SVG paths (100% binary-alpha match at source resolution), normalized to the upper-right corner, and applied as palette-colored CSS masks in a fixed varied sequence across six Ringkasan cards only. Ornaments are decorative/hidden from accessibility, pointer-transparent and layered behind content with label spacing. Desktop/mobile browser checks validated all four SVG assets, six ornaments, action alignment, working budget dialog and no overflow. Screenshots inspected; scoped ESLint/Prettier, TypeScript and architecture (884 modules) passed.

Extended the 104px corner ornaments to the three budget balance cards and three savings cards (combined wide balance plus both partners). Savings-specific layering/spacing keeps the PDF action and own-account badge clear of the ornament; mobile PDF action wraps below the balance content. Browser checks passed for all tab ornament counts, PDF generation, desktop/mobile non-overlap and no horizontal overflow. Screenshots inspected; scoped formatting/lint, TypeScript and architecture passed.

Compact controls follow-up: shared styling now gives finance tabs, create-budget, PDF, savings adjustments and status filters a 36px height, 13px font and 6px/12px padding. Selected status filters use green fill/soft white text with visible green keyboard focus. History reuses the sidebar's global app-scroll class (5px Chromium scrollbar). Own-account savings uses flower #3. PDF hover changes only the border to green while preserving its white surface. Browser measurements confirmed control sizes, selected colors, unchanged PDF hover background, working report, shared scrollbar, ornament variant and no mobile overflow; screenshots inspected. Scoped lint/formatting, TypeScript and architecture passed.
