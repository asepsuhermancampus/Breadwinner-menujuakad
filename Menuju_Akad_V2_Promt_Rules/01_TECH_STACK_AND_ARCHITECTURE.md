# 01 — Tech Stack dan Arsitektur Menuju Akad V2

## Status, lingkup, dan cara membaca

Audit statis: 17 Oktober 2026. Sumber aktual: `/home/kebeletwebdev/menujuakad-web`, bukan `./menujuakad-web` di workspace ini. Paket aturan: `/home/kebeletwebdev/refactor-menujuakad-web/Menuju_Akad_V2_Promt_Rules` (ejaan mengikuti permintaan). Kode produksi hanya dibaca.

**OBSERVASI** berarti terlihat di sumber lokal; **KEPUTUSAN V2** berarti aturan pembangunan berikutnya; **DESIGNED** berarti tersedia di desain/slicing; **TERCATAT** berarti bukti historis di dokumen, bukan pengujian ulang layanan. Jangan menyamakan status tersebut.

Inventaris mencakup manifest/lockfile, konfigurasi Next/TypeScript/lint/test, `src/app`, `src/features`, `src/components`, `src/server`, Prisma/migrasi, `public`, aset/lisensi, scripts, deployment, CI, pengujian, serta dokumentasi. Analisis berfokus pada berkas buatan tim; `node_modules`, `.next`, generated Prisma, dan artefak tes bukan kode yang direfaktor manual. `.env` tidak dibaca; tidak ada koneksi DB, migrasi, build, pemasangan paket, pemindaian provider, atau deploy dalam audit ini.

Terdapat **492 berkas TS/TSX/CSS di `src` di luar generated**, termasuk tes; **37 berkas melampaui 200 baris**. Bukti masalah dan perbaikannya ada di [02](02_CLEAN_CODE_AND_ANTI_SPAGHETTI_RULES.md); inventaris fitur dan RBAC ada di [03](03_ROLES_AND_FEATURES_BLUEPRINT.md). [04](04_MASTER_AGENT_PROMPT.md) adalah prompt eksekusi untuk sesi implementasi mendatang.

Permintaan lanjutan memasukkan desain Pencil aktif dan paket `../Menuju_Akad_V2_Prompt_Slicing` sebagai **target V2**. Rincian baru wajib dibaca di [05](05_DESIGN_UIUX_AND_FEATURE_EXPANSION.md), dengan seluruh 180 root snapshot ditelusuri di [06](06_PENCIL_FRAME_TRACEABILITY.md). Vendor/BA/marketplace/check-in termasuk target, tetapi bukan kemampuan produksi V1. Folder `../Menuju_Akad_V2_Prompt_Rules`, canvas dan paket slicing tidak diubah.

## Observasi stack V1

Versi resolved berasal dari `package-lock.json`, sedangkan rentang deklarasi berasal dari [package.json](../../menujuakad-web/package.json).

