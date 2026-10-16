# PROMPT BATCH 03 — Keuangan, sumber dana, rekening dan anggaran

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


## Tugas spesifik dan dependency
Implementasikan seluruh Batch 03 memakai shell/auth Batch 01 dan availability Ekspansi. Gunakan **versi setelah remediasi**, bukan label keuangan lama. Anchor `w7nKVL.png`, mobile `KyFHp.png`. Keuangan harus berasal dari satu domain store/adapter dengan selector teruji, bukan angka independen yang dihardcode pada masing-masing halaman.

## Scope lengkap
- Ringkasan `w7nKVL`; tabungan `OpGQi` + catat setoran `viFWB`; target/simulator `HYcrO`.
- Budget 11 kategori/inline edit `kXCB3` + konflik versi `f3gyC`.
- Expenses `YGhuy` + detail/bukti/audit `yX59Y`; jadwal termin `AMdWi`.
- Laporan `BbisD`, ekspor `tepqM`, CSV `FoaEJ` + repair/compare `Q8dVnf`.
- Mobile lama `q44djF`/`TzWN3` dan mobile keyboard/dirty-dismiss `KyFHp`; keuangan Lamaran `KAMys`.
- Rekening/mutasi `AsgIs`; transfer record `I1fa2`; rekening/saldo awal/koreksi `dXzYX`.
- Library `I3oh1` adalah sumber reusable finance rows/badges/feedback, bukan route.

## Aturan akuntansi yang tidak boleh dilanggar
1. **Sisa rencana biaya bukan otomatis utang/tagihan terkonfirmasi.** 13 jadwal termin manual juga rencana sampai kontrak, nominal, tanggal dan bukti dikonfirmasi.
2. Pisahkan `budgetPIC`, `paidBy`, `fundingScope/fundingAccountId`, `recordedBy`. Pemilik rekening pribadi dapat menyimpan **alokasi dana acara**; jangan menganggap semua rekening pribadi adalah dana eksternal.
3. `event_fund`: expense menambah realisasi dan mengurangi alokasi rekening acara. `external_private`: expense menambah realisasi, tetapi **tidak mengurangi dana acara**.
4. Contribution adalah pemasukan kontribusi. Menyimpan target/rencana kontribusi tidak membuat setoran atau autodebit.
5. Transfer internal adalah debit/kredit atomik, bukan contribution atau expense. Ini pencatatan manual, **bukan mengirim uang**.
6. Posted entry tidak diedit/dihapus diam-diam; koreksi memakai linked reversal+replacement, alasan, bukti, actor, version dan idempotency.
7. Opening allocation memiliki cut-off/source; jangan menggandakan uang dari opening dan transaksi impor yang overlap. Rekonsiliasi opening nonzero diperlukan.
8. Lamaran/Pernikahan memiliki eventId, accounts, ledger, target dan permission scope terpisah.
9. Data contoh adalah ledger desain, **bukan bank balance hasil koneksi**. Pending/unknown order payment tidak otomatis menjadi biaya realized.
10. Integrasi sourcePaymentId di masa depan harus match/link unik; payment yang sama tidak boleh masuk dua kali dari webhook, bukti manual dan impor.

## Fixture aktual contoh — integer IDR
- Budget/target 150.000.000; contributions 112.500.000 = Andi 55.000.000 + Risa 42.500.000 + keluarga 15.000.000.
- 7 expenses 57.500.000: venue 15.000.000; catering 13.500.000; MUA 8.000.000; dokumentasi 7.500.000; dekorasi 9.000.000; busana 4.000.000; hiburan 500.000.
- Semua 7 expense ini memakai alokasi dana acara. Sisa dana acara 55.000.000; sisa rencana 92.500.000; gap contribution 37.500.000.
- BCA Andi••4821:55 jt setoran−36 jt biaya−9 jt mutasi keluar = **10 jt**.
- Mandiri Risa••9012:42,5 jt−12 jt biaya = **30,5 jt**.
- Jago Bersama••7734:15 jt+9 jt mutasi masuk−9,5 jt biaya = **14,5 jt**.
- Opening 0 per 19 Sep 2026. Total alokasi10+30,5+14,5 =55 jt. Jangan menambah mutasi 9 jt ke total kontribusi.
- Deposits:20 Sep Andi 25 jt;1 Okt Risa 30 jt;5 Okt Andi 25 jt;10 Okt keluarga 15 jt;15 Okt Risa 10 jt;22 Okt Andi 5 jt;25 Okt Risa 2,5 jt.

