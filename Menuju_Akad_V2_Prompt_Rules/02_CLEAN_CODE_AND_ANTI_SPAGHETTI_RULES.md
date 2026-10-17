# 02 — Clean Code dan Aturan Anti-Spaghetti

## Kontrak

Aturan ini **wajib saat implementasi V2**, bersama [01](01_TECH_STACK_AND_ARCHITECTURE.md), [03](03_ROLES_AND_FEATURES_BLUEPRINT.md), dan perluasan desain [05](05_DESIGN_UIUX_AND_FEATURE_EXPANSION.md). Dokumen ini tidak memberikan instruksi mengubah aplikasi produksi dalam sesi audit.

## Pain points yang terbukti pada V1

Ukuran adalah jumlah baris fisik sumber pada snapshot 17 Oktober 2026, bukan estimasi kompleksitas.

| Temuan/bukti | Dampak | Pemecahan V2 |
|---|---|---|
| `features/planner/components/admin-operational-views.tsx` **791 baris** | User management, upgrade, content, payment settings, audit, landing preview satu file/domain planner | Pindahkan ke domain masing-masing; `admin` hanya shell/komposisi |
| `features/planner/components/planner-misc-views.tsx` **554 baris** | Lamaran, moodboard, wedding kit, pasangan, onboarding bercampur | Fitur preparation/moodboards/wedding-kit/planner-workspaces dengan kontrak jelas |
| `planner-dashboard-view.tsx` **276**, `planner-shell.tsx` **262**, `marketing/home-overview.tsx` **242** | Komposisi, data presentasi, state dan banyak section menumpuk | Section bermakna, view-model/query, navigation config, hook sesuai tanggung jawab |
| `guests/components/guest-management-view.tsx` **236**, `invitations/components/editor/editor-phone-content.tsx` **220** | Kontrol/list/modal/preview sulit ditinjau bersama | Pisahkan filter, tabel, aksi tamu, modal RSVP; renderer section terdaftar |
| `features/planner/styles.css` **1.500**, `app/styles/marketing.css` **1.432**, `workspace.css` **746 baris** | Banyak domain dan responsive override berada di stylesheet besar | Primitive Tailwind + cva, token semantik, CSS Modules lokal |
| `app/globals.css:1-15` mengimpor CSS publik, admin, billing, guests, planner | Cakupan selector/cascade global luas dan ketergantungan urutan impor | Global hanya theme/reset; style fitur scoped |
| `features/workspace/` memuat editor/form/query-view domain undangan dan admin; `features/planner/` berisi admin operasional | Kepemilikan domain tidak konsisten | Pindahkan ke fitur pemilik; shell lintas fitur tetap netral |
| `server/account/account-service.ts` **224 baris** dispatch banyak operasi dan query DB; `server/guests/repository.ts` **262 baris** memuat CRUD, wishes, import, RSVP dan normalisasi telepon | Tanggung jawab server juga meluas | Pecah use case akun/repository; pisahkan policy/mapper/util tamu sambil mempertahankan transaksi |
| Guests/billing/analytics mengimpor `WorkspaceError` dari invitations; RSVP publik memakai repository throttle auth | Helper teknis lintas fitur dimiliki domain bisnis lain | Kontrak error/rate-limit platform yang kecil; jangan menyalin helper atau membuat service global raksasa |
| `features/invitations/components/editor/publish-panel.tsx:3`, `hooks/use-editor-draft.ts:3`, route publik mengimpor `design-preview` fixture | Fitur bisnis bergantung kontrak/demo sebagai sumber data | DTO/schema domain independen; fixture hanya adapter preview |
| Editor, daftar undangan, RSVP/wishes memiliki jalur preview dan jalur `workspace`/aktual terpisah | Risiko tampilan/validasi bercabang; **bukan bukti semua file duplikat identik** | Bagikan presentational component dan schema yang benar-benar sama; pisahkan adapter live/mock |
| `features/workspace/use-workspace-mutation.ts:24-38` menelan error dan tidak mengembalikan hasil domain | Caller tidak punya hasil sukses/gagal yang stabil; hook generik mengetahui redirect undangan | Return typed result; navigasi dan pesan dimiliki use case |
| `guests/components/guest-import-form.tsx:58-62` membaca `mutation.failed` closure setelah await, mengklaim `valid.length` tersimpan | Analisis statis menunjukkan input berisiko dikosongkan saat gagal; jumlah `created/skipped` server tidak dipakai | Putuskan dari `result.ok`, tampilkan jumlah server, pertahankan input gagal; reproduksi dengan tes pada V2 |
| `src/proxy.ts:18-56` hanya cek format token; `CHANGELOG.md:18` mencatat token valid tak dikenal HTTP 200 | Soft-404 dan kontradiksi komentar metadata | Uji status HTTP nyata token invalid/tak dikenal; pilih boundary yang menetapkan status sebelum streaming |
| `AGENTS.md`, `docs/architecture.md`, copy preview/status tertentu tertinggal | Agent dapat menghidupkan role/tema lama atau menganggap fitur DB belum ada | Satu status feature registry + dokumentasi bertanggal dan bukti |
| `playwright.config.ts:20-26` memaksa `DATABASE_URL: ""` | E2E CI menguji preview/fail-closed, bukan alur persistence Neon | Pisahkan suite no-secret dan suite DB sandbox dengan fixture terisolasi |
| `eslint.config.mjs` hanya preset dan ignore | Batas ukuran/import baru berupa panduan, belum enforcement | Tambahkan pemeriksaan otomatis ukuran, boundary import dan siklus dependency |