| Area | Temuan aktual | Bukti lokal |
|---|---|---|
| Framework/router | Next.js **16.3.8**, React/React DOM **19.3.0**, **App Router**, tanpa Pages Router | `package.json:36-38`; `src/app/` |
| Runtime | Node yang dideklarasikan `>=22.12.0 <23 || >=24.0.0`; ESM, npm lockfile | `package.json:5-8`; `.nvmrc` |
| Bahasa | TypeScript **5.9.3**, `strict: true`, alias `@/*` | `tsconfig.json:7`; lockfile |
| ORM/database | Prisma CLI/client/adapter Neon **7.10.0**, PostgreSQL Neon; bukan Drizzle | `prisma/schema.prisma`; `src/server/db/client.ts` |
| Koneksi | Singleton lazy `PrismaNeon`, timeout, pool `max: 5`; runtime `DATABASE_URL`, CLI `DIRECT_URL` | `src/server/db/client.ts:8-24`; `prisma.config.ts:4-9` |
| Validasi | Zod **4.6.5 resolved**, deklarasi `^4.1.12` | lockfile; `src/server/invitations/input.ts` |
| Styling | CSS biasa, CSS Modules terbatas, token CSS, `clsx` **2.1.1** | `src/app/globals.css`; `src/components/ui/button.tsx` |
| UI library | Primitive internal Button/Input/Card/Icon; **belum ada Tailwind, shadcn/ui, Radix, cva, atau tailwind-merge** dalam manifest | `package.json`; `src/components/ui/` |
| Animasi | CSS transition/keyframes dan reduced motion; tanpa Framer Motion/GSAP | `src/app/styles/base.css`; CSS fitur |
| State/form | React hooks, state lokal/context preview, fetch pada hooks; tanpa Redux/Zustand/TanStack Query/React Hook Form | `src/features/**/hooks`; `features/workspace/use-workspace-mutation.ts` |
| Auth | Implementasi internal: password scrypt, opaque session DB, email/telepon, Google, verifikasi/recovery/OTP, CSRF/throttle/reauth | `src/server/auth/`; `src/server/account/` |
| Provider auth | `google-auth-library` **11.2.0**; adapter Google, email Resend, SMS Twilio | `src/server/integrations/auth/providers.ts`; lockfile |
| Pembayaran | Permintaan/review pembayaran **uji**, QRIS; Mayar komersial belum memiliki alur provider/webhook aktif | `src/server/billing/`; `features/billing/actual/` |
| QA | Vitest **5.0.3**, Playwright **1.63.0 resolved** (`^1.56.0` di manifest), PGlite **0.4.3**, ESLint 9, Prettier | manifest/lockfile; `tests/database`; `.github/workflows/ci.yml` |
| Operasional | Next standalone, Docker/Compose + overlay Neon/rootless, Caddy, health/liveness, deployment candidate/rollback | `next.config.ts`; `deploy/`; `scripts/prepare-standalone.mjs` |

**Kekuatan yang dipertahankan:** V1 sudah berbasis fitur, memisahkan service/repository, memakai `server-only`, DTO, Zod, guard, dan pemeriksaan ownership. Penelusuran akses Prisma/database pada TSX tidak menemukan query database langsung. Server Component yang memanggil service merupakan pola yang sah.

**Drift dokumentasi:** `AGENTS.md` dan bagian awal `docs/architecture.md` masih memuat status/tema/role historis. Kode role sekarang hanya `CLIENT | SUPERADMIN`; token runtime menggunakan **Horizon Modern Style / Luminous Aura Minimal**, Plus Jakarta Sans, primary `#5F3ADD`, background `#FAF8FF`, teks `#131B2E` (`src/app/styles/tokens.css:42-114`). Ini fakta V1; target visual V2 mengikuti Pencil pada bagian berikut. Migrasi identitas Vendor/BA mengikuti policy baru pada 03, bukan enum historis.

`CHANGELOG.md:3-19` mencatat RSVP/ucapan membaca DB, migrasi tamu diterapkan ke Neon, dan rilis 14 Oktober. Login dua role tercatat diuji produksi 11 Oktober (`:58-71`). Ini **riwayat**, bukan verifikasi produksi pada 17 Oktober. Google/Resend/Twilio/Mayar tetap dinyatakan belum aktif pada checkpoint tersebut.

## Keputusan stack V2

| Area | Keputusan wajib |
|---|---|
| Bentuk aplikasi | Satu **modular monolith** Next.js App Router; tidak perlu microservice/monorepo untuk scope ini |
| Framework | Baseline keluarga Next **16**, React **19**, Node **24 LTS**; pilih patch kompatibel dan pin lockfile setelah verifikasi saat scaffold |
| Bahasa | TypeScript strict; input eksternal `unknown`, tanpa `any` sebagai jalan pintas; aktifkan `noUncheckedIndexedAccess` dan `exactOptionalPropertyTypes` sejak fondasi |
| Data | **Neon Serverless Postgres + Prisma 7**, adapter Neon; pertahankan keselarasan versi CLI/client/adapter; jangan mencampur Prisma 6/7/8 |
| Styling | **Tailwind CSS 4**, `@tailwindcss/postcss`, CSS variables/token melalui `@theme`; CSS Modules hanya untuk kebutuhan lokal yang sulit diekspresikan dengan utility |
| Primitive UI | `src/components/ui` milik proyek, kontrak aksesibel; **clsx + tailwind-merge melalui `cn()`**, **class-variance-authority (`cva`)** untuk varian |
| Auth | Pertahankan kontrak sesi DB opaque dan kemampuan auth V1 yang relevan di modul terisolasi; jangan sekaligus mengganti mesin auth tanpa ADR dan rencana migrasi |
| State | Server sebagai sumber data; hooks lokal untuk interaksi. Tambah library state/form hanya ketika ada kebutuhan terukur dan ADR singkat |
| Motion | CSS terlebih dahulu, dukung `prefers-reduced-motion`; library animasi tambahan membutuhkan alasan kebutuhan |
| Validasi | Zod 4 di seluruh boundary server; schema publik aman dibagi, schema rahasia/server dipisahkan |
| Pengujian | Vitest untuk domain, PostgreSQL pengembangan/Neon branch untuk integrasi, Playwright untuk alur browser; PGlite pelengkap |
| Integrasi | Adapter storage, email, SMS, OAuth, WA, geolocation/metadata, pembayaran dan fulfillment; provider diputuskan melalui ADR. Mayar kandidat V1; penyebutan Midtrans/Xendit/Mayar di desain bukan keputusan provider produksi |
| Delivery | npm + lockfile; quality gate CI, build standalone/container; V2 memakai environment, port, DB branch, dan storage terpisah |

