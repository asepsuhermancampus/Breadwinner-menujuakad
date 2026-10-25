# User reviews and private superadmin moderation

Date: 22 October 2026
Status: Approved by user on 22 October 2026; implementation authorized with “oke eksekusi”.

## Intent and agreed constraints

Provide working website feedback: visitors submit one to five stars and a comment; only the superadmin reads incoming feedback and chooses which reviews appear publicly. Support complaints, suggestions, and positive feedback equally.

The user clarified that only initial records and the testing account are dummy. All routes, forms, authentication, persistence, moderation, and landing publication must be real application behavior. Do not add preview routes, example sections, simulation notices, or dummy labels to the product interface. Keep the source of seeded records identifiable internally.

Preserve the concurrent work described in `docs/superpowers/plans/2026-10-22-functional-dashboard-trial.md`. Do not modify that plan or the dashboard trial implementation. No commit, push, external messaging, or service purchase is required.

## Approach

Use the existing Next.js application and Node SQLite support. Add a dedicated review feature, server repository, and superadmin review area. Use a separate SQLite file under the already ignored `.data/` directory so review migrations and initial records do not modify payment/workspace tables under active development.

Alternatives considered: browser-only persistence cannot provide private, shared moderation across devices; extending payment/workspace storage increases overlap with the other agent. Dedicated durable server storage offers the required behavior with a small integration surface.

Read relevant bundled Next.js documentation before implementing handlers, cookie sessions, or server/client composition. Follow the repository's maximum 200 formatted lines per source module and existing design tokens and UI primitives.

## Visitor flow

Add a `Ulasan` section to the real landing page, between pricing and FAQ. Show published reviews as responsive cards, each containing display name, stars, comment, and date. Include a `Tulis ulasan` action opening an accessible form.

Accept a display name, an integer rating from 1 through 5, and a nonempty comment. Proposed validation: display name 2–80 characters and comment 10–2000 characters after trimming. Visitors may submit without a paid package or login; do not alter customer authentication or dashboard quotas. Explain before submission that feedback goes privately to the website team and may be selected for public display. Do not request or expose email/contact details in this feature.

The server validates and persists each submission as pending. Return success only after successful storage. Retain input on failure, prevent duplicate clicks while sending, and provide clear pending/success/error feedback. A submitted review must never become public automatically, including five-star reviews.

## Public display and visual treatment

Use the site's existing typography, palette, rounded cards, and spacing. Provide a distinctive editorial heading, star accents, and subtle entrance and hover effects. Display cards in one column on small screens and additional columns as space permits. Support long names/comments without horizontal overflow.

Respect `prefers-reduced-motion`. Ensure keyboard operation, visible focus, labelled star selection, accessible modal behavior, readable contrast, and touch targets. Avoid essential interactions depending on hover or automatic motion.

Published reviews have no editorial quantity cap. Use incremental loading if needed so all selected reviews remain reachable without rendering an arbitrarily large initial page. Any displayed rating/count describes published reviews, not the private inbox. If no reviews are published, show an honest empty state and submission action; never silently restore hidden sample reviews.

## Superadmin access

Provide `/superadmin/login` and `/superadmin/reviews` as real application routes. Keep the feature's server-validated superadmin identity separate from the existing Google customer session and operations email allowlist; ordinary users and operations staff do not gain review moderation access.

Persist a seeded test account with a normalized dummy email and a salted password hash using Node crypto. Give the user its testing credentials in the delivery notes. Never ship passwords or password hashes in client bundles or public API responses. Seed the account once without resetting its password during restarts. Keep testing credentials in ignored server configuration/durable storage; require explicit provisioning for a production deployment rather than silently enabling a known dummy login there.

Use cryptographically random sessions persisted server-side, with only a secure session token in an HttpOnly, SameSite cookie; enable Secure on HTTPS/production. Expire sessions and invalidate them on logout. Protect the page and every private API independently. An existing client role flag is never sufficient authority.

## Moderation flow

The private inbox shows all pending, published, and hidden reviews, including low ratings. Allow filtering by status/rating and searching name/comment. Pagination must not impose a total review limit.

For each review, the superadmin can publish or hide it. Hiding removes it from the landing but preserves it in the private inbox; no deletion or rewriting of user comments is required. Record moderation time and actor. Provide loading, empty, saving, and error states; reflect server-confirmed changes rather than claiming success before persistence.

Public reads immediately exclude hidden/pending records. Invalidate or bypass caching so subsequent public reads reflect moderation; an already open page may refresh its review data on focus. No email, WhatsApp, or external delivery is implied by “sent to superadmin”: delivery means durable availability in the protected inbox.

## Storage and API boundaries

Store reviews with ID, display name, integer rating, comment, status, created/updated timestamps, moderation actor/time, and internal seed marker. Store superadmin accounts and sessions separately from review rows. Apply schema constraints and parameterized SQL.

Proposed endpoints:

- `GET /api/reviews`: published review fields only, paginated.
- `POST /api/reviews`: validated public submission; always initially pending.
- `POST /api/superadmin/login`: credential verification and session creation.
- `POST /api/superadmin/logout`: revoke session and clear cookie.
- `GET /api/superadmin/reviews`: authenticated private list and filters.
- `PATCH /api/superadmin/reviews/[id]`: authenticated publish/hide only.

Verify same-origin mutations, cap request bodies, and apply bounded submission/login throttling. Render comments as plain text. Private responses use no-store; never include private review fields or records in public HTML/API payloads. Separate deployment instances must share durable storage for cross-instance consistency; this follows the project's current persistent Node runtime pattern, not ephemeral hosting storage.

## Initial data

Seed a small set of polished Indonesian reviews for the first landing display and a mixture of pending complaints/suggestions for testing moderation. Store internal seed IDs/markers and make seeding idempotent. Apply seed records once; restarting must not republish a hidden review or recreate intentionally altered records.

These records use the same repository, visibility rules, public endpoint, and moderation controls as subsequent submissions. No mock adapter, browser-only inbox, alternate demo screen, or fake successful action is allowed.

## Integration boundaries

Create new modules under `src/features/reviews/` and `src/server/reviews/`, plus the dedicated superadmin pages and API routes. Integrate the landing through `landing-screen.tsx` and an isolated review component/CSS module. Avoid shared auth, payment, dashboard, workspace, pricing, and navigation edits unless evidence shows they are necessary; re-read shared files before any integration change.

## Verification criteria

1. Submitting a valid review persists across reload/restart and appears only in the authenticated inbox.
2. Guest/customer/operations identities cannot read pending/hidden reviews or mutate publication, including direct API access and client-side role tampering.
3. Valid dummy credentials open the real inbox; wrong passwords, expired/revoked sessions, and logout deny access.
4. Publishing makes a review publicly readable; hiding removes it; more than a small fixed count can be published and reached.
5. Invalid stars/text, hostile origins, repeated login/submission requests, and oversized requests fail without falsely reporting saved data.
6. Seeding twice does not duplicate records, reset credentials, or undo moderation.
7. Verify the real landing/form/inbox at mobile, tablet, and desktop sizes, keyboard-only operation, long comments, and reduced-motion mode.
8. Run focused domain/repository/auth tests and end-to-end submission/moderation tests using isolated storage, then appropriate lint/typecheck/build checks. Distinguish unrelated failures from concurrent work without reverting that work.

## Next step

Implementation follows `docs/superpowers/plans/2026-10-22-user-reviews-superadmin.md`. Execution was explicitly authorized by the user; final verification evidence is recorded in that plan.
