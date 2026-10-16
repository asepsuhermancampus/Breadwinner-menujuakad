# PROMPT BATCH EKSPANSI — Role, feature flags dan release engine

> Prompt ini mandiri: kontrak global disertakan di bawah. Kerjakan scope khusus batch setelah membaca kontrak. Referensi relatif mengikuti folder paket unduh.

## Kontrak global wajib

## Misi dan mode kerja
Kamu adalah senior frontend engineer yang melakukan **slicing menjadi kode UI yang berfungsi**, bukan mendesain ulang, membuat mockup baru, atau hanya menulis rencana. Kerjakan hanya batch yang diminta. Jangan mengubah file sumber `.pen`. Pertahankan implementasi batch sebelumnya.

Mode default: **frontend slicing dengan adapter data mock deterministik**. Implementasikan navigasi, form, validasi, filter, modal, state dan simulasi lokal yang dapat diuji. Jangan menyebut simulasi sebagai transaksi/OTP/publish sungguhan. Jika API sudah tersedia, gunakan kontraknya; perubahan backend atau aktivasi produksi memerlukan scope/izin terpisah.

1. Inspeksi repository: package manifest, lockfile, framework, routing, styling, komponen, auth/data client, scripts dan test runner. Gunakan stack/versi yang sudah terpasang; jangan mengganti arsitektur atau upgrade major.
2. Jika repository benar-benar kosong dan tidak ada stack yang ditentukan, fallback yang diusulkan adalah Next.js App Router + TypeScript + Tailwind; verifikasi kompatibilitas versi saat scaffold. Keputusan stack yang sudah diberikan pengguna selalu mengalahkan fallback ini.
3. Gunakan komponen yang ada sebelum membuat baru. Pisahkan presentational UI, domain/state dan adapter API/mock. Jangan memasang dependency besar tanpa kebutuhan nyata.
4. Default adapter tidak menghubungi payment gateway, bank, OTP, WA, DNS, storage publik atau endpoint produksi. Secrets tidak boleh ditaruh di client.
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


## Tujuan dan dependency
Bangun foundation multi-role/availability setelah Batch 01 agar batch selanjutnya tidak hardcode menu. Ini **Batch Ekspansi**, bukan Batch 08 dan bukan pengganti Batch 07 operasi. Anchor `bLaVb.png`; Feature Studio sumber1920×1600 berbeda dari Admin operasi1760×1200.

## Cakupan frame
- Library `rOsoG`; Feature Studio `bLaVb`; cascade/review `T1iXe`; security gate `xUTSV`.
- Couple release 43 `arf9l`; ComingSoon `J0C5L`/waitlist success `V9L0nn`; Maintenance `sCBWB`; manual vendor fallback `wnYOo`.
- Vendor preview `lrAK9`; BA preview `xbJUF`; guest invitation `cN7lO`; pass/Wallet inactive gifts `wVmls`; digital public checkout `u0TtL`.
- Source components: docks `xOUE4`/`zYvTA`/`PRqHQ`/`JepY5`, status selectors `MvYsd`/`Bi2UW`/`k0KX3`/`ePsad`, menu `S4VFV`, registration Preset 3 `y9NkuH`, registration release 43 `hgvHj`.

## Arsitektur role dan permissions
Lima pengalaman: Pasangan, Vendor, BA, Tamu/Publik dan Superadmin. Membership/action permission/object-event scope/entitlement/effective availability/version berbeda. Petugas check-in delegasi event, Support/Finance scope terbatas; jangan memberi akses penuh karena role switcher dipilih.

Implementasikan shell/navigation registry yang memakai capability dan availability selectors, bukan branching string role tersebar. Switcher hanya menampilkan membership yang memang dimiliki. Public checkout/invitation tidak menerima dock pasangan/vendor.

## Availability dan state draft/active
Gunakan enum `Live | ComingSoon | Maintenance | Hidden` dengan label Indonesia sesuai sumber. Model `RoleAvailability`, `FeatureNode`, parentKey, configuredState/effectiveState, teaser/maintenance config, releaseVersion, draftConfig, changeReason, acknowledgement dan verificationScope.

- **Release 43 aktual fixture:** Vendor/BA Hidden, catering ComingSoon, Wedding KitMaintenance, vendor auto-sync Hidden, domain Hidden, gifts inactive.
- Preset 1 planner+invitation; Preset 2 +Vendor, BA Hidden; Preset 3 full ecosystem. Ini preset **draft/sandbox**, bukan alasan menimpa active release saat halaman dimuat.
- Parent Hidden mendominasi child Live; jangan menghancurkan configured child state ketika parent berubah, tetapi hitung effective state dengan benar. Definisikan kombinasi ComingSoon/Maintenance sesuai policy sumber/handoff; konflik yang tidak ditentukan jangan diselesaikan dengan asumsi membuka fitur.
- Live masih perlu permission/entitlement. Hidden menghilangkan registration/menu/referral entrypoint terkait tanpa gap kosong. Direct route harus ditolak oleh server integration; client gate sendiri bukan enforcement keamanan.
- Historical data/order/escrow/entitlement tidak dihapus. Owner recovery terbatas berbeda dari akses portal/katalog baru.

