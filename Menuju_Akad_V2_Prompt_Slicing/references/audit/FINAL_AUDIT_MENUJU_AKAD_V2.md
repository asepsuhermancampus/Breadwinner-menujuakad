# Audit Final — Menuju Akad V2

**Tanggal audit:** 16 Oktober 2026  
**Lingkup:** Batch 01–07 + Batch Ekspansi, desain Modern Quiet Luxury & Frictionless UX.  
**Status dokumen:** Snapshot audit awal, sebelum remediasi yang kemudian diizinkan pengguna. Pada saat audit ini, seluruh rekomendasi masih terbuka dan tidak ada perubahan pada desain sumber. Setelahnya, temuan ditindaklanjuti melalui revisi desain dan handoff; tidak ada aktivasi fitur, publikasi, pengiriman pesan, transaksi, atau perubahan backend nyata.

> **Status terbaru:** baca [Hasil remediasi dan handoff](./REMEDIATION_HANDOFF_MENUJU_AKAD_V2.md), [QA revisi](./REMEDIATION_QA.json), dan papan canvas **Audit Final | 04** (`TzrQC`). Angka, temuan, serta pernyataan “belum tersedia” di bawah adalah kondisi baseline, bukan status desain terbaru. Pengujian runtime/UAT tetap belum dilakukan.

## 1. Kesimpulan

Fondasi visual, perencanaan, CRM/undangan, editor, dan operasi Vendor/BA/Admin sudah kuat. Namun, **belum tepat menyatakan seluruh fungsi master specification telah selesai**.

Ada **3 kelompok P0, 8 P1, dan 3 P2**:

1. **P0 keuangan planner:** pembayar dan sumber dana masih digabung; sisa rencana biaya masih dilabeli seolah-olah seluruhnya tagihan belum dibayar.
2. **P0 sebelum Marketplace diaktifkan:** discovery 11 kategori, cek tanggal serentak, dan bundler pasangan belum ditemukan sebagai alur layar yang utuh.
3. **P0 sebelum pemesanan jasa diaktifkan:** checkout jasa, hold slot, pembayaran pembeli, dan penggantian item ditolak belum end-to-end. Checkout produk digital bukan penggantinya.

**Temuan lintas batch yang penting:** jadwal Andi–Risa berbeda. Rundown/undangan lama memakai Akad 08.30 dan Resepsi 11.00; undangan/WhatsApp terbaru memakai Akad 08.00 dan Resepsi 10.00. Audit tidak memilih waktu yang benar tanpa persetujuan pemilik.

Dua P0 Marketplace tidak otomatis memblokir rilis Planner-only jika Vendor/BA dan jalur terkait tetap Hidden. Semantik keuangan tetap perlu diselesaikan sebelum handoff modul keuangan.

## 2. Sumber dan metode

### Sumber lokal

- **S1 — Roadmap tujuh tahap dan klausul modul:** `C:/Users/ASUS/Downloads/menuju_akad_ui_ux_design_specification_master_prompt (1).md`
- **S2 — Rincian fungsional:** `C:/Users/ASUS/Downloads/menuju_akad_ui_ux_design_specification_master_prompt.md`
- **S3 — Visual V2, prioritas atas estetika lama:** `C:/Users/ASUS/Downloads/menuju_akad_modern_quiet_luxury_master_specification.md`
- **S4 — Lima pengalaman, feature flags, release/cascade:** `C:/Users/ASUS/Downloads/gemini-code-1792075129384.md`
- **Canvas:** `C:/Users/ASUS/.pencil/documents/c5a247e7-ec44-4202-b361-d7caca1734c1/Menuju_Akad_v2.pen`

Aturan heritage seperti wax seal, paper grain, botanical ornament dan font/palet lama **tidak dianggap requirement visual yang harus dikembalikan**. Daftar fungsi pada spesifikasi lama tetap menjadi sumber audit.

### Pemeriksaan