### Budget 11 kategori, bukan kategori Marketplace
| Kategori | Rencana IDR | Dibayar IDR | PIC |
|---|---:|---:|---|
| Venue |30000000|15000000|Bersama|
| Katering |45000000|13500000|Andi|
| MUA |8000000|8000000|Risa|
| Dokumentasi |15000000|7500000|Andi|
| Dekorasi |18000000|9000000|Bersama|
| Busana |8000000|4000000|Risa|
| Cincin & mahar |10000000|0|Bersama|
| Hiburan |5000000|500000|Bersama|
| Souvenir |4000000|0|Bersama|
| Undangan |3000000|0|Risa|
| Transportasi & lainnya |4000000|0|Andi|

## Vignette harus terisolasi, bukan ditambahkan ke fixture aktual
- Draf setoran 5 jt→117,5 jt kontribusi, belum posted.
- Draf transfer1 jt BCA→Jago: BCA 9 jt/Jago 15,5 jt, total 55 jt. Save hanya setelah validasi; cancel tidak mengubah ledger.
- Koreksi MT-009 dari 9→8 jt: reversal 9 lalu replacement 8; BCA 11 jt/Jago 13,5 jt, total 55 jt. Ini preview koreksi, bukan mutasi ketiga yang dijumlahkan sembarang.
- Draft expense transport 500 rb dari Mandiri event fund: expenses 58 jt, cash 54,5 jt. Pilih external private: expenses 58 jt tetapi cash 55 jt.
- Conflict budget venue base 30 jt/v17, server 31 jt/v18, local 32 jt: lihat diff, choose/reapply dengan version baru; jangan auto overwrite. Local total 152 jt memicu overbudget 2 jt bila lainnya tetap.
- Simulator gap 37,5 jt/4 periode=9,375 jt;50/50=4,6875 jt/orang/periode. Setoran aktual read-only; persentase total 100%; entrypoint target dari savings harus berfungsi.
- Lamaran: target 20 jt, contributions 12 jt, expenses 5 jt, cash 7 jt, sisa rencana 15 jt. Jangan campur dengan Pernikahan.

## CSV, report dan form behavior
- Impor 5 baris:3 valid 500 rb+750 rb+250 rb=1,5 jt; invalid `32Okt2026`150 rb; duplicate venue 15 jt/EX-1001 excluded. Pilih baris via checkbox 44 px; repair invalid dan compare duplicate jelas.
- Mapping sumber dana wajib sebelum confirm. Jika 3 valid dari event fund: expenses 59 jt/cash 53,5 jt. Jika sumber berbeda, hitung sesuai scope; jangan otomatis55−semua expenses pribadi.
- Parsing raw IDR/date tegas; UI lokal bukan payload. Export UTF-8 semicolon, deposits/expenses terpisah, private notes/proofs default off; export berdasarkan event/filter/izin saat aksi.
- Account form: personal/couple/shared allocation, owner, bank, masked account, opening/date/evidence. Client tidak boleh mengirim instruksi transfer bank.
- Inspector 480 px, close 44 px, date/select icon nyata, payer/source/recorder tampil terpisah. Enter/Escape/dirty-dismiss tidak menyebabkan kehilangan data.
- Reports memakai ledger selector yang sama; filter periode dapat direproduksi. Reversal/refund tampil bertaut, bukan mengubah histori.

