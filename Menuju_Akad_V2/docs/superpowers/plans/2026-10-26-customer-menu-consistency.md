# Customer Menu Consistency Implementation Plan

**Goal:** Unify customer menus with the approved finance styling and expose overflow destinations as feature tabs.

**Architecture:** Customer-scoped theme plus reusable controls/metric-card ornaments; route-backed feature tabs reuse existing Next.js pages and persistence. Fullscreen studio supplies guarded navigation inside its own header.

**Tech Stack:** Next.js App Router, React, CSS modules, existing SVG assets, Vitest/Playwright.

**Spec:** ../specs/2026-10-26-customer-menu-consistency.md

- [x] Shared customer-only theme/control markers and reusable summary/ornament primitives; preserve finance output and public/editor canvas.
- [x] Replace five sidebar overflow popups with route-backed feature tabs and correct active parent state; preserve all old destinations and studio exit guard.
- [x] Apply square cards, consistent summaries, compact actions and shared scrollbars across planning/task/KUA/moodboard/catering screens.
- [x] Apply matching layout and controls across overview/account/guests/invitations/catalog/wedding-kit and studio chrome.
- [x] Verify unit tests, scoped lint/types/format/architecture, production build, broad route/mobile screenshots and persistence/navigation regressions; review findings before completion.

Ruling: routed tabs are one feature navigation with deep links, rather than redirecting old URLs or mounting every editor at once. This preserves bookmarks, feature permissions and unsaved-draft boundaries. Ornaments apply to summary/feature cards, not form fields or data-table rows.

## Verification

- Vitest: 130 files / 646 tests passed.
- Production build and TypeScript passed; scoped ESLint, Prettier and architecture (891 modules, max 200 lines, no cycles/boundary failures) passed.
- Broad Playwright regression: 56/58 passed initially. The two failures were test assumptions about streamed not-found HTTP status and transient duplicate loading/main selectors. Both were corrected using bundled Next documentation and editor-ready navigation, with no changes to route capability behavior.
- Final build targeted run: all 7 tests passed, including both corrected tests, all five route-backed feature groups at desktop/mobile, studio unsaved-draft exit protection, and a fresh 22-route audit at 1440px and 375px (44 page checks, compact control measurements, no horizontal overflow or browser errors).
- Guest/account planning CRUD, finance allocation/reversal/PDF, KUA provenance and immutable main documents, vendor private quote permissions, account persistence, sidebar, header, scroll and viewport regressions passed in the broad run.
- Desktop/mobile screenshots inspected; final audit also confirmed square trial cards and green active guest/KUA navigation. Read-only review found no blockers; customer-scoped controls leave public pages and authored invitation previews unaffected.
- Build output was isolated and temporary Next type includes restored; no commit or deployment.

## 2026-10-27 Wedding Kit and heading follow-up

- Grouped features now render one H1 before the tab navigation. Their content PageHeading components inherit H2 through a UI-only heading context, with smaller subheading styling. A single flex layout controls 24px spacing and avoids doubled margins. Existing routes and capability checks remain unchanged.
- Studio navigation is below its H1 and keeps the original guarded exit callback. Locked studio also has a visible group heading; Wedding Kit has one visible H1 outside its feature lock.
- Live/trial Wedding Kit share two square bordered panels, matched desktop heights/padding, stacked mobile layout and an ornament on each main card. Shared preview removes the nested border/shadow and unwanted DOKUMEN RENCANA/A4/BAHASA INDONESIA caption. Trial preview lists its available sections. Export logic and generated document content are unchanged.
- Verified: 646 unit tests; final production build and TypeScript; scoped ESLint/Prettier and architecture (894 modules). Final targeted browser run covers five grouped destinations on desktop/mobile, H1-before-tabs geometry and one H1 per page, studio draft guard, 22-route audit at two widths, and trial/Premium Wedding Kit panels + document opening at 1440/375px. Screenshots inspected; review found no blockers.
