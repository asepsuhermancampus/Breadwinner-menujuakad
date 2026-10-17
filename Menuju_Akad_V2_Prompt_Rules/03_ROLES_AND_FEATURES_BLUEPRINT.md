# 03 — Blueprint Fitur, Role, dan Permission

## Legenda dan batas bukti

Snapshot sumber lokal: 17 Oktober 2026, `/home/kebeletwebdev/menujuakad-web`. **DB** = ada jalur service/repository persisten; **UI** = fixture/state lokal; **SCHEMA** = model tersedia tanpa use case backend; **BACKLOG** = belum ditemukan implementasi menyeluruh. Label DB tidak berarti diuji ulang atau siap produksi pada audit ini.

`CHANGELOG.md:3-19` mencatat perubahan RSVP/ucapan serta migrasi/grant tamu dan deploy 14 Oktober; `:58-71` mencatat login dua role di produksi 11 Oktober. Status ini historis. Audit tidak mengakses Neon/provider/produksi dan tidak menjalankan tes.

Permintaan lanjutan memasukkan desain Pencil dan paket slicing ke **scope target V2**. Label **DESIGNED** adalah spesifikasi baru, bukan bukti backend V1. Inventaris dan invariant lengkap ada pada [05](05_DESIGN_UIUX_AND_FEATURE_EXPANSION.md); [06](06_PENCIL_FRAME_TRACEABILITY.md) melacak seluruh root snapshot. Scope Vendor/BA/marketplace/check-in di bawah sekarang wajib direncanakan dengan gate, bukan ditolak sebagai backlog di luar permintaan.

## Pemetaan seluruh kemampuan V1 ke modul V2

Modul tujuan mengikuti `src/features/<nama>` dengan struktur dokumen [01](01_TECH_STACK_AND_ARCHITECTURE.md). Baris berisi beberapa modul menunjukkan pemisahan tanggung jawab; bukan instruksi membuat folder kosong sekaligus. Dalam tabel inventaris, awalan `app/`, `features/`, `server/`, `config/` dan `proxy.ts` relatif terhadap **`src/`**; path schema/CI/deployment relatif repository.