## Feature Studio dan kontrol
- 4 master role cards sesuai sumber, feature tree hierarchical/search/filter/expand, granular status selector 44 px, sidebar visibility, right inspector dan impact summary. Jangan mengganti selector dengan badge read-only atau sebaliknya.
- Selector putih44 px dengan dot/label/chevron; menu 4 opsi dengan detail/icon/text. Read-only summary lebih pendek/tinted/tanpa chevron; state tidak hanya warna.
- Inspector teaser: custom badge/message, launch date, waitlist toggle/count, ETA, whitelist; whitelist harus membership/server-authorized, bukan public email/query bypass.
- Parent change menampilkan impacted registration/menu/public routes/data-history, reason dan explicit acknowledgement. Preset/draft save tidak menjalankan production action.
- Release flow: preset/edit→draft→impact+reason+ack→scoped OTP→explicit publish with fresh permission/version. OTP expired/wrong/revoked/versionchanged menahan commit; OTP valid sendiri tidak menerapkan release.
- Mock adapter boleh mensimulasikan published snapshot pada demo state yang terpisah; tidak boleh mengubah baseline 43 diam-diam atau memanggil produksi.

## Availability UX
- ComingSoon: teaser + countdown + waitlist. Fixture 142→143 setelah successful unique registration; double click/reopen tidak menambah lagi. No real WA/email.
- Maintenance: reason/ETA/data-retention/fallback; tidak mengklaim real incident sudah diperbaiki. Wedding Kit link tidak membocorkan modul internal yang belum live.
- Vendor Hidden: couple entrypoint menjadi catatan vendor manual; sumber rundown tidak disebut live vendor sync.
- BA Hidden: registration/referral inputs/promo entrypoint disembunyikan di checkout tanpa memblokir pembelian; legacy attribution/history tetap terpelihara.

## Public dan role preview
- Couple preview mempertahankan Premium, Andi/Risa, event context dan data nyata contoh; jangan mengadopsi sapaan Rama/Sinta dari spesifikasi konseptual.
- Vendor Kalyana:12 events/4 pending, escrow 45 jt/available 18,5 jt/rating 4,98; BA Sinta Larasati Gold 15%,3.420 clicks/218 trials/64 paid/available 6,4 jt. Detailed operations dilanjutkan Batch 07, jangan buat domain store duplikat.
- Public invitation lama sudah dikoreksi: akad 08.00/resepsi 10.00 WIB. Pass QR adalah **demo**, bukan admission. Gifts tetap inactive; `enabled:false` gift/bank subtree tidak dirender.
- Wallet unsupported→galeri; jangan mengklaim Apple Wallet integration aktif atau meminta izin notifikasi sebagai syarat RSVP.
- Digital checkout standalone Rp 49.000 tanpa full account, fee sesuai sumber, transactional consent terpisah. BA Hidden tidak merusak checkout. Unknown payment tidak charge ulang; fulfillment/entitlement menggunakan Batch 02 `USpKE`.

## Acceptance tests
- Matrix role×action×event×entitlement×effective flag tidak memberi izin berlebih; role switcher/OTP bukan authorization grant.
- Hidden parent+Live child tetap inaccessible; ComingSoon/Maintenance menampilkan UX tepat dan data tidak dihapus.
- Preset change/draft/OTP tanpa explicit publish tidak mengubah active release 43.
- Stale version/OTP expiry/permission revoke saat review menolak commit dan menjaga draft.
- Vendor/BA registration/referral/menu hilang sesuai flag; manual vendor fallback aktif; public checkout tetap jalan via mock tanpa referral.
- Waitlist unique/idempotent,142→143 sekali; no duplicate subscription saat retry.
- Public pass tidak menampilkan disabled bank detail dan tidak menganggap QR scanned sebagai admitted.
- Selector keyboard/focus 44 px, role menus accessible, responsive shell tidak clipped.

## Batas handoff
Definisikan contract/read adapters dan validasi UI. Jangan menyatakan feature gate server, OTP, release publish atau commerce berfungsi sebelum integrasi/runtime test benar-benar tersedia. Jangan memindahkan semua operasi Batch 07 ke scope ini.


## Inventaris frame wajib — diambil dari snapshot aktual

Total **14** frame desain/library/state/reference pada batch ini. Setiap ID harus dipetakan ke kode/state/component atau blocker yang dinyatakan, bukan otomatis satu route per frame.

| ID frame | Nama sumber | Jenis referensi |
|---|---|---|
| `rOsoG` | 00E · Multi-role system — Shells, flags & public entrypoints | component-library-not-route |
| `bLaVb` | 24 · Superadmin — Modular Feature Studio & impact inspector | screen-or-state |
| `T1iXe` | 24B · Superadmin — Review cascade & konfirmasi rilis | screen-or-state |
| `xUTSV` | 24C · Superadmin — Security gate sebelum produksi | screen-or-state |
| `arf9l` | 25 · Pasangan — Collaborative Planner / release #43 | screen-or-state |
| `J0C5L` | 26 · Pasangan — Katering Coming Soon / teaser publik | screen-or-state |
| `V9L0nn` | 26B · Pasangan — Berhasil masuk daftar prioritas | screen-or-state |
| `sCBWB` | 27 · Pasangan — Wedding Kit Maintenance / data aman | screen-or-state |
| `wnYOo` | 28 · Pasangan — Vendor Hidden / catatan manual otomatis | screen-or-state |
| `lrAK9` | 29 · Mitra Vendor — B2B Studio & Escrow / Preset 3 | screen-or-state |
| `xbJUF` | 30 · Brand Ambassador — Growth & Commission Hub / Preset 3 | screen-or-state |
| `cN7lO` | 31 · Tamu — Undangan personal & Smart RSVP / mobile | screen-or-state |
| `wVmls` | 31B · Tamu — QR Pass & Wallet / hadiah nonaktif | screen-or-state |
| `u0TtL` | 32 · Publik — Checkout produk digital tanpa akun / BA Hidden | screen-or-state |

Baca `references/FRAME_INVENTORY.json` untuk annotations dan instance references, lalu inspeksi source `.pen` untuk hierarchy/override/style efektif. Sumber gambar dapat dilacak melalui `ASSET_MANIFEST.json`.
