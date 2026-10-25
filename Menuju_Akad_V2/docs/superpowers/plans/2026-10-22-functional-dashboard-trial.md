# Functional Dashboard Trial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Deliver functioning customer pages, five attempts per guest feature, ready KUA documents, and authenticated discount claims directly in the local application.

**Architecture:** Share product editors between browser-backed guests and server-backed accounts. Use versioned browser snapshots and existing workspace resource rows for persistence. Keep trial permission separate from paid account entitlements.

**Tech Stack:** Next.js 16.4.2, React 19.3.1, TypeScript, Zod, SQLite, Vitest, Playwright; Node 24.

**Spec:** `docs/superpowers/specs/2026-10-22-functional-dashboard-trial-design.md` (approved by user on 22 October 2026).

**Execution:** Native implementation in this session, preserving the previously selected execution method. User approved execution after reviewing the plan; implementation is applied directly to the local app.

## Global Constraints

- Apply directly to real application routes; no duplicate demo site or temporary product implementation.
- Guest data stays in browser. Account data uses authenticated workspace membership and package checks.
- Five successful changes per feature; KUA instead permits five active checked documents. Five successful guest PDF exports.
- No fake payment, publication, messaging, domain, administrative, or vendor success.
- Preserve existing account/payment data, unrelated changes, pricing, discount amounts, and upgrade rules.
- Source modules remain at most 200 formatted lines; split by responsibility as needed.
- Read relevant bundled Next.js documentation before route/server component changes. No commit, push, worktree, new paid services, or real charge required.
- Durable regression tests remain; remove only temporary artifacts created for this plan.

## Review Focus

1. Version-one data cannot reveal per-feature history: preserve data and start new counters at zero, including older KUA lists with more than five checks.
2. Two tabs can race migration or the fifth commit: serialise writes, reject stale drafts, retain form input on rejection.
3. An intentionally empty document list is not an uninitialised list: defaults must not resurrect deleted documents.
4. Guest Studio/editor callbacks and export actions must not bypass quota or call account mutation/publication APIs.
5. Renaming simulated panels must not conceal missing integrations; direct URLs and downstream actions must respect identity and actual service availability.

## Task 1: Trial version two and atomic per-feature limits

**Files:** Modify `src/features/dashboard-trial/types.ts`, `domain/trial-snapshot.ts`, `domain/trial-validation.ts`, `storage/trial-store.ts`, `storage/trial-store.test.ts`, `hooks/use-trial-resource.ts`, `components/trial-provider.tsx`, `components/trial-notice.tsx`. Create `domain/trial-migration.ts` and `domain/trial-limits.ts` under the same feature.

**Interfaces:** `TrialFeatureKind` adds `moodboard`, `studio-drafts`, `calendar`, `rundown`, `seserahan`, `emergency`, `catering`, and `pdf` to the existing feature identifiers. `TrialResourceKind` excludes `pdf`. `TrialSnapshot` has `version: 2`, independent `revision`, `used: Partial<Record<TrialFeatureKind, number>>`, resources, and template initialization metadata. `createTrialStore` retains asynchronous `commit(kind, data, expectedRevision)` and adds `consumeExport(expectedRevision): Promise<TrialCommitResult>`.

- [x] Add tests: `independent_fifth_and_sixth_commits`, `kua_sixth_active_rejected_uncheck_frees_slot`, `v1_migration_preserves_data_and_zeroes_counters`, `legacy_six_checks_can_be_reduced`, `concurrent_migration_and_fifth_write`, `unchanged_invalid_storage_failure_do_not_consume`, and `export_counter_independent`.
- [x] Run `npm test -- src/features/dashboard-trial/storage/trial-store.test.ts`; observe failures against v1 behavior.
- [x] Implement parsing, version-one migration with backup, per-feature accounting, locking, and export accounting. Apply one global lock name during migration and v2 writes. Reject corrupt storage without reset. Preserve failed/conflicting drafts.
- [x] Update provider/hook notice and login dialog to show current-feature quota, with active-check count for KUA. No residual global-ten UI.
- [x] Run the same focused command; expect all tests pass.

## Task 2: Ready KUA templates and document CRUD

**Files:** Create `src/features/kua-documents/domain/document-template.ts`, `document-template.test.ts`, and `src/features/customer-workspace/components/customer-documents.tsx`; modify `components/customer-notes.tsx`, `components/resource-editor.tsx`, `src/server/workspaces/resource-service.ts`; create `src/server/workspaces/document-defaults.test.ts`.

**Interfaces:** `createDocumentTemplate(): DocumentItem[]` supplies neutral, unchecked, editable items with stable IDs. `DocumentItem` retains `{id, title, completed?, notes?}`. Distinguish missing `workspace_resources` row from stored empty documents; first initialization persists an explicit row under transaction. Guest snapshot records template version separately.

