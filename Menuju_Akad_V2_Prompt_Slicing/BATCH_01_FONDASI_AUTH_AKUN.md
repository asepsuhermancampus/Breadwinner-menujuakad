# PROMPT BATCH 01 — Fondasi, autentikasi, onboarding dan akun

> Prompt ini mandiri: kontrak global disertakan di bawah. Kerjakan scope khusus batch setelah membaca kontrak. Referensi relatif mengikuti folder paket unduh.

## Kontrak global wajib

## Misi dan mode kerja
Kamu adalah senior frontend engineer yang melakukan **slicing menjadi kode UI yang berfungsi**, bukan mendesain ulang, membuat mockup baru, atau hanya menulis rencana. Kerjakan hanya batch yang diminta. Jangan mengubah file sumber `.pen`. Pertahankan implementasi batch sebelumnya.

Mode default: **frontend slicing dengan adapter data mock deterministik**. Implementasikan navigasi, form, validasi, filter, modal, state dan simulasi lokal yang dapat diuji. Jangan menyebut simulasi sebagai transaksi/OTP/publish sungguhan. Jika API sudah tersedia, gunakan kontraknya; perubahan backend atau aktivasi produksi memerlukan scope/izin terpisah.

1. Inspeksi repository: package manifest, lockfile, framework, routing, styling, komponen, auth/data client, scripts dan test runner. Gunakan stack/versi yang sudah terpasang; jangan mengganti arsitektur atau upgrade major.
2. Jika repository benar-benar kosong dan tidak ada stack yang ditentukan, fallback yang diusulkan adalah Next.js App Router + TypeScript + Tailwind; verifikasi kompatibilitas versi saat scaffold. Keputusan stack yang sudah diberikan pengguna selalu mengalahkan fallback ini.
3. Gunakan komponen yang ada sebelum membuat baru. Pisahkan presentational UI, domain/state dan adapter API/mock. Jangan memasang dependency besar tanpa kebutuhan nyata.
4. Default adapter tidak menghubungi payment gateway, bank, OTP, WA, DNS, storage publik atau endpoint produksi. Secrets tidak boleh ditaruh di client.
   Gateway V2 dipilih **KlikQRIS**; label provider lama pada snapshot/inventaris bukan instruksi memakai Mayar/Midtrans/Xendit. Baca [panduan KlikQRIS](../Menuju_Akad_V2_Promt_Rules/07_KLIKQRIS_PAYMENT_GATEWAY.md); mode slicing tetap mock, bukan integrasi atau aktivasi produksi.
5. Hasil akhir harus kode aplikasi, bukan screenshot statis atau halaman berisi instruksi. Laporkan perubahan, perintah yang benar-benar dijalankan, hasil test, dan integrasi yang belum tersedia. Jangan mengarang hasil test.

## Sumber desain dan prioritas
- Snapshot lengkap: `references/design/Menuju_Akad_v2.pen`; aset relatif berada di `references/design/images/`.
- Inventaris: `references/FRAME_INVENTORY.json`; token: `references/DESIGN_TOKENS.json`; aset: `references/ASSET_MANIFEST.json`.
- Keputusan terkini: `references/audit/REMEDIATION_HANDOFF_MENUJU_AKAD_V2.md` dan `REMEDIATION_QA.json`.
- Jika bekerja langsung di folder asal, file aktif bernama `Menuju_Akad_v2.pen`. Jika ada perubahan setelah snapshot, baca ulang frame aktif dan konfirmasi perbedaannya; jangan menimpa kerja pengguna.
- Gunakan MCP Pen/Get/TakeScreenshot bila tersedia. Jika tidak, baca schema `.pen` termasuk variables, `ref` dan `descendants`, serta PNG anchor pada `references/previews/`. Jangan mengabaikan override instance atau menyalin nilai default komponen secara buta.
- Urutan otoritas: instruksi pengguna terbaru → desain V2 setelah remediasi → handoff terkini → spesifikasi fungsional lama. Jangan mengembalikan estetika heritage atau contoh Rama/Sinta menjadi identitas Andi/Risa.
- Jika sumber/asset tidak dapat dibuka, sebutkan blocker spesifik; jangan mengarang desain, foto, kebijakan atau backend. Periksa lisensi/attribution aset sebelum produksi.
- `enabled:false` dalam canvas berarti node tidak ditampilkan; jangan merendernya sebagai elemen HTML disabled yang masih terlihat. Ini penting untuk hidden icon, bank/gift lama dan handles. ID frame adalah referensi desain, bukan ID bisnis atau bukti endpoint tersedia.