Nomor versi V1 adalah snapshot, **bukan klaim versi terbaru atau bebas kerentanan**. Periksa advisori, peer dependency, runtime, dan panduan resmi saat implementasi; update patch terencana tanpa `npm audit fix --force`.

## Target UI V2 — Modern Quiet Luxury

Sumber token adalah variabel canvas aktif dan [DESIGN_TOKENS.json](../Menuju_Akad_V2_Prompt_Slicing/references/DESIGN_TOKENS.json). Jangan meneruskan primary ungu V1 ke V2 atau menjadikan screenshot sebagai satu gambar halaman.

| Kelompok | Token/aturan desain |
|---|---|
| Permukaan | Canvas `#FBFBF9`, surface `#FFFFFF`, subtle `#F4F4F0`, border `#EAE9E4` |
| Teks | Primary `#141413`, secondary `#5E5D59`, muted `#96948E`; muted bukan otomatis aman untuk teks kecil |
| Brand | Cypress `#1E3F32`, hover `#183429`, Champagne `#C9A66B`, Rose `#B86B5A`; teks rose aksesibel `#914F43` |
| Status | Success `#166534`/`#F0FDF4`, warning `#9A5B13`/`#FEFCE8`, maintenance `#B45309`/`#FEF3C7`, danger `#BE123C`/`#FFF1F2` |
| Tipografi | Plus Jakarta Sans untuk UI, Instrument Serif untuk editorial/emosional terpilih, Geist Mono untuk angka/teknis; registry dan lisensi terkelola |
| Ukuran | Grid4; radius control12/card16/shell20; target interaksi minimal44px, focus/kontras/reflow diverifikasi runtime |
| Shell | Pasangan dock272/compact68, inset12, topbar76, body32; Vendor/BA/admin dock240; maksimal4 metric card per baris, inspector sekitar480 |
| Responsif | Desktop referensi1600×1160, admin1760×1200, auth1440; bukan viewport fixed. Canvas undangan375, preview768/1280 harus reflow |

Shell memakai contextual topbar, role/workspace switch terotorisasi dan command palette Cmd/Ctrl+K. Public invitation dan guest checkout tanpa dock. Jangan merender keyboard/status bar OS, resize handle canvas, catatan desainer, atau subtree `enabled:false` sebagai UI produk. Token aplikasi berbeda dari token tema undangan.

## Struktur fitur dan batas kepemilikan

