# PROMPT BATCH 02 — Perencanaan pernikahan dan fulfillment digital

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
Slice seluruh modul planner menggunakan shell Batch 01 dan availability dari Batch Ekspansi. Anchor preview `Dx42c.png`. Jangan mengubah UI menjadi dashboard generik atau menampilkan fitur Coming Soon/Maintenance sebagai fitur aktif.

## Modul wajib
1. Dashboard Pernikahan `Dx42c`, Lamaran `Un4o0`: segmented event context, readiness, countdown, task priority dan progressive disclosure.
2. Tasks `N2dqI` + inspector `Hz044`: filter/search, checkbox, PIC/status/due date, inline edit, tambah/edit/detail dan dirty confirmation.
3. KUA `FUxIj` + revisi `gK7r1`: dua mempelai, status dokumen, upload/review/revision states; berkas privat.
4. Emergency bag `OKEKY`: daftar default/checklist dan penyimpanan progres per event.
5. Rundown `aXVUJ` + generator `WBpK5`: item/waktu/durasi/PIC, input constraint, preview dan confirmation. Sumber layanan manual, bukan integrasi Vendor live.
6. Kalender `V4Cg4P`: fitting/test food/deadline, event detail, navigasi dan konflik jadwal.
7. Katering `AXNnj`: kalkulator hanya internal preview; produksi memakai teaser/waitlist sesuai flag.
8. Seserahan `X0IiC`: visual item, bought/not bought, estimasi/realisasi.
9. Moodboard `ioFcn` + simpan inspirasi `E0Whvt`: assets, URL/note, validation dan upload/error.
10. Wedding Kit `eLw4l`: Maintenance/fallback, tidak memalsukan konten tersedia.
11. Mobile task/inspector `JVyCP`:375×812, pilihan tanpa drag, detail dan focus return.
12. Fulfillment digital `USpKE`: setelah pembayaran produk standalone49 rb; jangan menyamakannya dengan Wedding Kit.

## Fixture dan logika domain
- As-of25Okt2026: Pernikahan H–112/readiness 84%/21 dari 25 task; Lamaran H–28/readiness 60%. Derived values, bukan string yang selalu tetap.
- KUA Andi 5/7 dan Risa 7/7. Revisi Elsimil/rekomendasi sesuai sumber. Upload baru tidak otomatis berarti lolos verifikasi.
- Seserahan6 item/3 dibeli; estimasiRp10.200.000, realisasiRp7.050.000. Item foto harus memakai aset sumber.
- Katering:500 undangan×2=1.000 orang; buffer 10%=1.100. Buffet660 orang;440 orang gubukan×4=1.760 porsi, total 2.420 porsi. **Orang tidak sama dengan porsi.** Validate jumlah/buffer/proporsi; tidak ada operasi catering produksi.
- Jadwal Andi/Risa: MUA 04.30–07.30; buffer 30 menit; keluarga 07.00; KUA 07.30; akad 08.00–09.00; foto 09.00–09.30; transisi 09.30–10.00; resepsi 10.00–14.00 WIB. Tanggal 14 Feb 2027/Bumi Samami. Jangan mengembalikan08.30/11.00 dari versi lama atau mengubah appointment kalender lain.

## Interaksi dan state
- Checklist tersimpan per workspace/event, bukan global browser key tunggal. Semua actor/edit memiliki version; optimistic update harus rollback pada failure/permission lost.
- Upload memberi progress, validasi file, preview privat dan retry tanpa hilang draft; mock tidak mengunggah ke storage nyata. Jangan mengekspos KTP/dokumen KUA ke URL publik.
- Rundown generator menghormati locked anchor, durasi/buffer, constraint lokasi/PIC dan konflik. Tampilkan preview/diff lalu explicit apply; tidak diam-diam overwrite susunan manual.
- Mode Lamaran tidak membawa KUA atau budget Pernikahan secara otomatis.
- Moodboard URL bukan alasan scraping platform privat atau bypass CORS; gunakan adapter/URL metadata aman dan fallback manual.
- Empty/loading/saved/upload error/offline/schedule conflict dari library `v90AJl` harus dipakai sesuai konteks, bukan menampilkan seluruh feedback sekaligus.

