# Paid Plans Checkout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membeli paket dari card landing dengan harga diskon dan kode unik yang pasti sebelum membuka QR, lalu mengaktifkan fitur akun beserta panduannya setelah pembayaran terverifikasi.

**Architecture:** Gunakan satu katalog paket dan snapshot harga server, reservasi invoice KlikQRIS yang dapat diikat dari tamu ke akun Google, serta settlement dan grant dalam satu transaksi SQLite. Jalur pelanggan membaca workspace dan capability server; preview tetap terpisah. Popup dan panduan mengikuti perubahan capability aktual per grant.

**Tech Stack:** Next.js 16.4.2, React 19.3.1, TypeScript 5.9.3, Node 24, Auth.js, node:sqlite, Tailwind, Vitest, Playwright, API KlikQRIS yang sudah digunakan.

**Spec:** [Rancangan yang disetujui](../specs/2026-10-21-paid-plans-checkout-design.md).

## Global Constraints

- Free tetap Rp0 dan tidak memiliki klaim diskon maupun transaksi QRIS.
- Premium tetap Rp149.000 per enam bulan; Lifetime tetap Rp399.000 sekali bayar.
- Klaim diskon pengguna baru 5% berada di samping harga pada kedua card berbayar.
- Klaim memperbarui harga pada card, termasuk kode unik resmi, tanpa navigasi atau menampilkan QR.
- Profil yang belum lengkap tidak menghalangi pembelian, aktivasi, atau akses dashboard.
- Total resmi harus berada antara nominal dasar dan harga awal; diskon dibulatkan ke bawah dalam rupiah utuh.
- Invoice uji dan sandbox tidak pernah menghasilkan akses produksi.
- Tombol Premium mempertahankan class dan warna sekarang.
- Tidak ada commit, push, deployment, pembayaran uang otomatis, atau perubahan kredensial. Pertahankan perubahan pengguna yang sudah ada.
- Ikuti batas arsitektur repo: setiap file src TS/TSX/CSS maksimal 200 baris setelah format, tanpa siklus dan tanpa import server/fixture ke client pelanggan.
- Baca dokumentasi lokal Next terkait sebelum implementasi route/cookie/auth. Semua mutation memvalidasi sesi/kepemilikan, Origin, ukuran dan bentuk payload; respons akun/payment private no-store.
- Gunakan dependency yang sudah ada. Catat kendala integrasi nyata secara jujur; jangan membuat status domain, sinkronisasi, atau entitlement palsu.

## Review Focus

1. Klaim tamu di dua tab lalu login ke akun yang sudah membeli: jangan menerapkan diskon tidak sah atau mengambil invoice akun lain (Task 3 dan 4).
2. Create provider timeout setelah invoice sebenarnya dibuat: pulihkan order yang sama dan jangan menghasilkan kode unik kedua (Task 3).
3. Webhook dan manual check bersamaan, termasuk sesudah expiry: satu settlement dan satu grant, tanpa downgrade atau perpanjangan ganda (Task 5).
4. Pembelian Premium pada akhir bulan/tahun kabisat dan akun Lifetime: perhitungan enam bulan terjepit ke akhir bulan yang sah, tanpa menurunkan Lifetime (Task 1 dan 5).
5. Logout/pergantian akun atau target guide hilang setelah navigasi: jangan bocorkan data/draft/progress dan jangan menjebak fokus (Task 6, 8, 10).

## File map dan batas unit

- `src/features/plans/domain/`: katalog, capability, aturan periode, DTO bersama yang tidak mengimpor server.
- `src/server/payments/`: migrasi, invoice, intent, pemanggilan provider dan settlement. Pertahankan API uji lama dengan purpose eksplisit.
- `src/server/subscriptions/`: query akses dan notices; grant SQL dipanggil dengan koneksi/transaksi settlement yang sama, bukan koneksi transaksi kedua.
- `src/server/workspaces/`: workspace milik akun, resource terstruktur, batas kuota, domain dan bantuan; tidak memakai fixture.
- `src/features/customer-workspace/`: kontrak dan adapter API pelanggan serta komposisi screen nyata.
- `src/features/subscriptions/`: context akses client, popup, guide dan registry target.
- Route handlers hanya mengurus HTTP/auth/DTO; komponen hanya mengonsumsi kontrak publik. Pisahkan file saat mendekati batas 200 baris.
- Test unit/integrasi tetap `src/**/*.test.ts`; browser di `tests/e2e/`. Tidak ada report/screenshot sementara yang ditambahkan ke source.