## Penerjemahan canvas menjadi aplikasi
**Canvas bukan satu halaman web besar.** Koordinat ribuan piksel adalah organisasi board, bukan posisi elemen dalam aplikasi. Frame varian/inspector adalah state dari screen terkait, bukan otomatis URL baru. Library, penanda area, audit dan handoff board bukan halaman produk.

Board mobile 1600 px berisi contoh telepon **375×812**, catatan dan state. Slice layar teleponnya menjadi UI responsif; jangan membuat halaman aplikasi berisi dua mockup telepon dan catatan desainer. Status bar OS, keyboard ilustratif, resize handles dan annotation editor bukan UI publik. Gunakan keyboard native, safe-area dan kontrol browser yang sesuai.

Pertahankan hierarki, teks Indonesia, ikon, spacing, foto, crop dan tampilan state. Gunakan layout responsif semantik; jangan memosisikan semua teks dengan absolute coordinates. Data tabel harus tetap memiliki relasi header/row/cell. Elemen panjang boleh scroll pada runtime; jangan memotong isi hanya agar sama dengan tinggi screenshot.

## Design system wajib
- Canvas `#FBFBF9`; surface `#FFFFFF`; subtle `#F4F4F0`; border `#EAE9E4`.
- Text utama `#141413`; sekunder `#5E5D59`; muted `#96948E` hanya untuk konten yang sesuai, bukan otomatis semua teks kecil.
- Cypress `#1E3F32`, hover `#183429`; Champagne `#C9A66B`; Rose `#B86B5A`, rose teks aksesibel `#914F43`.
- Success `#166534`/`#F0FDF4`; warning `#9A5B13`/`#FEFCE8`; maintenance `#B45309`/`#FEF3C7`; danger/Hidden `#BE123C`/`#FFF1F2`.
- Plus Jakarta Sans untuk UI; Instrument Serif hanya judul editorial/emosional; Geist Mono/tabular numbers untuk rupiah, persen, countdown dan key teknis. Ikuti font asli, bukan mengganti semua menjadi serif.
- Radius card16 px, control12 px, shell20 px; control/hit target minimal44 px. Glass putih82% blur16 px jika dipakai sumber. Jangan menambah shadow berat, neon gradient, paper grain, wax seal atau ornamen botanical.
- Canonical pasangan: referensi desktop1600×1160, dock272 px/compact68 px, inset/gap 12 px, topbar76 px, padding body32 px. Vendor/BA dock240 px; Admin desktop1760×1200/dock240 px. Auth sumber1440 px tetap ikuti proporsinya. Jangan memaksa fixed viewport untuk semua perangkat.
- Maksimal4 metrik/baris, satu region dominan, progressive disclosure, inspector sekitar480 px, inline edit dan command search Cmd/Ctrl+K. Public invitation/checkout **tanpa dock workspace**.
- Gunakan design tokens/CSS variables/theme existing, bukan hardcode warna di setiap komponen. Uji kontras aktual; pemakaian token tidak otomatis lulus WCAG.