- Inventaris seluruh **148 root sumber**: 140 frame desain/library dan 8 penanda area.
- Traversal **23.401 node aktif**, termasuk instance terurai; **9.770 node teks**.
- Penelaahan copy, struktur, dan **113 node dengan context deskriptif**.
- Pemetaan 22 kelompok klausul fungsional S1 + 2 kelompok tambahan V2/feature flags.
- Screenshot **13 frame representatif**: `MNC2H`, `Dx42c`, `bLaVb`, `HYcrO`, `YGhuy`, `kXCB3`, `o3Lcg`, `LQOhS`, `A5HAQ`, `bpoHM`, `XjU3V`, `q44djF`, `TzWN3`.
- Pemeriksaan geometris seluruh root, teks runtuh, placeholder, tabrakan antar-root, dan perbandingan hash serialisasi 148 root sebelum/sesudah audit.
- 22 pemeriksaan aritmetika contoh.

### Batas audit

Ini **audit desain dan dokumentasi**, bukan UAT aplikasi, pentest, sertifikasi WCAG, pemeriksaan legal, atau pengujian transaksi/provider nyata. Context dan tombol yang tampak aktif bukan prototype executable. Tidak ada aplikasi dalam browser yang diuji.

Pemeriksaan kontras berbasis ancestor menemukan 20 kandidat pada panel foto autentikasi. Foto dan overlay-nya merupakan sibling berposisi absolut, sehingga rasio terhadap latar ancestor bukan rasio visual yang valid. Kandidat tersebut **tidak dilaporkan sebagai 20 pelanggaran terkonfirmasi**. Kontras foto tetap perlu diuji terhadap aset aktual pada implementasi.

## 3. Hasil struktural dan perlindungan sumber

| Pemeriksaan | Hasil |
|---|---:|
| Root sumber | 148 |
| Overflow struktural melebihi toleransi 0,05 px | 0 |
| Teks aktif runtuh | 0 |
| Root sumber bertabrakan | 0 |
| Placeholder sumber tertinggal | 0 |
| Root sumber berubah/hilang selama audit | 0 / 0 |
| Pemeriksaan aritmetika contoh | 22 lulus |

Tiga papan laporan terpisah ditambahkan, sehingga canvas kini memiliki **151 root**:

- `GuXYq` — **Audit Final | 01 · Ringkasan keputusan & matriks lintas batch**
- `g29PF` — **Audit Final | 02 · Traceability master spec & bukti temuan**
- `qdmlm` — **Audit Final | 03 · Backlog P0–P2 & acceptance criteria**

QA akhir seluruh 151 root: tidak ada tabrakan, overflow laporan, teks runtuh, atau placeholder tersisa. Ketiga laporan berada di kanan area Batch 07. Ini bukan Batch 08.

## 4. Inventaris per batch

Jumlah frame berikut termasuk library, tidak termasuk penanda area.

| Area | Frame | Hasil audit ringkas |
|---|---:|---|
| Batch 01 — Fondasi, Akun & Onboarding | 18 | Inti autentikasi/pairing/pengaturan tercakup; bukti mobile dan fokus masih diperlukan. |
| Batch 02 — Perencanaan Pernikahan | 16 | Inti planner tersedia; generator dari catatan manual, jadwal perlu diselaraskan. |
| Batch Ekspansi — Multi-role & Superadmin | 14 | Peran, release dan availability tercakup; label flag bukan bukti fitur selesai. |
| Batch 03 — Keuangan & Anggaran | 16 | Sebagian; semantik dana, multi-rekening, simulator dan keterbacaan perlu tindak lanjut. |
| Batch 04 — Tamu & Undangan | 20 | Inti CRM/WA/RSVP/check-in tercakup; bukan pengganti Marketplace pada master Tahap 4. |
| Batch 05 — Pengalaman Tamu & Multi-Undangan | 15 | Inti pengalaman tamu kuat; domain/hadiah sengaja nonaktif, fitur opsional perlu inventaris. |
| Batch 06 — Studio Editor Visual | 12 | Inti Visual/Form, versi dan publikasi tercakup; belum diuji sebagai interaksi executable. |
| Batch 07 — Vendor, BA & Operasi Platform | 29 | Operasi partner/admin kuat; tidak menutup alur pembelian pasangan yang belum ada. |
| **Total desain/library** | **140** | |