| Domain/fitur V1 | Bukti sumber relatif `menujuakad-web/` | Status nyata/batas | Modul V2 |
|---|---|---|---|
| Beranda, about, cara kerja, FAQ pencarian/kategori, pricing, kontak, terms/privacy | `app/(public)/`; `features/marketing/` | Halaman tersedia; konten/harga contoh; kontak hanya validasi browser, tidak mengirim | `marketing`, `content`, `support` |
| Blog/artikel, SEO, canonical, sitemap/robots, error/loading/not-found | `features/marketing/`; `app/{sitemap,robots}.ts`; `config/seo.ts` | Statis/fixture; sitemap whitelist, private/preview noindex | `content`, `marketing`; boundary tetap `app` |
| Katalog/filter/detail/demo tema/template | `features/templates/`; `proxy.ts:28` | Publik fixture; template untuk draft DB dibatasi template internal seed (`server/invitations/repository.ts:7`) | `templates` |
| Register email/telepon + password, login/logout | `server/auth/{registration-service,auth-service,auth-handlers}.ts` | DB; registrasi selalu CLIENT, scrypt, throttle, sesi opaque | `auth` |
| Google OAuth login/link/reauth; email verification/recovery; SMS OTP request/resend/verify | `server/auth/`; `server/integrations/auth/providers.ts` | Kode tersedia; konfigurasi/provider live belum terverifikasi; OAuth conflict tidak otomatis link berdasar email | `auth`, platform provider adapters |
| Profil/security, password, contact/email/phone link/unlink/verify, Google unlink, SMS OTP policy, fresh reauth, session list/revoke | `server/account/`; `features/account/` | DB own-account; reauth sensitif dan larangan melepas metode login terakhir | `account` |
| Dashboard customer, daftar/buat/detail/hapus draft undangan | `features/workspace/components/customer-invitation-views.tsx`; `server/invitations/` | DB owner-scoped; maksimum daftar100; hapus draft privat tanpa riwayat payment-test | `invitations` |
| Edit judul/slug/tanggal/timezone, profil pasangan, cover/event/story/RSVP, preview privat | `server/invitations/input.ts:13-69`; `features/workspace/components/` | DB **terbatas** kontrak tersebut; bukan seluruh editor visual | `invitations`, `invitation-editor` |
| Editor sampul: typography/image/overlay, pasangan, cerita, acara, RSVP, publish readiness | `features/invitations/components/editor/` | Editor lengkap UI/local draft; publish hanya simulasi; save preview hilang setelah reload | `invitation-editor`, `invitations` |
| Galeri/quota/unggah, musik, video, countdown, livestream | `editor/{gallery-panel,music-panel,countdown-panel,editor-media-panels}.tsx`; hooks galeri | UI; galeri memakai ilustrasi lokal; tidak ada pipeline upload/audio nyata | `media`, `invitation-editor`, `invitation-renderer` |
| Dress code, hashtag/filter, lokasi/peta, ayat, rundown, protokol, narahubung, kolofon | `editor/{editor-content-panels,editor-extended-panels,editor-settings-panels}.tsx` | UI; map/geocoding/provider belum tersambung | `invitation-editor`, `invitation-renderer` |
| Pengaturan lifecycle, privacy, calendar, custom domain | `features/design-preview/components/invitation-settings/` | UI/BACKLOG; belum ada aktivasi domain/publish komersial | `invitations`, `domains` |
| Undangan publik contoh `/invitation/[slug]` dan `/demo/[templateSlug]` | `app/(public)/`; `proxy.ts:28-33` | Fixture whitelist; jangan disamakan dengan renderer semua undangan DB yang terbit | `invitation-renderer`, `templates` |
| Daftar/ringkasan tamu, tambah, update API, arsip, kategori, alokasi kursi | `server/guests/{service,repository}.ts`; `features/guests/` | DB per undangan; kategori FAMILY/FRIEND/WORK/VIP/VENDOR/OTHER, kursi1–10 | `guests` |
| Impor tamu, preview validasi/dedupe, CSV export | `guest-import-form.tsx`; `features/guests/lib/`; preview hooks | DB bulk paste `Nama;KATEGORI` max500/transaksi; CSV lebih lengkap masih preview; jangan samakan keduanya | `guests` |
| Tautan personal, salin/share WhatsApp, status kirim/buka | `guest-management-view.tsx`; `server/guests/public-repository.ts` | Token DB, manual share; openedAt/lastOpenedAt nyata; tidak ada pengiriman WhatsApp API otomatis | `guests`, `notifications` |
| RSVP dicatat pemilik, status/count/summary | `server/guests/repository.ts:213`; `components/rsvp-view.tsx` | DB upsert satu respons/tamu; ATTENDING/NOT_ATTENDING/MAYBE/PENDING; jumlah dibatasi kursi | `rsvp`, `guests` |
| RSVP tamu lewat `/u/[token]`, pesan/telepon, noindex | `server/guests/public-*`; `app/api/public/rsvp/[token]/route.ts` | DB tanpa login, token43 karakter; invitation isPublished + guest ACTIVE; origin/body/rate limit | `rsvp`, `invitation-renderer` |
| Buku ucapan pemilik | `server/guests/repository.ts:45`; `features/wishes/components/wishes-view.tsx` | DB pesan nonkosong dari tamu aktif, newest200; **moderasi belum ada** | `wishes` |
| Hadiah/amplop, rekening/QR/alamat, deklarasi hadiah | `features/gifts/`; `customer-invitation-views.tsx:77` | UI; bukan settlement atau verifikasi dana | `gifts` |
| Analitik akun periode all/7d/30d | `server/analytics/`; `app/(dashboard)/dashboard/analytics/page.tsx` | DB agregasi undangan dan payment-test; bukan statistik visitor/tamu lengkap | `analytics` |
| Analitik per-undangan, views/unique/conversion | `customer-invitation-views.tsx:73`; `features/analytics/*preview*` | Pending/UI; tracking kunjungan belum diimplementasikan | `analytics` |
| Paket uji, request/riwayat/detail checkout, QRIS terlindungi, approve/reject admin | `server/billing/`; `features/billing/actual/`; `api/billing/`; `api/admin/payment-tests/[id]` | DB PaymentTestRequest; nominal server1000/2000/3000; approval tidak mengubah entitlement/publish | `billing-testing` |
| Paket/checkout komersial, payment method, invoice/renewal, webhook/rekonsiliasi | `features/billing/components/`; `design-preview/components/billing-preview-view.tsx` | UI/BACKLOG pada V1; target V2 memakai KlikQRIS menurut [07](07_KLIKQRIS_PAYMENT_GATEWAY.md), adapter/webhook belum diimplementasikan | `billing`, `payments` |
| Planner workspace, onboarding, pasangan/invite, pengumuman | `features/planner/components/planner-{routes,shell,misc-views,announcement-view}.tsx` | UI/SCHEMA; belum ada server planner, persistence, pengiriman invite atau sinkronisasi pasangan | `planner-workspaces`, `announcements` |
| Tabungan/rekening/target/setoran/transfer | `planner-savings-view.tsx`; schema `SavingsAccount/Transfer` | UI/SCHEMA; rekening catatan bukan koneksi bank | `planner-finance` |
| Anggaran/kategori/alokasi dan pengeluaran | `planner-{budget,expenses}-view.tsx`; `BudgetCategory/Expense` | UI/SCHEMA; belum ada ledger backend | `planner-finance` |
| Tugas/PIC/status, rundown/urutan/event context | `planner-{tasks,rundown}-view.tsx` | UI/SCHEMA; ekspor dokumen belum aktif | `planner-tasks`, `planner-rundown` |
| Vendor catatan/katalog contoh/status bayar | `planner-vendors-view.tsx`; schema `Vendor` | UI/SCHEMA; bukan akun vendor, marketplace atau pembayaran vendor nyata | `planner-vendors` |
| Seserahan, persyaratan nikah/dokumen, lamaran | `planner-seserahan-requirements-view.tsx`; `planner-misc-views.tsx` | UI/SCHEMA; upload dokumen belum ada | `wedding-preparation` |
| Moodboard board/item, wedding kit katalog/order | `planner-misc-views.tsx`; schema moodboard/wedding kit | UI/SCHEMA; beli/download/PDF belum aktif | `moodboards`, `wedding-kit` |
| Notifikasi baca/filter/preferensi | `features/account/hooks/use-notifications-preview.ts` | UI/state lokal; belum ada pengiriman event/provider | `notifications` |
| Support tiket/detail/buat/balas | `features/support/hooks/use-support-preview.ts` | UI/state lokal; belum dikirim/tersimpan | `support` |
| Dashboard admin, daftar users/invitations | `server/admin/{query,repository}.ts`; `features/workspace/components/admin-workspace-views.tsx` | DB read-only, allowlist **11 akun uji**, pagination25; bukan admin global lengkap | `admin` untuk komposisi; `users`, `invitations` untuk use case |
| Review pembayaran uji | `app/(admin)/admin/payments/page.tsx`; `server/billing/service.ts:44` | DB SUPERADMIN; route statis `/admin/payments` mengalahkan cabang preview catch-all | `billing-testing` |
| User management/bulk/lifetime, upgrades, CMS/landing, payment settings, audit | `planner/components/admin-operational-views.tsx`; schema domain terkait | UI/SCHEMA; tombol/dialog lokal bukan mutasi admin nyata | `users`, `billing`, `content`, `payment-settings`, `audit` |
| Template catalog/admin infrastructure/server health/backup UI | `planner/components/admin-{template-catalog,infrastructure}-view.tsx` | UI; tidak membuktikan operasi backup/restore/provider | `templates`, `operations` |
| Preview studio lintas audience/variant, inspector/reference | `features/design-preview/`; `app/preview-ui/`; `src/proxy.ts` | Synthetic whitelist/noindex; alat preview bukan otorisasi produksi | `design-preview` terisolasi |
| Liveness/readiness, CI, standalone/rootless deployment | `server/health/`; `.github/workflows/ci.yml`; `deploy/` | Implementasi operasional tersedia; hasil live tidak diuji ulang | platform `server/health`, deployment tooling |
| Check-in/seating/memory/referral/AI writing | `docs/product-domains.md` | Roadmap V1, bukan fitur aktif; check-in/seating/referral kemudian dispesifikasikan desain V2 | Modul target 05; memory/AI hanya sesuai capability nyata batch, jangan mengarang integrasi AI |