## Acceptance tests kritis
- Semua total aktual, sumber per akun dan budget di atas cocok. Conservation invariant transfer/correction menjaga total event.
- External-private vs event-fund menghasilkan cash berbeda; payer dan recorder tidak ikut tertukar.
- Negative/zero expense, same-account transfer, overdraw dan invalid 100% diblokir sesuai konteks; opening 0 tetap valid.
- Duplicate import/submit/sourcePaymentId tidak menggandakan posting; correction memakai expected version dan atomik.
- Read-only actual contribution tidak dapat dimutasi simulator. Invalid CSV tidak lolos melalui bulk-select.
- Permission/event revoked atau conflict saat save menjaga draft dan menolak commit; semua expense terisolasi event.
- 375 px keyboard/save/safe-area, focus/error announcements, dialog return dan CSV/table keyboard navigation diuji.
- Tidak ada real bank transfer, Vendor sync aktif atau perubahan ledger akibat sandbox bundle 35 jt Batch 04.


## Inventaris frame wajib — diambil dari snapshot aktual

Total **21** frame desain/library/state/reference pada batch ini. Setiap ID harus dipetakan ke kode/state/component atau blocker yang dinyatakan, bukan otomatis satu route per frame.

| ID frame | Nama sumber | Jenis referensi |
|---|---|---|
| `I3oh1` | 00F · Sistem Keuangan — Komponen & feedback | component-library-not-route |
| `w7nKVL` | 33 · Ringkasan Keuangan — Dana acara & sisa rencana | screen-or-state |
| `OpGQi` | 34 · Tabungan Bersama — Riwayat & kontribusi | screen-or-state |
| `viFWB` | 34B · Catat Setoran — Inspector & bukti transfer | screen-or-state |
| `HYcrO` | 35 · Target Dana — Simulasi kontribusi transparan | screen-or-state |
| `kXCB3` | 36 · Buku Anggaran — 11 kategori & edit inline | screen-or-state |
| `f3gyC` | 36B · Konflik Edit — Rekonsiliasi versi aman | screen-or-state |
| `YGhuy` | 37 · Pengeluaran — Buku kas & lampiran pembayaran | screen-or-state |
| `yX59Y` | 37B · Detail Pembayaran — Bukti, termin & jejak audit | screen-or-state |
| `AMdWi` | 38 · Jadwal Termin — Pengingat & kebutuhan pendanaan | screen-or-state |
| `BbisD` | 39 · Laporan Keuangan — Arus dana & rekonsiliasi | screen-or-state |
| `tepqM` | 39B · Ekspor Laporan — CSV, periode & privasi | screen-or-state |
| `FoaEJ` | 40 · Impor CSV — Pemetaan, validasi & deduplikasi | screen-or-state |
| `q44djF` | 41 · Mobile Keuangan — Ringkasan & aktivitas | screen-or-state |
| `TzWN3` | 41B · Mobile Catat Pengeluaran — Bottom sheet | screen-or-state |
| `KAMys` | 42 · Keuangan Lamaran — Konteks & dana terpisah | screen-or-state |
| `AsgIs` | 42A · Rekening dana acara & mutasi | screen-or-state |
| `I1fa2` | 42B · Catat mutasi, bukan kirim uang | screen-or-state |
| `Q8dVnf` | 42C · Perbaiki & bandingkan sebelum impor | screen-or-state |
| `KyFHp` | 42D · Catat biaya · keyboard & keluar draf | responsive-reference-board-not-whole-page |
| `dXzYX` | 42E · Rekening & koreksi catatan | screen-or-state |

Baca `references/FRAME_INVENTORY.json` untuk annotations dan instance references, lalu inspeksi source `.pen` untuk hierarchy/override/style efektif. Sumber gambar dapat dilacak melalui `ASSET_MANIFEST.json`.
