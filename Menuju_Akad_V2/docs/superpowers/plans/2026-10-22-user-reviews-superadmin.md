# User Reviews and Superadmin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Real private feedback submission, durable superadmin authentication/moderation, and curated landing reviews with initial seeded data.

**Architecture:** Dedicated SQLite repository and server sessions, isolated from customer/payments authentication and the concurrent dashboard work. Public endpoints project published fields only; authenticated APIs perform moderation. Existing landing gains an isolated responsive review section.

**Tech Stack:** Next.js 16.4.2, React 19, Node 24 SQLite/crypto, Zod, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-10-22-user-reviews-superadmin-design.md`, approved 22 October 2026 with instruction “oke eksekusi”. Execution: native, in place; no commit, push, worktree, or implementing subagents.

## Global Constraints

- Real product routes and persistence; only seed data/account are dummy. No preview/example UI.
- Pending/hidden reviews remain accessible only to server-authenticated superadmin.
- No editorial cap on published reviews; incremental lists remain fully reachable.
- Preserve all concurrent changes. New source modules stay at most 200 formatted lines.
- Read bundled Next documentation before route/cookie code; no new dependencies.

## Review Focus

- Seed reruns/restarts never restore hidden records or reset credentials (Task 1).
- Malformed ratings, long text, and hostile origins fail without a write (Tasks 1–2).
- Session forgery, expiry, and logout cannot expose private data (Tasks 1–2).
- Pagination includes every published review without exposing private records (Tasks 1–3).
- Mobile long comments, keyboard rating selection, and reduced motion remain usable (Task 4).

## Task 1: Durable storage and authentication

**Files:** `src/features/reviews/types.ts`, `domain/review-schema.ts`; `src/server/reviews/{database,repository,seed,accounts,sessions,runtime}.ts` with focused `*.test.ts` files.

**Interfaces:** `ReviewRepository.submit(input)`, `list({status,rating,search,page})`, `publicList(page)`, `moderate(id,status,actor)`; account hashing and session service store token hashes, not raw tokens. Public results contain only id/name/rating/comment/date plus aggregate published rating/count and pagination.

- [x] Write and run failing schema/repository/auth tests: private first, all rating bounds, publish/hide, >12 published rows, persistence, seed idempotence, hashed credentials, expiry/logout/forgery.
- [x] Implement dedicated `.data/reviews.sqlite`, atomic seeds, constrained schema, prepared queries, Node scrypt account hashes and random opaque sessions with eight-hour expiry.
- [x] Rerun focused Vitest tests until passing.

## Task 2: HTTP/session boundaries

**Files:** `src/server/reviews/{http,rate-limit,access}.ts`; `src/app/api/reviews/route.ts`, `src/app/api/superadmin/{login,logout,reviews}/route.ts`, `reviews/[id]/route.ts`; HTTP tests.

**Interfaces:** public GET/POST; authenticated GET inbox/PATCH visibility; POST login/logout with HttpOnly cookie. `readJson` caps body at 16 KiB; same-origin compares to request origin and explicitly configured trusted application origin. Login limit 10/15min, submission 5/10min; durable SQLite counters with bounded retention.

- [x] Write/run failing tests for cross-origin and oversized mutations, forged/expired session, rejected non-admin access, and throttling.
- [x] Implement handlers with no-store JSON responses, structured errors, validation before writes, server-only role checks, and logout invalidation. Accounts are provisioned from ignored server configuration, including local testing credentials.
- [x] Run focused HTTP and auth tests.

## Task 3: Real public and private UI

**Files:** `src/features/reviews/components/{review-section,review-form,review-card,review-stars,superadmin-login,superadmin-inbox}.tsx`, supporting client request/hooks/styles; `src/app/superadmin/{login,reviews}/page.tsx`, layout; integrate `src/features/landing/components/landing-screen.tsx`.

**Interfaces:** `ReviewSection` reads published pages, supports load-more/retry/focus refresh, opens accessible `ReviewForm`; private inbox filters status/rating/search and confirms publish/hide from API. Superadmin server page redirects invalid sessions to login; login redirects already-authenticated users to inbox.

- [x] Write browser tests for submit → private inbox → publish → landing → hide; reload persistence, unauthorized API/page, keyboard stars, mobile overflow, pagination and reduced motion.
- [x] Implement forms with retained input and pending/error/success states, responsive editorial cards, subtle CSS animation, empty states and protected private inbox.
- [x] Seed test credentials locally and document access without placing credentials in public bundles. Add testing/setup notes under `docs/`.

## Task 4: Verification and review

**Files:** `playwright.reviews.config.ts`, `tests/e2e/reviews.spec.ts`; update this plan with observed evidence.

- [x] Run focused Vitest, ESLint/architecture, Prettier, TypeScript and production build, distinguishing unrelated concurrent failures.
- [x] Run isolated Playwright review flow on desktop/mobile against actual product routes and dedicated test SQLite database.
- [x] Review complete diff against the design and security boundaries; repair demonstrated issues and rerun affected checks.
- [x] Report actual test evidence, superadmin route, testing credentials and any real limitations. Do not commit/push or alter the other agent's plan.

## Execution record

Plan written and self-reviewed against approved design; user explicitly authorized execution. Work in current checkout preserves concurrent uncommitted feature dependencies. No worktree/commit is created.

### Observed verification

- Focused Vitest: **3 files, 14 tests passed** (`node node_modules/vitest/vitest.mjs run src/server/reviews`). Tests first failed on absent implementation; visitor-isolation regression also failed before the repair.
- Production build with `NEXT_DIST_DIR=.next-reviews`: **exit 0**, compilation, TypeScript, prerendering and tracing completed. An earlier attempt encountered the concurrent agent's not-yet-written `guest-rsvp` module; no other agent file was changed to bypass it.
- Scoped ESLint: **zero warnings/errors**. Architecture check passed with source modules at most 200 lines and no boundary/cycle errors. Scoped Prettier passed.
- Playwright: **4 tests passed**, covering the real submission/moderation/logout flow, unauthorized access, wrong credentials, keyboard radio controls, reduced motion, responsive landing/inbox at 360/768/1440 px, and loading all selected reviews across more than 25 records.
- The first browser run had two passes and one test-only selector ambiguity with Next's route announcer. Scoped the error assertion; all four final tests passed.
- Full project `npm test`: **522 tests passed in 103 files; one unrelated suite failed to load** because `src/features/guest-crm/utils/customer-import.test.ts` imports the concurrent agent's not-yet-available `./customer-import`. This remains separate from the passing review feature checks.
- After that module appeared, repeated the full suite once: **523 passed, one failed across 105 files**. The remaining failure is the concurrent `src/server/workspaces/guest-integrity.test.ts` assertion for cross-workspace guest token/attendance integrity. Review tests continue to pass; do not change that agent's implementation or describe the full project suite as green.
- Independent read-only review found a shared throttle bucket and a fixed testing password in application source. Both repaired: opaque server-issued visitor identities (or explicitly trusted proxy IP), separate per-account login throttling, and credentials provisioned exclusively from server configuration. Regression checks pass.
- Local persistent installation at `http://localhost:3228`: actual dummy account login passed; **six public reviews, eight inbox records, zero browser JavaScript errors**. The local server remains available for user testing and shares `.data/reviews.sqlite` with the normal development application.
- Visually inspected real desktop landing and mobile form screenshots. Local testing credentials live in ignored `.env.local`; salted password hash and moderation state live in `.data/reviews.sqlite`. Usage/configuration notes: `docs/user-reviews-superadmin.md`.

### Small integration changes

`next.config.ts` accepts optional `NEXT_DIST_DIR` so tests avoid the concurrent agent's `.next` output. Added `.next-reviews` to Git/ESLint ignores. Next generated additional type includes in `tsconfig.json`; retained them and formatted the file. The normal build directory remains `.next` without the override.
