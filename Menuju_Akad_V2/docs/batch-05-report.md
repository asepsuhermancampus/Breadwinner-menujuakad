# Laporan audit dan perbaikan Batch 05

Tanggal: 19 Oktober 2026. Mode **UI_MOCK** dengan adapter lokal deterministik.
Audit mengikuti `BATCH_05_PENGALAMAN_TAMU.md`, kontrak global, inventaris frame,
dan handoff remediasi. Frame aktif diperiksa melalui Pencil pada sesi gabungan
Batch 05/06; file `.pen` tidak diedit. Inventaris menyebut sumber mobile 420 px;
implementasi memakai lebar fluid, tanpa dock workspace pada undangan publik.

## Temuan yang diperbaiki

- Menyimpan usulan slug sebelumnya mengganti slug aktif. `draftSlug` sekarang
  terpisah; URL aktif, versi v3 dan tautan personal tetap sama.
- Route microsite sebelumnya mengabaikan token dan selalu membuka sesi Budi.
  Route server kini hanya menerima token fixture Budi yang cocok persis; token
  asing, substring, kedaluwarsa dan dicabut mendapat layar tautan tidak tersedia.
- RSVP sebelumnya memakai clock tetap dan mempercayai kuota dari draf. Adapter
  memeriksa kuota otoritatif lokal, deadline, status, integer, ID sesi, izin dan
  versi. Clock runtime dapat diinjeksi. Reload konflik dan retry offline tersedia;
  jawaban tersimpan tetap ada saat berpindah bagian pada microsite yang sama.
- Lightbox sebelumnya berupa div tanpa pengelolaan fokus. Kini memakai `Dialog`
  bersama: focus trap/return, Escape, panah kiri/kanan dan caption per foto.
  Media tidak autoplay; video/live yang belum tersedia memiliki fallback jujur.
- Foto sebelumnya hanya mengganti nama berkas fixture. Kini ada pemilih JPG/PNG
  lokal, validasi ukuran ≤10 MB, pratinjau privat, reset consent saat mengganti,
  progres simulasi, retry offline, pencegahan submit ganda dan penarikan foto/izin.
- Ucapan memeriksa consent pada aksi kirim, mencegah kirim ulang, menyediakan
  penarikan ucapan/izin dan menjaga konten di antrean privat, bukan galeri publik.
- Moderasi sebelumnya dapat menampilkan kiriman tanpa consent dan tidak mencatat
  keputusan. Domain kini menolak publikasi tanpa izin dan keputusan versi lama,
  mewajibkan alasan serta menyimpan aktor/waktu/versi/alasan pada audit lokal.
  Metrik berubah setelah keputusan, dengan 4 baris tetap sampel dari 12 pending.
- Follow-up sebelumnya langsung menyalin ID tanpa recheck. Adapter dispatch kini
  memeriksa consent, nomor, jawaban dan cooldown 7 hari terbaru; dedup kampanye
  berlaku per penerima dan nomor ternormalisasi. Search mempertahankan pilihan
  eksplisit. Checkbox mixed memiliki semantik aksesibel dan target 44 px.
- Analitik kini mempunyai rentang, loading/empty/offline/retry serta unduhan CSV
  agregat. Denominator tetap 168/210 = 80%; sessions tidak disebut orang unik.
- Simulasi DNS tidak lagi mengarang TXT/SSL sukses. Domain tetap internal/Hidden.
  Halaman hadiah nonaktif tidak merender rekening, QRIS atau alamat tersembunyi.
- Kalender menghasilkan berkas ICS; navigasi membuka pencarian venue tanpa
  geolocation otomatis. Timeline dilabeli ilustratif; fitur IG/Wallet/media yang
  belum tersedia mempunyai penjelasan dan alternatif, tanpa klaim integrasi.

## Pemetaan 16 frame

