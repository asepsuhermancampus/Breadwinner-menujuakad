# Account nicknames and button text

User request: retain complete names in account settings, add a nickname for each partner, and use nicknames throughout customer-facing dashboard/finance displays. Keep existing records usable until nicknames are supplied. Green filled buttons use harmonious soft white text while retaining legibility.

- Add optional persisted nickname fields with an idempotent migration and backward-compatible updates.
- Extend the live account form; reuse one display-name helper in header, greeting and task assignments.
- Derive finance labels from the account-to-side binding, never assume the workspace owner is male. Reflect profile renames in cards, source confirmation and report without changing transaction ownership or stored receipts.
- Adjust shared primary button colors, preserving dark text for light secondary controls.
- Verify migrations/validation/name mapping/report escaping, real account save/reload and cross-page labels, colors, lint, architecture and build.

Completed: 128 Vitest files / 642 tests passed; 9 browser tests passed on production build with isolated database, including nickname save/reload, female-owner side mapping, renamed partner, header/greeting and PDF labels, mobile overflow and existing savings/budget regressions. Production build/TypeScript, scoped ESLint/Prettier and architecture check (881 modules) passed. Screenshots inspected. Soft-white #f4fbf7 on emerald #087f5b has 4.762:1 text contrast, hover #066b4c has 6.217:1. Active finance tab hover retains a dark green background. Review found no blockers.

Follow-up: combined names now place bride first in the shared customer header, avatars and dashboard greeting, using active account-to-savings-side bindings for either owner role. Claiming a side refreshes shared header data. Existing individual account fields and the requested financial card positions retain their meaning. Local Suep/Latifah profile was verified read-only to resolve to Latifah & Suep. Verification: 129 unit files / 644 tests; 11 browser tests including both owner roles; production build/TypeScript, scoped ESLint/formatting and architecture (883 modules) passed.