## Perluasan modul dari Pencil dan slicing

Semua baris berikut **DESIGNED**. Hak dan status runtime mengikuti dua matriks akses di bawah serta availability release desain `#43` pada 05.

| Kelompok target | Modul pemilik/use case | Ketentuan utama |
|---|---|---|
| Identitas/pairing/plan/shell | `auth`, `account`, `planner-workspaces`, `plans`, `shell-navigation` | Actor/workspace/event/membership/entitlement terpisah; Premium fixture bukan wajib checkout ulang |
| Planning/KUA/kalender | `planner-tasks`, `kua-documents`, `emergency-checklist`, `planner-calendar`, `planner-rundown`, `wedding-preparation`, `moodboards` | Event terisolasi, dokumen privat, generator preview/diff/apply |
| Katering/Kit/digital | `catering`, `wedding-kit`, `digital-products` | ComingSoon/Maintenance tetap berlaku; produk digital satuan dan hak beli historis punya jalur sendiri |
| Dana acara | `planner-finance` | Kontribusi, budget, pengeluaran, termin, rekening, opening, mutasi, CSV, correction dan ledger; bukan integrasi transfer bank otomatis |
| CRM/admission | `guests`, `rsvp`, `seating`, `check-in`, `notifications` | Per-sesi/quota/consent; petugas scoped; scan bukan admission |
| Marketplace/bundler | `marketplace`, `bundles`, `quotes` | 11 kategori pada 05, per-item availability/hold, guest checkout |
| Contract/commerce | `service-orders`, `contracts`, `payments`, `invoices`, `disputes`, `refunds` | Snapshot approved immutable, DP/full/termin, unknown status recovery, refund terkontrol |
| Undangan/guest experience | `invitations`, `invitation-renderer`, `domains`, `analytics`, `wishes`, `media`, `moderation`, `gifts` | Multi-project/variant, privacy/moderation, domain internal/gifts off, shared schema |
| Studio Visual/Form | `invitation-editor` | Satu document, version/conflict/history/crop/motion/publish, bukan editor terpisah |
| Portal Vendor | `vendor-businesses`, `vendor-kyb`, `vendor-availability`, `escrow`, `payouts` | KYB/bank, katalog, order item, kalender, ledger, payout |
| Portal Brand Ambassador | `affiliates`, `commissions`, `payouts` | Atribusi/promo berbeda; commission dari eligible platform fee, reversal/dedup |
| Operasi admin | `users`, `reconciliation`, `payment-settings`, `audit`, `content`, `operations`, `support`, `notifications` | Scoped finance/support, fee release, KYB/moderation, CMS, queue dan health |
| Feature Studio | `feature-availability` | Configured/effective hierarchy, presets draft, impact/reason/OTP/review/publish/rollback |