| Frame    | Implementasi/state                                                                  |
| -------- | ----------------------------------------------------------------------------------- |
| `DNjlJ`  | Kontrak privasi, exact token gate dan domain RSVP per sesi; bukan route library     |
| `orG6X`  | `ManagerScreen` / `ProjectCard`; Pernikahan 350, VIP subset 12, Lamaran terpisah    |
| `ej3Si`  | `AddressInspector`, `checkSlug`, field `draftSlug` terpisah dari aktif              |
| `w10ww`  | `DomainPanel` internal; TXT missing dan SSL belum terbit tetap pending              |
| `iybkq`  | `ThemeComparePanel`; dialog demo dengan konten sama dan tanpa reset RSVP            |
| `oh4K3`  | `AnalyticsPanel` / `AnalyticsControls`, CSV agregat dan rekonsiliasi CRM            |
| `LQOhS`  | `MicrositeScreen`; keluarga resmi dan timeline ilustratif                           |
| `gb4IQ`  | `GuestGuideSection`; denah skematik, kalender, pencarian venue dan FAQ              |
| `saA1w`  | `GuestGallerySection`; masonry, native modal, keyboard dan media fallback           |
| `JLu7e`  | `SessionRsvpSection` / adapter; Akad 1/2, Resepsi 2/2, bukan 3 orang unik           |
| `L5Awxn` | `WishesSection`; consent awal unchecked, antrean lokal dan penarikan                |
| `Ll4xj`  | `MomentsSection` / hook privat / validasi berkas dan penarikan                      |
| `E8d5oa` | `GiftsSection`; penjelasan nonaktif, tanpa data pembayaran tersembunyi              |
| `MddxL`  | `ModerationPanel` / `ModerationDialog` / domain keputusan dan audit                 |
| `Z5R5x`  | `FollowUpView`; 150/42/108 dan 4 pilihan eksplisit, recheck saat dispatch           |
| `IdxPj`  | `OptionalFeaturesPanel` dan fallback media/guide/hadiah/domain; bukan route roadmap |

## Verifikasi revisi ini

Task utama menjalankan verifikasi gabungan Batch 05/06 berikut. Subtask tidak
mengulang suite secara terpisah. Hasil ini berasal dari sesi revisi saat ini.

| Pemeriksaan                | Hasil aktual                                                                                                  |
| -------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `npm test`                 | PASS — 31 berkas, 167 tes                                                                                     |
| `npm run typecheck`        | PASS                                                                                                          |
| `npm run lint`             | PASS — arsitektur 359 modul, batas ≤200 baris dan dependency/cycle; 12 warning nonfatal terkait gambar/unused |
| `npm run format:check`     | PASS                                                                                                          |
| `npm run db:validate`      | PASS                                                                                                          |
| `npm run build`            | PASS — 33 route, termasuk build akhir setelah penyesuaian renderer                                            |
| E2E terarah Batch 04/05/06 | 30 tes unik seluruhnya lulus setelah perbaikan selector dan rerun terarah                                     |

Prettier pada berkas yang berubah dan `git diff --check` juga dijalankan tanpa
error whitespace. Build akhir dan dua tes browser terakhir untuk upload foto serta
inline edit/Visual/Form/recovery lulus. Suite penuh tidak diulang untuk selector.

Regresi ditambahkan untuk token yang tidak cocok, kuota draf yang dimanipulasi,
izin/versi RSVP, consent/ukuran berkas, keputusan moderasi, ekspor agregat,
eligibility/dedup follow-up dan pemilihan lintas filter. Browser coverage ada pada
`batch05-guest-experience.spec.ts` dan `batch05-resilience.spec.ts`, termasuk
keyboard/focus, offline/retry, withdrawal, dan lebar 375/768/1280 px.

Run browser terarah mencakup `batch04-crm-marketplace.spec.ts`,
`batch05-guest-experience.spec.ts`, `batch05-resilience.spec.ts`, dan
`batch06-studio.spec.ts`. Kegagalan selector ditangani dengan pembatasan alert ke
region `Foto momen` serta label tanggal yang cocok persis. Dua selector ambigu
menyebabkan kegagalan awal; pemeriksaan berikutnya hanya mengulang tes terkait.

## Integrasi yang belum tersedia

Tidak ada pengiriman WhatsApp, DNS/SSL nyata, pembayaran hadiah, storage publik,
streaming, IG/Wallet/PWA, atau publikasi produksi. Token dan izin memakai registry
mock yang sangat terbatas; server authorization dengan expiry/revocation nyata
belum terhubung. Microsite hanya menyediakan fixture per sesi Budi; token tamu
lain tidak boleh mewarisi data tersebut. Adapter RSVP dan antrean foto/ucapan
lokal bukan sinkronisasi lintas tab/perangkat atau antrean moderasi backend.
Sanitasi metadata, pemindaian isi, kebijakan retensi dan withdrawal server masih
memerlukan backend. Domain internal hanya komponen referensi, bukan entrypoint
untuk mengaktifkan produksi. Kesesuaian visual penuh dibuktikan melalui review
Pencil dan screenshot gabungan task utama; laporan ini tidak mengklaim hasil
pixel-diff yang belum dijalankan.