### Drift roadmap

**S1 Bagian 6, Tahap 4** secara eksplisit meminta Marketplace, cek tanggal serentak, bundler, guest checkout jasa dan pembayaran escrow. **Canvas Batch 04 saat ini berisi CRM Tamu.**

Ini temuan pemetaan scope, bukan alasan membongkar CRM atau mengganti nama frame yang sudah disetujui. Buat crosswalk requirement dan letakkan penyelesaian alur Marketplace dalam roadmap tujuh batch yang disepakati, tanpa otomatis menambah Batch 08.

## 5. Matriks cakupan master spec

**Tercakup** berarti requirement inti terlihat pada desain/state, bukan implementasi atau seluruh edge case telah lulus. **Sebagian** berarti ada bagian penting tetapi masih ada gap/defer. **Belum tercakup** berarti layar/alur yang diminta tidak ditemukan; penyebutan di menu/flag tidak cukup.

Hasil tingkat kelompok: **13 tercakup, 10 sebagian, 1 belum tercakup**. Angka ini bukan persentase kelengkapan produk.

| Klausul | Requirement | Status desain | Bukti dan gap |
|---|---|---|---|
| 1.1 | Autentikasi dan keamanan | Tercakup | `MNC2H`, `VgqXJ`, `wZeSu`, `rnno1`; email/Google/telepon, OTP dan recovery. |
| 1.2 | Profil, onboarding dan pairing | Tercakup | `nohWZ`, `ppEju`, `w6pWd`, `VUBCF`; keluarga, acara dan dua akun. |
| 1.3 | Paket, role dan privasi | Tercakup | `m34FY`, `CwZFE`, `o6oxd`, `VGsCi`; Premium dimiliki, Lifetime penawaran upgrade. |
| 2.1 | Dashboard dan dua acara | Tercakup | `Dx42c`, `Un4o0`; Lamaran/Pernikahan terpisah. |
| 2.2 | Tugas, KUA dan darurat | Tercakup | `N2dqI`, `FUxIj`, `OKEKY`; PIC, berkas/revisi, checklist dan pemulihan. |
| 2.3 | Rundown, kalender, katering | Sebagian | `aXVUJ`, `WBpK5`, `V4Cg4P`, `AXNnj`; generator manual, sinkron vendor belum tercakup, jadwal berbeda. |
| 2.4 | Seserahan, moodboard, Kit | Sebagian | `X0IiC`, `ioFcn`, `eLw4l`; Kit Maintenance, pemenuhan pascabayar belum lengkap. |
| 3.1 | Target dan multi-rekening | Sebagian | `OpGQi`, `HYcrO`; target/kontribusi ada, tiga rekening/saldo awal/mutasi belum terbukti. |
| 3.2 | Anggaran vs aktual | Sebagian | `kXCB3`, `f3gyC`; matematika konsisten, label sisa rencana belum tepat. |
| 3.3 | Pengeluaran dan sinkron | Sebagian | `YGhuy`, `yX59Y`; sumber/pembayar digabung, sinkron vendor tetap Hidden pada release #43. |
| 4.1 | 11 layanan dan cek tanggal serentak | Belum tercakup | Tidak ditemukan discovery pasangan dan filter same-date/lokasi/harga/jarak. `CJw2i` adalah katalog usaha sendiri. |
| 4.2 | Favorit dan vendor pribadi | Sebagian | `wnYOo` menyediakan catatan manual; bookmark marketplace belum ditemukan. |
| 4.3 | Bundler, checkout dan kontrak | Sebagian | `jVxHU` mencakup kontrak vendor; bundler/cart/checkout jasa multi-vendor belum ditemukan. |
| 4.4 | Portal vendor dan KYB | Tercakup | `CJw2i`, `mDQYw`, `jVxHU`, `PeBEY`; operasi inti, revisi dokumen/bank dan kalender. |
| 5.1 | DP/penuh dan multi-gateway | Sebagian | `jVxHU`, `bpoHM`, `u0TtL`; sisi vendor/admin ada, pembayaran pembeli jasa belum utuh. |
| 5.2 | Escrow, payout, sengketa, Kit | Sebagian | `ZYbW5`, `I1LPbH`, `UJ7nm`, `MbVXe`; intake sengketa pemilik dan fulfillment Kit belum lengkap. |
| 6.1 | CRM, impor dan WhatsApp | Tercakup | `o3Lcg`, `IteDr`, `lHjOQ`, `c7xjuR`; kuota/orang/undangan, consent dan retry dibedakan. |
| 6.2 | Tema, multi-undangan, analitik | Tercakup | `seJ6W`, `orG6X`, `iybkq`, `oh4K3`, `w10ww`; domain adalah preview Hidden/internal. |
| 6.3 | Komponen undangan publik | Sebagian | `qSqgx`, `gb4IQ`, `saA1w`, `JLu7e`, `E8d5oa`; inti tersedia, jadwal dan scope opsional perlu ditutup. |
| 7.1 | Studio dan publikasi | Tercakup | `A5HAQ`, `lIjG4`, `J42RnE`, `WcY8K`, `hj9yS`; draft/aktif, recovery, reduced motion, responsive. |
| 7.2 | BA dan komisi | Tercakup | `xbJUF`, `aSy8W`, `huATE`, `rGfR1`; atribusi program dan penarikan terpisah. |
| 7.3 | Admin dan dukungan | Tercakup | `f5KPKj`, `XjU3V`, `J5qwCa`, `PS9AV`, `NUj9z`; operasi inti tersedia. |
| X | Multi-role dan availability | Tercakup | `bLaVb`, `T1iXe`, `xUTSV`, `arf9l`; parent/child, rilis dan sandbox dibedakan. |
| V2 | Bahasa visual | Tercakup | `bi8Au`, `FQfll`, `DNjlJ`, `fBaKE`; konsisten pada sampel, bukan sertifikasi aksesibilitas. |