```text
src/
  app/                            # routing, metadata, layouts, boundaries, komposisi
    (public)/
    (auth)/
    (account)/account/
    (customer)/dashboard/
    (admin)/admin/
    u/[token]/
    api/
  features/
    invitations/
      components/                 # UI khusus undangan; customer/admin bila perlu
      hooks/                      # state/interaksi browser
      services/                   # use case SERVER, seluruh file server-only
      actions/                    # Server Actions, file boundary use server
      queries/                    # entry point baca terotorisasi, server-only
      repositories/               # query Prisma, server-only
      schemas/                    # Zod input/domain; tanpa env/database
      types/                      # DTO dan kontrak; tanpa Prisma runtime
      utils/                      # fungsi murni domain
      config/                     # konfigurasi fitur nonrahasia
      tests/                      # atau tes colocated sesuai konvensi
    <fitur-lain>/                  # pola sama, dibuat saat digunakan
  components/
    ui/                           # atomic: Button, Input, Dialog, Card
    shared/                       # pola lintas fitur tanpa aturan bisnis
    layouts/                      # shell publik/pasangan/vendor/BA/admin
  server/
    auth/                         # resolver sesi bersama, policy dasar
    db/                           # client Prisma + koneksi
    integrations/                 # storage/payment/email/SMS/OAuth adapter
    env.ts                        # konfigurasi rahasia tervalidasi
  lib/                            # cn, util teknis kecil lintas fitur
  config/                         # konfigurasi publik dan route registry
  styles/                         # tokens, theme, reset
  generated/                      # hasil generator, jangan edit
prisma/                           # schema per domain + migrasi
public/assets/                    # hanya aset statis publik
```

Setiap fitur menyediakan `components/`, `hooks/`, `services/` atau `actions/`, `types/`, dan `utils/` **ketika tanggung jawabnya dibutuhkan**. Jangan membuat folder kosong/hook tiruan agar pohon terlihat lengkap. Semua nama fitur dan tujuan migrasi ada pada dokumen 03.

V1 membagi domain di `src/features` dan `src/server/<domain>`. V2 memilih **colocation domain** di `features/<domain>`; `src/server` hanya infrastruktur lintas fitur. Jangan memelihara dua service undangan sebagai sumber kebenaran paralel.

Perluasan domain 05 meliputi planning/KUA/digital fulfillment, ledger event, CRM/seating/check-in/WA, marketplace/bundle/contract/payment/dispute, multi-undangan/studio, Vendor/KYB/escrow/payout, BA/commission, serta feature availability/operations. Portal adalah komposisi use case bersama, bukan salinan service per role. `admin` dan `shell-navigation` tidak menjadi pemilik seluruh logika bisnis.

## Aliran dependency wajib

1. Server page memanggil `features/<fitur>/queries` lalu menyusun UI dari DTO; Client Component memanggil action atau HTTP client fitur.
2. Action/Route Handler membatasi request, memvalidasi Zod, dan memanggil service. Action bukan fungsi yang otomatis aman hanya karena `use server`.
3. Service memperoleh identitas/capability terverifikasi dari server, memeriksa role/action/resource/event/entitlement/effective availability serta versi terbaru, lalu menjalankan aturan bisnis/transaksi.
4. Repository menjalankan query terlingkup tenant/resource. Query Prisma hanya di repository dan infrastruktur DB.
5. Adapter mengisolasi detail provider. Hasil dipetakan menjadi DTO minimum dan error domain yang stabil.

`components/ui` tidak mengimpor fitur. Komponen/hook tidak mengimpor repository/DB/env. Service tidak mengimpor React/JSX, redirect, atau komponen. Repository tidak membentuk pesan form/navigasi. Hindari siklus dependency dan barrel yang mencampur server/client.

Impor lintas fitur hanya lewat entry point bernama jelas, misalnya `features/billing/contracts` atau `features/guests/queries`; bukan deep import repository. Bila dua domain berkolaborasi, tentukan satu use case pemilik transaksi. Jangan memecah transaksi atomik demi batas folder.

## Data, cache, dan kontrak operasional