## Task 1: Katalog, harga, periode, dan capability tunggal

**Files:** Create `src/features/plans/domain/catalog.ts`, `capabilities.ts`, `subscription-period.ts` dan masing-masing `.test.ts`; modify `src/features/plans/config/plan-options.ts`, `src/features/plans/utils/entitlement.ts`, `src/features/payments/domain/payment-pricing.ts`.

**Interfaces:**

- Reuse `PlanId = 'free' | 'premium' | 'lifetime'`; export `PaidPlanId = Exclude<PlanId, 'free'>`.
- `getPlan(id: PlanId): PlanDefinition`, dengan id, label, originalAmount, durationMonths/null, revision, features dan capabilities readonly.
- `PlanDefinition { id: PlanId; label: string; originalAmount: number; durationMonths: number | null; revision: string; features: readonly string[]; capabilities: readonly Capability[] }`. Definisikan union `Capability` dengan nilai literal yang sama pada policy dan registry guide, bukan label terjemahan UI.
- `pricePlan(id: PaidPlanId, claimDiscount: boolean): { originalAmount: number; discountAmount: number; amount: number }`.
- `addCalendarMonths(iso: string, months: number): string`, UTC dan clamp tanggal akhir bulan.
- `capabilitiesFor(plan: PlanId): readonly Capability[]`; capability mencakup guest-limit-100/unlimited, basic/premium templates, unlimited tasks, studio, moodboard, pdf, multi-invitation, custom-domain, priority-support.

- [ ] Tulis tes gagal `catalog_prices_and_discount_are_authoritative`: premium 149000/7450/141550, lifetime 399000/19950/379050, free tidak dapat menjadi produk invoice. `period_clamps_month_end` mengharapkan 2026-08-31T12:00:00Z +6 menjadi 2027-02-28T12:00:00Z; 2023-08-31 +6 menjadi 2024-02-29.
- [ ] Jalankan `npm test -- src/features/plans/domain`; pastikan gagal karena modul/kontrak belum tersedia.
- [ ] Implementasikan kontrak di atas. Landing dan internal plans memakai daftar fitur landing yang disetujui; hapus janji tambahan sinkronisasi vendor/Wedding Kit dari paket bila belum tersedia, tanpa menghapus halaman preview-nya.
- [ ] Jalankan tes yang sama; harapkan PASS, lalu tes entitlement/harga yang sudah ada agar promo uji tetap kompatibel.

## Task 2: Migrasi invoice produk, intent, grant, dan notices

**Files:** Modify `src/server/payments/db-schema.ts`, `db-migration.ts`, `db.ts`; create `product-schema.ts`, `intent-repository.ts`, `product-migration.test.ts`; create `src/server/subscriptions/schema.ts`, `grant-repository.ts`, `notice-repository.ts`, `types.ts`.

**Interfaces:**

- Export `PaymentPurpose = 'integration_test' | 'subscription'`, `PaymentEnvironment = 'production' | 'sandbox'` dan `ProductSnapshot { purpose; planId: PaidPlanId | null; revision: string; durationMonths: number | null }`.
- `CheckoutIntent` server: id, guestHash/null, owner/null, environment, product, price, orderId, state, expiresAt. `IntentRepository.reserve(principal, planId, claimDiscount): { intent: CheckoutIntent; isNew: boolean }`; principal adalah discriminated union `{ kind: 'guest'; hash: string } | { kind: 'owner'; owner: string }`.
- `IntentRepository.bind(intentId: string, guestHash: string, owner: string): CheckoutIntent` atomik, menolak konflik reservasi/kelayakan.
- Semua repository menerima `DatabaseSync` yang sama melalui konstruktor; jangan mengekspos handle SQL ke client/UI. Transaksi dikelola satu unit-of-work server.

