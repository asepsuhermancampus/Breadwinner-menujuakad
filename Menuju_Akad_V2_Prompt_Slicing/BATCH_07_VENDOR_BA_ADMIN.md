# PROMPT BATCH 07 — Vendor, Brand Ambassador dan operasi Superadmin

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


## Tugas dan batas role
Implementasikan workspace **berbeda**, bukan satu dashboard yang hanya berganti judul. Vendor/BA 1600×1160/dock240 px; Admin1760×1200/dock240 px dan navigasi independen. Anchor `f5KPKj.png`; vendor/BA detail baca frame sumber. Batch ini berisi banyak state: kerjakan subfase7A Vendor,7B BA,7C finance operations,7D platform operations, lalu regresi lintas role.

**Baseline release 43 Vendor/BA tetap Hidden.** Preview melalui sandbox internal Preset 3; jangan membuka akses produksi untuk mendemonstrasikan UI. Support/Finance adalah scope terbatas Superadmin, bukan semua kemampuan Admin. Prinsip permission/object/event/availability/version wajib terpisah dari OTP.

## 7A — Vendor
Frames: katalog `CJw2i`, KYB `mDQYw`, orders `jVxHU`, calendar `PeBEY`, wallet `ZYbW5`, payout `VXnZN`.
- Kalyana Photography & Cinema.3package7,5 jt/15 jt/5 jt; edit draft price tidak mengubah approved order snapshots.
- KYB step 3/4; proposal bank Mandiri••6402 perlu bukti pemilik yang utuh; rekening BCA••1188 lama tetap aktif. Dokumen privat, permission/audit; bank baru belum eligible payout sebelum verified.
- 4 pendingorders; Rama/Sinta ITM2041/15 jt, contract v2; termin4,5+6+4,5 jt. Accept/reject per item dengan reason, fresh slot dan expected version; jangan auto accept semua bundle.
- Kalender membedakan confirmed/hold/internal block;12 events/4 requests pada fixtureFeb2027. Block baru tidak membatalkan confirmed order. State tanggal harus mengikuti data fixture, jangan mengubah seluruh14Feb karena event lain.
- Escrow 45 jt **terpisah** dari available 18,5 jt. Releases13,5+6,5=20 jt; fees675 rb+325 rb=1 jt; net19 jt; completed payout500 rb→18,5 jt available.
- WD105 request5 jt/fee 0/BCA 1188: available menjadi13,5 jt setelah hold satu kali. Accepted request bukan scheduled transfer atau completed transfer. Recheck KYB/bank/dispute/amount/version/idempotency.

## 7B — Brand Ambassador
Frames: recruitment `aSy8W`, ledger `huATE`, withdrawal `rGfR1`.
- Sinta Larasati, Gold 15%. Vendor recruitment code `BA-SINTA-2026` berbeda dari couple promo `SINTA2026`.
- 8 recruits=5 active+3KYB;4 rows sample. Kalyana12 orders/eligible platform fee 1 jt/commission150 rb; Arunika8/fee 1 jt/150rbheld; Luma4/0; SvaraKYB/0.
- 15% dari **eligible platform fee**, bukan GMV atau sekadar registration. Duplicate attribution/refund update tidak mencetak komisi baru.
- Available 6 jt opening+250 rb+150 rb=6,4 jt; pending 300 rb terpisah. Withdraw1 jt/BCA••4029→5,4 jt setelah hold, tidak double deduct saat scheduled/settled.
- BA Hidden menghilangkan referral input/registration/promo entrypoint yang relevan tanpa merusak checkout utama; histori komisi tidak dihapus.

## 7C — Admin finansial, KYB dan moderasi
Frames: executive `f5KPKj`, master calendar `X5XMjO`, KYB `SiDny`, moderation `gTU8N`, reconciliation `bpoHM`, webhook `XSNpx`, payouts `I1LPbH`, dispute `UJ7nm`, refund `MbVXe`, settings `uz02N`, OTP `aMmL5`, review `XjU3V`, audit `J5qwCa`.

### Executive/calendar/moderation
- Cumulative2.840 couples/72 vendors/1.120 published/GMV240 jt. Captured 180 jt×5%=9 jt accrued fee, bukan net cash.
- Cohort 1–25 Okt:1.000→720→480→320=32%, jangan membagi angka cohort dengan cumulativepublished1.120.
- Prioritas9KYB/6caption/1recon/4payout; calendar14–21 Feb sesuai source, restricted export, hold≠confirmed.
- KYB341v3 bank revision,9 queue/4 shown. Moderation6 pending/4 shown; rules4.2, captionv7/M401. Contact scanner signal, **human verdict**. `20×30cm` false positive tidak boleh auto reject. Decision perlu version/reason/audit; captionv8 memerlukan review baru.