Nama modul menentukan kepemilikan, bukan kewajiban folder kosong atau service terpisah. Domain pembayaran/ledger/moderation dipakai lintas portal lewat kontrak; jangan menggandakannya dalam folder `admin`, `vendor` atau `BA`.

## Alur bisnis dan invariant V2

1. **Undangan:** pilih template sah → draft privat → isi section → preview → periksa entitlement server → bila perlu order/payment terverifikasi → review publish → publish → share → RSVP/ucapan. Premium valid tidak perlu bayar ulang setiap publish; V1 belum menghubungkan keseluruhan alur ini.
2. **Draft/publish:** schema draft menerima ketidaklengkapan yang sah; schema publish memerlukan section wajib, media siap, domain/slug valid dan entitlement. Gunakan typed section registry, bukan `Record<string, string>` atau switch raksasa.
3. **Tamu/RSVP:** identitas dari token server; V1 satu respons per tamu dimigrasikan ke respons **per tamu/per sesi** di V2. ATTENDING integer positif ≤ kuota sesi, decline0. Read/write memeriksa guest ACTIVE, lifecycle/availability sesi, deadline/quota secara atomik; jumlah dua sesi bukan unique people.
4. **Planner:** workspace → membership → rekening/anggaran → transfer/pengeluaran → tugas/rundown/persiapan. Setiap from/to account/category/resource wajib milik workspace yang sama. Transfer atomik, tidak boleh lintas tenant; aturan saldo/koreksi ditetapkan sebelum persistence.
5. **Pembayaran:** harga/nominal server; callback browser tidak mengaktifkan produk; authenticity webhook/provider, idempotency dan transisi atomik diverifikasi. Pisahkan payment-test, gift declaration, vendor payment record, dan settlement komersial.
6. **QRIS uji:** aset `assets/payment/testing-qris.jpg` disajikan melalui endpoint terlindungi; `features/billing/actual/customer-views.tsx:139-151` menyatakan pemindaian dapat memindahkan dana nyata. Jangan memindahkannya ke `public/`, menganggapnya QR palsu, atau memakainya sebagai fixture E2E.
7. **List/analytics:** pagination terukur; ringkasan memakai agregasi seluruh scope, bukan hanya `take100/500/200`. V1 `guests/repository.ts:35-37` merangkum hasil terbatas500, sehingga total dapat terpotong.
8. **Publikasi dan RSVP:** V1 create/update hanya draft privat, tetapi RSVP publik memerlukan `isPublished`. Jangan mengklaim onboarding-to-publish selesai sebelum jalur aktivasi sah tersedia.