**Penting:** 11 kategori anggaran di Batch 03 bukan bukti bahwa 11 kategori Marketplace sudah dirancang. Kategori Marketplace tetap: Prewedding, Busana/Fitting, MUA, Seserahan/Mahar, Dokumentasi, Dekorasi/Florist, Katering, Kue/Dessert, Souvenir, Undangan Digital/Cetak/Hybrid, Denah Ilustrasi.

## 6. Backlog prioritas dan acceptance criteria

### P0 — Gate handoff atau aktivasi fitur terkait

#### P0-01 — Marketplace dan bundler pasangan belum tercakup
- **Berlaku:** sebelum Preset 2/3 dibuka; bukan blocker Planner-only jika tetap Hidden.
- **Bukti:** S1 Tahap 4 dan §4.1–4.3; `bLaVb/AoFnW` hanya nama flag. `CJw2i` adalah katalog milik vendor, bukan discovery pembeli.
- **Tindakan:** petakan scope; rancang 11 kategori, lokasi/tanggal/harga, cek tanggal banyak vendor, jarak, favorit, bundler/cart/draft, kuantitas dan kalkulasi total.
- **Selesai bila:** discovery → beberapa vendor → simpan/pulihkan bundle → tinjau harga terdefinisi; kondisi kosong, perubahan harga dan vendor tidak tersedia memiliki pemulihan.

#### P0-02 — Checkout jasa dan pembayaran pembeli belum end-to-end
- **Berlaku:** sebelum pemesanan jasa live.
- **Bukti:** `u0TtL` menjual spreadsheet Rp49.000; `jVxHU` adalah persetujuan sisi vendor; `bpoHM` adalah rekonsiliasi admin.
- **Tindakan:** lengkapi checkout jasa tanpa akun, data acara/pin/kontak, TTL hold slot, DP/pelunasan/penuh, provider/manual sesuai availability, bukti, invoice/receipt dan pengganti item ditolak.
- **Selesai bila:** hold kedaluwarsa, penolakan sebagian dan status provider unknown ditangani. Unknown tidak berarti boleh membuat pembayaran baru; retry harus idempoten.