## Fulfillment produk digital
Hubungkan ke guest digital checkout Batch Ekspansi `u0TtL`, dengan kontrak `DigitalOrder`, `ProviderPaymentStatus`, `Entitlement`, `DeliveryAttempt`, `AccessLink`.
- Redirect sukses/unggahan bukti tidak cukup. Hanya provider status yang diverifikasi melalui adapter/server dapat menghasilkan entitlement unik.
- Unknown: periksa status, jangan membuat charge baru. Payment failed tidak memperoleh akses seolah paid.
- Verified: tombol akses/receipt muncul sesuai owner scope. Gagal kirim WA/email tidak menghilangkan ownership.
- Link expired: recover/reissue setelah owner verification; tidak meminta repurchase. Re-download tidak membuat payment/entitlement kedua.
- Consent dan status terbaru dicek saat dispatch; jangan sungguh mengirim pesan dalam mode slicing.

## Acceptance tests
- Readiness berubah sesuai task valid, task restore/edit conflict tidak merusak event lain.
- Upload invalid/retry/revision tidak menghapus berkas lama sampai versi baru siap.
- Generator mempertahankan anchor08.00/10.00, mendeteksi overlap dan membutuhkan konfirmasi.
- Rumus catering dan seserahan di atas cocok; label orang/porsi jelas.
- Coming Soon/Maintenance entrypoint tidak membuka workflow produksi via direct URL.
- Entitlement idempotent; delivery failure/expired link tidak meminta bayar ulang.
- Mobile 375, keyboard/save, dirty-dismiss dan alternatif reorder berfungsi. Screenshot desktop/mobile cocok sumber.

## Batas dan dependency
Angka tabungan/dashboard hanya selector dari adapter keuangan; jangan membuat ledger tersendiri di planner. CRM snapshot berasal dari adapter tamu. Order/refund/escrow tidak dibangun ulang pada batch ini. Buat interface typed dan mock yang dapat diganti, bukan API fiktif yang diklaim tersedia.


## Inventaris frame wajib — diambil dari snapshot aktual

Total **18** frame desain/library/state/reference pada batch ini. Setiap ID harus dipetakan ke kode/state/component atau blocker yang dinyatakan, bukan otomatis satu route per frame.

| ID frame | Nama sumber | Jenis referensi |
|---|---|---|
| `v90AJl` | 00D · Planning system — Batch 2 components & imagery | component-library-not-route |
| `Dx42c` | 14 · Dashboard kesiapan — Pernikahan | screen-or-state |
| `Un4o0` | 14B · Dashboard — Mode acara lamaran | screen-or-state |
| `N2dqI` | 15 · Checklist & tugas — Smart task manager | screen-or-state |
| `Hz044` | 15B · Detail tugas — Contextual quick inspector | screen-or-state |
| `FUxIj` | 16 · Dokumen KUA — Kelengkapan kedua mempelai | screen-or-state |
| `gK7r1` | 16B · KUA — Unggah revisi & pratinjau berkas | screen-or-state |
| `OKEKY` | 17 · Perlengkapan darurat — Checklist tas Hari-H | screen-or-state |
| `aXVUJ` | 18 · Rundown acara — Builder dari catatan layanan manual | screen-or-state |
| `WBpK5` | 18B · Rundown — Pengaturan generator otomatis | screen-or-state |
| `V4Cg4P` | 19 · Kalender koordinasi — Fitting, test food & tenggat | screen-or-state |
| `AXNnj` | 20 · Kalkulator katering — Pratinjau desain internal | screen-or-state |
| `X0IiC` | 21 · Seserahan — Daftar visual & progres belanja | screen-or-state |
| `ioFcn` | 22 · Moodboard — Referensi visual bersama | screen-or-state |
| `E0Whvt` | 22B · Moodboard — Simpan inspirasi & catatan vendor | screen-or-state |
| `eLw4l` | 23 · Wedding Kit — Pratinjau desain internal | screen-or-state |
| `JVyCP` | 23A · Tugas & inspector mobile ·375px | responsive-reference-board-not-whole-page |
| `USpKE` | 23B · Produk digital · setelah pembayaran | screen-or-state |

Baca `references/FRAME_INVENTORY.json` untuk annotations dan instance references, lalu inspeksi source `.pen` untuk hierarchy/override/style efektif. Sumber gambar dapat dilacak melalui `ASSET_MANIFEST.json`.