## Identitas, waktu dan fixture
- Andi Ramadhan & Risa Pratiwi; keluarga Andi: Bapak H. Budi Santoso & Ibu Hj. Siti Aminah; keluarga Risa: Bapak H. Dedi Prasetyo & Ibu Hj. Ratna Dewi.
- Paket aktual contoh: **Premium**. Lifetime adalah tawaran upgrade, bukan entitlement yang sudah dimiliki.
- Pernikahan: **14 Februari2027, Bumi Samami, Bandung, Asia/Jakarta**. Akad 08.00–09.00, resepsi 10.00–14.00 WIB. MUA 04.30–07.30, keluarga 07.00, KUA 07.30, foto 09.00, transisi 09.30.
- Lamaran22 November2026 dan seluruh ledger/task-nya terpisah. Jangan mengganti waktu appointment lain atau acara Rama/Sinta/Arga/Nadya.
- Fixture planner memakai snapshot 25 Oktober2026: H–112 Pernikahan/H–28 Lamaran. Clock harus injectable/frozen untuk test; runtime menghitung countdown dari event date dan timezone, bukan hardcode H–112 selamanya.
- Nilai uang disimpan sebagai integer IDR; persentase gunakan representasi presisi yang sesuai. UI memakai `Intl.NumberFormat('id-ID')` dan label Rp; payload CSV/API tidak memakai angka berformat lokal.
- Sebelum/sesudah, preview impor, draft pembayaran dan skenario koreksi adalah vignette terpisah, bukan tambahan transaksi aktual.

## Role, izin dan availability
Lima pengalaman: Pasangan, Mitra Vendor, Brand Ambassador, Tamu/Publik, Superadmin. Petugas check-in adalah delegasi event; Support/Finance scope terbatas Superadmin, bukan workspace bebas akses baru.

**Baseline release #43:** Vendor/BA **Hidden**, katering **Coming Soon**, Wedding Kit **Maintenance**, domain **Hidden/internal**, hadiah undangan aktif **nonaktif**. Marketplace/vendor/BA lengkap hanya preview sandbox Preset 3. Jangan mengaktifkan produksi demi menunjukkan hasil slicing. Sediakan internal component gallery/dev preview bila perlu, bukan query parameter publik yang membypass auth/flag.

- Live: tersedia sesuai izin. Coming Soon: teaser/waitlist, bukan workflow aktif. Maintenance: penjelasan/fallback, tanpa hilangkan data. Hidden: entrypoint baru hilang dan direct route/API harus dibatasi pada implementasi server.
- Parent Hidden mengalahkan child Live. Draft preset atau OTP saja tidak menerapkan release. Rilis perlu impact/reason/ack, verifikasi scope dan explicit publish.
- Role, action permission, event/object ownership, entitlement, effective availability dan version terpisah. OTP tidak memberi izin baru. Client gate bukan pengganti server authorization.
- Historical purchase recovery owner-scoped berbeda dari katalog/portal baru. Hidden tidak menghapus akun, order, escrow atau hak akses produk yang sudah dibeli.
- Simulasi frontend harus memodelkan revoked/expired/stale/forbidden states; tandai server enforcement sebagai pending jika backend belum ada.

## Kriteria lintas batch dan cara membuktikan
- Implementasikan empty, loading, ready, dirty, saving, saved, invalid, upload error, offline, permission-revoked dan stale conflict sesuai konteks. Tombol disabled harus punya alasan; retry tidak menggandakan aksi.
- Focus visible, tab order, label/error association, modal focus trap/return, dirty-dismiss, screen-reader status dan reduced-motion. Checkbox grafik20 px tetap target 44 px. Jangan hanya mengandalkan warna.
- Test desktop sesuai anchor dan responsif375/768/1280 px; tidak ada horizontal page overflow, control tertutup keyboard, atau data terpotong. Desain mobile belum membuktikan runtime keyboard benar.
- Jalankan typecheck, lint, build, unit/integration dan browser tests yang tersedia. Bandingkan screenshot implementasi dengan frame dalam konteks, bukan hanya komponen terisolasi. Tulis test kritis batch.
- QA canvas terakhir:180 root, nol overflow/tabrakan/placeholder;37 pemeriksaan aritmetika fixture lulus. Itu **bukan hasil test kode**. Ada24 skenario fungsi/security/payment dan 6 aksesibilitas/resilience yang belum diuji runtime pada saat handoff.
- Sebelum menyatakan batch selesai: semua frame dipetakan ke screen/state/component yang diimplementasikan atau blocker yang jujur; tidak ada dead-end CTA tanpa penjelasan; batch sebelumnya tidak rusak; laporan membedakan mock, sandbox dan integrasi nyata.


---


