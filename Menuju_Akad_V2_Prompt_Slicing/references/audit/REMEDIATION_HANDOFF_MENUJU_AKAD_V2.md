# Menuju Akad V2 — Hasil remediasi dan handoff

## Status dan batas klaim

Tindak lanjut atas **3 P0, 8 P1, dan 3 P2** pada audit awal telah diterapkan pada canvas. Ini hasil **desain dan spesifikasi interaksi**, bukan aplikasi berjalan. P0 ditangani pada tingkat desain; P1-04 dan P1-08 secara khusus tetap memerlukan validasi runtime. Temuan lain juga membutuhkan implementasi dan pengujian sebelum boleh diaktifkan.

- Canvas: `Menuju_Akad_v2.pen`.
- Ringkasan terkini: **Audit Final | 04** — `TzrQC`.
- Audit awal dipertahankan sebagai snapshot: [FINAL_AUDIT_MENUJU_AKAD_V2.md](./FINAL_AUDIT_MENUJU_AKAD_V2.md).
- Hasil pemeriksaan desain: [REMEDIATION_QA.json](./REMEDIATION_QA.json).
- Tidak ada backend, route enforcement, prototype executable, transaksi, transfer bank, pengiriman OTP/WA, penerbitan, DNS/SSL, admission QR, atau instalasi PWA yang dilakukan.
- `context` serta pemetaan tujuan tombol merupakan handoff deskriptif. Bukan bukti bahwa tombol sudah berfungsi.

## 1. Keputusan yang dipertahankan

1. Tetap **tujuh batch** dan **Batch Ekspansi**. Tidak membuat Batch 08.
2. Master **Tahap 4** membutuhkan Marketplace; canvas **Batch 04** sebelumnya berisi CRM. CRM tidak diganti. Addendum 52A–52P menutup kesenjangan tersebut.
3. **Release #43 tidak berubah**: Vendor/BA Hidden, katering Coming Soon, Wedding Kit Maintenance. Domain tetap Hidden/internal; hadiah pada undangan aktif tetap nonaktif.
4. Marketplace baru adalah **sandbox Preset 3**. Jangan menganggap paket contoh sebagai pembelian aktual, penggantian vendor aktual, atau tambahan ledger Andi–Risa.
5. **Andi Ramadhan & Risa Pratiwi**, keluarga, tanggal/venue dan entitlement **Premium** dipertahankan. Lifetime tetap penawaran upgrade.
6. Jadwal desain mengikuti versi undangan terbaru: **14 Februari 2027, Bumi Samami, Bandung, WIB; Akad 08.00–09.00, Resepsi 10.00–14.00**. Pemilik harus memverifikasi ulang sebelum publikasi nyata.
7. Lamaran 22 November 2026 dan keuangannya tetap terpisah.
8. Visual tetap Modern Quiet Luxury: Plus Jakarta Sans, Instrument Serif selektif, Geist Mono untuk angka teknis; bukan kembali ke heritage.

## 2. Status per temuan