#### P0-03 — Semantik dana, rencana dan pembayar
- **Berlaku:** handoff keuangan Planner MVP.
- **Bukti:** `kXCB3/bVgBX` menampilkan **“Belum dibayar” Rp92.500.000** tetapi rumusnya rencana minus pembayaran. `yX59Y/t9reQw` memakai **“Pembayar / sumber”**. `w7nKVL/qsxpB` menghitung Rp55 juta dari seluruh pembayaran.
- **Tindakan:** gunakan **“Sisa rencana biaya”** kecuali sudah ada kontrak/tagihan terkonfirmasi; pisahkan **dibayar oleh**, **sumber dana**, dan **dicatat oleh**. Definisikan total biaya acara terpisah dari kas bersama.
- **Selesai bila:** pembayaran pribadi dari luar dana bersama tidak otomatis mengurangi kas bersama; mutasi tidak menggandakan kontribusi; contoh sisa Rp55 juta hanya dipertahankan jika sumber transaksi mendukungnya.

### P1 — Tutup sebelum UAT jalur terkait

#### P1-01 — Satu jadwal kanonis Andi–Risa
- **Bukti:** `aXVUJ/Ge02f,d5RNe4` dan `cN7lO/VShhV,IDiZd`: **08.30/11.00**. `lHjOQ/aURbi`, `qSqgx/KnAOj,o0srTU`, `gb4IQ/wF0iZ`: **08.00/10.00**.
- **Tindakan:** minta persetujuan jam, lalu selaraskan rundown, WA, undangan, sesi RSVP dan kalender. Labeli versi historis bila memang sengaja berbeda.
- **Selesai bila:** satu event/version memakai satu jadwal, dengan revisi eksplisit. Audit tidak menetapkan waktu sendiri.

#### P1-02 — Multi-rekening harus ditutup atau defer disetujui
- **Bukti:** `OpGQi` menunjukkan kontributor/setoran, bukan tiga rekening dan riwayat mutasi; Feature Studio masih menyebut Multi-Rekening.
- **Tindakan:** rancang ledger manual rekening pribadi/pasangan/bersama, saldo awal, koreksi dan mutasi; atau sahkan defer dan sesuaikan nama/kontrak fitur.
- **Selesai bila:** transfer antar-rekening tidak meningkatkan pendapatan/total tabungan; saldo hitung bukan saldo bank, tiap acara tetap terpisah. Ini pencatatan, bukan transfer bank nyata.

#### P1-03 — Simulator tidak boleh mengedit kontribusi aktual
- **Bukti:** `HYcrO/rYLE4` memakai surface input `EM51W` untuk setoran tercatat Rp112,5 juta, tanpa affordance read-only yang jelas.
- **Tindakan:** jadikan nilai aktual read-only bersumber dari ledger; tambahkan **Atur target & kontribusi** dari Tabungan. Bedakan tanggal/select/teks dan gunakan persentase komplementer.
- **Selesai bila:** total persentase 100%; simpan simulasi tidak mengubah ledger, membuat setoran atau autodebit.

#### P1-04 — Bukti mobile dan aksesibilitas
- **Bukti:** 16 root mobile berlebar 420 px. `hj9yS` menyediakan undangan aktual 375/768/1280, tetapi jalur auth/planner/editor-compact belum dibuktikan end-to-end pada lebar sempit.
- **Tindakan:** uji 375 px, safe area, keyboard nominal, sticky save, dirty-dismiss, fokus, tab order, focus trap/return, pembaca layar, alternatif drag dan reduced motion.
- **Selesai bila:** aksi utama tidak tertutup keyboard; target aksi minimal 44 px; semua tindakan dapat dicapai tanpa drag; kontras teks foto diverifikasi per aset. Belum ada klaim gagal/lulus runtime.

#### P1-05 — Pengajuan sengketa oleh pemilik
- **Bukti:** `UJ7nm`/`MbVXe` menjelaskan mediasi dan refund admin; intake pasangan/vendor yang utuh belum ditemukan.
- **Tindakan:** tentukan item/kontrak, alasan, bukti privat, batas waktu, status dan tanggapan; batasi ke pemilik dan cegah klaim ganda.
- **Selesai bila:** pengajuan tidak otomatis refund; bukti/versi kontrak terlacak, keputusan admin dan persetujuan pemohon terpisah.