## Identitas dan role aktual V1

- Platform role saat ini hanya **CLIENT** dan **SUPERADMIN** (`prisma/schema.prisma:10-12`, `server/authorization/roles.ts:2`). Registrasi publik tidak dapat memilih role.
- **PUBLIC** dan **GUEST_TOKEN** di tabel berikut adalah konteks akses, bukan enum user baru. Tamu tidak perlu memiliki akun.
- **Vendor** adalah model perencanaan dan kategori tamu. Role `VENDOR` historis telah dihapus; `CUSTOMER` digabung ke `CLIENT` dalam migrasi `20261010000000_role_client_superadmin`.
- Schema memiliki `InvitationMember: OWNER/EDITOR/VIEWER` dan `PlannerMember: OWNER/PARTNER`, tetapi repository V1 saat ini memeriksa owner; membership belum merupakan kemampuan runtime yang aktif.
- Role platform, membership resource, status akun dan entitlement adalah dimensi terpisah. SUPERADMIN tidak otomatis menjadi anggota semua undangan atau boleh memakai API customer untuk menulis data pengguna.

## Matriks akses dasar dan paritas V1

`CLIENT | SUPERADMIN` di sini adalah identitas migrasi V1, bukan larangan pengalaman Vendor/BA target. `Milik` mencakup scope yang dibuktikan server; membership tambahan hanya berlaku setelah policy tersedia. Fitur UI/SCHEMA/DESIGNED tetap preview/gated sampai backend/izin tersedia.

| Operasi | PUBLIC | GUEST_TOKEN sah | CLIENT ACTIVE | SUPERADMIN ACTIVE |
|---|---|---|---|---|
| Marketing/katalog/demo publik | Baca | Baca | Baca | Baca |
| Register/login/recovery | Endpoint publik dengan mitigasi | Sama | Sesuai state akun | Sesuai state akun |
| `/account`, security, metode login/sesi | Tolak | Tolak | Akun sendiri + reauth bila perlu | Akun sendiri + reauth bila perlu |
| `/dashboard`, daftar/buat draft | Tolak | Tolak | Milik sendiri | Tolak; entry admin tersendiri |
| Edit/preview privat/settings/hapus undangan | Tolak | Tolak | Owner atau membership yang diizinkan | Tolak melalui API customer |
| List/import/edit/archive tamu | Tolak | Tolak | Resource sendiri + policy | Hanya use case admin khusus bila kelak dibuat dan diaudit |
| RSVP/ucapan milik tamu | Tolak tanpa akses sesuai privacy | Read/write tamu pemegang token itu saja | Kelola/report pada undangan sendiri | Tidak otomatis; jalur admin khusus |
| Buku ucapan publik | Sesuai privacy/visibility terbit | Sesuai policy publik | Sama + hak kelola resource | Sama + operasi moderasi khusus bila tersedia |
| Gifts | Hanya informasi yang diizinkan pemilik | Sama; deklarasi bukan pembayaran | Konfigurasi milik sendiri | Operasi admin eksplisit bila ada |
| Billing-testing/QRIS/history | Tolak | Tolak | Milik sendiri | Review melalui endpoint admin; bukan akses QRIS customer |
| Order/payment komersial | Discovery sesuai gate; guest checkout V2 memakai capability order tersendiri | Token RSVP tidak memberi invoice privat | Order/invoice sendiri + entitlement | Rekonsiliasi/refund sesuai action scope dan audit |
| Planner/finance/tasks/preparation | Tolak | Tolak | Workspace sendiri + membership sah | Tidak memakai API workspace customer |
| Analytics | Statistik publik terkurasi saja bila dibuat | Bukan akses laporan | Data resource sendiri | Laporan admin terbatas kontrak data |
| `/admin`, users/invitations/payments | Tolak | Tolak | Tolak | Allowlist operasi + DTO minimum; V1 list masih akun uji |
| CMS/template/settings/audit/infrastructure | Konten publik terbit saja | Sama | Tolak operasi admin | Operasi yang sudah diimplementasikan; bukan tombol preview |
| Preview studio | Hanya synthetic whitelist | Sama | Sama | Sama; tidak membuka data lintas akun |

