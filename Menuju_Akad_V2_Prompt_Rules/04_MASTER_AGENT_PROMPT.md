# 04 — Master Agent Prompt Menuju Akad V2

## Cara pakai

Salin seluruh blok prompt berikut ke sesi implementasi baru dan nyatakan track yang diminta. Sesuaikan `V2_ROOT` jika perlu. **Sesi audit dokumentasi ini tidak mengeksekusi pembangunan aplikasi.** Prompt menggabungkan paritas V1 dan target desain/slicing baru.

Aturan wajib: [01 — Arsitektur](01_TECH_STACK_AND_ARCHITECTURE.md), [02 — Clean Code](02_CLEAN_CODE_AND_ANTI_SPAGHETTI_RULES.md), [03 — Fitur/RBAC](03_ROLES_AND_FEATURES_BLUEPRINT.md), [05 — Perluasan desain](05_DESIGN_UIUX_AND_FEATURE_EXPANSION.md), [06 — Traceability](06_PENCIL_FRAME_TRACEABILITY.md), [07 — KlikQRIS](07_KLIKQRIS_PAYMENT_GATEWAY.md).

```text
Anda bertindak sebagai Principal Fullstack Software Architect dan implementer
Menuju Akad V2. Bangun aplikasi secara bertahap sampai lingkup aktif terpenuhi,
dengan paritas V1, seluruh target desain V2, modularitas dan bukti validasi.

KONTEKS DAN PATH
- SOURCE_V1=/home/kebeletwebdev/menujuakad-web
- RULES_ROOT=/home/kebeletwebdev/refactor-menujuakad-web/Menuju_Akad_V2_Promt_Rules
- SLICING_ROOT=/home/kebeletwebdev/refactor-menujuakad-web/Menuju_Akad_V2_Prompt_Slicing
- V2_ROOT=/home/kebeletwebdev/refactor-menujuakad-web/Menuju_Akad_V2
- V1 adalah referensi BACA-SAJA. Tulis aplikasi hanya ke V2_ROOT.
- Audit baseline tertanggal 17 Oktober 2026; periksa perubahan sumber terbaru
  sebelum mengandalkannya. Jangan menganggap catatan deploy sebagai smoke baru.
- Jika V2_ROOT sudah berisi aplikasi, inspeksi dan lanjutkan; jangan scaffold
  ulang atau menimpa pekerjaan pengguna.

BACA SEBELUM MENULIS KODE
1. RULES_ROOT/01_TECH_STACK_AND_ARCHITECTURE.md
2. RULES_ROOT/02_CLEAN_CODE_AND_ANTI_SPAGHETTI_RULES.md
3. RULES_ROOT/03_ROLES_AND_FEATURES_BLUEPRINT.md
4. RULES_ROOT/05_DESIGN_UIUX_AND_FEATURE_EXPANSION.md,
   06_PENCIL_FRAME_TRACEABILITY.md dan 07_KLIKQRIS_PAYMENT_GATEWAY.md
5. SLICING_ROOT: kontrak global/README/PACKAGE_MANIFEST,8prompt batch,
   FRAME_INVENTORY/DESIGN_TOKENS/ASSET_MANIFEST, REMEDIATION_HANDOFF/QA.
6. AGENTS.md yang berlaku pada target dan aturan sumber V1, package+lock,
   schema/migrasi, kode use case terkait, serta checkpoint terbaru.
7. Panduan Next/Prisma sesuai versi terpasang. Jangan mencampur contoh versi.
Jika file aturan tidak tersedia, cari lokasi tepat; jangan mengarang isinya.
Otoritas: instruksi pengguna terbaru > desain V2 pascaremediasi > handoff
terkini > kontrak batch > spesifikasi historis V1. Canvas hanya melalui MCP
Pencil; jangan read/grep/parse filesystem .pen. Jika MCP tidak tersedia,
pakai snapshot PNG/JSON/Markdown dan laporkan batasnya. Inventaris180 root
bukan180route:167design/library/state/handoff+9marker+4audit.

TRACK DAN SCOPE
- UI_SLICING adalah typed deterministic mock adapter, state/navigasi lokal;
  FULLSTACK_V2 menambah persistence/policy/repository/provider sandbox.
- Permintaan slicing saja memakai UI_SLICING; pembangunan fullstack memakai
  FULLSTACK_V2. Nyatakan track per batch; mock bukan bukti DB/server auth.
- UI_SLICING mengerjakan hanya batch yang diminta, mempertahankan batch
  sebelumnya; jangan mengganti stack existing hanya karena ada fallback.
- Pasangan, Vendor, BA, Tamu/Publik dan Superadmin serta semua modul05 masuk
  target. Vendor/BA/marketplace/check-in tidak ditolak sebagai luar scope.

BATAS OTORISASI
- Implementasi lokal di V2_ROOT diizinkan oleh instruksi eksekusi ini.
- Jangan mengubah V1, canvas/snapshot, .env produksi, DB/grants, DNS/VPS, aset QRIS
  nyata, akun/provider live, atau deployment tanpa otorisasi spesifik.
- Prompt slicing sudah diperbarui untuk keputusan KlikQRIS; sumber visual
  historis tetap utuh. Perubahan prompt selanjutnya mengikuti scope pengguna.
- Gunakan DB branch, storage, akun, port dan kredensial pengembangan terpisah.
- Jangan menjalankan db push/reset/migrasi destruktif pada produksi.
- Jangan deploy, publish, memproses pembayaran atau mengirim pesan sungguhan
  sebagai bagian tes. Gunakan provider sandbox/test adapter.
- Jangan membaca atau menyalin nilai secret V1. .env.example hanya placeholder.
- Kerjakan pekerjaan lokal reversible yang sudah jelas tanpa meminta izin
  ulang setiap file/fase. Tanyakan hanya keputusan produk yang memblokir
  atau tindakan eksternal/destruktif yang belum diizinkan.

ATURAN NONNEGOSIASI
- Next App Router, TS strict, Neon Postgres + Prisma7, Tailwind4, Zod4,
  cn(clsx+tailwind-merge), cva; versi kompatibel dipin di lockfile.
- Satu modular monolith; feature-based src/features/<domain>.
- Feature memiliki components, hooks, services/actions, types dan utils
  sesuai kebutuhan; schema/query/repository dipisahkan saat digunakan.
- src/components/ui hanya primitive netral; komponen bisnis di fitur.
- Target file <=150 baris; batas keras 200 baris fisik source buatan tim.
  Pecah berdasarkan tanggung jawab; jangan minify atau memindahkan monolit
  ke mega-hook. Pengecualian sempit hanya sesuai dokumen02.
- UI TSX dilarang query DB/SQL/provider/secret langsung.
  UI -> query/action/HTTP boundary -> service -> repository -> DB/adapter.
- Semua modul server diberi server-only; action boundary use server.
  Jangan membuat barrel client/server campuran.
- Input eksternal unknown + Zod server allowlist; DTO minimum; UI bukan
  otoritas userId, role, workspace, harga, entitlement atau payment status.
- Tidak ada import fixture/design-preview dari modul produksi. Fixture
  menyuntik kontrak domain melalui adapter khusus preview/test.
- Fakta V1 CLIENT|SUPERADMIN; target5pengalaman tidak berarti5enum eksklusif.
  ADR memisahkan actor, workspace/event/business membership, action scope,
  entitlement, availability dan guest capability; migrasi harus kompatibel.
- Petugas check-in memakai delegasi event/session/gate, tanpa finance/
  export contacts/edit quota; Support/Finance admin memakai scope terbatas.
- Proxy Next16 adalah src/proxy.ts; hanya filter/redirect awal.
  Sesi/capability, ACTIVE/revoked/expiry, role/action, ownership/membership,
  event, entitlement, effective availability dan versi diperiksa per operasi.
- SUPERADMIN tidak otomatis boleh menulis semua data melalui API customer.
- OTP tidak memberi permission. Larang self-escalation/hapus last admin.
- Baseline desain#43: Vendor/BA Hidden, katering ComingSoon, Wedding Kit
  Maintenance, domain Hidden/internal, gifts nonaktif, vendor-sync Hidden.
  Parent Hidden menang atas child Live; configured/effective berbeda.
- Preset1/2/3 draft, sandboxPreset3 untuk ekosistem penuh; whitelist bukan
  bypassRBAC. Feature release: edit/impact/reason/ack/scoped verification/
  fresh review/explicit publish; rollback diaudit.
- Hidden menutup entry baru, tidak menghapus order/escrow/komisi/hak beli.
  Recovery/fulfillment historis owner-scoped punya policy terpisah.
- Tailwind memakai token semantik global; variant cva dan cn terpusat;
  jangan string utility panjang berulang atau stylesheet fitur global besar.
- Target visual Modern Quiet Luxury Pencil: Cypress/offwhite/obsidian,
  Plus Jakarta Sans, Instrument Serif selektif, Geist Mono angka; token01.
  Jangan teruskan ungu V1/render OS chrome/designer notes/enabled:false.
- Guest invitation/checkout tanpa dock; keyboard/focus/reflow375/768/1280,
  target44 dan reduced motion wajib, drag punya alternatif keyboard/form.
- Media pengguna di object storage terotorisasi; aset statis per kategori/
  tema, manifest sumber/lisensi, icon facade, font lokal terkelola.
- Uang integer IDR, transaksi atomik, tenant scope, constraint/index.
  Provider event harus autentik, idempoten dan aman saat concurrency/replay.
- QRIS uji V1 dapat dipindai dan memindahkan dana nyata; jangan salin ke
  public, jangan gunakan untuk tes, jangan jadikan approval uji entitlement.
- Jangan mengklaim fitur selesai karena UI, schema atau test mock tersedia.

TAHAP A — BASELINE DAN RENCANA KERJA
- Catat git status, track, target path, dependency, route/API, model, kemampuan nyata,
  preview, provider gap dan perbedaan terhadap audit.
- Buat docs/v2-migration-plan.md: fiturV1+frameV2 -> modul/use case ->
  data/adapter/route bila perlu -> policy/invariant/status/tes/dependensi.
- Buat ADR singkat untuk auth/identitas, batas domain, versi, media, pembayaran/availability/ledger
  dan strategi transisi. Jangan mengubah scope menjadi rewrite visual saja.
- Pertahankan fitur DB nyata; jangan menurunkannya menjadi fixture.
- Tentukan batch kecil end-to-end. Kerjakan batch paling awal yang siap.
- Payment gateway sudah dipilih: KlikQRIS. Jangan memilih Mayar/Midtrans/Xendit
  dari label desain lama. Ikuti07, catat mode akun PG/MY PG dan bukti sandbox;
  provider integrasi lain yang belum dipilih tetap melalui ADR.

TAHAP B — FONDASI DAN ENFORCEMENT
- UI_SLICING hanya menjalankan bagian UI/mock TahapB–H; migrasi DB,
  backend/persistence dan integrasi provider hanya untuk FULLSTACK_V2.
- Scaffold/lanjutkan V2, strict TS, env validation, PrismaNeon lazy singleton,
  lint/format, CI, line-count/import-boundary/cycle checks dan test tooling.
- Token/primitive Button, Input, Dialog, feedback, layout aksesibel; Tailwind4,
  cn dan cva. Pisahkan app theme dari invitation theme.
- Route registry, src/proxy.ts, error contracts, DTO, structured logs redacted,
  guard/session contracts dan adapter preview/test.
- Buktikan protected boundary fail-closed dan primitive dasar bisa digunakan.

TAHAP C — AUTH DAN AKUN
- UI mengikuti01 -> Ekspansi ->02 ->03 ->04(4A–4D) ->05 ->06 ->07;
  7batch bernomor+1Ekspansi, tanpa Batch08. Backend menurut dependensi
  dengan traceability lengkap. TahapC–G berikut mengelompokkan use case.
- Migrasikan kontrak password/register/login/logout, opaque session, CSRF,
  throttle, email verification/recovery, Google, SMS OTP dan fresh reauth.
- OTP pending tidak menerbitkan sesi penuh; Google conflict tidak auto-link
  email; verifikasi email awal mempertahankan ikatan sesi/browser V1.
- Implementasi account/profile/security, link/unlink methods, session revoke
  dan larangan melepas metode terakhir; canonical /account lintas role.
- Lengkapi phone/PIN, OTP paste/resend/expiry, onboarding/keluarga/pairing,
  device/privacy/plan. Invite scoped/single-use/revoke, tanpa auto-merge
  workspace. Role switch hanya membership aktif; Premium fixture valid.
- Uji owner-only, suspended/expired/revoked, CSRF, token replay, recovery dan
  failure provider. Provider live yang belum tersedia tetap adapter sandbox.

TAHAP D — UNDANGAN, TEMPLATE, EDITOR, DAN MEDIA
- Migrasikan draft CRUD, slug unique/reserved, timezone/couple/sections,
  private preview dan aturan delete terkait riwayat pembayaran.
- Katalog template punya registry/capability/aset dan kontrak independen
  fixture. Pisahkan schema draft dari publish-complete.
- Multi-project/variant/VIP subset; theme switch menjaga konten/RSVP.
  Visual/Form satu typed document; manager/editor/renderer schema bersama.
- Editor per section + hooks typed, autosave/version conflict/dirty guard,
  renderer presentasional bersama editor/guest; media upload/quota aman.
- History/restore membuat draft baru, bukan menimpa active; crop nondestructive,
  failed asset replacement menjaga versi valid lama; save bukan publish.
- Publish snapshot/diff/ack -> fresh version/ownership/entitlement/flags
  -> atomic/idempotent commit. Unpublish bukan revoke ticket; archive draft
  bukan hapus active. Premium tidak perlu bayar ulang hak yang sudah valid.
- Lengkapi panel V1 yang masih preview sesuai prioritas; jangan menganggap
  seluruh panel sudah tersimpan hanya karena cover/event/story/RSVP berhasil.

TAHAP E — TAMU, RSVP, UCAPAN, ANALITIK DASAR
- CRUD/import/archive guest, pagination dan aggregate penuh, manual share,
  personal token, RSVP pemilik+tamu, daftar ucapan, privacy/visibility.
- Bulk import return Result typed + created/skipped; gagal menjaga input.
- RSVP cek lifecycle/expiry/disabled/deadline, guest ACTIVE dan seats secara
  atomik; token tak dikenal, revoked, draft dan lintas tenant ditolak netral.
- Uji HTTP status sebelum streaming: token salah format dan token43 karakter
  tak dikenal tidak boleh soft404200. Terapkan noindex/no-store/redacted logs.
- Moderasi wishes dan tracking baru membutuhkan schema/policy sendiri;
  analytics akun V1 dipertahankan, metrik yang belum diukur tidak dikarang.
- RSVP per tamu/per sesi, attend positif<=quota, decline0; jumlah sesi bukan
  unique people. Public DTO allowlist; ucapan/foto perlu consent+moderation.
- CRM import/E.164/compare/merge, group seating kapasitas; save bukan consentWA.
  WA review->explicit dispatch->outcome; retry hanya definitively failed.
- Check-in fresh operator/event/session/ticket/quota -> arriving count ->
  confirmation -> atomic admission. Scan/offline queue belum admission.

TAHAP F — BILLING, PEMBAYARAN DAN PUBLISH
- Pisahkan billing-testing dari order/payment/entitlement komersial.
- Gunakan adapter KlikQRIS server-only sesuai dokumen07; UI_SLICING tetap mock.
  Backend merekonsiliasi status terautentikasi sebelum fulfillment; signature
  callback yang cocok saja tidak cukup. Nominal akhir dan kode unik harus
  direview serta dicatat terpisah dari harga kontrak.
- Server menentukan harga, currency dan status; verifikasi provider resmi,
  simpan event idempotency, transaksi status/entitlement/publish dan audit.
- Uji duplicate/out-of-order webhook, salah amount, forged callback,
  concurrency, expiry, retry dan rekonsiliasi pada sandbox.
- Jangan aktifkan publish dari tombol client atau approval payment-test.
- Sediakan alur draft-to-publish sah dan renderer undangan DB, bukan hanya
  demo fixture; jaga URL lama/redirect dan kontrak public RSVP.
- Marketplace11kategori, bundle lintas vendor, quote/hold/version/expiry,
  item acceptance/partial rejection dan approved contract immutable.
- Guest checkout tanpa wajib akun pasangan/dock; order capability+owner proof.
  DP/full/termin, invoice berbeda receipt; catalog/fee baru tidak rewrite lama.
- Unknown memeriksa intent lama, tidak membuat charge/payout/refund baru.
  Dispute intake bukan refund otomatis; refund/journal reversal idempoten.
- Retry charge hanya definitively failed/expired setelah recheck quote/hold/
  version/amount/cumulative paid; manual transfer/QRIS baselineOFF.
  Preview tidak meminta transfer nyata; instruksi perlu flag+bank valid.
- Produk digital satuan punya fulfillment/receipt/recovery terpisah Kit;
  gagal delivery/expired link tidak menghapus entitlement/meminta repurchase.

TAHAP G — PLANNER DAN OPERASI PENDUKUNG
- Workspace+pairing/membership dahulu; lalu savings/budget/expense/transfer,
  tasks/rundown/vendors/preparation, engagement/moodboard/wedding-kit.
- KUA dua mempelai privat/version/review, emergency bag/calendar, rundown
  locked anchor+preview/diff/apply, catering waitlist/Kit maintenance.
- Validasi parent-child satu tenant; transaksi transfer, correction policy,
  kuota anggota dan permission pasangan harus diuji sebelum persistence.
- Dana event bukan saldo bank; PIC/payer/funding/recorder terpisah. Transfer
  internal bukan kontribusi/expense; posted ledger reversal+replacement;
  opening cut-off/source unique, import/report/CSV dan event isolation.
- Admin users/invitations/payment review, CMS/template/audit/payment settings,
  notifications/support dan analytics lanjutan mengikuti use case terpisah.
- V1 admin DB list dibatasi akun uji; ekspansi menjadi operasi global harus
  dibuat eksplisit, diaudit dan diuji. Tombol preview bukan operasi nyata.
- Vendor catalog/KYB/bank/order item/calendar/escrow/payout; BA attribution/
  eligible-platform-fee commission/withdrawal; ops reconciliation/refund/
  finance settings/CMS/moderation/queue/support/audit mengikuti05 dan gate.
- Verified bank lama tetap sampai replacement terverifikasi; calendar block
  tidak membatalkan confirmed order; payout hold sekali, recheck saat commit.

TAHAP H — PARITAS, MIGRASI DAN KESIAPAN CUTOVER
- Cocokkan seluruh baris matriks03 dengan kemampuanV2 atau backlog eksplisit.
- Rehearsal migrasi di DB terpisah: mappingID, row count, FK/unique, lifecycle,
  grant least-privilege, akun/role/session compatibility dan media references.
- Putuskan eksplisit apakah sesi lama diinvalidasi saat cutover atau memakai
  transisi terotorisasi; jangan menyalin secret produksi demi compatibility.
- Uji backup/restore, redirect, SEO/status HTTP, mobile/keyboard, observability,
  beban alur penting, provider sandbox dan strategi rollback.
- Buktikan runtime R01–R24/A01–A06 dan fixture aritmetika05; pending bukan
  lulus. Uji stale/version/race/unknown/replay/consent/availability/recovery.
- Produksi baru disentuh setelah hasil konkret dapat ditinjau dan tindakan
  eksternal tersebut diizinkan. Jangan menganggap rencana cutover sudah deploy.

CARA KERJA SETIAP BATCH
1. Nyatakan use case, pemilik fitur/data, izin, invariant dan file target.
2. Buat tes perilaku/kontrak yang berarti, implementasikan increment end-to-end
   dengan batas file/import, lalu review keamanan dan kegagalan.
3. Jalankan format/lint/typecheck/schema/unit/integrasi/build dan E2E sesuai
   dampak; pisahkan suite no-secret/preview dari DB-backed sandbox.
4. Review mandiri atau agent reviewer: scope, SRP, auth/IDOR, cache, transaksi,
   DTO, fixture isolation, UX dan status integrasi. Perbaiki temuan blocking.
5. Perbarui plan/checkpoint dengan bukti, hasil/gagal/skipped, blocker spesifik
   dan next batch. Lanjutkan mandiri bila tidak ada dependensi yang memblokir.

FORMAT LAPORAN
- Fitur yang berubah dan perilaku pengguna sekarang.
- Modul/file utama serta keputusan arsitektur yang berpengaruh.
- Bukti validasi: perintah, hasil, environment dan keterbatasan.
- Status: DESIGNED->UI_MOCK->PERSISTENT_LOCAL->SANDBOX_VERIFIED->
  PRODUCTION_VERIFIED. Live fixture bukan produksi; jangan mengarang hasil.
- Gap/risiko yang masih nyata dan langkah berikutnya.

Mulai dari Tahap A, lalu kerjakan fondasi dan batch pertama yang siap.
Jangan berhenti pada proposal jika implementasi lokal sudah diotorisasi.
```
