# Registration, feature locks, and KlikQRIS rejection handling

## Requirements and implementation

- Preserve the shared login and canonical account/session implementation from the other CLI.
- Manual registration keeps email, password, and password confirmation. On success it clears the password fields, shows confirmation, and redirects to `/login` after three seconds without creating a session. Google remains available on both login and register pages.
- Keep the shared guest/account SaaS shell and the previously approved five local trial saves per feature. The optional question about changing the guest entitlement policy has not been answered; the prior policy remains in effect.
- Signed-in accounts see actual feature controls under a slight blur, with an inert, screen-reader-hidden background and a centered lock card. Moodboard, Studio, PDF, Premium templates, multi-invitation, custom domain, and priority support follow package capabilities. Standard support remains usable. Non-owner domain restrictions explain the role requirement rather than suggesting another purchase.
- Locked Studio uses an empty customer editor without loading paid account resources or saving a local draft. Existing server-side entitlement and role checks remain authoritative.
- The provider rejected Lifetime creation with HTTP 422 and `Nominal transaksi maksimal adalah Rp 300.000.` The discounted base amount is Rp379.050. The client recognizes only this verified response shape and returns a safe, actionable message without reflecting arbitrary provider content.
- A definitively rejected creation releases the new reservation and restores the previous pending, unexpired claim if there is no newer active reservation. Network failures and ambiguous status errors remain unknown. Paid invoices are never restored or cancelled by this path.
- Customer browser tests now isolate canonical auth and reviews databases as well as payments. Auth browser tests can use the current production build through `E2E_AUTH_DIST_DIR`.

## Verification

- Regression tests first reproduced the generic QRIS error, missing registration success, and missing feature locks.
- All 538 unit tests passed.
- Production build, TypeScript compilation, and formatting passed.
- Lint passed with zero errors and 12 existing warnings. Architecture check: 798 modules, at most 200 formatted lines per source module.
- All 15 authentication/review browser tests passed, including registration without auto-login, later credential login, logout, ownership isolation, role changes, and revoked-session rejection.
- All 74 customer browser tests passed on the final full run, including Free/Premium/Lifetime gates, guest trials, locked feature controls without paid fetches, mobile layouts, claim changes, QRIS status polling, and verified settlement behavior with isolated fixtures.
- One initial Studio test failed because its poll dereferenced an absent storage value before the asynchronous save completed. The test now waits for the persisted counter; it passed three consecutive focused runs and the final complete suite. Production save logic was unchanged.
- Final typecheck passed. Local browser smoke test at `http://127.0.0.1:3201` confirmed manual/Google registration controls and the guest SaaS sidebar without browser errors.
- Independent read-only review found the missing priority-support lock; it was added while preserving the standard support form. No other important findings were reported.

## Outstanding merchant decision

Direct Lifetime purchase above Rp300.000 remains unavailable at the current merchant limit. The user has been asked to choose between requesting a higher limit from KlikQRIS and implementing two QRIS payments that grant access only after both settle. No price change or split-payment behavior has been assumed.

Existing production unknown invoices were not rewritten or treated as paid/expired based on a failed status lookup. The new rejection handling applies to definitive create responses; it does not guess the outcome of earlier ambiguous attempts. No successful live payment was performed during these checks.