#### P1-06 — Pemenuhan produk digital pascabayar
- **Bukti:** `u0TtL` hanya menjanjikan tautan setelah konfirmasi; `eLw4l` tetap internal/Maintenance.
- **Tindakan:** lengkapi konfirmasi pembayaran/unknown, akses tersedia, pengiriman gagal, kanal pemulihan, link kedaluwarsa, unduh ulang dan receipt.
- **Selesai bila:** redirect sukses saja tidak memberikan akses; provider terverifikasi; recovery tidak meminta bayar dua kali atau membuka produk orang lain. Maintenance tidak diubah oleh audit.

#### P1-07 — Impor dan tabel keuangan lebih mudah diverifikasi
- **Bukti:** `FoaEJ` menggunakan glyph ✓/— untuk pilihan; belum ada kontrol Perbaiki/Bandingkan yang tegas. Ada **117 node teks** berisi `Rp` tanpa pengelompokan ribuan; angka ini termasuk duplikasi instance/vignette, bukan 117 bug unik.
- **Tindakan:** gunakan checkbox konsisten, perbaikan invalid dan perbandingan duplikat; format Rupiah lokal untuk tampilan, teks tabel penting 13–14 px. CSV tetap angka mentah.
- **Selesai bila:** pilihan dan total preview selalu cocok, duplikat tidak masuk diam-diam, format tampilan tidak mengubah nilai.

#### P1-08 — Kontrak navigasi, state dan izin untuk handoff
- **Bukti:** 113 context adalah anotasi, bukan navigasi/interaksi executable.
- **Tindakan:** susun route map, transisi state, matriks role × action × event × entitlement × effective availability, versi, revocation dan idempotency.
- **Selesai bila:** hasil direct URL Hidden/izin hilang, consent dicabut saat antre, QR duplikat/offline, perubahan harga/versi dan OTP tanpa izin terdefinisi; setelah implementasi baru diuji UAT.

### P2 — Polish dan keputusan scope berikutnya

#### P2-01 — Inventaris fitur opsional dan rilis
Catat setiap fitur sebagai dirancang, deferred-disetujui, atau di luar MVP. Hadiah `E8d5oa` memang nonaktif dan domain `w10ww` memang Hidden. Hotel, filter IG, QRIS/kado dan Wallet belum memiliki alur lengkap yang terverifikasi. Klarifikasi contoh hadiah historis `wVmls` agar tidak dibaca sebagai konfigurasi undangan aktif. Jangan memublikasikan alamat pribadi/rekening contoh. Kebutuhan master tidak dihapus tanpa persetujuan.

#### P2-02 — Inspector dan affordance konsisten
Pertimbangkan normalisasi inspector ke sekitar 480 px jika sesuai konteks; saat ini ada 448/480/500 px. Bedakan ikon tanggal/select/teks dan PIC anggaran dari pembayar aktual. Ini polish, bukan alasan mengubah isi tanpa persetujuan.

#### P2-03 — Kurangi pengulangan tanpa menghilangkan safeguards
Demotikan duplikasi target/total rencana pada `kXCB3`; utamakan terkumpul, terpakai dan sisa dengan definisi yang sah. Penjelasan panjang dapat menjadi bantuan kontekstual, tetapi consent, konfirmasi dan peringatan dana harus tetap terlihat pada aksi sensitif. Pertahankan maksimal empat metrik per baris.

## 7. Yang sudah baik dan perlu dipertahankan