Akun SUSPENDED, sesi kedaluwarsa/revoked, role tidak dikenal, dan kegagalan verifikasi ditolak untuk operasi terlindungi. Jangan menaikkan akses karena layanan auth/DB sedang gagal.

## Matriks RBAC target lima pengalaman

**Pasangan, Vendor, Brand Ambassador, Tamu/Publik, Superadmin** adalah lima pengalaman desain, bukan perintah menambah lima enum role eksklusif. Gunakan principal terverifikasi + workspace/business membership + action scopes + guest capabilities. ADR schema/migrasi menetapkan representasi kompatibel dua role V1 sebelum implementasi.

| Pengalaman/konteks | Boleh sesuai scope | Batas wajib |
|---|---|---|
| Pasangan owner/partner | Planner/event, dana, task, CRM, undangan/studio, order sendiri | Membership dan hak per aksi; tidak mengakses bisnis vendor/pasangan lain, tidak mengubah fee/entitlement sendiri |
| Vendor business member | Profil/katalog/portfolio, KYB/bank, availability, order item miliknya, escrow/payout sendiri | Baseline Hidden; sandbox/internal terotorisasi. Tidak melihat item bisnis lain, kontak CRM seluruh acara, atau mengesahkan KYB/payout sendiri |
| BA program member | Atribusi/referral, komisi eligible, marketing kit, payout sendiri | Baseline Hidden; tidak menentukan eligibility/rate atau membuka kontrak/KYB/rekening vendor lain |
| Publik/tamu/pembeli jasa | Katalog yang tersedia; invitation token per tamu/sesi; checkout/order capability owner-scoped | Token undangan tidak memberi akses order/anggota; checkout tidak mewajibkan akun pasangan; detail order memerlukan proof yang sesuai |
| Petugas check-in terdelegasi | Validasi tiket/admission/koreksi berizin untuk event/session/gate | Grant khusus, expiry/revoke; tanpa finance/export contacts/edit quota. Ini delegasi operasional, bukan workspace role keenam |
| Superadmin berizin | Use case admin eksplisit: akun, KYB/moderasi, feature release, fee, reconciliation/refund/payout, CMS/audit | Action scope dan fresh reauth untuk aksi sensitif; tidak otomatis memiliki API customer/business |
| Admin Support terbatas | Tiket sesuai assignment, balasan dan catatan internal | Tanpa KTP/rekening/fee/payout/export contacts; bukan SUPERADMIN global |
| Admin Finance terbatas | Rekonsiliasi/payout/refund/settings sebatas scope yang diberikan | Permission per aksi, version/reason/ack/verification; tidak self-escalate, menghapus last admin, atau mengubah snapshot historis |

Role switcher hanya memperlihatkan membership aktif yang dibuktikan server. Beta whitelist melewati availability tertentu saja; OTP tidak menambah izin. Support/Finance adalah scope administratif, bukan enum wajib baru.

**Gate operasi:** session/capability sah ∧ role/membership ∧ action permission ∧ object/event scope ∧ entitlement bila diperlukan ∧ effective availability ∧ fresh version. Public auth memakai policy khusus; jangan mensyaratkan login pada capability publik yang sah.