**Tidak ditemukan bukti query Prisma langsung di TSX.** Pertahankan pemisahan existing; jangan menulis audit seolah seluruh V1 monolitik. Sesi DB, guard ownership, validasi Zod dan banyak repository sudah merupakan fondasi yang baik.

## R01 — Batas baris ketat dan SRP

- Target **≤150 baris**, batas keras **200 baris fisik** per berkas buatan tim: TS/TSX, hooks, service, repository, util, schema, CSS, dan tes. Termasuk import, komentar, serta baris kosong; minifikasi bukan cara lolos.
- Page/Route Handler/action boundary ditargetkan **≤100 baris**, maksimal 200. Kebutuhan baru yang membuat file melewati 150 memicu evaluasi pemecahan; lebih dari 200 wajib dipecah sebelum merge.
- Satu file memiliki **satu tanggung jawab utama** dan satu alasan perubahan. Jangan membuat `misc`, `helpers` campuran, mega-hook, atau komponen dengan puluhan flag.
- Pecah berdasarkan perilaku: filter, tabel, form, summary, use case, mapper DTO, repository entity. Jangan memecah tiap tag JSX atau membuat wrapper tanpa manfaat.
- Fungsi ditargetkan ≤40 baris dan kompleksitas rendah; lebih panjang wajib ditinjau. Hindari nested ternary dan percabangan domain berbeda dalam satu render.
- **Pengecualian terbatas:** generated client, lockfile, artefak vendored/berlisensi, migrasi SQL immutable, dan dokumen Markdown. Pengecualian bukan untuk service/CSS/fixture buatan sendiri. Catat whitelist path + alasan pada tooling.
- Schema Prisma dapat dipecah multi-file per domain; jangan memberi pengecualian universal pada satu schema raksasa. Jangan mengedit migrasi lama yang sudah diterapkan demi batas baris.

## R02 — UI, server, dan database

- `.tsx` hanya presentasi/komposisi/interaksi. **Dilarang menulis query DB, raw SQL, `getPrisma()`, akses driver Neon, secret env, atau panggilan provider langsung di UI.**
- Semua interaksi Neon wajib melewati **query/action → service → repository → client DB**. Server Component boleh memanggil query/service yang mengembalikan DTO aman.
- `features/<fitur>/services`, `queries`, `repositories`, dan integrasi diberi `import "server-only"`. File action yang dipanggil browser memakai boundary `use server`.
- Services memegang aturan bisnis, otorisasi, keputusan transaksi dan error domain. Repository memegang query/constraint; mapper DTO tidak mengirim model Prisma mentah ke browser.
- Zod memvalidasi **setiap input eksternal** di server: body/form, params, query, upload metadata, webhook, env. Validasi client hanya membantu UX.
- Schema mutasi allowlist/strict; jangan menerima `ownerUserId`, role, harga, entitlement atau status paid dari browser sebagai otoritas.
- Setiap operasi terlindungi memeriksa identitas, ACTIVE, role/action, scope resource/event, entitlement yang relevan dan effective availability. Jalur auth publik dan guest capability mengikuti policy 03. Gunakan scope di query dan ulangi predicate/expectedVersion pada mutasi atomik agar tidak ada celah antar pemeriksaan dan penulisan.
- Modul UI tidak mengimpor Prisma bahkan hanya demi tipe record. Gunakan DTO/domain types; `import type` untuk kontrak murni.