| ID | Tindak lanjut desain | Bukti canvas | Batas tersisa |
|---|---|---|---|
| P0-01 | Discovery 11 kategori, cek tanggal serentak, profil, favorit, draf dan bundler | `mkFcs`, `VKRRC`, `y39xp`, `KQuvx`, `RB5cT`, `p1hIw` | Marketplace produksi tetap Hidden; availability harus otoritatif di server. |
| P0-02 | Guest checkout, hold, item acceptance/replacement, kontrak, DP/full/termin, metode pembayaran, invoice/receipt dan recovery | `PFaIp`, `c1GHr`, `sCDXm`, `f9tDH`, `I7adT5`, `CyKZk`, `YDHrr`, `fyvrX` | Tidak ada order/charge sungguhan; manual payment hanya preview internal ketika flag tidak tersedia. |
| P0-03 | Sisa rencana bukan utang; PIC, payer, sumber dan recorder dipisah | `w7nKVL`, `kXCB3`, `yX59Y`, `AsgIs`, `I1fa2` | Pembukuan manual, bukan saldo bank terverifikasi. |
| P1-01 | Rundown, generator dan undangan lama diselaraskan dengan 08.00/10.00 | `aXVUJ`, `WBpK5`, `cN7lO`, undangan/WA terbaru | Tidak mengubah waktu janji lain atau jadwal Lamaran. |
| P1-02 | Tiga rekening, saldo awal/cut-off, tipe kepemilikan, mutasi dan koreksi bertaut | `AsgIs`, `I1fa2`, `dXzYX` | Skenario koreksi bukan perubahan transaksi aktual. |
| P1-03 | Setoran ledger read-only, entrypoint target, total kontribusi 100%, rencana tidak menciptakan setoran | `HYcrO`, `OpGQi` | Simulator bukan autodebit. |
| P1-04 | Contoh 375×812, keyboard, save, dirty-dismiss, fokus, OTP, kontrol 44 px, alternatif drag, plate kontras foto | `tQXWQ`, `JVyCP`, `KyFHp`, `fyvrX`, `W214ws`, auth desktop | **Belum diuji runtime/screen reader/WCAG.** |
| P1-05 | Intake sengketa owner, item/kontrak, alasan, bukti privat, deadline, dedup dan respons | `EudS2`, operasi lanjutan `UJ7nm` / `MbVXe` | Pengajuan tidak otomatis membuat refund. Deadline 21 Feb pada contoh adalah fixture kontrak. |
| P1-06 | Provider verified → entitlement, akses/receipt, gagal kirim, link expired dan unduh ulang | `USpKE`, checkout digital `u0TtL` | Produk digital Rp49.000 terpisah dari Wedding Kit yang tetap Maintenance. |
| P1-07 | Checkbox/pilih, perbaiki/bandingkan, sumber wajib, raw CSV versus rupiah lokal, tipografi tabel | `FoaEJ`, `Q8dVnf`, tabel Batch 03 | Impor harus atomik/idempoten setelah mapping dan konfirmasi. |
| P1-08 | Rute usulan, role/action/event/entitlement/availability, state dan regresi | `HDg7g`, context 52A–52P, dokumen ini | **Belum ada enforcement server atau UAT aplikasi.** |
| P2-01 | Inventaris designed/deferred/internal, syarat aktivasi dan fallback | `IdxPj`, pass lama `wVmls` | Hadiah/domain tetap nonaktif; hotel/IG/Wallet bukan klaim integrasi tersedia. |
| P2-02 | Inspector 480 px, select/date affordance, close 44 px, PIC versus payer | `viFWB`, `yX59Y`, `f3gyC`, `HYcrO`, `dXzYX` | Focus trap/return dan kontrol native perlu implementasi. |
| P2-03 | Metrik berulang dikurangi, savings lebih bermakna, safeguard dekat aksi sensitif | `kXCB3`, `OpGQi`, `w7nKVL` | Jangan menghapus peringatan pembayaran/publikasi/privasi saat implementasi. |

## 3. Inventaris tambahan

### Batch 03
- 42A `AsgIs`: Rekening dana acara & mutasi.
- 42B `I1fa2`: Catat mutasi, bukan kirim uang.
- 42C `Q8dVnf`: Perbaiki & bandingkan sebelum impor.
- 42D `KyFHp`: Catat biaya, keyboard dan keluar draf; dua contoh telepon 375×812.
- 42E `dXzYX`: Rekening, saldo awal/cut-off dan koreksi reversal + replacement.

### Batch 04 — addendum Marketplace
| Frame | ID | Isi |
|---|---|---|
| 52A | `mkFcs` | Discovery 11 kategori, tanggal/lokasi/harga/jarak |
| 52B | `VKRRC` | Pemeriksaan vendor pada tanggal yang sama |
| 52C | `y39xp` | Profil/paket Lensa Teduh Photo |
| 52D | `KQuvx` | Favorit dan draf tersimpan |
| 52E | `RB5cT` | Bundler lintas vendor |
| 52F | `p1hIw` | Harga berubah dan hold berakhir |
| 52G | `PFaIp` | Guest checkout jasa |
| 52H | `c1GHr` | DP/full/termin dan metode pembayaran |
| 52I | `sCDXm` | Manual payment internal, belum aktif |
| 52J | `f9tDH` | Unknown/failed/verified dan retry aman |
| 52K | `I7adT5` | Penolakan/penggantian satu item |
| 52L | `CyKZk` | Kontrak dan persetujuan versi baru |
| 52M | `YDHrr` | Invoice, receipt dan termin lanjutan |
| 52N | `EudS2` | Intake sengketa owner |
| 52O | `fyvrX` | Checkout mobile 375×812 |
| 52P | `c6ReWy` | Hidden, kosong, offline dan izin hilang |