### Reconciliation dan idempotency
- Override provider implementasi: seluruh baris memakai **KlikQRIS**, menggantikan label historis pada snapshot. TX8421 4,5 jt match; TX8422 6 jt match/duplicate no-op; TX8423 2 jt providerSettled/internalWaiting; TX8424 1,5 jt expired/unpaid, bukan captured. Nilai dan state fixture dipertahankan; bukan transaksi KlikQRIS nyata.
- Provider 12,5 jt−internal 10,5 jt=2 jt **status difference**, bukan otomatis uang hilang atau payment baru.
- Webhook example TX8423v17, signature/key/reason/ack. Provider payload harus diverifikasi server, amount/order/currency/status cocok; unknown/invalid/out-of-order tidak disamakan sukses.
- Retry reconciliation berarti periksa/replay aman sesuai contract, bukan charge ulang. Unique provider event/payment/state key; duplicate verified event no-op.

### Payout dan refund
- Queue 13 jt: WD1055 jt eligible; WD1064,75 jt dispute; WD1072 jt bank unverified; WD1081,25 jt unfinished.5 jt eligible/8 jt held; schedule26Okt bukan completed transfer.
- DisputeDS019/ORD8204 Arunika/Arga&Nadya adalah vignette berbeda dari Rama/Sinta dan checkout sandbox Andi/Risa. Jangan menyambungkan hanya karena angka cocok.
- PAY8300 captured 15 jt/refund 5 jt→10 jt. Fee 750 rb→500 rb (reversal 250 rb); vendor right14,25 jt→9,5 jt (reduction4,75 jt).5 jt refund=250 rb+4,75 jt.
- Refund original method, cumulative cap, active dispute/payment version, fresh permission, reason/ack, idempotency. Unknown tidak boleh membuat refund kedua. Submission/request accepted bukan transfer completed.

### Pengaturan sensitif dan audit
- Activeconfigv17 fee 5%, platformBCA••9087, gateway secrets masked, manualQRISoff. Draftv18 fee 6% untuk order baru/platformMandiri••6610; **bukan rekening payout vendor** dan tidak merombak fee historis.
- OTP scoped6digits/resend 00:45; verifikasi tidak memberi `financial_settings.write`. Review memerlukan valid OTP+izin+bank/version/reason/unchecked ack→explicit confirm. Draft atau OTP saja tidak mengaktifkan config.
- Auditv18published10.48/WD105accepted10.46 adalah post-confirmation vignettes terpisah. Append linked correction; audit tidak diedit untuk menyembunyikan histori. Mask data/secret/OTP pada export.

## 7D — Platform operations dan bantuan
Frames: notifications `SHE9M`, helpdesk `PS9AV`, CMS `s0GCv`, health `NUj9z`, accounts `g7JcA`, owner mobile `XZ8eT`, handoff `HDg7g`.
- Notifications: Rendi definite429/backoff retry candidate; Dewidelivered tidak retry; unknown email periksa provider; queuedInApp; revoked consent WA canceled. Recheck consent/cooldown/dedup saat dispatch.
- Helpdesk12 active/4 shown, TK2048Andi/FarahSupport. Private conversation berbeda dari internal note; draft bukan terkirim. Support tidak boleh export KTP/rekening/contact list.
- CMS templateTPL012activev12/draft 13, productPremiumPR004v7 dan legal/privacy drafts punya versi global sendiri, bukan project Andiv3. Review SEO/legal/version; jangan rewrite published content atau entitlement milik pembeli.
- Health4/5normal, queue 5/oldest4min. Backup checksum bukan bukti restore; sandbox restore20Okt adalah fixture. Maintenance draft Vendor/Preset 3/reason/ETA melewati Feature Studio review, bukan direct production switch.
- Accounts0 selected/bulkdisabled; permission scopes, no self escalation/last-admin removal, session review. Bulk operation rechecks each selected object.
- Mobile `XZ8eT` hanya tiket pribadi TK2048/PWA optional, **bukan admin queue mobile universal**. Install bukan notification consent atau izin sensitive offline caching.
- `HDg7g` handoff permission/state contract, bukan route baru di navigasi produk.

## Adapter dan test
Gunakan typed adapters untuk catalog/KYB/order/slot, escrow journal, payout, referral/commission, provider reconciliation, refund, financial config, audit, dispatch, helpdesk, CMS dan accounts. Simulate pending/unknown/failure/revoked/stale; jangan memalsukan aksi keuangan selesai pada klik.