## R03 — Dependency, nama, dan reuse

- File/folder kebab-case, komponen PascalCase, hooks `useX`, fungsi memakai kata kerja domain. Nama harus mengungkap tanggung jawab, bukan urutan revisi.
- Feature hanya mengakses fitur lain lewat kontrak publik yang eksplisit. Larang deep import repository fitur lain, cycle, dan barrel campuran server/client.
- `src/components/ui` untuk primitive netral; `src/components/shared` untuk pola visual lintas domain; `features/<fitur>/components` untuk komponen yang memahami bisnis.
- Reuse setelah kontrak/perilaku sama terbukti. Shared Button tidak perlu tahu paket premium; entitlements ditangani fitur pemilik.
- Hindari generalisasi awal: tidak membuat generic repository/framework internal atau abstraction berlapis yang hanya dipakai satu use case.
- Semua fixture berada di preview/test adapter. Kode domain nyata **dilarang mengimpor** `design-preview`, fixtures, atau nilai saldo/status dummy. Track UI_SLICING menyuntik mock adapter pada composition root melalui kontrak domain yang sama dengan track FULLSTACK_V2.

## R04 — State, hooks, async, dan error

- Server adalah sumber data tersimpan; hooks mengurus state interaksi. Jangan menyalin seluruh server DTO menjadi global store tanpa strategi sinkronisasi.
- Hook hanya satu tujuan: form input, pagination, upload, autosave. Pisahkan networking, pure reducer, dan tampilan bila mulai bercampur.
- Mutation mengembalikan hasil bertipe diskriminan, misalnya `{ ok: true, data } | { ok: false, code, fieldErrors? }`; jangan menentukan sukses dari state React lama setelah `await`.
- Bulk import menampilkan `created`, `skipped`, dan masalah baris dari server; gagal mempertahankan input. CSV export harus menetralkan formula; impor membatasi byte/baris dan duplikasi.
- Jangan mengubah kegagalan menjadi pesan sukses/fallback fixture. Bedakan validation, unauthenticated, forbidden, not-found, conflict, rate-limit, unavailable dan error internal.
- Gunakan error code stabil; pesan pengguna Bahasa Indonesia; detail exception hanya di log server tersanitasi dengan request ID.
- Loading/empty/error/disabled/success harus jelas; cegah submit ganda dan stale response. Autosave mempunyai debounce, cancel/urutan, versi konflik, indikator dirty dan retry yang aman.
- Side effect provider memerlukan timeout dan kebijakan retry/idempotency sesuai operasi; jangan mengulang pembayaran/pesan secara buta.

## R05 — CSS, Tailwind, `cn()`, dan `cva`

- Tailwind 4 menggunakan token terpusat di `src/styles/tokens.css`/`theme.css` melalui CSS variables dan `@theme`; jangan mencampur instruksi setup Tailwind 3 tanpa evaluasi.
- `globals.css` hanya import fondasi, reset/base dan theme. Style khusus fitur tidak boleh dikumpulkan menjadi stylesheet global raksasa.
- Semua penggabungan kelas dinamis/override memakai **`cn()` = `twMerge(clsx(...))`** dari `src/lib/cn.ts`. Kelas statis singkat boleh langsung `className`.
- Gunakan peta kelas lengkap yang dapat dideteksi compiler Tailwind; hindari interpolasi seperti `bg-${color}-500` dari nilai runtime.
- Primitive bervarian menggunakan **`cva`**: `variant`, `size`, `state`, default dan compound variant bertipe; gunakan `VariantProps`. Jangan menyalin string panjang untuk tiap tombol.
- **Dilarang** string utility panjang berulang. Jika kombinasi yang sama muncul ≥3 kali, ekstrak primitive/variant. Jika satu elemen memakai >15 utility, tinjau dan pindahkan kelompok perilaku ke komponen/variant atau CSS Module yang sesuai.
- `cn()` hanya menggabungkan kelas; memindahkan string raksasa ke `cn()` tidak menyelesaikan duplikasi. Jangan membuat seluruh JSX menjadi konstanta kelas tanpa pemilik tanggung jawab.
- Gunakan token semantik `primary`, `surface`, `foreground`, `muted`, `danger`; jangan menaruh hex/font/radius arbitrer berulang. Alias lama `gold` yang bernilai violet diganti dengan migrasi terpetakan.
- Theme undangan di-scope pada root `data-invitation-theme`; theme produk/admin terpisah agar perubahan template tidak mengubah dashboard.
- Hindari `style={{...}}` untuk styling statis. Nilai dinamis yang sah (posisi layer/progress/CSS custom property) diperbolehkan, diketik dan dibatasi; tidak memasukkan CSS/HTML/URL arbitrer pengguna.
- CSS Module untuk kebutuhan kompleks harus scoped dan ≤200 baris; hindari override selector global, `!important`, specificity bertingkat dan `@apply` sebagai penampung utility raksasa.
- Aksesibilitas wajib: label/error terhubung, keyboard/focus, semantic HTML, dialog focus management, kontras, reflow mobile, dan reduced motion.