- [ ] Tulis tes gagal migrasi dua versi schema lama, paid/pending/unknown, signature/QR, rollback saat rusak, reopen dan dua koneksi. Invoice lama selalu purpose integration_test; grant awal kosong.
- [ ] Jalankan `npm test -- src/server/payments/product-migration.test.ts`; pastikan gagal pada kolom/tabel baru.
- [ ] Migrasi dengan BEGIN IMMEDIATE, versi schema dan rollback. Tambah snapshot immutable, tabel intent/grant/notice, foreign key serta unique grant(order_id), notice(owner,grant). Ubah indeks invoice aktif menjadi owner/environment/purpose. Active subscription milik tamu mengikuti hash dan active milik akun mengikuti owner; bind memeriksa ulang di transaksi yang sama.
- [ ] Definisikan status unknown sebagai reservasi yang belum boleh diganti. Paid/expired hasil provider terverifikasi menyelesaikan reservasi; expiry lokal saja tidak menganggap provider pasti expired.
- [ ] Jalankan `npm test -- src/server/payments/product-migration.test.ts src/server/payments/migration.test.ts src/server/payments/persistence.test.ts`; harapkan PASS dan semua invoice lama utuh.

## Task 3: Reservasi harga landing tanpa membocorkan QR

**Files:** Create `src/server/payments/plan-checkout-service.ts`, `guest-reservation.ts`, `checkout-request.ts`, `reservation-limit.ts`, `plan-checkout.test.ts`; create `src/app/api/payments/plans/route.ts`, `src/app/api/payments/plans/[intentId]/route.ts`, `src/features/payments/checkout-types.ts`; modify `src/server/payments/runtime.ts`, `service.ts` untuk berbagi provider/invoice lifecycle.

**Interfaces:**

- `PlanQuote { intentId: string; planId: PaidPlanId; originalAmount: number; discountAmount: number; amount: number; uniqueAmount: number | null; totalAmount: number | null; status: InvoiceStatus; expiresAt: string | null; eligibility: 'verified' | 'requires-login' }`.
- `PlanCheckoutService.reserve(principal, planId: PaidPlanId, claimDiscount: boolean): Promise<PlanQuote>`; `quote(principal, intentId: string): Promise<PlanQuote>`.
- POST `/api/payments/plans` accepts only `{ planId, claimDiscount }`; GET `/api/payments/plans/[intentId]` resolves same reservation. Payload max1024 bytes. Client price/owner/purpose/signature rejected.
- Guest cookie uses random32-byte token, hash persisted, HttpOnly/SameSite=Lax/Path=/; Secure on HTTPS, lifetime bounded to reservation window. Rate limit persisted: max5 new provider reservations per guest/owner per hour; reuse/status checks do not consume quota. IP alone is not identity.

- [ ] Tulis tes gagal untuk premium/lifetime harga resmi, response tanpa qrImage/signature/owner, total satu rupiah di atas ceiling diblokir, total sama ceiling diizinkan, wrong-owner404, missing Origin403, body besar413, limit429.
- [ ] Tambahkan `create_timeout_reconciles_same_order` dan `concurrent_claims_create_once` menggunakan client fake dan dua koneksi. Unknown/creating tidak memicu create kedua; GET status pada order yang sama. Tidak dapat dipastikan tetap unknown dengan pesan retry.
- [ ] Jalankan `npm test -- src/server/payments/plan-checkout.test.ts`; harapkan FAIL sebelum implementasi.
- [ ] Implementasikan reserve-first, provider-create hanya pemenang reservasi, validasi jumlah/signature/QR tersimpan. Keterangan provider memuat tier. DTO landing hanya angka/status; QR hanya pada API checkout terautentikasi.
- [ ] Saat total tidak memenuhi ceiling, jangan kirim QR. Pembelian tanpa promo juga tunduk pada ceiling; jangan menambah diskon tersembunyi. Expiry/provider error ditampilkan dan direkonsiliasi, tidak dihapus.
- [ ] Jalankan tes Task3 dan seluruh `src/server/payments`; harapkan PASS tanpa request provider produksi dalam suite.

## Task 4: Login mempertahankan pesanan dan mengikat tamu dengan aman

**Files:** Create `src/features/auth/lib/return-to.ts`, `return-to.test.ts`, `src/app/api/payments/plans/[intentId]/adopt/route.ts`, `src/server/payments/adoption.test.ts`; modify `src/features/auth/components/google-auth-button.tsx`, `auth-layout.tsx`, `auth-screen.tsx`, `src/app/checkout/qris/page.tsx`, `src/server/payments/plan-checkout-service.ts`.