Acceptance minimum:
- Vendor/BA/Admin/Support/Finance memiliki menu, data scope dan izin berbeda; Hidden direct route tidak bypass.
- KYB/bank update tidak langsung mengubah payout destination verified; accepted order price snapshot immutable.
- Available/held/escrow/request/scheduled/completed tidak tertukar atau double subtract.
- Commission dihitung dari fee eligible, bukanGMV; duplicate/refund handling tidak double credit.
- Recon difference2 jt, queue 13 jt, refund split5 jt dan config fee historical sesuai fixture.
- Valid OTP tanpa permission tetap forbidden; stalev17 saat v18 aktif harus re-review.
- Unknown charge/refund/payout tidak retry new intent; same idempotency replay no-op.
- Scanner false positive/human reason, notification consent revoked, helpdesk private note dan CMS draft/public isolation benar.
- Responsive375/768/desktop adaptif, accessible tables/menus/modals, no secret leak. Jangan mengklaim semua mobile role sudah diverifikasi hanya dari source mobile helpdesk.


## Inventaris frame wajib — diambil dari snapshot aktual

Total **30** frame desain/library/state/reference pada batch ini. Setiap ID harus dipetakan ke kode/state/component atau blocker yang dinyatakan, bukan otomatis satu route per frame.

| ID frame | Nama sumber | Jenis referensi |
|---|---|---|
| `zqegy` | 00J · Sistem Operasional — Akses, dana & pemulihan | component-library-not-route |
| `CJw2i` | 78 · Vendor · Katalog & profil usaha | screen-or-state |
| `mDQYw` | 79 · Vendor · KYB / revisi pembaruan rekening | screen-or-state |
| `jVxHU` | 80 · Vendor · Pesanan per item & kontrak | screen-or-state |
| `PeBEY` | 81 · Vendor · Kalender, blok & slot terkunci | screen-or-state |
| `ZYbW5` | 82 · Vendor · Dompet escrow & jurnal | screen-or-state |
| `VXnZN` | 82B · Vendor · Review permohonan pencairan | screen-or-state |
| `aSy8W` | 83 · BA · Rekrutmen vendor & atribusi | screen-or-state |
| `huATE` | 84 · BA · Komisi lintas program | screen-or-state |
| `rGfR1` | 84B · BA · Review penarikan komisi | screen-or-state |
| `f5KPKj` | 85 · Admin · Executive & funnel kohort | screen-or-state |
| `X5XMjO` | 86 · Admin · Kalender lintas vendor | screen-or-state |
| `SiDny` | 87 · Admin · KYB & tinjauan dokumen | screen-or-state |
| `gTU8N` | 88 · Admin · Moderasi & pemindai kontak | screen-or-state |
| `bpoHM` | 89 · Admin · Rekonsiliasi provider | screen-or-state |
| `XSNpx` | 89B · Admin · Webhook & idempotensi | screen-or-state |
| `I1LPbH` | 90 · Admin · Kelayakan & antrean payout | screen-or-state |
| `UJ7nm` | 91 · Admin · Sengketa & jurnal refund | screen-or-state |
| `MbVXe` | 91B · Admin · Review refund yang aman | screen-or-state |
| `uz02N` | 92 · Admin · Pengaturan keuangan terkunci | screen-or-state |
| `aMmL5` | 92B · Admin · Verifikasi OTP keuangan | screen-or-state |
| `XjU3V` | 92C · Admin · Review perubahan terotorisasi | screen-or-state |
| `J5qwCa` | 93 · Admin · Audit log & perubahan versi | screen-or-state |
| `SHE9M` | 94 · Admin · Antrean notifikasi & retry | screen-or-state |
| `PS9AV` | 95 · Admin · Tiket bantuan & percakapan | screen-or-state |
| `s0GCv` | 96 · Admin · CMS & versi konten | screen-or-state |
| `NUj9z` | 97 · Admin · Kesehatan layanan & maintenance | screen-or-state |
| `g7JcA` | 98 · Admin · Akun & otorisasi massal | screen-or-state |
| `XZ8eT` | 99 · Bantuan Mobile — Tiket pribadi & PWA opsional | screen-or-state |
| `HDg7g` | 99A · Kontrak navigasi, izin & state | technical-handoff-not-route |

Baca `references/FRAME_INVENTORY.json` untuk annotations dan instance references, lalu inspeksi source `.pen` untuk hierarchy/override/style efektif. Sumber gambar dapat dilacak melalui `ASSET_MANIFEST.json`.