**11 kategori Marketplace**, bukan kategori anggaran: Prewedding; Busana/Fitting; MUA; Seserahan/Mahar; Dokumentasi; Dekorasi/Florist; Katering; Kue/Dessert; Souvenir; Undangan Digital/Cetak/Hybrid; Denah Ilustrasi.

Tambahan lain: Batch 01 13A `tQXWQ` auth/OTP mobile; Batch 02 23A `JVyCP` planner mobile dan 23B `USpKE` fulfillment digital; Batch 05 66A `IdxPj` inventaris opsional; Batch 06 77A `W214ws` studio mobile; Batch 07 99A `HDg7g` kontrak navigasi/izin/state. Penanda batch diperbarui tanpa menggabungkan workspace.

## 4. Sumber kebenaran keuangan

### Data aktual contoh yang dipertahankan

- Setoran: **Rp112.500.000** = Andi55jt + Risa42,5jt + keluarga15jt.
- Tujuh pembayaran: **Rp57.500.000**.
- Semua tujuh pembayaran ini memakai **alokasi dana acara**, termasuk rekening yang dimiliki pribadi.
- Sisa dana acara: **Rp55.000.000**, bukan saldo bank hasil koneksi.
- Rencana anggaran: Rp150.000.000; sisa rencana Rp92.500.000 **bukan otomatis tagihan/liabilitas terkonfirmasi**.
- Jadwal 13 termin manual juga ditandai sebagai rencana, bukan utang yang sudah diverifikasi. Konfirmasi kontrak, nominal, jatuh tempo dan bukti sebelum klasifikasi liabilitas.

| Rekening alokasi | Setoran | Biaya dari alokasi | Mutasi masuk | Mutasi keluar | Sisa |
|---|---:|---:|---:|---:|---:|
| BCA Andi ••4821 | Rp55.000.000 | Rp36.000.000 | Rp0 | Rp9.000.000 | **Rp10.000.000** |
| Mandiri Risa ••9012 | Rp42.500.000 | Rp12.000.000 | Rp0 | Rp0 | **Rp30.500.000** |
| Jago Bersama ••7734 | Rp15.000.000 | Rp9.500.000 | Rp9.000.000 | Rp0 | **Rp14.500.000** |

Saldo awal contoh **Rp0 per19 September2026**. Mutasi9jt tercatat satu kali. Tidak ada instruksi ke bank.

### Entitas dan aturan implementasi

- **Budget plan:** `eventId`, kategori, nominal rencana, PIC anggaran, versi. PIC tidak otomatis payer atau pemilik dana.
- **Contribution:** contributor, nominal, rekening tujuan, tanggal, recorder, status/versi. Menyimpan target/simulasi tidak membuat contribution.
- **Expense:** event/kategori, `paidBy`, `fundingScope`, `fundingAccountId`, `recordedBy`, `paidAt`, nominal, bukti privat, `sourcePaymentId` bila ada, versi/status.
- `fundingScope=event_fund`: sumber rekening wajib dan biaya mengurangi alokasi rekening tersebut.
- `fundingScope=external_private`: tetap menambah realisasi biaya acara, **tidak** mengurangi dana acara. Kepemilikan bank tidak menentukan scope secara otomatis.
- Recorder adalah aktor audit; jangan menyamakannya dengan payer.
- **Transfer:** event, rekening asal/tujuan, nominal, waktu, alasan, recorder, versi/idempotency. Debit/kredit satu operasi atomik; bukan pendapatan atau biaya.
- **Account/opening:** owner/type personal-couple-shared, event scope, cut-off, opening allocation dan sumber/bukti migrasi. Nonzero opening wajib rekonsiliasi; jangan mengimpor kembali saldo yang sudah diwakili transaksi setelah cut-off.
- **Correction:** entry posted tidak diedit/dihapus. Tautkan reversal dan replacement, alasan/bukti/aktor/versi; periode dan sumber tidak boleh tumpang tindih.
- **Refund:** tautkan pembayaran asal. Pengembalian dana pribadi eksternal tidak boleh menambah dana acara. Payout vendor/fee/escrow bukan transaksi baru pada ledger pembeli.
- Ringkasan akun = saldo awal + kontribusi teralokasi + mutasi masuk − mutasi keluar − expense dari dana acara + refund yang sesuai ± koreksi bertaut.
- Ringkasan event menghilangkan mutasi internal. Pisahkan opening, kontribusi, biaya, refund, dan koreksi pada laporan.
- Sinkronisasi pembayaran/order mendatang harus memakai unique source-payment reference serta mode cocokkan/link, bukan membuat biaya kedua dari bukti yang sama. Release43 tidak mengaktifkan sinkronisasi Vendor.