## Tugas spesifik
Implementasikan Batch 01 sebagai fondasi reusable seluruh aplikasi. Baca kontrak global yang disertakan. Gunakan `MNC2H.png` dan `m34FY.png` pada previews sebagai anchor, tetapi inspeksi seluruh frame dalam inventaris.

## Scope dan mapping
- `bi8Au`, `rnno1`, `FQfll`: tokens, button/input/toggle, feedback, shell expanded/compact, rich tooltip, role menu dan contextual header. Ini sumber komponen, bukan route produk.
- `MNC2H` login email/password; `hMEbg` daftar pasangan; `VgqXJ` telepon/PIN; `wZeSu` OTP; `Qyl3s` pemulihan password/PIN.
- `nohWZ` profil mempelai/keluarga; `ppEju` rencana acara; `w6pWd` undang pasangan; `VUBCF` pairing sukses.
- `m34FY` profil/access, `uP5rs` quick inspector, `m64RvD` compact shell, `CwZFE` paket, `o6oxd` privasi/perangkat, `VGsCi` hapus akun.
- `tQXWQ`: dua state auth/OTP mobile 375×812, focus/error dan keyboard. Implementasikan layar responsif nyata, bukan comparison board.

## Urutan implementasi
1. Audit komponen existing. Buat/petakan tokens dan primitive: button, field, select, date, checkbox/radio, dialog, drawer, toast/status, segmented control dan command palette.
2. Buat auth layout editorial: foto/crop sumber, panel form ringan, caption/masthead dengan plate Obsidian92%. Jangan membuat ornament heritage atau menggunakan foto baru sembarang.
3. Implementasikan auth/onboarding stepper, lalu pairing dan account settings.
4. Integrasikan canonical couple shell272/68 px, topbar76 px, tooltip hover **dan keyboard focus**, role switcher dan Cmd/Ctrl+K.
5. Tambahkan mobile, state gagal/offline/pending dan test regresi.

## Perilaku wajib
- Email/telepon tervalidasi; normalisasi telepon sesuai kontrak backend, tampilkan format ramah pengguna. Password/PIN rahasia tidak dicatat ke log/analytics. Kontrol show/hide memiliki label.
- Login method, remember session, forgot flow dan validation jelas. Pending submit dibatasi agar tidak double action. Mock login harus diberi label development dan tidak dianggap auth server.
- OTP: six-digit input, paste/autofill, expiry/resend cooldown dari adapter clock, wrong/expired/network states. Fokus kembali benar; jangan hardcode OTP universal di produksi. UI tidak mengklaim OTP terkirim jika hanya simulasi.
- Recovery tidak membocorkan apakah alamat/nomor terdaftar; respons generik dan rate-limit contract. Jangan otomatis mengubah kredensial tanpa verified recovery session.
- Onboarding menyimpan draft; next/back tidak membuang input. Pilih Lamaran/Pernikahan dengan eventId terpisah. Memuat nama/keluarga Andi–Risa sesuai sumber, bukan Rama–Sinta.
- Pairing memakai invite capability opaque, expiry/revoke/redeem states; jangan menggabungkan dua workspace otomatis. Link partner contoh `AKAD-882` adalah demo, bukan kode undangan produksi.
- Quick inspector sekitar480 px; dirty close menawarkan lanjut edit/simpan/buang, inline Enter simpan/Escape batal jika tidak bertentangan dengan konteks form; akses revocation memblokir save.
- Paket aktual Premium. Free/Premium/Lifetime harus punya fitur/CTA sesuai sumber; Lifetime bukan badge entitlement otomatis. Pembelian upgrade hanya lewat adapter/mock yang jelas.
- Privasi/notifikasi/perangkat: toggle tidak dianggap mengirim consent ke provider; sesi perangkat dan revoke menampilkan konfirmasi/status. Account deletion butuh explicit confirmation sesuai desain dan fresh authorization; jangan benar-benar menghapus data produksi.

## Kontrak komponen/data
Gunakan konsep `Session`, `WorkspaceMembership`, `EventContext`, `CoupleProfile`, `PartnerInvite`, `PlanEntitlement`, `DeviceSession`, `NotificationPreferences`. Bedakan actor yang sedang masuk, pasangan dan workspace. Route mengikuti repository; kandidat `/auth/*`, `/onboarding/*`, `/settings/profile`, `/settings/privacy`, `/settings/plans` hanyalah mapping usulan.