**Interfaces:**

- `safeReturnTo(value: string | null): string`: allow `/account`, `/dashboard`, dan `/checkout/qris?intent=<validated-id>`; fallback `/account`; reject scheme/host/backslash/protocol-relative/double-encoded escape.
- `PlanCheckoutService.adopt(intentId: string, guestHash: string, owner: string): CheckoutIntent` verifies session + guest cookie; existing owned intent can resume without guest cookie only for same owner.
- `PlanCheckoutService.invoice(owner: string, intentId: string): InvoiceView` requires owned matching subscription purpose. POST adopt requires Origin and same signed-in principal as route checkout.

- [ ] Tulis tes gagal allowlist redirect, login/register intent persistence, missing/wrong guest token, race two accounts adopting same reservation, expired intent, existing paid account discount conflict409, existing active other-tier409.
- [ ] Jalankan `npm test -- src/features/auth/lib/return-to.test.ts src/server/payments/adoption.test.ts`; harapkan FAIL.
- [ ] Implementasikan returnTo di Google dan auth links. GET checkout hanya membaca; jika tamu perlu bind, render client continuation yang POST adopt setelah login, kemudian mengambil invoice, tanpa mutation pada GET server page. Jangan memakai mock OTP sebagai sesi payment nyata.
- [ ] Tidak ada pemeriksaan profile completeness pada jalur checkout/adopt. Kelayakan promo berdasarkan successful production subscription, bukan invoice uji. Bound invoice tidak dapat direbind.
- [ ] Jalankan tes Task4 serta existing auth/routes; harapkan PASS.

## Task 5: Cek status dan settlement atomik ke langganan

**Files:** Modify `src/server/payments/service.ts`, `db.ts`, `invoice-validation.ts`, `src/features/payments/types.ts`, `hooks/use-qris-transport.ts`, `hooks/use-qris-payment.ts`, `components/qris-invoice-card.tsx`; create `src/server/payments/verified-settlement.ts`, `subscription-settlement.test.ts`, `src/server/subscriptions/entitlement-query.ts`, `src/features/plans/domain/subscription.ts`.

**Interfaces:**

- `settleVerifiedInvoice(orderId: string, verified: InvoiceUpdate, checkedAt: number): DbInvoice` transaction updates invoice, unique grant, notice; invoked only after provider validation. No raw browser status reaches this function.
- `readEntitlement(owner: string, now: Date): SubscriptionSnapshot`, with planId, expiresAt/null, capabilities and latestGrantId/null. Aggregate valid grants; Lifetime dominates; premium renew from max(now,active expiry).
- DTO bersama `SubscriptionSnapshot { planId: PlanId; expiresAt: string | null; capabilities: readonly Capability[]; latestGrantId: string | null }` tinggal di `features/plans/domain/subscription.ts`; server query mengimpor DTO tersebut, client tidak mengimpor folder server.
- Status response adds `checkedAt: string | null` and access activation `accessReady: boolean` for subscription invoice; integration tests never accessReady.
- Manual check option is explicit `{ manual: boolean }` inside refresh; manual can reconcile expired, polling skips terminal. UI announces pending/success/error using aria-live, distinguishes checking from creating.

- [ ] Tulis tes gagal `paid_poll_and_webhook_grant_once`, late paid after expired, webhook-before-adoption, replay settlement, amount/signature mismatch, sandbox/test no grant, premium renewal and Lifetime non-downgrade. Pending guest never grants; paid guest grants only in validated adoption transaction, subject to promo recheck; ineligible paid reservation requires manual reconciliation and never silently activates.
- [ ] Tulis tes waktu: six-month UTC clamping, double events same millisecond, payment near expiry and old pending response after paid. Existing legacy paid invoice cannot become subscription.
- [ ] Jalankan `npm test -- src/server/payments/subscription-settlement.test.ts`; harapkan FAIL.
- [ ] Implementasikan satu transaksi untuk paid+grant+notice, unique order guard; compute entitlement/feature delta from server state. Periksa ulang owner/promo eligibility saat settlement/adoption. GET provider tetap otoritas; webhook ACK hanya setelah durable update.
- [ ] Implementasikan status feedback dengan abort timeout, single-operation lock, hasil manual tidak ditimpa polling, waktu update hanya setelah respons valid. Tombol manual tetap bisa retry error/expired; tidak membuat invoice baru.
- [ ] Jalankan seluruh payment/subscription tests; harapkan PASS. Browser status cases masuk Task11.