### Vignette tidak boleh dijumlahkan sebagai transaksi tambahan

1. Mutasi draf1jt: BCA10→9jt, Jago14,5→15,5jt; total tetap55jt.
2. Koreksi draf MT-009 dari9→8jt: reversal9jt lalu replacement8jt; BCA10→11jt, Jago14,5→13,5jt; total tetap55jt.
3. Impor tiga baris valid total1,5jt, hanya setelah sumber dan ack ditentukan: biaya57,5→59jt; dana55→53,5jt jika semuanya memakai dana acara. Salah tanggal dan duplikat15jt tetap dikecualikan.
4. Biaya transport draf500rb dari Mandiri dana acara: biaya58jt dan sisa54,5jt. Bila sumber dipilih pribadi eksternal, biaya58jt tetapi sisa dana acara tetap55jt.
5. Simulasi37,5jt/4 periode =9,375jt/periode; pembagian50/50 =4,6875jt/orang/periode. Hanya rencana.

CSV memakai IDR integer mentah, UTF-8 dan pemisah semicolon; UI memakai rupiah lokal. Pemilihan baris, tanggal, mapping sumber, perbaikan dan perbandingan wajib eksplisit. Satu konfirmasi tidak boleh mengimpor ulang baris yang sama.

## 5. Jadwal kanonis

| Kegiatan | Waktu WIB |
|---|---|
| Persiapan MUA | 04.30–07.30, buffer30menit |
| Keluarga datang | 07.00–07.30 |
| Persiapan KUA | 07.30–08.00 |
| Akad | **08.00–09.00** |
| Foto keluarga | 09.00–09.30 |
| Persiapan/transisi resepsi | 09.30–10.00 |
| Resepsi | **10.00–14.00** |

Jadwal manual bukan bukti slot Vendor live. Waktu appointment kalender lain tidak diganti secara blanket. Contoh Lamaran, Rama/Sinta dan event lain tetap independen.

## 6. Marketplace, kontrak dan pembayaran

### Alur utama

52A→52B→52C→52E→52G→52K→52L→52H→52J→52M. Favorit/draf52D bisa dibuka ulang. Harga/slot berubah menuju52F lalu cek ulang quote; jangan memaksa harga lama. Sengketa52N terpisah dari refund Admin.

Contoh sandbox: Aru MUA8jt + Lensa Teduh Photo15jt + Luma Dekor12jt = **35jt**. DP30%=**10,5jt**; sisa24,5jt. Satu item ditolak: ganti Luma dengan Rona Dekor12jt, cek ulang slot/harga, lalu persetujuan kontrak **v9**. Total yang sama tidak menghapus kebutuhan persetujuan ulang.

Receipt setelah verifikasi DP:2,4jt MUA +4,5jt dokumentasi +3,6jt dekor =10,5jt. Termin selanjutnya14jt pada15 Januari2027 dan10,5jt pada7 Februari2027. Tidak menambah ledger aktif57,5jt. Kalyana tidak ditawarkan pada14 Februari karena komitmen Rama/Sinta; Lensa Teduh adalah alternatif fiktif.

### Kontrak state

