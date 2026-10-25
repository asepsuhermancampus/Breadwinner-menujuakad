# Login akun Menuju Akad

Semua role masuk pada `/login`, melalui email/password atau Google. Daftar manual pada `/auth/register`. Customer diarahkan ke `/dashboard`, superadmin ke `/superadmin/reviews`, dan admin ke `/admin`. Return URL pelanggan dibatasi ke halaman aplikasi yang dikenali.

Akun pengujian superadmin yang sudah tersimpan tetap memakai `superadmin@menujuakad.test` dan `AkadReview!2026`. Buka `http://localhost:3201/login`. Akun ini memakai alur autentikasi nyata. Data awal ulasan tetap dummy; pengiriman, penyimpanan, moderasi dan publikasinya berfungsi.

Password manual baru harus 12–128 karakter. Password dimasking, dapat diperlihatkan melalui tombol mata, dan disimpan di server sebagai hash scrypt dengan salt. Nama input dan autocomplete mendukung password manager browser; browser menentukan penawaran simpan dan pengisian satu klik. Aplikasi tidak menyimpan riwayat password mentah di localStorage/cookie.

Di `/account/security`, pengguna dapat mengganti password atau menambahkan password setelah login Google yang masih baru. Perubahan password mengakhiri semua sesi dan bukti penghubungan Google yang belum dipakai. Menghubungkan Google ke akun manual memerlukan sesi akun tersebut, bukti sekali pakai berumur sepuluh menit, dan email Google terverifikasi yang sama.

Google membuat customer saat pertama masuk. Admin hanya diberikan dari daftar server `OPERATIONS_EMAIL_ALLOWLIST` pada identitas Google terverifikasi atau melalui provisioning server. Mengetik email admin saat mendaftar tidak memberi hak admin. Role dan status aktif dibaca dari database pada setiap verifikasi sesi. Akun manual memakai kunci kepemilikan terpisah; akun Google lama mempertahankan kepemilikan workspace/pembayaran. Jika email sudah memiliki data Google lama, masuk Google lalu tambahkan password melalui keamanan akun.

Database akun/sesi default `.data/auth.sqlite`, dapat diubah dengan `AUTH_DATABASE_PATH`. Database ulasan tetap `.data/reviews.sqlite`; data pembayaran/workspace tidak dipindahkan. Superadmin dimigrasikan dengan ID dan hash password yang sama, tanpa reset role/password saat restart. Cookie superadmin lama tidak mengizinkan akses; endpoint login/logout lamanya mengembalikan 410. Sesi terpadu berlaku maksimal 24 jam dan dicabut saat logout. Logout membersihkan pilihan workspace dan cookie sesi lama.

Google memakai `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_SECRET`, dan `AUTH_URL=http://localhost:3201`. Authorized redirect URI di Google Cloud harus sama dengan `http://localhost:3201/api/auth/callback/google`. Pemeriksaan permintaan awal pada 22 Oktober 2026 berhasil menuju Google dengan callback tersebut, PKCE S256 dan state. Pemeriksaan awal bukan bukti selesainya persetujuan Google; putaran penuh membutuhkan akun Google interaktif. Query `error=Configuration` menampilkan pesan kegagalan sebelumnya, bukan pemeriksaan langsung kelengkapan konfigurasi.

Pengujian terisolasi memakai Node 24:

```powershell
npm test
$env:NEXT_DIST_DIR='.next-reviews'
npm run build
npx playwright test --config playwright.auth.config.ts --reporter=line
```

Playwright memakai port 3229 dan database sementara terpisah untuk akun, ulasan, dan pembayaran. Tes mencakup registrasi/login, persistensi profil, login salah, password baru, pencabutan dan replay sesi, admin/superadmin, moderasi, Google client wiring dan layout mobile. Tes Google wiring tidak menukar kode OAuth sungguhan. Pemulihan password lewat email belum dikonfigurasi; tidak ada pengiriman email atau OTP simulasi pada alur nyata.
