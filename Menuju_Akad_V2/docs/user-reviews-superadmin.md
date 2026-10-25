# Ulasan pengguna dan superadmin

Fitur ini memakai form, API, login, database, serta moderasi yang nyata. Data awal dan akun pengujian adalah dummy; tidak ada mode preview atau halaman simulasi.

## Mencoba fitur

1. Buka landing pada `/#ulasan`, lalu pilih **Tulis ulasan**.
2. Isi nama, 1–5 bintang, dan komentar. Review yang terkirim hanya masuk ke inbox privat.
3. Buka `/login` dan gunakan akun pengujian lokal:
   - Email: `superadmin@menujuakad.test`
   - Password: `AkadReview!2026`
4. Cari review yang dikirim di `/superadmin/reviews`. Pilih **Tampilkan di landing** untuk memublikasikannya, atau **Sembunyikan** untuk menariknya dari landing tanpa menghapus masukan.
5. Muat ulang landing atau fokuskan kembali tab landing untuk melihat hasil moderasi.

Superadmin dapat menampilkan semua review yang dipilih tanpa batas jumlah. Daftar memakai halaman/muat-lagi agar semua record tetap dapat dijangkau. Angka rating di landing menghitung review yang ditampilkan saja. Pengguna tidak harus berlangganan atau login untuk memberi masukan.

Konfigurasi akun pengujian sudah disimpan di `.env.local` yang diabaikan Git. Akun diprovisi dari konfigurasi tersebut dan password disimpan sebagai hash scrypt. Enam review publik dan dua masukan privat dibuat sekali. Login kini memakai sesi terpadu Auth.js dengan masa berlaku maksimal 24 jam dan pencabutan di server. Akun customer/operations tidak memperoleh akses superadmin. Lihat [panduan login terpadu](./unified-auth.md).

## Penyimpanan dan konfigurasi server

Default database: `.data/reviews.sqlite`, terpisah dari data pembayaran/workspace. Backup file dengan mekanisme backup SQLite dan simpan pada disk persisten. Seluruh instance aplikasi harus mengakses penyimpanan yang sama; disk sementara serverless tidak menyediakan persistensi lintas instance.

Variabel opsional (simpan pada konfigurasi server/`.env.local`, bukan `NEXT_PUBLIC_*`):

| Variabel                   | Kegunaan                                                                                                 |
| -------------------------- | -------------------------------------------------------------------------------------------------------- |
| `REVIEWS_DATABASE_PATH`    | Path SQLite khusus ulasan.                                                                               |
| `SUPERADMIN_EMAIL`         | Email akun superadmin yang akan diprovisi.                                                               |
| `SUPERADMIN_PASSWORD`      | Password akun tersebut, 12–128 karakter.                                                                 |
| `REVIEWS_SEED_DATA=true`   | Secara eksplisit memasukkan data review awal ketika menjalankan build produksi.                          |
| `REVIEWS_APP_ORIGIN`       | Origin publik aplikasi jika berbeda dengan URL internal reverse proxy, misalnya `https://menujuakad.id`. |
| `REVIEWS_TRUST_PROXY=true` | Gunakan IP dari `X-Forwarded-For` hanya jika proxy Anda menimpa/membersihkan header tersebut.            |

Production tidak memiliki akun/password dummy bawaan dalam kode aplikasi. Provisi akun pribadi menggunakan `SUPERADMIN_EMAIL` dan `SUPERADMIN_PASSWORD`; gunakan HTTPS untuk cookie sesi Secure. Nilai provisioning hanya membuat akun yang belum ada, tidak mereset password akun yang tersimpan. Jangan membawa konfigurasi atau database testing berisi akun dummy ke deployment publik.

Seed hanya dijalankan sekali: restart tidak menggandakan data, memublikasikan ulang review yang disembunyikan, atau mereset password. Review baru selalu `pending`; hanya superadmin dapat mengubahnya menjadi `published` atau `hidden`.

Mutasi memerlukan Origin yang sesuai. Body JSON dibatasi 16 KiB; komentar 10–2000 karakter dan nama 2–80 karakter. Pembatasan penyalahgunaan tersimpan di database: lima percobaan kirim per 10 menit dan sepuluh percobaan login per 15 menit per identitas pengunjung, ditambah 30 percobaan per akun per 15 menit. Tanpa proxy tepercaya, server memakai cookie identitas acak yang diterbitkan server dan diverifikasi melalui hash tersimpan; pengguna yang berbeda tidak berbagi kuota. Browser menyiapkan cookie lewat `/api/reviews/identity` sebelum mengirim/login. Klien API langsung perlu melakukan langkah yang sama dan membawa cookie hasilnya. Untuk perlindungan per IP pada deployment publik, aktifkan opsi proxy hanya pada proxy yang benar-benar membersihkan header IP; pembatasan berbasis cookie saja bukan perlindungan bot yang dapat mengganti identitas.

## Verifikasi terisolasi

Gunakan Node 24, sesuai versi proyek:

```powershell
npm test -- src/server/reviews
$env:NEXT_DIST_DIR = '.next-reviews'
npm run build
node node_modules/@playwright/test/cli.js test --config playwright.reviews.config.ts --reporter=line
```

Build dan server Playwright menggunakan `.next-reviews`; konfigurasi Playwright membuat database sementara yang terpisah dari data pengguna, di port 3227. Hapus variabel `NEXT_DIST_DIR` dari sesi shell sesudahnya jika ingin kembali menggunakan build default. Tes mencakup kirim → inbox privat → publikasi → sembunyikan → logout, akses ilegal, validasi, persistensi, seed idempoten, keyboard, reduced motion, dan beberapa ukuran layar.