## Task 6: Workspace akun nyata dan API akses pelanggan

**Files:** Create `src/server/workspaces/schema.ts`, `repository.ts`, `service.ts`, `membership-service.ts`, `ownership.test.ts`; create `src/features/customer-workspace/types.ts`, `components/customer-shell.tsx`, `hooks/use-customer-workspace.ts`; create `src/app/api/workspace/route.ts`, `src/app/api/workspace/partner/route.ts`, `src/app/api/subscriptions/route.ts`; modify `src/app/api/account/route.ts`, `src/app/dashboard/page.tsx`, `src/app/account/[[...path]]/page.tsx`, `src/features/shell-navigation/components/workspace-shell.tsx`, `workspace-header.tsx`, `workspace-dock.tsx`.

**Interfaces:**

- `getOrCreateWorkspace(owner: string): CustomerWorkspace` creates empty account-owned workspace with nullable profile fields, not example people/data.
- `CustomerWorkspace { id: string; profile: CustomerProfile; subscription: SubscriptionSnapshot; revision: number }` and `CustomerProfile { fullName: string; partnerName: string | null }`; verified session display name is optional default, never identity authority.
- GET workspace/account/subscriptions requires auth and only returns current principal. Client context consumes DTOs and clears on sign-out/account change. All customer shell plan badges derive subscription snapshot, not literal Premium.
- Workspace berdua memakai membership persisted dan token undangan sekali pakai berumur24jam: `invitePartner(owner: string): { token: string; expiresAt: string }`, `acceptPartnerInvite(account: string, token: string): { workspaceId: string }`; token disimpan sebagai hash dan hanya pemilik workspace dapat membuat/mencabut invite. Maksimal dua anggota, atomic accept, tidak menerima owner dari payload.

- [ ] Tulis tes gagal two-owner isolation, empty profile can create workspace, no preview guest/task/name data, subscription remains after restart, localStorage Premium does not alter server access, unauth401.
- [ ] Uji partner invite expired/replay, dua acceptance bersamaan, revoke dan nonmember access. Anggota pasangan sah dapat membaca/mengubah resource bersama sesuai policy workspace; invoice dan riwayat pembayaran tetap hanya milik pembayar. Akses fitur workspace mengikuti grant pemilik workspace, bukan grant workspace lain milik anggota.
- [ ] Jalankan `npm test -- src/server/workspaces/ownership.test.ts`; harapkan FAIL.
- [ ] Implementasikan SQLite workspace tables on same managed database, customer account adapter, real dashboard composition. Signed-in customer routes use real DTOs; public demo path remains visibly preview. Preserve unrelated operations/vendor flows.
- [ ] Reconcile account plan CTA with same intent purchase flow; remove customer mock requestPlanChange that pretends paid success. Do not mutate subscription through profile/account endpoint.
- [ ] Jalankan ownership/account tests dan typecheck; harapkan PASS, incomplete account usable.

## Task 7: Integrasi card landing dan checkout paket

**Files:** Modify `src/features/landing/components/landing-pricing.tsx`, `src/features/plans/components/plans-screen.tsx`, `plan-card.tsx`, `src/features/payments/components/qris-checkout.tsx`; create `src/features/landing/components/landing-plan-card.tsx`, `plan-price.tsx`, `src/features/payments/hooks/use-plan-quote.ts`, `components/plan-checkout.tsx`; test `tests/e2e/plan-claim.spec.ts`.

**Interfaces:**

- `usePlanQuote(planId: PaidPlanId)` returns quote/null, pending, error, claim(), refresh(); hook uses Task3 DTOs only.
- `PlanCheckout({ intentId }: { intentId: string })` loads/adopts owned reservation, renders same invoice and Task5 status view; never switches to latest invoice of another purpose.
- Paid CTA with quote links `/checkout/qris?intent=...`; without claim CTA creates undiscounted reservation on intentional purchase then continues. Free CTA remains registration/dashboard, with no payment call.