Release desain `#43`: Vendor/BA Hidden, katering ComingSoon, Wedding Kit Maintenance, domain Hidden/internal, gifts nonaktif, vendor-sync Hidden. Parent Hidden menutup entry/checkout baru walau child configured Live. **Hak/order/escrow/komisi historis tidak dihapus**: owner recovery/fulfillment/payout yang sah memakai policy tersendiri, bukan bypass umum ke portal Hidden. Detail resolver/publish release pada 05.

## Policy membership V2 yang diusulkan

Tabel ini **target baru, belum perilaku V1**. Aktifkan setelah schema, penerimaan undangan anggota, verifikasi identitas, revocation dan tes lintas tenant tersedia; default tetap owner-only.

| Resource/membership | Read privat | Ubah konten/tamu/RSVP | Billing/publish/hapus/membership |
|---|---|---|---|
| Invitation OWNER | Ya | Ya | Ya, dengan entitlement/reauth yang relevan |
| Invitation EDITOR | Ya | Ya pada resource yang diberikan | Tolak; tidak boleh mengganti owner, tagihan, domain/publish atau mengundang anggota |
| Invitation VIEWER | Ya, DTO sesuai kebutuhan | Tolak | Tolak |
| Planner OWNER | Ya | Ya, termasuk finance sesuai policy | Kelola anggota dan pengaturan workspace; operasi sensitif reauth |
| Planner PARTNER | Ya | Kerja bersama/tugas dan catatan keuangan yang diizinkan | Tidak memindah ownership, menghapus workspace atau mengubah billing/membership |

Batasi workspace pasangan maksimal dua anggota bila meneruskan kontrak V1; lakukan cek kuota secara atomik. Invite scoped, expiry, single-use, dan hak yang eksplisit. Membership planner tidak otomatis memberi akses invitation yang berbeda.

Vendor/BA dan delegasi petugas sekarang bagian target desain 05. Implementasikan policy/membership/capability serta migrasi kompatibel melalui ADR; jangan sekadar menambah enum/menu tanpa resource scope. Reseller atau aktor lain yang belum dispesifikasikan tetap memerlukan definisi tersendiri.

## Arsitektur middleware/proxy dan otorisasi

V1 `src/proxy.ts` memvalidasi whitelist preview/template/demo/invitation dan format token; **belum merupakan RBAC proxy**. Guard layout/service/repository adalah proteksi utama existing.

V2 memakai pipeline berikut; konvensi Next16 adalah `src/proxy.ts`, bukan menambahkan `middleware.ts` paralel:

1. **Route policy registry** mengklasifikasikan public/guest checkout, invitation/order capability, account, pasangan, vendor, BA, check-in terdelegasi dan admin; matcher statis mencakup area relevan dan menghindari aset internal.
2. **Proxy:** cek awal cookie/format dan redirect login untuk navigasi terlindungi yang jelas tanpa cookie. Cookie opaque hanya petunjuk; jangan membaca role dari cookie/header/browser atau melakukan query Neon pada setiap prefetch.
3. **Server route/layout/query:** resolve opaque session ke DB, cek user ACTIVE, expiry/revoked dan role yang cocok. Salah role diarahkan ke landing sah atau 403; API mengembalikan 401/403 JSON, bukan halaman login HTML.
4. **Setiap action/Route Handler/service:** validasi ulang principal, action scope, input dan gate operasi target, walaupun UI/menu/layout sudah melindungi. Client Component dan route group bukan security boundary.
5. **Repository/transaksi:** scope owner/membership + resource parent; mutasi mengunci/memeriksa ulang invariant yang dapat berubah. Tidak percaya userId/workspaceId dari body tanpa ikatan konteks.
6. **Response:** DTO minimum, `private/no-store` untuk data sensitif, 404 netral untuk resource lintas tenant, error layanan generik tanpa detail internal; log teredaksi.

Pertahankan empat alias akun exact307 sebelum layout customer melalui konfigurasi redirect: `/dashboard/settings`, `/dashboard/settings/profile`, `/dashboard/account` → `/account`; `/dashboard/settings/security` → `/account/security` (`next.config.ts`). Catch-all juga mengenali sebagian subpath akun setelah guard, tetapi bukan alias lintas role sebelum layout. Redirect `returnTo` hanya internal allowlist sesuai role; jangan open redirect.