- Filter mencari kandidat; bukan reservation.
- Hold memiliki `expiresAt`/versi dari server. Countdown hanya tampilan; refresh/dua tab/offline tidak memperpanjang hold.
- Quote memuat item/vendor/service, scope, tanggal/lokasi/jam, quantity, nominal IDR, fee/discount/customer total, aturan cancel/refund, versi dan masa berlaku.
- Per-item accept/reject dengan alasan dan versi. Penolakan satu item tidak membatalkan otomatis item diterima lainnya.
- Kontrak disetujui menjadi snapshot immutable: siapa/kapan/versi/nominal/ketentuan. Perubahan harus membuat versi baru dan persetujuan baru.
- DP/full/termin berasal dari kontrak. Jangan menyamakan invoice, payment intent, escrow, vendor available balance, payout request, atau transfer completed.
- Provider redirect, unggahan bukti, atau screenshot **bukan** bukti settled.
- Payment intent yang sama memakai idempotency key persisten. **Unknown/timeout: periksa provider, jangan membuat charge baru.**
- Failed/expired hanya bisa dicoba lagi setelah status definitif dan pemeriksaan quote/hold/versi/nominal/total paid terbaru. Duplikat verified webhook adalah no-op.
- Manual transfer/QRIS hanya jika availability dan rekening platform valid. Pada release aktif tetap nonaktif; preview internal tidak meminta transfer.
- Refund hanya jumlah yang masih eligible, metode asal, dengan rekonsiliasi fee/hak vendor dan idempotency. Unknown bukan alasan membuat refund kedua.
- Sengketa harus owner-scoped dan terkait item/kontrak/pembayaran. Alasan, bukti privat, deadline policy server, case dedup, ownership respons dan status harus jelas. Pengajuan bukan janji refund.

## 7. Rute dan gerbang izin — usulan handoff

Pola berikut bukan route yang sudah diimplementasikan. URL pribadi memakai identifier/token opaque, tidak membawa nama, nomor telepon, alamat atau QR payload pribadi.

| Tujuan | Pola usulan | Gerbang |
|---|---|---|
| Discovery / cek tanggal | `/vendors`, `/vendors/availability` | Parent Vendor dan fitur efektif Live; public read sesuai policy |
| Detail vendor | `/vendors/:vendorId` | Vendor/service eligible dan versi tersedia |
| Favorit / bundle draf | `/saved/vendors`, `/bundles/:draftId` | Owner session/capability; simpan guest tanpa memaksa akun |
| Checkout | `/checkout/services` | New-order availability, quote/hold/consent/owner; versi terbaru |
| Pemulihan quote | `/checkout/quote-review` | Owner + quote terbaru; harga lama tidak dipaksakan |
| Pesanan historis | `/orders/:accessToken` | Token opaque valid dan owner proof; event/order scope |
| Kontrak / item | `/orders/:accessToken/contract`, `/items` | Owner + current accepted items/version + action permission |
| Payment / receipt | `/orders/:accessToken/payments/:intentId`, `/receipts` | Owner, authoritative provider/ledger status, dedup |
| Sengketa | `/orders/:accessToken/disputes/new` | Owner, eligible item, deadline, active-case check, policy Live |
| Preview manual | `/internal/payments/manual-preview` | Whitelist/internal permission; bukan production payment |
| Rekening dana acara | `/events/:eventId/funds/accounts` | Workspace member + finance action permission + event scope |
| Vendor portal | `/partner/*` | Vendor role/business membership + effective Vendor availability |
| Admin sensitif | `/admin/finance/*` | Scoped action permission + fresh OTP + reason + version + explicit confirm |

**Allow** = valid session/capability + role/membership yang relevan + action permission + object/event scope + entitlement bila diperlukan + effective availability + fresh version. Entitlement Premium tidak wajib untuk guest checkout jika policy tidak mensyaratkannya. OTP tidak menambah role/permission.

Parent Hidden mengalahkan child Live. Direct URL harus memeriksa server, bukan hanya menyembunyikan dock. Hidden menutup pembelian/portal baru tetapi tidak menghapus akun/order/escrow. Recovery pembeli historis adalah handler terbatas yang terpisah dari katalog/portal Vendor; tetap membutuhkan owner verification. Jalur itu tidak boleh menjadi bypass checkout baru. Jika recovery tidak tersedia, tampilkan bantuan terotorisasi yang tidak membocorkan data.