- [ ] Tulis E2E gagal: claim beside price changes149000 to official141550+51=141601 while URL unchanged and no QR; lifetime399000 to379050+51=379101; Free no claim; reload reuses quote and CTA uses same order. Mock provider at test server boundary, not only display values.
- [ ] Jalankan `npm run test:e2e -- tests/e2e/plan-claim.spec.ts --reporter=line`; harapkan FAIL before UI wiring.
- [ ] Implementasikan responsive pricing, price breakdown, expires/error states, login-required eligibility copy. Never invent uniqueAmount when provider not confirmed. Disable duplicate claim while loading; failed claim leaves original price and useful message.
- [ ] Apply only Free/Lifetime hover:bg-primary-hover hover:text-white and equivalent focus-visible. Keep Premium class string unchanged. Separate existing Rp5000 integration checkout from plan flow with explicit purpose.
- [ ] Jalankan E2E Task7; harapkan PASS desktop/mobile and no overflow.

## Task 8: Persistensi resource dan pembatasan fitur pada server

**Files:** Create `src/server/workspaces/resource-repository.ts`, `resource-policy.ts`, `resource-service.ts`, `resource-policy.test.ts`; create `src/app/api/workspace/resources/[kind]/route.ts`, `src/features/customer-workspace/adapters/resource-adapter.ts`; modify customer composition for `src/app/planner/guests/page.tsx`, `tasks/page.tsx`, `moodboard/page.tsx`, `finance/page.tsx`, `invitations/page.tsx`, `invitations/studio/page.tsx` dan feature hooks/components terkait.

**Interfaces:**

- `ResourceKind = 'guests' | 'tasks' | 'documents' | 'finance' | 'moodboard' | 'invitations' | 'studio-drafts'`; per-kind bounded Zod schemas, no arbitrary SQL/table names from URL.
- `readResource(owner: string, kind: ResourceKind): { revision: number; data: unknown }`; `writeResource(owner: string, kind: ResourceKind, expectedRevision: number, data: unknown): { revision: number }` validates ownership/schema/capability inside transaction.
- Free: 100guests, basic checklist/documents/finance and one basic-template invitation; premium unlimited guest/task counts and premium capabilities; Lifetime additionally multi-invitation. Payload limit1MiB, lists capped10000 per write for resource exhaustion protection; unlimited subscription means no plan quota, pagination/chunks handle larger datasets.

- [ ] Tulis tes gagal free guest100 succeeds/101 rejects, paid101 succeeds, template premium denied free, moodboard/studio denied free, single invitation versus Lifetime multi, expired premium loses write privileges while existing data remains readable/exportable within ownership. Free basic tasks not given an invented undisclosed paid quota.
- [ ] Test IDOR, malformed resource payload, stale revision409, sign-out/sign-in draft partition, privileged actions through direct API with forged client entitlement.
- [ ] Jalankan `npm test -- src/server/workspaces/resource-policy.test.ts`; harapkan FAIL.
- [ ] Implementasikan persistent owner-scoped data/adapters dan conditional controls in existing screens. Studio publication authority checked server-side. Client local draft keys include owner/workspace and are recovery-only, never rights authority; do not silently import shared demo localStorage into customer accounts.
- [ ] Jalankan policy tests dan relevant existing feature tests; harapkan PASS. Pastikan created task/guest/moodboard/draft survives reload/server restart in E2E Task11.

## Task 9: Fitur paket yang masih maintenance dan integrasi eksternal

**Files:** Create `src/server/workspaces/pdf-report.ts`, `pdf-report.test.ts`, `domain-service.ts`, `domain-service.test.ts`, `support-service.ts`, `support-service.test.ts`; create `src/app/api/workspace/export/route.ts`, `src/app/api/workspace/domain/route.ts`, `src/app/api/workspace/support/route.ts`, `src/app/api/operations/helpdesk/route.ts`; modify `src/features/wedding-kit/components/wedding-kit-screen.tsx`, `src/features/invitation-manager/components/domain-panel.tsx`, `src/features/platform-operations/components/helpdesk-panel.tsx`, customer invitation composition; create `src/features/customer-workspace/components/plan-export.tsx`, `priority-support.tsx`.