- Bahasa visual V2: Alabaster/White, Obsidian/Cypress, Plus Jakarta Sans, Instrument Serif selektif dan Geist Mono.
- Identitas Andi Ramadhan dan Risa Pratiwi beserta keluarga; Premium tidak salah ditampilkan sebagai Lifetime milik.
- Lamaran dan Pernikahan memiliki keuangan/data sendiri; varian VIP adalah subset, bukan tambahan tamu.
- Role, izin tindakan, entitlement dan effective availability dipisahkan. Petugas check-in adalah akses terdelegasi, bukan role workspace keenam. Support/Finance adalah scope Superadmin terbatas.
- Release #43, Vendor/BA Hidden, catering Coming Soon dan Wedding Kit Maintenance tetap tidak berubah. Preset 3 merupakan sandbox.
- Impor kontak tidak dianggap sebagai persetujuan WhatsApp; revalidasi consent, dedup dan retry sudah dideskripsikan.
- QR terbaca tidak sama dengan masuk; validasi online, kuota, idempotency dan pemisahan offline telah dirancang.
- Draft tidak sama dengan versi publik; restore versi membuat draft baru, tidak otomatis menimpa publikasi/RSVP.
- Escrow tertahan, saldo tersedia, permohonan diterima, payout terjadwal dan transfer selesai dibedakan.
- Provider timeout/unknown bukan alasan pembayaran/refund/payout baru. OTP tidak menggantikan izin atau konfirmasi eksplisit.
- Refund Rp5 juta direkonsiliasi menjadi reversal fee Rp250 ribu + pengurangan hak vendor Rp4,75 juta.

## 8. Angka yang dicek

Semua berikut lulus secara aritmetika contoh; tidak memverifikasi saldo bank atau kejadian nyata:

1. Kontribusi 55 + 42,5 + 15 = Rp112,5 juta.
2. Tujuh pembayaran berjumlah Rp57,5 juta.
3. 112,5 − 57,5 = Rp55 juta; makna kas bersama tetap bersyarat pada sumber dana.
4. 150 − 57,5 = Rp92,5 juta **sisa rencana**, bukan otomatis utang.
5. Kekurangan Rp37,5 juta / 4 periode = Rp9,375 juta.
6. Pembagian 50/50 = Rp4,6875 juta per orang/periode.
7. Katering 500 undangan × 2 orang × 110% = 1.100 orang rencana.
8. 660 buffet + 1.760 porsi stall = 2.420 porsi, bukan 2.420 orang.
9. 170 hadir + 30 berhalangan + 150 belum menjawab = 350 undangan.
10. 168 jawaban online + 32 manual = 200; 168/210 = 80% konversi online.
11. Sesi kunjungan 24+28+36+44+48+72+88 = 340.
12. Vendor: bruto20 − fee1 − payout lama0,5 = Rp18,5 juta tersedia.
13. Permohonan Rp5 juta → Rp13,5 juta tersedia setelah hold.
14. BA: 6 + 0,25 + 0,15 = Rp6,4 juta tersedia.
15. Penarikan BA Rp1 juta → Rp5,4 juta.
16. Referral vendor: Rp20 juta × 5% fee × 15% komisi = Rp150 ribu.
17. Rekonsiliasi 12,5 − 10,5 = Rp2 juta selisih status.
18. Refund 0,25 + 4,75 = Rp5 juta.
19. Hak vendor pascarefund: 15 × 95% − 4,75 = Rp9,5 juta.
20. Empat payout 5 + 4,75 + 2 + 1,25 = Rp13 juta.
21. Kohort publikasi 320/1.000 = 32%, bukan rasio terhadap undangan kumulatif.
22. Tiga baris impor valid 0,5 + 0,75 + 0,25 = Rp1,5 juta; pembayaran menjadi Rp59 juta.

Vignette sebelum dan sesudah permohonan/konfirmasi merupakan contoh terpisah dan tidak boleh dijumlahkan sebagai transaksi tambahan.

## 9. Urutan rekomendasi

1. **P0-03:** benahi semantik dan sumber dana Batch 03.
2. **P1-01:** sahkan jadwal kanonis dan tandai versi historis.
3. **Keputusan scope:** Planner-only atau Marketplace pada rilis berikutnya; multi-rekening masuk MVP atau defer yang disetujui.
4. Jika Marketplace dipilih, tutup **P0-01 dan P0-02** sebelum membuka Preset 2/3.
5. Lengkapi P1 untuk jalur yang akan dirilis; buat prototype dan acceptance matrix.
6. Handoff komponen, route, model data, API, state machine, izin dan availability; setelah implementasi lakukan UAT nyata.

**Audit tidak menerapkan perbaikan. Semua 148 root sumber tetap utuh.**