Support hanya mengakses tiket/data minimum; Finance hanya tindakan keuangan sesuai scope. Check-in staff adalah operator event terdelegasi, bukan admin atau role workspace baru. Tamu tidak memperoleh daftar tamu, private quota orang lain, kontak, bukti keuangan atau alamat kado.

## 8. Mobile, aksesibilitas dan resilience

- Telepon contoh berukuran **375×812**; dock workspace tidak ditambahkan ke checkout publik.
- Target aksi minimal44px; indikator checkbox20px dibungkus target44px, select/date diberi affordance, inspector desktop dinormalisasi480px.
- Expense mobile menunjukkan keyboard terbuka dan save di atas keyboard; dismiss dirty meminta simpan/lanjut edit/buang secara eksplisit. Pending/error tidak boleh menghapus draf.
- Urutan tab mengikuti label/form/action; fokus terlihat. Modal memerangkap fokus dan kembali ke trigger; Escape tidak membuang perubahan diam-diam.
- OTP mendukung paste/autofill, error terasosiasi dan announcement; jangan membuat countdown berbunyi tiap detik. Submit pending tidak bisa dikirim dua kali.
- Loading/saved/error pakai status yang dapat diumumkan, bukan warna saja. Screen reader harus mendapat label checkbox, radio, date/select, pilihan vendor, perubahan harga dan hold expired.
- Editor mobile menggunakan Form/layer controls, bukan drag wajib. Desktop menyediakan angka/properti dan reorder non-drag. Draftv4 tetap terpisah dari publicv3.
- Reduced motion menonaktifkan efek efektif tanpa menghapus preferensi. Media tidak autoplay.
- Plate Obsidian92% ditambahkan di bawah caption/masthead foto auth agar kontras tidak bergantung hanya pada foto. Tetap uji pixel/asset aktual; ini bukan sertifikasi WCAG.
- Offline/revoked/stale states menyimpan draf lokal secara aman, memblokir commit yang tidak valid, dan memberi pemulihan tanpa mengakui aksi berhasil. Tidak menyimpan QR/keuangan sensitif sebagai cache offline umum.

## 9. Digital fulfillment dan fitur opsional

Produk standalone49rb: provider verified → entitlement unik → akses di akun/owner recovery + receipt. Redirect saja tidak cukup. Gagal WA/email tidak menghilangkan ownership; link expired dapat diterbitkan ulang setelah owner check, tanpa repurchase. Re-download tidak membuat entitlement/payment kedua. Recheck consent/status saat dispatch. Wedding Kit terintegrasi tetap Maintenance.

`IdxPj` membedakan fitur yang dirancang, internal/deferred dan belum diproduksikan: domain/DNS/SSL; hadiah/rekening/QRIS/alamat; media/live; hotel/transport; IG filter; Wallet. Memerlukan keputusan produk, availability, izin/consent serta fallback yang sesuai. Tidak menyebut QRIS-kado, domain, filter IG atau Wallet telah aktif. Pass lama tidak lagi menampilkan nomor rekening hadiah; unsupported Wallet menawarkan galeri, bukan memaksa instalasi/notifikasi.

## 10. QA desain akhir

- **180 root**: 167 frame desain/library/state/handoff, 9 penanda area, 4 papan audit.
- Traversal seluruh dokumen: **27.208 node aktif terurai**, termasuk **11.468 node teks**.
- **0 overflow** di atas toleransi0,05px, **0 teks nonkosong runtuh**, **0 tabrakan root**, **0 placeholder tertinggal**, **0 root baseline hilang**.
- **116 root di luar scope revisi tidak berubah**, dibandingkan dengan hash FNV-1a serialisasi schema baseline. Ini pemeriksaan perubahan non-kriptografis, bukan jaminan keamanan.
- **29 root baru**: 27 desain/state/handoff, satu penanda addendum, satu papan hasil remediasi. Ada35root baseline dalam scope revisi yang diizinkan.
- **37/37 pemeriksaan aritmetika fixture lulus**; ini bukan unit test backend atau data bank/provider nyata.
- 13 frame representatif ditinjau melalui screenshot; daftar ada pada JSON QA. Inspector keuangan480px, contoh telepon375×812, target stepper/checkbox44px.
- Duplikasi metrik setoran pada overview juga dihapus: progres setoran menjadi region dominan; metrik rencana biaya, biaya tercatat dan sisa dana tetap berbeda.
- Pemeriksaan ini tidak membuktikan WCAG, route enforcement, transaksi, pengiriman atau publikasi bekerja. Detail status mesin: [REMEDIATION_QA.json](./REMEDIATION_QA.json).