**Interfaces:**

- GET export requires pdf capability, generates account data printable document response; provide browser print-to-PDF with title/print stylesheet rather than claim a binary PDF if no generator exists. Output includes actual plan/guest/task/finance data selected by owner, escaping all user text.
- Domain states `unconfigured | pending-dns | pending-hosting | active | failed`; `requestDomain(owner: string, hostname: string)` requires Lifetime + hostname validation, creates ownership DNS challenge. `verifyDomain(owner: string)` uses DNS checks and actual serving HTTPS/hosting proof; never declares active from an arbitrary successful HTTP request.
- `createSupportRequest(owner: string, message: string): { id: string; priority: 'standard' | 'priority' }`; priority determined server-side. Persist queue visible through existing authorized operations surface; do not send external messages.

- [ ] Tulis tes gagal PDF ownership/escaping and capability checks; domain reserved/localhost/IP rejection and cross-owner collision, correct TXT still pending-hosting when hostname not routed; support priority determined from Lifetime, not submitted flags; nonoperations account cannot read global helpdesk. Operations endpoint mengikuti role guard nyata yang ada dan tidak memakai flag role kiriman client.
- [ ] Jalankan `npm test -- src/server/workspaces/pdf-report.test.ts src/server/workspaces/domain-service.test.ts`; harapkan FAIL.
- [ ] Implementasikan useful PDF export, persisted multi-invitation CRUD and owner-correct public publishing route, domain configuration/verification and support queue. For real custom-domain activation, assess existing hosting: external DNS/hosting changes require actual account access/configuration; without those, expose pending and specific next action, never active. Do not mark end-to-end domain activation complete until actually verified.
- [ ] Run tests and browser PDF/owned invitation checks. Domain integration uses fake DNS/hosting for automated tests; real activation remains explicit verification with the user's actual domain, not fabricated success. No new paid dependency/service.

## Task 10: Popup fitur terbuka dan guide yang memfokuskan target

**Files:** Create `src/features/subscriptions/types.ts`, `config/guide-targets.ts`, `domain/guide-state.ts`, `domain/guide-state.test.ts`, `components/unlocked-features-dialog.tsx`, `components/feature-guide.tsx`, `hooks/use-subscription-notice.ts`; create `src/app/api/subscriptions/notices/[grantId]/route.ts`; modify customer shell/dashboard and feature target elements.

**Interfaces:**

- `SubscriptionNotice { grantId: string; capabilities: readonly Capability[]; state: 'new' | 'started' | 'dismissed' | 'completed'; step: number }` is owner-specific and server-generated feature delta.
- `GuideTarget { capability: Capability; href: string; targetId: string; title: string; description: string }`; registry includes guests/tasks, template chooser, studio, moodboard, PDF export, multi-invitation, domain settings, priority help. Exclude Free carry-over and expiry-only renewals.
- PATCH notice accepts `{ action: 'start' | 'next' | 'back' | 'dismiss' | 'complete'; expectedStep: number }`; server verifies owner/grant and state progression. Replaying stale action returns current state, not an extra advance.

- [ ] Tulis tes gagal newly-unlocked delta, Premium-to-Lifetime only new features, renewal no duplicate tour, next/back clamp, stale replay idempotence, owner mismatch404, target absent safe skip explanation.
- [ ] Jalankan `npm test -- src/features/subscriptions/domain/guide-state.test.ts`; harapkan FAIL.
- [ ] Implementasikan dialog/guide using existing UI primitives, route navigation then bounded target wait, scrollIntoView/focus highlight, Escape/Lewati and focus restore; no indefinite overlay when target missing. Persist progress and dismiss per owner/grant; render only after accessReady server confirmation. Domain guidance says configuration required until actual activation.
- [ ] Jalankan domain tests and E2E guide keyboard/mobile steps in Task11; harapkan PASS and focus not trapped outside dialogs.

## Task 11: Integrasi browser, pemeriksaan akhir, dan server lokal

**Files:** Create `tests/e2e/plan-checkout.spec.ts`, `plan-access.spec.ts`, `plan-guide.spec.ts`; modify `tests/e2e/auth-google.spec.ts`, `qris-payment.spec.ts`, `qris-discount.spec.ts`, `account-plans.spec.ts` for explicit real/preview distinction; document local test path in existing README if relevant.