- [x] Test templates appear for a missing resource, never duplicate under two readers, retain legacy documents, and stay empty after deliberate deletion. Test edit and cancellation do not violate active-five rule.
- [x] Run `npm test -- src/features/kua-documents/domain/document-template.test.ts src/server/workspaces/document-defaults.test.ts`; observe missing behavior.
- [x] Build editable document list on the shared product page and one-time defaults for both adapters. Use general preparation labels; verify official Kemenag sources before naming legally required forms. Include guidance to adjust to the local KUA.
- [x] Run focused tests; expect passing. Add browser CRUD/check-sixth regression to `tests/e2e/dashboard-trial.spec.ts`.

## Task 3: Five functioning planning pages with persistent resources

**Files:** Create `src/features/customer-planning/domain/planning-resource.ts`, `planning-resource.test.ts`, `components/planning-editor.tsx`, `components/planning-form.tsx`, `components/planning-list.tsx`; create `src/app/_components/customer-planning-page.tsx`. Modify the five `src/app/planner/{calendar,rundown,seserahan,emergency,catering}/page.tsx` files, `src/server/workspaces/resource-policy.ts`, and corresponding policy tests; create `tests/e2e/customer-planning.spec.ts`.

**Interfaces:** `PlanningKind = 'calendar' | 'rundown' | 'seserahan' | 'emergency' | 'catering'`. Export typed schemas and `PlanningItem` union with `id`, `title`, and feature-specific fields. Calendar: date/startTime/endTime/notes. Rundown: order/startTime/pic/notes. Seserahan: quantity/unitCost/completed/notes. Emergency: category ('equipment'|'contact'), phone/completed/notes. Catering: portions/unitCost/notes. `PlanningEditor({kind, data, onSave})` consumes typed arrays and async boolean saves; adapters validate before writes.

- [x] Test invalid dates/times, end-before-start, duplicate IDs, negative/fractional quantities, oversized text, and total overflow. Test membership isolation and revision conflicts using existing workspace fixtures.
- [x] Run `npm test -- src/features/customer-planning/domain/planning-resource.test.ts src/server/workspaces/resource-policy.test.ts`; observe missing schemas/behavior.
- [x] Implement focused editors with create/edit/delete, stable sorting, status where relevant, empty states, real totals, and pending/error states. Connect guest trial store and account resource API; remove use of `PlannerPreviewPage` for these routes.
- [x] Run focused tests; expect passing. Browser test creates/edits/reloads/deletes one item per feature for account and guest; sixth guest action blocks only its own feature.

## Task 4: Full guest editors and shared sidebar

**Files:** Modify `src/features/customer-workspace/components/{customer-sidebar,customer-dashboard,customer-resources,customer-invitations,invitation-editor,plan-export}.tsx`, `src/app/_components/customer-resource-page.tsx`, `src/app/planner/invitations/studio/page.tsx`, `src/app/planner/wedding-kit/page.tsx`. Create `src/features/dashboard-trial/components/trial-studio.tsx`, `trial-export.tsx`, and `domain/trial-export.test.ts`. Adapt `src/features/invitation-studio/hooks/use-remote-studio.ts` only through a separate injected/local adapter, preserving server behavior.

**Interfaces:** Guest trial access comes from `DashboardAccess.mode`, not fabricated paid subscription capabilities. Local Studio documents retain actual `StudioDocument` schema and `projectId` matching persisted draft ID. Exports use guest snapshot resources with HTML escaping and successful export quota consumption. Save callbacks return `Promise<boolean>` to retain draft after rejection.

- [x] Add browser assertions: all menu links visible without Terkunci; guest moodboard, premium template, multi-invitation, Studio, and PDF paths work locally; sixth commit/export blocked; no account resource PUT or publication request emitted. Login Free remains denied paid server mutations.
- [x] Run selected `dashboard-trial.spec.ts` cases and export unit tests; observe failure on currently locked routes.
- [x] Connect existing functional editors to local adapters, remove sidebar lock badges, preserve account tier enforcement, and generate printable output from real snapshot data. No example project or historical version is presented as user data.
- [x] Run focused tests; expect passing. Retain cross-tab login/logout and dirty-draft conflict regressions, updating old ten-global assertions.

## Task 5: Login-required discount claims and origin regression

**Files:** Modify `src/features/payments/components/plan-purchase-provider.tsx`, `src/app/api/payments/plans/route.ts`, `src/server/payments/checkout-request.ts` as needed; create `components/discount-login-dialog.tsx` and `src/server/payments/discount-auth.test.ts`; extend `tests/e2e/plan-claim.spec.ts` and HTTP origin tests.

**Interfaces:** GET plan metadata includes `authenticated: boolean` from real server session. Provider waits for resolved metadata; guest discount claim opens dialog and returns null without POST. Server POST verifies an owner principal for `claimDiscount: true` before reserving; nonclaim guest recovery remains intact. Return destinations go through existing safe local return-to validation.