## 11. Checklist implementasi/UAT — seluruhnya BELUM DIJALANKAN

| Tes | Acceptance yang harus dibuktikan pada aplikasi |
|---|---|
| R01 | Direct URL Marketplace Hidden menolak new-order API dan tidak membocorkan katalog privat. |
| R02 | Child Live di bawah parent Hidden tidak dapat mem-bypass gerbang. |
| R03 | Historical owner recovery mempertahankan order tetapi tidak membuka pembelian baru. |
| R04 | Token dicabut/expired atau wrong owner/event tidak dapat membaca/menulis data. |
| R05 | Izin dicabut setelah modal dibuka membuat commit ditolak; draf aman. |
| R06 | OTP valid tanpa financial_settings.write tetap menolak perubahan sensitif. |
| R07 | Favorit/draf survive refresh tanpa mencampur dua owner/event. |
| R08 | Tanggal/radius/geolocation denied memiliki fallback; satu vendor unavailable tidak dianggap available. |
| R09 | Harga/quote berubah, hold expired, dua tab dan clock lokal salah memicu review baru. |
| R10 | Partial rejection mengganti item terkait, tidak membatalkan yang lain; kontrak baru wajib disetujui. |
| R11 | Double submit/refresh/back/network timeout memakai payment intent yang sama. |
| R12 | Unknown payment tidak memicu charge/refund/payout baru. |
| R13 | Signature/nominal/order mismatch dan duplicate/out-of-order webhook ditangani aman/no-op sesuai state. |
| R14 | Manual proof tidak menjadi settled otomatis; flag/rekening invalid memblokir transfer instruction. |
| R15 | Receipt/DP/termin/cumulative paid serta fee/vendor right konsisten pada refund. |
| R16 | Case sengketa duplikat/deadline expired/invalid file ditolak tanpa membocorkan bukti privat. |
| R17 | Event-fund versus external-private menghasilkan saldo berbeda sesuai rumus, recorder terpisah. |
| R18 | Mutasi/reversal/replacement atomik/idempoten; same-account/overdraw/duplicate/cut-off overlap ditolak. |
| R19 | CSV hanya memasukkan baris dipilih+valid+mapped; retry impor tidak menggandakan transaksi. |
| R20 | Simulator100%, read-only ledger dan save plan tidak membuat setoran/autodebit. |
| R21 | Entitlement digital hanya sekali; delivery failure/expired link tidak meminta repurchase. |
| R22 | WA antre memeriksa consent terbaru, cooldown dan campaign-recipient dedup saat dispatch. |
| R23 | QR offline/duplicate/staff revoked tidak menambah admission; arriving count atomic per sesi. |
| R24 | Draft/public/restore/unpublish/ticket revoke terpisah; publikasikan hanya versi disetujui. |
| A01 | 375px, safe area dan keyboard tidak menutup focused field/save/error. |
| A02 | Keyboard-only, focus order/visible, modal trap/return dan dirty dismissal benar. |
| A03 | Screen reader mengumumkan label/status/error/payment uncertainty tanpa spam countdown. |
| A04 | 44px target, zoom/reflow dan drag alternative dapat dipakai tanpa kehilangan fungsi. |
| A05 | Kontras foto/text diuji pada aset aktual dan state disabled/error/focus. |
| A06 | Reduced-motion/no-autoplay dan offline/retry menjaga draf serta data sensitif. |

**Gate rilis:** review produk atas jadwal/policy/opsional → implementasi server/client → regresi di sandbox → verifikasi akses/uang/privasi/aksesibilitas → release review + scoped OTP + konfirmasi eksplisit. Desain selesai tidak sama dengan persetujuan aktivasi produksi.