**Interfaces:** Tests use isolated temporary SQLite paths, fake provider responses and signed synthetic test sessions from existing test helpers. Never forge the user's Google identity or replace production webhook/payment data; real user login/payment remains in their browser.

- [ ] Tulis E2E: guest claim→Google return/adopt→same QR amount; authenticated empty profile→payment success→persistent plan badge/features→popup→Next scroll/focus. Cover both paid tiers, Free no payment, expired/pending/error/manual-refresh UX, rejected cross-account intent and test invoice no unlock.
- [ ] Tambahkan network-timeout/create recovery, concurrent callback+manual check, unavailable domain target and logout/login during guide. Mobile price/card/CTA no horizontal overflow; hover Free/Lifetime colors match expected Premium-hover token, Premium initial/hover unchanged.
- [ ] Jalankan focused E2E, lalu `npm test`, `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run db:validate`, `npm run build`, `npm run test:webhook-proxy`. Harapkan semua exit0; laporan jumlah tes berasal dari output aktual, bukan baseline lama. Jalankan full E2E bila suite lokal siap; jelaskan kegagalan lingkungan secara tepat, jangan diam-diam mengabaikannya.
- [ ] Fresh whole-change code review sesuai metode Native; fokus auth ownership, settled amount ceilings, SQLite races, promo eligibility, real capability coverage dan regressions. Perbaiki temuan lalu ulangi hanya pemeriksaan relevan, diikuti build bila kode produksi berubah.
- [ ] Pastikan local3201 health200, login redirects retain intent, webhook proxy/tunnel current responds at exact path. Keep local services running for user's browser test. Do not expose all local routes through tunnel.
- [ ] Hapus hanya scratch/report/screenshot yang dibuat selama pekerjaan dan tidak dibutuhkan, setelah memverifikasi resolved path tetap di workspace/temp tugas. Pertahankan durable tests dan dokumentasi. Jangan menghapus file pengguna atau audit historis tanpa dasar.
- [ ] Report completed behavior, actual verification, local link dan any actual external hosting blocker. Real paid receipt/provider status hanya diuji jika user sendiri membayar; tidak mengaku lunas dari mock atau mengklaim semua fitur siap jika domain hosting belum terhubung.

## Urutan eksekusi dan gerbang akhir

Task1→2→3→4→5 membangun kontrak dan invariant pembayaran; Task6 menyediakan akun nyata, Task7 menghubungkan UI, Task8–9 memenuhi fitur yang dijual, Task10 menghubungkan pengenalan fitur, Task11 memverifikasi alur utuh. Kerjakan langsung dalam sesi ini sesuai arahan pengguna sebelumnya (Native), dengan satu independent review akhir; jangan memakai AGY/Tsiji yang belum tersedia.

Status: implementasi lokal telah dijalankan sesuai persetujuan pengguna. Verifikasi akhir: 478 tes unit, 25 tes browser terfokus, 4 tes webhook proxy, build/TypeScript, format, dan validasi Prisma lulus. Lint menyisakan peringatan lama tanpa error. Checklist di atas mempertahankan rincian rancangan awal; variasi pelaksanaan dan hasil review dicatat dalam ledger lokal. Aktivasi hosting/HTTPS custom domain dan pembayaran nyata tidak disimulasikan sebagai keberhasilan produksi.

Untuk mengulang tes browser, jalankan `npm run build` lalu `npm run test:e2e:customer`. Suite membuat database SQLite terpisah di direktori sementara, memakai akun sintetis, dan tidak membuat pembayaran provider nyata. Pengujian unit dijalankan dengan `npm test`.

Konfigurasi opsional terdapat di `.env.example`: `PAYMENT_DATABASE_PATH` mengubah lokasi SQLite; `OPERATIONS_EMAIL_ALLOWLIST` berisi email Google operator yang boleh membaca antrean bantuan. Nilai kosong menolak akses operator. Custom domain dengan TXT benar berstatus `pending-hosting` sampai routing dan sertifikat HTTPS benar-benar tersedia. Reservasi anonim dibatasi 5 per identitas per jam serta anggaran bersama 20 per menit/100 per jam; akun yang sudah masuk tetap memakai batas per akun.
