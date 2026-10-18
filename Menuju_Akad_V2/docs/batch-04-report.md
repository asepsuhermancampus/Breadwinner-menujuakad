# Laporan Batch 04 — CRM, Undangan, Check-in, dan Marketplace/Checkout Jasa

Tanggal: 18 Oktober 2026. Track increment: **UI_SLICING**, status: **UI_MOCK**.
Batch 04 dinyatakan selesai setelah seluruh modul CRM tamu, komunikasi WhatsApp berizin, studio undangan, tiket & konsol check-in hari-H, marketplace 11 kategori, racik paket bundler, checkout jasa tanpa akun, serta resolusi kontrak dan sengketa berhasil dislice, diintegrasikan ke rute kanonikal produksi, dan seluruh gate verifikasi hijau.

---

## Hasil Verifikasi

| Gate                    | Perintah                                                   | Hasil                                           |
| ----------------------- | ---------------------------------------------------------- | ----------------------------------------------- |
| Format                  | `npm run format:check`                                     | lulus, 100% Prettier code style                 |
| Lint + batas arsitektur | `npm run lint`                                             | lulus, 272 modul, ≤200 baris/berkas, nol siklus |
| Typecheck strict        | `npm run typecheck`                                        | lulus, 0 error                                  |
| Prisma validate         | `npm run db:validate`                                      | lulus, skema valid 🚀                           |
| Unit/integration        | `npm test`                                                 | 79 tes / 18 berkas lulus                        |
| Build produksi          | `npm run build`                                            | lulus, 31 rute kanonikal                        |
| Browser E2E             | `CI=1 npx playwright test tests/e2e/batch04-crm-*.spec.ts` | 6 tes komprehensif lulus (21.0s)                |

---

## Modul dan Komponen yang Dibangun

### 1. Checkpoint 4A — CRM Tamu & Komunikasi WhatsApp

- **Daftar Tamu & Metrik (`o3Lcg`)**:
  - Berada di rute kanonikal `/planner/guests`.
  - Agregasi aritmetika terverifikasi: 350 undangan, kuota maksimum 600 orang, 170 undangan hadir (340 orang), 30 berhalangan, 150 belum menjawab, 240 izin WhatsApp, 330 nomor valid.
  - Pencarian nama, nomor kontak, filter grup (Keluarga Andi, Keluarga Risa, Teman, Kolega, Rekanan, VIP), dan filter status RSVP.
- **Tambah Undangan (`y3Mltv`)**:
  - Modal tambah tamu dengan input nama wajib, kuota positif, nomor WhatsApp terverifikasi E.164, dan persetujuan komunikasi eksplisit terpisah (menyimpan kontak tidak otomatis mengizinkan pesan WhatsApp).
- **Detail Undangan & Tiket Personal (`JVhyJ`)**:
  - Quick inspector drawer (480px) menampilkan kuota yang dapat disesuaikan, status kehadiran, alokasi meja (Meja 04 · VIP), jejak audit izin WhatsApp, dan tautan personal dengan token opak aman.
- **Impor Tamu CSV (`IteDr`)**:
  - Alur 3 langkah (Unggah → Pemetaan → Tinjauan Data).
  - Normalisasi nomor E.164 otomatis, penyaringan 3 tamu siap impor (Alya 2 pax, Dimas 1 pax, Novi 3 pax), pengecualian 1 nomor tidak valid (Eko) dan 1 duplikat (Budi).
- **Penempatan Meja / Seating (`W1HD4`)**:
  - Ringkasan kapasitas: 340 RSVP hadir, 320 sudah duduk / 20 belum ditempatkan (40 meja × 10 kursi = 400 kursi).
  - Penegakan aturan: Rombongan Rafi (3 orang) ditolak di Meja 04 (sisa 2 kursi) untuk mencegah pemisahan rombongan otomatis; alternatif Meja 05 (sisa 5 kursi) disarankan.
- **WhatsApp Composer & Review (`lHjOQ`, `JGjTa`, `c7xjuR`)**:
  - Template pesan resmi dengan token personal aman dan teks `STOP` unregister.
  - Modal review pengecualian: 14 dipilih → 10 memenuhi syarat + 4 dikecualikan (2 sudah terkirim, 1 tanpa izin, 1 nomor tidak valid).
  - Kuota berkurang 100 → 90 hanya setelah accepted dispatch.
  - Riwayat pengiriman dengan tombol retry **hanya aktif untuk pesan gagal definitif** (pesan terkirim/diproses tidak dapat dikirim ulang massal).

### 2. Checkpoint 4B — Studio Undangan, Undangan Publik & Check-in