- Neon runtime memakai URL pooled dan user least privilege; migrasi memakai koneksi/role terpisah melalui konfigurasi Prisma yang sesuai versi. Lazy singleton, pool budget dan timeout disesuaikan kapasitas deployment.
- Schema Prisma dipecah per domain menggunakan dukungan multi-file versi terpilih; setiap berkas buatan tim maksimal 200 baris. Migrasi SQL dan generated memiliki pengecualian terdokumentasi pada 02.
- Uang integer IDR dengan batas aman/overflow; jangan float. Tanggal tersimpan konsisten, display mempertahankan zona acara Jakarta/Makassar/Jayapura.
- Gunakan FK, unique constraint, index tenant, dan transaksi untuk integritas. JSON hanya konfigurasi presentasi tervalidasi/versioned; relasi tamu, RSVP, membership, dan pembayaran tetap relasional.
- Session/akun/admin/RSVP/token/tenant response bersifat privat dan `no-store`; jangan memakai cache global yang dapat membagi data antar akun. Cache katalog publik memakai invalidasi eksplisit.
- DTO tidak membocorkan hash password, token sesi, secret provider, kontak/catatan privat tamu. Token RSVP hanya diberikan ke pemilik yang berizin dan tamu bersangkutan.
- Secret tidak boleh masuk `NEXT_PUBLIC_*`, logs, fixtures, screenshot, `public/`, atau dokumentasi. Konfigurasi publik dan server terpisah.
- Publikasi, entitlement, dan invoice hanya mengikuti status server. QRIS uji dipisahkan dari pembayaran komersial; lihat 03.
- Media pengguna disimpan melalui storage adapter, bukan `public/uploads` di filesystem container. Signed URL dan akses privat ditetapkan per kategori.
- Identity, workspace/event membership, business membership, action scope, plan entitlement dan availability adalah dimensi terpisah. OTP/fresh reauth tidak menambah permission; Hidden tidak menghapus hak historis.
- Ledger posted, approved contract, active publication dan fee snapshot memiliki versi immutable; koreksi/reversal/replacement eksplisit. Side effect payment/refund/payout/WA/fulfillment/check-in memakai idempotency key dan penanganan status unknown.
- Visual/Form memakai satu typed invitation document; manager/editor/renderer memakai schema yang sama. Finance/planning/CRM memakai selector lintas fitur, bukan saldo/guest/entitlement duplikat.

## Proteksi routing dan kompatibilitas framework

Next 16 memakai **`src/proxy.ts`** untuk konvensi yang dahulu bernama middleware. Gunakan proxy untuk redirect/validasi awal; verifikasi sesi DB, status ACTIVE, role, ownership dan membership wajib dekat akses data. Cookie opaque tidak berisi role yang dapat dipercaya. Detail kebijakan di 03.

Server Components menjadi default; `use client` hanya pada leaf interaktif. Jangan menyalin contoh API Next/Prisma lama tanpa mencocokkan versi. Baca dokumentasi bundled Next jika tersedia.

## Strategi transisi dan bukti selesai

V2 dibangun di direktori terpisah yang ditetapkan saat implementasi. Migrasikan per use case: kontrak perilaku → schema/repository/service → action/query → UI → pengujian. Pertahankan kemampuan nyata V1 dan cakup seluruh target 05; rewrite tidak membenarkan kehilangan fitur yang sudah berjalan.

Pertahankan ID/mapping resource dan URL penting atau sediakan redirect tervalidasi. Perubahan data memakai expand–backfill–verify–contract, rehearsal di DB terpisah, cek grant, rencana rollback dan restore. Pelajaran V1: perubahan enum role dapat memutus kompatibilitas image lama dan grant kolom (`CHANGELOG.md:137-142`).

Nyatakan track setiap batch: **UI_SLICING** memakai typed deterministic mock adapter sesuai kontrak slicing; **FULLSTACK_V2** menambahkan persistensi/policy/adapter sandbox. Urutan UI adalah 01 → Ekspansi → 02 → 03 → 04 (4A–4D) → 05 → 06 → 07. Backend boleh diurutkan menurut dependensi dengan traceability tetap lengkap.

Lulus test lokal tidak berarti provider/produksi siap. Catat **DESIGNED → UI_MOCK → PERSISTENT_LOCAL → SANDBOX_VERIFIED → PRODUCTION_VERIFIED**. Release desain `#43`/label `Live` bukan bukti produksi; Vendor/BA Hidden dan gate fitur lain mengikuti 05. Build/CI tanpa DB tidak boleh dijadikan bukti persistence E2E.

## Referensi resmi untuk implementasi

- [Next.js Proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) dan [authentication/DAL](https://nextjs.org/docs/app/guides/authentication): konvensi proxy serta pemeriksaan izin dekat data.
- [Prisma 7 config](https://www.prisma.io/docs/orm/v7/reference/prisma-config-reference) dan [upgrade Prisma 7](https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7): cocokkan dengan versi yang dipin.
- [Tailwind + Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs), [theme variables](https://tailwindcss.com/docs/theme), dan [cva variants](https://cva.style/getting-started/variants/): dasar konfigurasi styling V2.