## R06 — Aset, font, audio, dan ikon

```text
public/assets/
  brand/                          # logo/wordmark resmi
  fonts/plus-jakarta-sans/         # font dan lisensi
  fonts/instrument-serif/         # editorial terpilih
  fonts/geist-mono/                # angka/teknis
  images/marketing/
  images/placeholders/
  icons/                          # SVG statis terkurasi
  themes/<theme-id>/
    images/
    ornaments/
    audio/                        # hanya audio berlisensi yang benar-benar digunakan
src/features/templates/config/    # manifest theme/aset bertipe
```

- Foto/audio pengguna dan dokumen privat disimpan di **object storage**, terpisah dari aset statis Git. Contoh key: `tenants/<workspace-id>/invitations/<id>/<category>/<asset-id>`; key bukan bukti izin.
- Semua aset memiliki manifest: ID stabil, kategori/theme, path/key, MIME, dimensi/durasi/ukuran, checksum, sumber/lisensi dan alt/credit yang relevan. Jangan menduplikasi file hanya karena dipakai dua layar.
- Nama lowercase kebab-case, tanpa `final-v2-new-copy`. Pisahkan sumber desain dari aset runtime; jangan menaruh seluruh screenshot/desain mentah di bundle/public.
- Validasi MIME **dan isi**, ukuran/dimensi/durasi, quota, ownership dan lisensi; sanitasi SVG. Upload via URL terbatas dengan verifikasi server setelah selesai, cleanup orphan dan aturan retensi.
- Gunakan `next/image` sesuai kebutuhan rasio/dimensi/sizes dan allowlist host; gunakan `next/font/local` untuk font berlisensi. Hindari font CSS/CDN dobel.
- Ikon melalui satu facade `Icon`, SVG terkurasi atau library tunggal yang dipilih; dekoratif `aria-hidden`, kontrol memiliki accessible name.
- Audio mengikuti interaksi pengguna dan kontrol mute/play; jangan menjanjikan autoplay browser. Bersihkan object URL/listener setelah unmount.
- Scope akses storage membedakan media undangan terbit dari dokumen privat. Signed URL singkat untuk aset privat; jangan meletakkannya di metadata/analytics/log.

## R07 — Integritas bisnis dan keamanan

- Uang integer IDR dengan batas aman; operasi transfer/budget memakai transaksi dan constraint. `PaymentTestRequest` tidak berubah menjadi pembayaran komersial hanya karena direview `APPROVED_TEST`.
- Pembayaran V2: nominal server, verifikasi authenticity provider, dedupe event dengan unique key, transaksi perubahan status/entitlement, replay/concurrency handling dan rekonsiliasi.
- Jangan merender HTML pengguna tanpa sanitasi; URL media/link dibatasi protokol/host. Parameter query selalu melalui Prisma atau raw query terparameterisasi.
- Cookie sesi HttpOnly, Secure pada HTTPS, SameSite sesuai alur; rate limit, origin/CSRF, fresh reauth untuk aksi sensitif dan revocation harus dipertahankan.
- Jangan log token RSVP/session/OTP/password, kontak tamu, secret, atau payload provider mentah. Pakai redaksi struktural.
- Guest token merupakan capability sempit; tidak memberikan role customer atau akses daftar tamu lain. Detail policy pada 03.

## R08 — Aturan tambahan dari desain/slicing

