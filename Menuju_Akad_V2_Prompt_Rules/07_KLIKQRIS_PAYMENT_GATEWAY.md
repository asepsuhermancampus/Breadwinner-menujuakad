# 07 — Keputusan dan integrasi KlikQRIS

## Keputusan dan sumber

Keputusan pengguna, 17 Oktober 2026: **payment gateway V2 adalah KlikQRIS**. Mayar, Midtrans dan Xendit tidak dipilih. Nama provider lama pada snapshot desain/inventaris merupakan referensi historis; implementasi baru memakai KlikQRIS tanpa mengubah nominal atau arti vignette.

Dokumentasi resmi yang dibaca: [Dokumentasi API KlikQRIS](https://klikqris.com/dokumentasi-api). Tautan awal `/dokumentasi` mengarah ke login pada pemeriksaan ini. Status pekerjaan: keputusan dan panduan tercatat; adapter, kredensial, webhook serta tes sandbox belum diimplementasikan/diverifikasi.

## Ringkasan kontrak resmi

Base produksi `https://klikqris.com/api`; sandbox `https://klikqris.com/api/sandbox`. Header: `x-api-key`, `id_merchant`; JSON memakai `Content-Type: application/json`.

| Mode | Buat tagihan | Cek status |
|---|---|---|
| PG KlikQRIS | `POST /qris/create` | `GET /qris/status/{order_id}` |
| MY PG | `POST /qrisv2/create` | `GET /qrisv2/status/{id_merchant}/{order_id}` |
| Sandbox terdokumentasi | `POST /qris/create` | `GET /qris/status/{order_id}` |

Body create wajib: `order_id`, `amount` integer, `id_merchant`; opsional `keterangan`. PG juga mendokumentasikan `callback_url`; tanpa override, webhook memakai pengaturan dashboard.

Gunakan `total_amount`, termasuk kode unik, sebagai tagihan pembeli. Simpan `signature`, `expired_at`, `qris_url`/`qris_image`. Status API: `PENDING`, `SUCCESS`, `EXPIRED`; webhook memakai `PAID`/`EXPIRED`. Cocokkan signature callback dengan hasil create, deduplikasi, lalu balas HTTP 200 setelah penerimaan berhasil.

PG menyalurkan settlement berkala; MY PG menerima dana langsung melalui QRIS sendiri. Mode akun belum dipilih pengguna. Simulator tersedia di [sandbox publik](https://klikqris.com/public/sandbox/simulate).

Ringkasan di atas berasal dari dokumentasi resmi; bagian berikut adalah **aturan implementasi proyek**, bukan jaminan tambahan provider.

## Alur implementasi V2

1. Service `payments` memeriksa owner/capability, effective availability, kontrak/harga/versi dan cumulative paid. Buat intent lokal dengan `order_id` opaque unik dan mode/environment yang terikat permanen.
2. Adapter server-only `src/server/integrations/payments/klikqris/` memanggil create sesuai konfigurasi. Ini path usulan untuk implementasi, belum ada kode. UI_SLICING tetap memakai mock deterministik.
3. Validasi response dengan Zod dan simpan hubungan intent, merchant, order, signature serta nilai permintaan/total dalam repository. UI memperoleh DTO QR/nominal/expiry/status minimum, tanpa API key atau signature.
4. Pembeli mereview nominal akhir sebelum membayar. Selisih kode unik terhadap harga kontrak dicatat terpisah; jangan diam-diam menaikkan nilai item, fee, komisi atau entitlement. Tentukan kebijakan alokasi/rekonsiliasinya sebelum produksi.
5. Rute usulan `POST /api/webhooks/klikqris` memvalidasi payload menurut mode, memeriksa signature tersimpan dengan pembandingan konstan-waktu, lalu mencocokkan order, merchant jika tersedia, nominal dan environment terhadap intent.
6. **Sebelum fulfillment**, backend mengecek status melalui API terautentikasi dan mencocokkan total dengan intent. Signature yang cocok saja belum cukup untuk memberi produk. Ketidakcocokan/status yang belum pasti masuk rekonsiliasi tanpa entitlement.
7. Perubahan status paid, receipt dan entitlement dilakukan atomik/idempoten; delivery memakai outbox/pekerjaan terpisah. Webhook ulang atau balapan dengan polling tidak menggandakan ledger/akses produk. Redirect dan status dari browser tidak mengesahkan pembayaran.
8. UI membaca status internal yang owner-scoped. Timeout create tetap menyimpan intent lama dan memeriksa order tersebut; jangan menerbitkan order baru atau mengulang POST secara buta. Retry baru memerlukan kepastian status, pemeriksaan kontrak/hold/nominal dan policy yang berlaku.

Gunakan constraint unik `(provider, environment, merchantId, orderId)` serta transaksi/locking untuk concurrency. Jangan bergantung pada event ID atau header idempotency provider yang belum diverifikasi. `UNKNOWN` adalah state internal ketidakpastian, bukan status KlikQRIS yang diklaim terdokumentasi.

## Konfigurasi dan batas keamanan

Nama konfigurasi berikut **usulan proyek**, bukan nama parameter resmi provider:

| Konfigurasi server | Isi |
|---|---|
| `KLIKQRIS_ENVIRONMENT` | `sandbox` atau `production`; pengembangan default sandbox |
| `KLIKQRIS_MODE` | `pg` atau `my_pg`; wajib ditetapkan sebelum integrasi akun |
| `KLIKQRIS_API_KEY` | Secret merchant/environment yang sesuai |
| `KLIKQRIS_MERCHANT_ID` | Merchant yang terikat ke intent |
| `KLIKQRIS_CALLBACK_URL` | URL HTTPS aplikasi yang dikonfigurasi server |

- Base URL berasal dari allowlist mode/environment; jangan menerima host/callback dari input pembeli. Mode yang belum memiliki kontrak sandbox terverifikasi ditolak.
- API key/signature tidak masuk `NEXT_PUBLIC_*`, logs, fixtures, export atau screenshot. Simpan kredensial melalui pengelolaan secret; jangan mengambil nilai dari V1.
- Implementasi awal memakai QR dan status melalui DTO sendiri. Integrasi Snap opsional memerlukan review tersendiri karena dapat mengekspos signature transaksi di browser; jangan menyalin contoh script langsung ke shell aplikasi.
- Jangan mengasumsikan HMAC, SDK Node resmi, retry interval, native idempotency atau dukungan webhook event ID tanpa bukti. HTTP 200 hanya setelah event valid tersimpan/diproses secara tahan gagal, termasuk duplicate yang sudah ditangani.
- Tidak ada perubahan pada baseline Release #43, manual payment yang nonaktif, hadiah, atau hak pembelian historis. Payment-test V1 bukan pembayaran komersial/entitlement.

## Hal yang harus dibuktikan pada sandbox

- Pilih PG/MY PG sesuai akun; konfirmasi sandbox untuk mode tersebut. Jangan menebak endpoint sandbox MY PG hanya dengan mengganti prefix.
- Uji response Zod dan normalisasi IDR string desimal menjadi integer tanpa float/rounding tersembunyi; contoh create dokumentasi memuat nominal request/response yang berbeda, sehingga bukan fixture aritmetika otoritatif.
- Konfirmasi zona waktu expiry, batas nominal, tarif dan settlement akun. Nilai contoh bukan SLA, biaya kontrak atau batas transaksi.
- Status endpoint dan webhook berbeda bentuk; parser harus memisahkan envelope mode dan memeriksa status transaksi, bukan hanya boolean/string sukses di luar objek.
- Uji signature salah/hilang, wrong order/merchant/environment, total tidak cocok, webhook duplicate/out-of-order, create timeout, polling bersamaan, expiry dan callback terlambat setelah expiry lokal.
- Buktikan satu payment hanya memberi satu entitlement/receipt/journal serta delivery failure tidak meminta pembelian ulang. Simulator saja bukan hasil pengujian sampai log/assertion tersedia.
- Refund API, payout vendor/BA, split settlement dan escrow provider belum dibuktikan oleh referensi ini. Domain/preview tetap dalam scope; otomatisasinya memerlukan kontrak provider/operasi terpisah, bukan asumsi fitur KlikQRIS.

Tidak ada API transaksi, simulasi pembayaran, kredensial merchant, perubahan dashboard provider atau aktivasi produksi yang dijalankan dalam pembaruan catatan ini.