`/preview-ui` harus synthetic, noindex, tidak mengakses DB/provider/mutasi; deployment produksi dapat menutupnya via flag. Kehadiran preview lintas role tidak memberikan izin data nyata.

`/u/[token]`: bentuk43 karakter base64url dari32 byte acak, token valid di DB, publication/lifecycle aktif, guest ACTIVE, RSVP enabled/deadline dan kuota diperiksa di server. Rate limit terpisah token/IP, origin/body bound, noindex/no-store dan referrer policy; jangan membocorkan token/kontak/catatan privat.

**Gap RSVP V1:** `public-repository.ts:20-44` hanya mengecek ACTIVE/isPublished dan membaca konteks sebelum transaksi mutasi (`:81-92`); status/expiry/RSVP deadline belum enforced. V2 memeriksa ulang secara atomik. Tentukan expiry/rotation/revocation token serta cara owner reshare; jangan memaksa hash-only tanpa memenuhi kebutuhan reshare.

## Kontrak route/API yang perlu dimigrasikan

| Keluarga route | Operasi V1 yang ditemukan |
|---|---|
| `/api/auth` | GET capabilities/csrf/google-callback; POST register/login/logout/forgot-password/reset-password/email-request/email-verify/otp-request/otp-resend/otp-verify/google-start, dengan subpath existing |
| `/api/account` | GET/PATCH profile dan security; GET sessions; DELETE sessions/[id]; POST password/reauthenticate/sessions-revoke-others/email-request/email-verify/email-unlink/phone-otp/phone-verify/phone-unlink/google-unlink |
| `/api/customer/invitations` | GET/POST; `[id]` GET/PATCH/DELETE |
| `/api/customer/invitations/[id]/guests` | GET/POST/PUT; `[guestId]` PATCH/DELETE; `[guestId]/rsvp` PUT |
| `/api/public/rsvp/[token]` | PUT, token capability tanpa login |
| `/api/billing` | `test-requests` GET/POST; `test-requests/[id]` GET; `testing-qris` GET terlindungi |
| `/api/admin/payment-tests/[id]` | PATCH, SUPERADMIN |
| `/api/health` dan `/api/health/live` | GET readiness dan liveness, output publik minimal |

Nama di tabel auth/account adalah ringkasan; **salin path dan metode persis dari Route Handler saat migrasi**, bukan menjadikan tanda hubung sebagai URL baru. V1 transport mutasi berupa Route Handlers, belum Server Actions. V2 boleh action untuk UI internal, tetapi perubahan API/URL harus disengaja dan kompatibel.

## Kriteria penerimaan per modul

Setiap modul memiliki pemilik data, schema input/DTO, kebijakan izin, invariant/transaksi, status integrasi, state UI dan tes positif/negatif. Uji minimal lintas akun/role, revoked session, invalid payload, failure provider, token tak dikenal, serta race yang relevan.

Uji regresi khusus: bulk import gagal tidak menghapus input; jumlah created/skipped akurat; summary >500 tamu lengkap; RSVP seats/deadline/suspension berubah saat submit; soft-404 token berformat sah tidak kembali 200; duplicate webhook tidak menggandakan entitlement.

Untuk UI_SLICING ikuti **01 → Ekspansi → 02 → 03 → 04 (4A CRM, 4B dispatch/admission, 4C discovery/bundle/contract, 4D payment/recovery) → 05 → 06 → 07**. FULLSTACK_V2 mendahulukan fondasi/policy/shared contracts, lalu increment data/use case sesuai dependensi, paritas V1 dan seluruh scope 05; akhiri rehearsal migrasi/cutover. Tujuh batch bernomor + satu Ekspansi, bukan Batch 08.

Tambahkan per-frame traceability 06, feature release gate, immutable ledger/contract, partial-order consent, entitlement recovery, stale/conflict/unknown/idempotency dan test runtime R01–R24/A01–A06. Stored QA desain tidak sama dengan hasil aplikasi. UI preview, persistence lokal, sandbox dan produksi dilaporkan terpisah.
