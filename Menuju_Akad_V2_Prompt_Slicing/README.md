# Prompt slicing Menuju Akad V2 — mulai di sini

Paket ini dibuat dari canvas **setelah remediasi 3 P0, 8 P1 dan 3 P2**, bukan dari baseline sebelum perbaikan. Tersedia satu prompt untuk setiap Batch 01–07 serta **Batch Ekspansi terpisah**, tanpa membuat Batch 08.

**Pembaruan pembayaran, 17 Oktober 2026:** gateway V2 adalah **KlikQRIS**. Keputusan ini menggantikan label Mayar/Midtrans/Xendit pada desain lama. Baca [panduan KlikQRIS](../Menuju_Akad_V2_Promt_Rules/07_KLIKQRIS_PAYMENT_GATEWAY.md) dan [dokumentasi resmi](https://klikqris.com/dokumentasi-api). Slicing tetap mock; integrasi nyata menunggu implementasi dan bukti sandbox. Snapshot, inventaris, PNG dan QA desain tetap historis.

## Cara memakai
1. Ekstrak ZIP. Buka repository aplikasi target pada agent coding Anda.
2. Baca [00_KONTRAK_GLOBAL_AGENT.md](00_KONTRAK_GLOBAL_AGENT.md), lalu kirim **satu file batch** sebagai instruksi agent. Prompt batch juga menyertakan kontrak global sehingga dapat dipakai sendiri.
3. Berikan agent akses ke folder paket, terutama `references/design/Menuju_Akad_v2.pen`, folder `images`, inventaris dan PNG anchor. Jika hanya mengunduh satu MD, lampirkan sumber `.pen`/aset atau beri akses canvas aktif; MD saja bukan pengganti referensi visual.
4. Minta agent mengerjakan kode, menjalankan test, dan melaporkan integrasi yang belum tersedia. Jangan meminta semua batch sekaligus dalam satu context panjang.
5. Review hasil dan checkpoint/commit sebelum lanjut batch berikutnya.

**Prompt pembuka yang dapat disalin:**

> Kerjakan slicing sesuai file batch yang saya lampirkan. Repository target adalah [PATH_REPOSITORY]. Folder referensi desain adalah [PATH_PAKET]/references. Gunakan stack existing dan mode frontend slicing/mock yang dinyatakan di prompt. Baca `.pen`, override komponen dan PNG terkait terlebih dahulu. Implementasikan kode dan interaksi, bukan hanya membuat rencana. Jangan aktifkan fitur produksi atau melakukan transaksi/pengiriman/publikasi sungguhan. Jalankan verifikasi yang tersedia dan laporkan hasil serta blocker secara jujur.

## Urutan yang disarankan
**01 → Ekspansi → 02 → 03 → 04 → 05 → 06 → 07.** Ekspansi dikerjakan lebih awal agar shell role, availability dan release gates tersedia. Ini urutan dependency implementasi, **tidak mengubah penomoran/scope canvas**. Jika harus mengikuti 01–07 secara ketat, ekstrak fondasi role/flag Ekspansi setelah 01 sebelum mengerjakan entrypoint yang bergantung padanya.

| File | Lingkup |
|---|---|
| [BATCH_01_FONDASI_AUTH_AKUN.md](BATCH_01_FONDASI_AUTH_AKUN.md) | Tokens, shell, auth, onboarding, pairing, paket, privasi |
| [BATCH_EKSPANSI_ROLE_FEATURE_FLAGS.md](BATCH_EKSPANSI_ROLE_FEATURE_FLAGS.md) | Lima pengalaman, feature engine, release, teaser/fallback, public entrypoints |
| [BATCH_02_PERENCANAAN.md](BATCH_02_PERENCANAAN.md) | Dashboard, task/KUA, rundown, kalender, seserahan, moodboard, digital fulfillment |
| [BATCH_03_KEUANGAN.md](BATCH_03_KEUANGAN.md) | Setoran, budget, expense/source, rekening, mutasi/koreksi, CSV, laporan |
| [BATCH_04_CRM_MARKETPLACE_CHECKOUT.md](BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) | CRM/WA/RSVP/check-in **dan** addendum Marketplace11 kategori/bundler/checkout |
| [BATCH_05_PENGALAMAN_TAMU.md](BATCH_05_PENGALAMAN_TAMU.md) | Multi-undangan, microsite, sesi, analitik, moderasi dan fitur opsional |
| [BATCH_06_STUDIO_EDITOR.md](BATCH_06_STUDIO_EDITOR.md) | Editor Visual/Form, aset/layer, resilience, versi dan publish lifecycle |
| [BATCH_07_VENDOR_BA_ADMIN.md](BATCH_07_VENDOR_BA_ADMIN.md) | Vendor, BA, Admin, payout/refund/reconciliation, operasi dan bantuan |

## Apa yang ada dalam paket
- Prompt Markdown per batch, kontrak global dan inventaris frame otomatis dari snapshot.
- File sumber `.pen` dan salinan folder aset lokal. Jangan mengubah snapshot untuk melakukan slicing.
- JSON token dan manifest aset, termasuk penandaan aset lokal/remote/missing.
- PNG anchor pada `references/previews/`, bernama menurut ID frame. Ini sampel visual, bukan pengganti membaca semua frame batch.
- Handoff remediasi dan QA desain. Audit lama tidak boleh digunakan untuk mengembalikan label/jadwal yang sudah dikoreksi.

## Batas penting
- Release 43: Vendor/BA Hidden, katering Coming Soon, Wedding Kit Maintenance; marketplace baru sandbox Preset 3, bukan aktivasi produksi.
- Public checkout/undangan tidak memakai dock workspace.
- Frame library, marker, audit, mobile comparison board dan handoff bukan masing-masing route aplikasi.
- Contoh mobile 375×812 tidak berarti menggambar keyboard/status bar OS sebagai elemen website.
- Seluruh fixture adalah data desain; angka saldo bukan koneksi bank. Jangan memasukkan skenario preview ke ledger aktual.
- Blueprint route/API adalah usulan yang harus dicocokkan dengan repository, bukan klaim endpoint sudah tersedia.
- Pilihan API/backend produksi, kebijakan hukum/refund/SLA, data vendor dan pengujian nyata masih memerlukan persetujuan/implementasi.

## Definisi selesai per batch
Kode UI dan state selesai; sumber frame tercakup; typecheck/build/test yang tersedia dijalankan; screenshot desktop/mobile dibandingkan; aksesibilitas dasar diperiksa; tidak mengubah entitlement/role/release/data batch lain; integrasi yang masih mock dinyatakan jelas.

Jangan mengklaim seluruh produk siap rilis hanya karena seluruh batch sudah dislice.


## Verifikasi paket

- 8 prompt batch mencakup 167 frame desain/library/state/handoff dari 180 root;9 marker dan 4 audit tidak dijadikan halaman produk.
- 12 PNG anchor pada skala 1×.
- 11 aset lokal asli disalin; 2 foto remote dicache tanpa mengubah crop/geometri. Sisa remote yang memerlukan jaringan: **0**.
- Snapshot portabel hanya mengubah URL foto remote yang berhasil dicache. File canvas asli tidak diubah. Provenance SHA-256 ada pada manifest.

| Anchor | PNG |
|---|---|
| Auth editorial | [MNC2H](references/previews/MNC2H.png) |
| Shell pasangan/settings | [m34FY](references/previews/m34FY.png) |
| Planner | [Dx42c](references/previews/Dx42c.png) |
| Keuangan setelah remediasi | [w7nKVL](references/previews/w7nKVL.png) |
| CRM | [o3Lcg](references/previews/o3Lcg.png) |
| Marketplace sandbox | [mkFcs](references/previews/mkFcs.png) |
| Guest service checkout | [PFaIp](references/previews/PFaIp.png) |
| Multi-undangan | [orG6X](references/previews/orG6X.png) |
| Studio editor | [A5HAQ](references/previews/A5HAQ.png) |
| Admin operations | [f5KPKj](references/previews/f5KPKj.png) |
| Feature Studio | [bLaVb](references/previews/bLaVb.png) |
| Mobile keyboard/dirty-dismiss | [KyFHp](references/previews/KyFHp.png) |