- **Studio Undangan & Draf (`dJfnu`, `seJ6W`, `OZ2XF`)**:
  - Berada di rute `/planner/invitations`.
  - Galeri tema: Editorial Light (aktif), Cypress Modern, dan Monochrome Type.
  - Pengaturan draf v4: deadline RSVP 7 Februari 2027 23.59 WIB, indeks mesin pencari noindex, rekening hadiah nonaktif (baseline release #43), dan musik autoplay nonaktif.
  - Modal publikasi draf v4 ke versi aktif v3 tanpa menghilangkan atau merusak data RSVP tamu yang sudah masuk.
- **Undangan Personal Tamu Mobile (`qSqgx`, `uj3cI`, `l2XjAp`, `SqslJ`)**:
  - Berada di rute kanonikal `/i/[token]` (misal `/i/token-budi-a7c6`) tanpa dock workspace.
  - Layout mobile responsif 375px: sapaan personal Budi Santoso & Partner, batas waktu konfirmasi, dan detail acara Bumi Samami Bandung 14 Feb 2027.
  - Dialog RSVP: pilihan Hadir/Berhalangan, kuota stepper maksimal 2 orang (saat berhalangan jumlah hadir otomatis 0), dan pesan doa.
  - Tiket personal dengan QR Code dinamis (`qrcode`) dan nomor meja penempatan.
  - Penanganan tautan tidak valid/kedaluwarsa (`SqslJ`) dengan perlindungan privasi penuh.
- **Konsol Check-in Hari-H (`RJRrI`, `a50cJX`, `o5w7r3`, `kUeNq`)**:
  - Berada di rute operasional `/checkin` dengan identitas petugas Dina (Gerbang A).
  - Ringkasan kedatangan: 340 RSVP = 214 tervalidasi + 126 sisa.
  - Modal scanner tiket: membaca tiket Budi Santoso (Meja 04 VIP, 2 orang), konfirmasi kedatangan atomik memperbarui tervalidasi 214 → 216 orang.
  - State penanganan edge case: offline mode (3 pindaian tertahan), tiket duplikat (sudah masuk 2/2 ditolak), dan kuota terlampaui.
  - Kelola petugas: Dina (Gerbang A), Raka (Gerbang B), Naya (Koordinator) dengan hak akses terbatas dan opsi pencabutan sesi (revoke).

### 3. Checkpoint 4C — Marketplace 11 Kategori & Racik Paket

- **Katalog Marketplace 11 Kategori (`mkFcs`, `c6ReWy`)**:
  - Berada di rute kanonikal `/marketplace`.
  - Filter tanggal 14 Feb 2027, lokasi Bandung (Bumi Samami), dan rentang harga.
  - 11 Kategori lengkap: Prewedding, Busana/Fitting, MUA, Seserahan/Mahar, Dokumentasi, Dekorasi/Florist, Katering (Coming Soon), Kue/Dessert, Souvenir, Undangan Digital/Cetak/Hybrid, Denah Ilustrasi.
- **Pemeriksaan Tanggal Serentak / Same-Date Check (`VKRRC`)**:
  - Memeriksa ketersediaan multi-vendor pada 14 Feb 2027: Aru MUA (Tersedia), Lensa Teduh (Tersedia), Luma Dekor (Tersedia), Kalyana Photo (Tidak tersedia karena acara lain).
- **Detail Vendor Lensa Teduh Photo (`y39xp`)**:
  - Berada di rute `/marketplace/vendor/lensa-teduh`.
  - Portofolio, paket Sehari Penuh Rp 15.000.000 (8 jam layanan, 2 fotografer, galeri digital), ketentuan termin 30%/40%/30%.
- **Favorit & Draf Paket (`KQuvx`)**:
  - Berada di rute `/marketplace/favorites`.
  - Koleksi vendor tersimpan dan draf paket utama PKT-SIM-204 (Rp 35.000.000).
- **Racik Paket Bundler (`RB5cT`, `p1hIw`)**:
  - Berada di rute `/marketplace/bundles`.
  - Tabel 3 jasa lintas vendor dengan stepper kuantitas touch-target minimal 44px: Aru MUA (1× 8jt) + Lensa Teduh (1× 15jt) + Luma Dekor (1× 12jt) = Subtotal Rp 35.000.000, DP 30% Rp 10.500.000.
  - Skenario penanganan harga berubah (Q-PRICE/v8 naik Rp 300rb pada DP) dan hold server kedaluwarsa (TTL 00:00).

### 4. Checkpoint 4D — Checkout Jasa & Pemulihan

- **Checkout Jasa Tanpa Akun (`PFaIp`, `fyvrX`)**:
  - Berada di rute kanonikal `/checkout/services` tanpa dock workspace.
  - Timer hold sementara server: 14:52. Formulir data pemesan tamu (nama, email, WhatsApp, venue).
- **Resolusi Penolakan Item Parsial (`I7adT5`)**:
  - Luma Dekor ditolak vendor karena kru tidak tersedia; sistem menawarkan pengganti sebanding Rona Dekor (Rp 12.000.000, tersedia 14 Feb).
  - Nilai paket tetap Rp 35.000.000 (DP Rp 10.500.000) dan snapshot kontrak diperbarui ke v9 tanpa membatalkan item Aru MUA dan Lensa Teduh.
- **Tinjauan Kontrak Jasa (`CyKZk`)**:
  - Rincian kontrak draf v9 (Andi Ramadhan & Risa Pratiwi, 14 Feb 2027).
  - Rincian termin: DP 30% (Rp 10,5 jt), Termin 2 40% (Rp 14 jt, jatuh tempo 15 Jan 2027), Pelunasan 30% (Rp 10,5 jt, jatuh tempo 07 Feb 2027).
  - Persetujuan eksplisit klausul pembatalan, force majeure, dan hak foto.
- **Pilihan Cara Pembayaran & Status Deterministik (`c1GHr`, `sCDXm`, `f9tDH`)**:
  - Pilihan skema: DP 30% Rp 10.500.000 vs Bayar Penuh Rp 35.000.000.
  - Gateway sandbox KlikQRIS dan Virtual Account.
  - Pratinjau pembayaran manual internal (`sCDXm`) dengan penegasan status nonaktif di rilis publik.
  - Simulasi status pembayaran idempoten: Menunggu, Gagal definitif, dan Terkonfirmasi (SETTLED).
- **Invoice, Tanda Terima (Receipt) & Sengketa (`YDHrr`, `EudS2`)**:
  - Berada di rute kanonikal `/orders/[orderToken]`.
  - Tanda terima resmi RCPT-SIM-204-01 atas invoice INV-SIM-204-01 (DP 30% Rp 10.500.000).
  - Jadwal sisa kontrak Rp 24.500.000 dalam 2 termin.
  - Formulir pengajuan sengketa terarah dengan batas waktu 21 Feb 2027 23.59 WIB dan lampiran berkas privat ≤ 10 MB.

---

## Pemetaan 36 Frame Desain Pencil

| ID Frame | Nama Sumber                                              | Jenis            | Implementasi Kode                                                   |
| -------- | -------------------------------------------------------- | ---------------- | ------------------------------------------------------------------- |
| `dxIqb`  | 00G · Sistem Tamu — Definisi, status & komponen          | Library/Tokens   | `src/features/guest-crm/types/` & `components/guest-crm.module.css` |
| `o3Lcg`  | 43 · CRM Tamu — Undangan, kuota & RSVP                   | Screen/State     | `src/features/guest-crm/` & `/planner/guests`                       |
| `y3Mltv` | 43A · Tambah Undangan — Data minimum & izin terpisah     | Screen/State     | `GuestCreateDialog` di `/planner/guests`                            |
| `JVhyJ`  | 43B · Detail Undangan — Kuota, izin & tiket personal     | Screen/State     | `GuestInspectorDrawer` di `/planner/guests`                         |
| `IteDr`  | 44 · Impor Tamu — Normalisasi nomor & deduplikasi        | Screen/State     | `GuestImportDialog` di `/planner/guests`                            |
| `W1HD4`  | 45 · Penempatan Meja — Kapasitas & rombongan             | Screen/State     | `GuestSeatingView` di `/planner/guests`                             |
| `lHjOQ`  | 46 · WhatsApp — Template & penerima yang memenuhi syarat | Screen/State     | `WhatsappComposerView` di `/planner/guests`                         |
| `JGjTa`  | 46B · Tinjauan WhatsApp — Pengecualian & konfirmasi      | Screen/State     | `WhatsappReviewDialog` di `/planner/guests`                         |
| `c7xjuR` | 47 · Hasil WhatsApp — Status pesan & retry terarah       | Screen/State     | `WhatsappResultsView` di `/planner/guests`                          |
| `seJ6W`  | 48 · Galeri Tema — Editorial, Cypress & Monochrome       | Screen/State     | `ThemeGallery` di `/planner/invitations`                            |
| `dJfnu`  | 49 · Studio Undangan — Draf, RSVP & privasi              | Screen/State     | `DraftSettingsView` di `/planner/invitations`                       |
| `OZ2XF`  | 49B · Publikasi Undangan — Draf ke versi aktif           | Screen/State     | `PublishReviewDialog` di `/planner/invitations`                     |
| `qSqgx`  | 50 · Undangan Personal Mobile — Tamu tanpa akun          | Screen/State     | `PublicInvitationScreen` di `/i/[token]`                            |
| `uj3cI`  | 50B · RSVP Mobile — Kuota & jawaban pribadi              | Screen/State     | `RsvpDialog` di `/i/[token]`                                        |
| `l2XjAp` | 50C · Tiket Personal — Konfirmasi & QR demo              | Screen/State     | `PersonalTicketCard` di `/i/[token]`                                |
| `SqslJ`  | 50D · Tautan Tidak Tersedia — Privasi & pemulihan        | Screen/State     | `UnavailableLinkScreen` di `/i/[token]`                             |
| `RJRrI`  | 51 · Konsol Check-in — Akses operasional terbatas        | Screen/State     | `CheckinConsoleScreen` di `/checkin`                                |
| `a50cJX` | 51B · Pindai Tiket — Validasi sebelum catat kedatangan   | Screen/State     | `TicketScannerDialog` di `/checkin`                                 |
| `o5w7r3` | 51C · State Check-in — Offline, duplikat & batas kuota   | Screen/State     | `CheckinStatesView` di `/checkin`                                   |
| `kUeNq`  | 52 · Akses Petugas — Cakupan acara & pencabutan          | Screen/State     | `StaffAccessView` di `/checkin`                                     |
| `mkFcs`  | 52A · Temukan tim untuk hari kalian.                     | Screen/State     | `MarketplaceScreen` di `/marketplace`                               |
| `VKRRC`  | 52B · Satu tanggal. Semua vendor diperiksa.              | Screen/State     | `SameDateCheckDialog` di `/marketplace`                             |
| `y39xp`  | 52C · Lensa Teduh Photo                                  | Screen/State     | `VendorDetailScreen` di `/marketplace/vendor/[vendorId]`            |
| `KQuvx`  | 52D · Favorit & draf paket                               | Screen/State     | `FavoritesScreen` di `/marketplace/favorites`                       |
| `RB5cT`  | 52E · Racik paket lintas vendor                          | Screen/State     | `BundlerScreen` di `/marketplace/bundles`                           |
| `p1hIw`  | 52F · Harga berubah / hold berakhir                      | Screen/State     | `QuoteExpiredView` di `/marketplace/bundles`                        |
| `PFaIp`  | 52G · Checkout jasa tanpa akun                           | Screen/State     | `CheckoutServicesScreen` di `/checkout/services`                    |
| `c1GHr`  | 52H · Pilih cara pembayaran                              | Screen/State     | `PaymentChoiceView` di `/checkout/services`                         |
| `sCDXm`  | 52I · Pembayaran manual · preview internal               | Screen/State     | `ManualPaymentPreview` di `/checkout/services`                      |
| `f9tDH`  | 52J · Status pembayaran yang tidak menebak               | Screen/State     | `PaymentStatusView` di `/checkout/services`                         |
| `I7adT5` | 52K · Satu item ditolak, paket tetap aman.               | Screen/State     | `ItemRejectionView` di `/checkout/services`                         |
| `CyKZk`  | 52L · Tinjau kontrak sebelum menyetujui                  | Screen/State     | `ContractReviewView` di `/checkout/services`                        |
| `YDHrr`  | 52M · Invoice, receipt & termin berikutnya               | Screen/State     | `InvoiceReceiptView` di `/orders/[orderToken]`                      |
| `EudS2`  | 52N · Ajukan sengketa secara terarah                     | Screen/State     | `DisputeSubmissionDialog` di `/orders/[orderToken]`                 |
| `fyvrX`  | 52O · Checkout mobile · 375px                            | Responsive Board | Mobile reflow di `CheckoutServicesScreen`                           |
| `c6ReWy` | 52P · Akses aman dan pemulihan katalog                   | Screen/State     | `MarketplaceRecoveryView` di `/marketplace`                         |

---

## Batasan & Pembedaan Mode

- **Mock & Sandbox Mode:** Seluruh data CRM, WhatsApp, scanner tiket, katalog vendor, quote, dan checkout beroperasi dalam mode adapter sandbox deterministik (Preset 3). Tidak ada pengiriman WhatsApp nyata melalui API pihak ketiga atau pemotongan saldo perbankan nyata.
- **Rilis #43 Baseline Compliance:** Portal Mitra Vendor dan Brand Ambassador tetap berstatus **Hidden** secara fail-closed pada level proxy `/admin`, `/vendor`, dan `/ba`. Fitur pembayaran transfer manual berstatus preview internal.