- [x] Test guest claim opens login/register dialog without creating a reservation; direct guest API claim rejects; logged-in claim and bidirectional package switch still work. Test allowed actual local origins and denied hostile origins.
- [x] Run focused unit/browser claim tests; observe failures against current guest reservation path.
- [x] Implement authentication gate in UI and API. Reproduce reported origin mismatch using request URL/Origin observations without printing secrets. Fix only demonstrated trusted-host handling; retain cross-origin protection and existing security tests.
- [x] Run focused tests and checkout/upgrade browser regressions; expect passing.

## Task 6: Product-route audit and removal of simulation paths

**Files:** Audit `src/app/**/page.tsx` and public route handlers, their imported feature components, `src/preview/**` references, and domain/payment/message adapters. Modify actual reachable components; remove unused `src/app/_components/planner-preview-page.tsx` after reference check. Create `tests/e2e/product-route-integrity.spec.ts` and `docs/superpowers/functional-route-audit.md` as durable implementation reference, not a temporary test report.

**Interfaces:** Inventory each reachable product route with its real backing service, identity requirement, and successful action evidence. Internal `/dev/*` routes remain separated and guarded. A downstream integration without configured service returns an actionable failure and cannot claim successful fulfillment.

- [x] Add route tests for detected dummy success paths: fixture identities, manual-payment simulation, fake DNS/domain status, or mock message success. Tests assert no simulated action can create a false success state.
- [x] Run focused integrity tests to demonstrate existing failures, then replace reachable dummy adapters with existing real services and persisted user data. For absent external services, remove false-success controls and present exact connection/configuration requirements; record any remaining genuine blocker rather than declaring the route complete.
- [x] Make editor result views render current persisted/draft user documents, with Lihat hasil wording where appropriate. Do not remove working rendering/export merely because internal helper names contain preview.
- [x] Run integrity tests and affected operations/vendor tests; expect passing. Record external dependencies separately from completed product functionality. No new service purchase or outbound messaging is implied by automated verification.

## Task 7: Integrated verification and independent review

**Files:** Modify `playwright.customer.config.ts` to include new customer/integrity tests; retain existing isolated SQLite test setup. Record task evidence in this plan and temporary execution ledger.

- [x] Run `npm test`, `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run build`, and `npm run test:e2e:customer -- --reporter=line`; inspect exit status and errors. Run affected operations tests if task 6 touches those modules.
- [x] Verify desktop and mobile locally with actual guest/account modes. Confirm no regressions in payment success, cancel, webhook/status reconciliation, subscription credit, and post-payment guide.
- [x] Dispatch one fresh read-only whole-change reviewer using `superpowers:requesting-code-review` and the most capable available model, giving spec, plan, audit, test evidence, and preserved dirty-tree boundaries. No implementing subagents required.
- [x] Reproduce important findings with failing tests, fix and rerun affected/full suites. Report any unavailable integration honestly; do not mark all-web completion while blockers remain.
- [x] Keep local app available for user review; retain permanent regressions, remove only this task's temporary outputs. Update spec/plan completion status from observed evidence.

## Plan self-review and handoff

All spec sections map to tasks 1–7; the five Review Focus entries have explicit owning tests. Shared schema boundaries must remain client-safe: no import from server-only resource policy into browser code. Template initialization is system setup, not a billable trial action. User-selected Native method, no commits/worktree, and direct application delivery persist. The user approved this written plan and requested execution. No further approval checkpoint is pending.

## Execution evidence

- Native implementation, no commit/push/worktree. Existing unrelated review/superadmin work and real payment database preserved.
- 527 unit tests passed across 106 files; four webhook-proxy tests passed.
- Operations browser suite: 8/8 passed, including anonymous authorization and desktop/tablet/mobile assets.
- Customer browser suite: 72/72 passed on isolated production server/database. Guest and account CRUD, cross-tab conflicts, five-per-feature limits, KUA defaults/editing, Studio explicit saves, view versus PDF export, actual RSVP/check-in, catalog/private quotes, Google entry, payment reconciliation/cancel/upgrade/guide and responsive CSS verified.
- Production build, typecheck and format check passed; lint has zero errors and existing nonfatal warnings. Architecture checks 777 source modules at most 200 formatted lines.
- One fresh read-only independent review found six Important defects. All were corrected and covered by unit/browser regressions. Minor public-invitation indexing policy remains intentionally noindex pending a separate privacy/SEO decision.
- Five obsolete tests of removed simulated dev consoles retired; actual operations redirects/auth and responsive asset checks replace them. Permanent regressions retained.
- External configuration gaps are listed in functional-route-audit.md; no false OTP, automated WhatsApp delivery, vendor-payment, fulfillment or domain-hosting success is shown.
- Local dev server remains available at http://127.0.0.1:3201/dashboard.
