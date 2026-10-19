# Laporan Batch 07 — Vendor, Brand Ambassador dan Admin

Tanggal: 19 Oktober 2026. Seluruh **30 frame** dicakup dalam mode **UI_MOCK**.
Frame aktif diperiksa melalui Pencil tanpa mengubah file desain. Library dan
handoff dipetakan ke komponen/kontrak, bukan route produk tambahan.

Pratinjau memerlukan development server: `/dev/operations`, `/dev/vendor`,
`/dev/ba`, dan `/dev/admin`. Route tersebut menghasilkan 404 pada production
build. Public entrypoint Vendor/BA/Admin tetap dibatasi oleh proxy; baseline
release 43 tidak diubah. Tidak ada query parameter yang membuka akses produksi.

## Perilaku yang diterapkan

- Vendor memakai katalog draf dengan validasi/recovery lokal; edit harga tidak
  mengubah snapshot kontrak pesanan. Tinjauan keputusan per item memeriksa izin,
  versi dan slot. Kalender membedakan hold, confirmed dan blok internal.
- Pengajuan KYB memakai upload privat lokal, validasi PDF/gambar, progres,
  cancel/retry dan konfirmasi identitas rekening. Pengajuan Mandiri tidak
  mengganti rekening BCA terverifikasi. Ringkasan bukti Admin mencatat akses;
  dokumen identitas asli tidak tersedia dalam fixture.
- Escrow Rp45 juta terpisah dari saldo tersedia Rp18,5 juta. Permohonan WD105
  menahan Rp5 juta satu kali; accepted, scheduled, unknown dan completed memiliki
  arti berbeda. Status unknown diperiksa memakai intent yang sama.
- BA membedakan kode rekrutmen dan promo pasangan. Komisi Gold 15% dihitung dari
  eligible platform fee, dengan jurnal atribusi/refund dan deduplikasi. Saldo
  tersedia Rp6,4 juta terpisah dari pending Rp300 ribu; withdrawal Rp1 juta
  menahan saldo satu kali.
- Admin membedakan metrik kumulatif dan funnel kohort, memfilter agenda lintas
  vendor, serta membatasi ekspor. KYB/moderasi memerlukan alasan, acknowledgement
  dan versi baru saat snapshot berubah. Scanner tidak mengambil keputusan akun.
- Rekonsiliasi **KlikQRIS** mempertahankan selisih status Rp2 juta. Replay
  webhook memeriksa signature, payment/amount/currency/status/version dan kunci
  operasi pada adapter lokal. Tidak ada charge baru.
- Antrean payout Rp13 juta memisahkan eligible Rp5 juta dan held Rp8 juta.
  Refund Rp5 juta dari PAY8300 membalik fee Rp250 ribu dan hak vendor Rp4,75 juta;
  batas kumulatif dan unknown intent diperiksa ulang.
- Pengaturan finansial memisahkan active v17 dan draft v18. OTP scoped tidak
  memberikan permission baru; publikasi eksplisit memerlukan izin, bank,
  expected version, alasan dan acknowledgement. Audit menyimpan koreksi tertaut.
- Notifikasi memeriksa consent, cooldown dan deduplikasi. Helpdesk memisahkan
  balasan publik, catatan internal dan draf. Owner hanya melihat tiketnya sendiri.
- CMS mempertahankan published version saat mengedit draf. Health membuat
  proposal maintenance untuk review. Akun memeriksa setiap objek serta mencegah
  self escalation dan penghapusan admin terakhir.
- Navigasi desktop/compact, command search, dialog dan feedback menggunakan
  komponen bersama. Scope Superadmin, Finance dan Support mempunyai menu dan
  izin berbeda. State finansial bertahan saat switch scope; panel platform
  mempertahankan state/draf saat navigasi dan loading dalam scope berizin.

## Pemetaan seluruh frame