Komponen penting pada sumber: primary `af22E`, secondary `udOmP`, field `EM51W`, toggle `dH0mz`, search `Fe9yu`, couple dock `xOUE4`, compact `vUQ0q`, header `k9YRgN`, tooltip `v7cCe`, role menu `Z8auo0`. Inspeksi override sebelum menentukan props; jangan merender icon yang disabled dalam instance.

## Acceptance tests
- Login invalid→error, pending→resolved/rejected, recovery generic, OTP paste/wrong/expired/resend cooldown.
- Next/back onboarding mempertahankan draft; changing event context tidak memindahkan data event lain.
- Pairing expired/revoked/used token punya recovery; tidak membuat keanggotaan ganda.
- Compact/expanded shell tidak merusak body; tooltip dapat difokuskan; Cmd/Ctrl+K open/close dan fokus kembali.
- Premium tetap Premium; akses role tidak bertambah hanya karena switcher/OTP.
- 375 px dengan keyboard, safe-area, focus, field/error/save terlihat; modal trap/return dan dirty-dismiss benar.
- Form labels/validation dapat dibaca screen reader; tidak mengandalkan warna, tidak ada console error atau horizontal overflow.

## Batas batch
Belum membangun domain planner/finance/CRM. Sediakan shell slot dan adapter interface yang dapat dipakai batch berikutnya. Availability baseline jangan dilonggarkan agar menu Vendor/BA muncul; feature engine detail ada pada Batch Ekspansi.


## Inventaris frame wajib — diambil dari snapshot aktual

Total **19** frame desain/library/state/reference pada batch ini. Setiap ID harus dipetakan ke kode/state/component atau blocker yang dinyatakan, bukan otomatis satu route per frame.

| ID frame | Nama sumber | Jenis referensi |
|---|---|---|
| `bi8Au` | 00 · Sistem desain V2 — Modern Quiet Luxury | component-library-not-route |
| `rnno1` | 00B · Status & recovery V2 — Frictionless UX | component-library-not-route |
| `FQfll` | 00C · Architectural Luxury Dock — App shell system | component-library-not-route |
| `MNC2H` | 01 · Masuk — Email & kata sandi | screen-or-state |
| `hMEbg` | 02 · Daftar — Akun pasangan | screen-or-state |
| `VgqXJ` | 03 · Masuk — Nomor telepon & PIN | screen-or-state |
| `wZeSu` | 04 · Verifikasi OTP — Modal keamanan | screen-or-state |
| `Qyl3s` | 05 · Pemulihan — Kata sandi & PIN | screen-or-state |
| `nohWZ` | 06 · Onboarding 01 — Profil mempelai & keluarga | screen-or-state |
| `ppEju` | 07 · Onboarding 02 — Rencana acara | screen-or-state |
| `w6pWd` | 08 · Onboarding 03 — Undang pasangan | screen-or-state |
| `VUBCF` | 09 · Pairing berhasil — Dua akun tersinkronisasi | screen-or-state |
| `m34FY` | 10 · Pengaturan — Profil & akses peran | screen-or-state |
| `uP5rs` | 10B · Detail pasangan — Quick Inspector & inline edit | screen-or-state |
| `m64RvD` | 10C · App shell — Compact rail & rich tooltip | screen-or-state |
| `CwZFE` | 11 · Paket — Free, Premium & Lifetime Access | screen-or-state |
| `o6oxd` | 12 · Pengaturan — Privasi, notifikasi & perangkat | screen-or-state |
| `VGsCi` | 13 · Keamanan — Konfirmasi penghapusan akun | screen-or-state |
| `tQXWQ` | 13A · Masuk & verifikasi ·375px | responsive-reference-board-not-whole-page |

Baca `references/FRAME_INVENTORY.json` untuk annotations dan instance references, lalu inspeksi source `.pen` untuk hierarchy/override/style efektif. Sumber gambar dapat dilacak melalui `ASSET_MANIFEST.json`.