- **Satu sumber kebenaran:** Visual/Form satu document; draft/active dan CMS template/project version berbeda. Restore membentuk draft baru; unpublish tidak otomatis revoke ticket.
- **Keuangan:** posted ledger immutable dengan reversal/replacement; bedakan PIC, payer, funding account dan recorder. Transfer internal tidak menambah kontribusi/expense; dana acara berbeda saldo bank dan sisa anggaran berbeda utang.
- **Commerce:** quote/hold/version/expiry server; approved contract immutable. Catalog/fee baru tidak mengubah order lama; partial rejection tidak membatalkan item accepted. Guest checkout tidak wajib membuat akun pasangan.
- **Side effect:** gunakan operation identity yang persisten untuk payment/refund/payout/dispatch/fulfillment/admission. Unknown/pending diperiksa melalui status operasi lama; tidak membuat intent/charge/pesan baru secara buta.
- **Consent:** import/save contact bukan izin WA. Review recipient berbeda dispatch; recheck consent/dedup/cooldown saat kirim. Publikasi ucapan/foto memerlukan consent terpisah dan moderation.
- **RSVP/check-in:** response scoped per sesi; scan bukan admission. Fresh permission/quota check dan konfirmasi arrival mendahului commit atomik; offline queue belum menambah admitted count.
- **Availability:** centralized resolver mempertahankan configured/effective state dan release version. Parent Hidden mengalahkan child Live; UI menu dan server memakai policy yang sama. Hak/recovery order historis memakai jalur owner-scoped tersendiri.
- **Sensitive operation:** action scope + fresh verification + snapshot/diff/reason/ack + version recheck. OTP tidak memberi role, tidak mem-publish feature release atau transfer dana dengan sendirinya.
- **Canvas:** `.pen` hanya melalui MCP Pencil; snapshot/marker/library/audit bukan route otomatis. `enabled:false`, OS chrome dan designer annotations tidak dirender. Jangan menyalin screenshot halaman ke runtime bundle.
- **Aset/privasi:** failed replacement mempertahankan aset verified lama; crop nondestructive. KUA/KYB/bank/dispute terpisah dari galeri publik; manifest dan signed URL tidak mengandung secret/token pengguna.
- **Waktu:** expiry, cooldown, deadline, countdown dan availability memakai clock injectable serta timezone event; timer browser bukan otoritas. Fixture numerik 05 adalah regression oracle, bukan nilai bisnis hardcode.
- **State UX:** simpan draft ketika invalid/offline/conflict/error; explicit retry/reapply/review; keyboard/form alternative drag, focus-return, reflow375 dan reduced motion. UI mock tidak membuktikan security enforcement server.

## R09 — Enforcement dan bukti review

Pada fondasi V2, buat gate otomatis: jumlah baris fisik, ESLint batas import client/server/fixture, deteksi cycle, TypeScript strict, formatter, validasi schema, unit/integrasi, build dan E2E relevan. Dokumentasikan pengecualian generator/migration secara sempit.

Pemeriksaan ukuran tidak membuktikan SRP. Reviewer tetap harus menjawab: siapa pemilik use case; apakah UI/server terpisah; apakah query terlingkup; apakah ada dua sumber data/status; apakah kontrak dan failure path diuji?

Tes wajib bernilai perilaku: IDOR lintas akun, role ditolak, sesi revoked/expired, input invalid, bulk import gagal/dedupe, RSVP kursi, transaksi bersamaan, duplicate webhook, upload quota, dan status HTTP. Jangan hanya mencari substring source untuk mengklaim otorisasi bekerja.

Tambahkan acceptance terbaru 05 serta R01–R24/A01–A06 dari handoff slicing ke matriks runtime per batch. Label hasil stored design QA dan runtime pending secara jujur; angka aritmetika yang lolos di mock bukan bukti bank/provider.

Untuk perubahan kode V2, jalankan lint/format/typecheck/schema/unit/integrasi/build dan browser sesuai dampak. Jangan menulis tes aplikasi baru untuk perubahan dokumentasi audit ini atau menjalankan build V1 yang menghasilkan artefak.

Definisi selesai: seluruh file memenuhi batas atau whitelist sah; dependency benar; fitur membaca sumber data yang benar; happy/failure/permission path teruji; status integrasi jujur; tidak ada secret atau perubahan produksi di luar scope.