| Frame    | Implementasi/state                                                                    |
| -------- | ------------------------------------------------------------------------------------- |
| `zqegy`  | `operational-feedback`, badge, dialog dan guard bersama; library bukan route          |
| `CJw2i`  | `VendorCatalog`, package/profile/location draft dan portfolio                         |
| `mDQYw`  | `VendorKyb`, upload privat lokal dan revisi rekening                                  |
| `jVxHU`  | `VendorOrders`, kontrak dan keputusan per item                                        |
| `PeBEY`  | `VendorCalendar`, confirmed/hold/internal block                                       |
| `ZYbW5`  | `VendorWallet`, jurnal escrow dan saldo                                               |
| `VXnZN`  | `VendorPayout`, review permohonan/unknown intent                                      |
| `aSy8W`  | `AmbassadorScreen` recruitment, atribusi dan kode                                     |
| `huATE`  | BA ledger, basis komisi dan reversal                                                  |
| `rGfR1`  | BA withdrawal, acknowledgement dan hold                                               |
| `f5KPKj` | `AdminExecutive`, metrik kumulatif dan funnel kohort                                  |
| `X5XMjO` | `AdminMasterCalendar`, filter dan restricted export                                   |
| `SiDny`  | `AdminReviewBoard` KYB, ringkasan privat dan reason/version guard                     |
| `gTU8N`  | `AdminReviewBoard` moderation dan human false positive                                |
| `bpoHM`  | `FinanceReconciliation`, KlikQRIS dan perbedaan status                                |
| `XSNpx`  | Webhook inspector, signature/version/idempotency                                      |
| `I1LPbH` | `FinancePayouts`, eligible/held/scheduled                                             |
| `UJ7nm`  | `FinanceDispute`, vignette DS019 dan payment scope                                    |
| `MbVXe`  | Refund review, cumulative cap, reversal dan unknown                                   |
| `uz02N`  | `FinanceSettings`, active/draft configuration                                         |
| `aMmL5`  | OTP challenge, expiry/resend dan scoped grant                                         |
| `XjU3V`  | Configuration review, fresh permission/version dan explicit publish                   |
| `J5qwCa` | `FinanceAuditView`, immutable history dan correction                                  |
| `SHE9M`  | Notification dispatch queue, consent/retry/status check                               |
| `PS9AV`  | Helpdesk queue, scoped thread, reply/internal note                                    |
| `s0GCv`  | CMS typed draft, preview/review dan version checks                                    |
| `NUj9z`  | Health, restore evidence dan maintenance proposal                                     |
| `g7JcA`  | Accounts, scope/access/session/bulk review                                            |
| `XZ8eT`  | Owner-help mobile TK2048 dan install event PWA opsional                               |
| `HDg7g`  | Kontrak permission/object/event/availability/version pada domain adapter; bukan route |

## Verifikasi aktual

- `npm test`: **287 tes / 42 berkas PASS**, termasuk regresi batch sebelumnya.
- `npm run typecheck`: PASS. Build akhir memeriksa ulang TypeScript setelah
  perubahan integrasi.
- ESLint: tidak ada error, 13 warning nonfatal. Pemeriksaan arsitektur akhir
  **498 modul PASS**, mempertahankan batas 200 baris, batas lapisan dan graph tanpa siklus.
  Kegagalan awal import env langsung pada halaman dev diperbaiki melalui
  `server/services/development-access`; lint untuk perubahan terakhir diperiksa
  secara terarah.
- Format repository diperiksa; satu berkas tes Vendor diformat ulang. Semua
  sumber Batch 07, konfigurasi, tes dan laporan diperiksa kembali secara terarah.
- `npm run db:validate`: PASS; tidak ada perubahan schema atau migrasi.
- Browser development memakai `npm run test:e2e:operations` pada port 3201.
  Run awal: 16 PASS, 3 kegagalan selector Vendor. Selector status dibuat spesifik;
  native select dicari melalui role/nama aksesibel. Enam kasus terarah kemudian
  PASS, mencakup tiga kegagalan dan tampilan yang berubah. Suite penuh tidak
  diulang. Seluruh **19 skenario unik** telah lulus.
- Regresi terakhir memeriksa state notifikasi/draf melalui navigasi dan
  loading→ready, moderasi CMS, serta sinkronisasi percakapan bersama. Panel
  tetap mounted dalam scope berizin; dialog panel tersembunyi dipause.
  ID field percakapan owner/agent dibuat unik dengan `useId` setelah benturan
  ID ditemukan pada pemeriksaan owner terarah. Tiga regresi platform dan satu
  pemeriksaan ulang owner lulus pada sumber akhir.
- Screenshot desktop 1600/1760 dan compact diperiksa bersama frame Pencil.
  Foto katalog ditunggu sampai decode selesai; metrik/spacing finansial dirapikan
  dan minimum width wrapper diperbaiki agar form kalender compact tidak terpotong.
  Browser memeriksa Vendor/Admin 375 px, BA 768 px dan bantuan owner
  375/768/1280 px. Ini bukan klaim semua layar mobile atau pixel-diff otomatis.

- `npm run build`: **37 route PASS**, termasuk kompilasi dan TypeScript akhir.
- Runtime produksi: 9 pemeriksaan akses PASS. Empat route `/dev/*` dan variasi
  `/dev/admin?preview=true` menghasilkan 404; `/vendor`, `/ba`, `/admin` dan
  `/vendor?preview=true` menghasilkan 307 ke `/login`. Health endpoint 200.

## Batas integrasi

Seluruh aksi operasional memakai adapter in-memory. Katalog Vendor saja memakai
localStorage tervalidasi; dokumen privat, rekening lengkap dan berkas upload
tidak dipersist ke sana. Reload dapat mereset jurnal mock. Permission lokal
adalah demonstrasi kontrak, bukan otorisasi server produksi.

Belum ada koneksi bank/gateway/OTP, dispatch WA/email, penyimpanan dokumen privat,
provider verification server, settlement/refund riil, audit remote, CMS publish
remote, account/session service, backup restore nyata atau release service.
PWA mengikuti event install browser yang sungguh tersedia; tidak menjanjikan
offline cache sensitif atau notification consent. Marketing Kit dan Modular
Feature Studio diberi penjelasan status; keduanya bukan frame workflow baru
dalam inventaris Batch 07. Maintenance hanya proposal, tanpa mengubah baseline.
