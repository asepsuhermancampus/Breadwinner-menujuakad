# Subscription upgrade implementation plan

> **For agentic workers:** Use superpowers:executing-plans for inline execution task by task.

**Goal:** Implement cancellation, confirmed claim switching, two-month Premium upgrade credit, active landing cards, and expiry reminders.

**Architecture:** Keep invoice provider reconciliation authoritative. Persist cancellation separately from provider status and record upgrade credit separately from first-purchase discount. Derive landing offers and checkout pricing from the same owner-scoped server policy.

**Tech stack:** Next.js route handlers, React, SQLite, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-10-21-subscription-upgrade-design.md`.

## Global constraints

- Credit uses actual Premium package amount paid, excluding unique code; reminder is in dashboard.
- Calendar window is two months from initial continuously active Premium activation; no reset on renewal.
- Preserve existing invoice/grant data and webhook handling, including canceled payments.
- No real payment, credentials output, commit, push, new dependency, or unrelated cleanup.
- Existing working tree is the authorized workspace; keep changes reviewable here.
- Source modules remain at most 200 formatted lines; split responsibilities as needed.

## Review focus

- Concurrent confirmations must not cancel another tab's replacement order.
- Late payment of a canceled new-buyer invoice must not lose money or silently grant a second promotional purchase.
- Guest adoption must recheck active subscription/upgrade eligibility before showing a QR.
- End-of-month activation and renewal must not reset the two-month promotion.
- Canceled invoice migration must retain foreign keys and provider settlement.

## Task 1: Price policy and persistent metadata

Files: `src/server/subscriptions/purchase-offer.ts`, `purchase-offer.test.ts`, payment schema/migration modules, migration tests.

Interfaces: `purchaseOffer(db, owner, now): PurchaseOffer`; per-plan amount/credit/eligibility, subscription snapshot and credit deadline. Invoice credit and cancellation are independent fields.

- [x] Write and run failing policy tests for paid amount credit, calendar boundaries, Free/Lifetime, renewal, expiry and 15-day reminders.
- [x] Implement policy from production grants joined to source invoices, checking initial continuous Premium activation.
- [x] Write and run migration failures; migrate old invoice constraint to support explicit credit without weakening amount checks, preserve child rows.
- [x] Run policy and migration tests green.

## Task 2: Checkout cancellation and replacement

Files: intent repository/service, cancellation helper, request parsing, owner-scoped plan API routes and tests.

Interfaces: reserve accepts optional expected replacement intent and renewal flag; `cancel(principal, intentId)` verifies provider status before cancellation. GET returns active quote plus owner offer.

- [x] Write and observe failures for bidirectional replacement, wrong owner, paid refusal, duplicate/stale confirmation, canceled late settlement and unknown creation recovery.
- [x] Implement compare-and-set replacement inside reservation transaction after provider reconciliation; hide canceled QR without losing provider status.
- [x] Validate upgrade source and price snapshot; disallow downgrade/duplicate active purchase except explicit Premium renewal; reject stale eligibility before revealing QR.
- [x] Run affected server tests green, including adoption and legacy integration tests.

## Task 3: Landing and checkout controls

Files: shared landing checkout state hook/provider, landing cards/price, cancellation dialog, plan payment hook and checkout.

- [x] Add failing browser coverage for cancel/confirm switching, canceled checkout, active grayscale cards and server-derived upgrade prices.
- [x] Coordinate landing card quotes, show change confirmation before replacement, update both cards together, preserve guest/login return.
- [x] Add checkout cancellation confirmation, remove QR and stop polling after cancellation, retain success handling for verified payments.
- [x] Run focused browser tests green.

## Task 4: Reminder and renewal

Files: customer dashboard reminder component and renewal action; offer policy and browser tests.

- [x] Add failing reminder tests at 15 days, outside boundary, expired and Lifetime states.
- [x] Display expiry/countdown, renewal CTA and Lifetime link; renewal is explicit and adds six months after current expiry.
- [x] Run reminder and renewal tests green.

## Task 5: Final verification and review

- [x] Run unit suite, lint/architecture, format check, production build and focused customer Playwright suite on isolated SQLite.
- [x] Obtain one independent review of all changes in this implementation, resolve material findings and rerun affected tests.
- [x] Verify local development health, remove disposable reports/test DB only, retain durable tests and record actual verification evidence.

Execution method: inline, authorized by user's “ya eksekusi”; no further approval stops between tasks. Existing no-commit/no-push preference applies.
