# Serah terima pengembangan sidebar dan superadmin

Tanggal: 29 Oktober 2026. Catatan ini menandai titik terakhir sebelum pindah ke sesi chat baru.

## Tujuan dan lokasi

- Kerjakan rekomendasi dalam `ANALISIS-SIDEBAR-DAN-SUPERADMIN.md` sampai tuntas: sidebar dan teks yang mudah dipahami, serta pengelolaan pengguna dan fitur bertahap oleh superadmin.
- Root repository: `C:\Breadwinner\Breadwinner-menujuakad`; aplikasi: `Menuju_Akad_V2`.
- Branch aktif: `pengembangan/sidebar-dan-kontrol-fitur`.
- Perubahan branch ini **belum di-commit atau di-push**. Banyak file baru masih untracked; jangan hilangkan saat melanjutkan. `next-env.d.ts` juga telah berubah akibat build; jangan menghapus perubahan lain tanpa pemeriksaan. Analisis awal di root juga untracked.
- Pengguna telah memberikan persetujuan umum untuk melanjutkan tindakan yang dibutuhkan di thread ini; tetap patuhi batas dan mekanisme persetujuan teknis lingkungan.

## Yang sudah dibuat

- Perbaikan struktur dan penamaan sidebar, tautan langsung ke tujuan sekunder, pemisahan Seserahan dan Inspirasi & moodboard, serta sejumlah teks dan keadaan kosong pada halaman pelanggan. Ini belum berarti seluruh teks dan semua menu selesai ditinjau.
- `/superadmin/accounts`: daftar dan pencarian akun, perubahan role customer/admin dan status aktif dengan alasan, audit, pemeriksaan revisi, pencabutan sesi termasuk sesi Google lama, dan perlindungan akun superadmin.
- `/superadmin/features`: pemeliharaan global dengan audit dan kontrol server untuk Tugas, Kalender, Rundown, Perlengkapan Darurat, Dokumen KUA, Moodboard, Katering, Seserahan, Pengelolaan Tamu, Editor Undangan, Studio Undangan, Keuangan, dan Ringkasan Cetak. RSVP dan undangan terbit tetap berjalan ketika fitur editorial terkait dipelihara. Keuangan dan sumber anggaran terkait mempunyai pemeriksaan tambahan.
- Panel dashboard dapat menampilkan/menyembunyikan empat kartu metrik dan dua bagian dashboard secara terpisah untuk tamu percobaan, pemilik, dan pasangan. Ini pengaturan tampilan, bukan izin data.
- Fondasi ketersediaan fitur per kelompok dengan default tersedia, versi, alasan, audit, pembatasan API, navigasi/pencarian, pembaruan status berkala, dan penanganan draf pada halaman yang sedang terbuka. **Delapan fitur telah selesai diuji di browser:** Tugas, Kalender, Perlengkapan Darurat, Inspirasi & moodboard, Dokumen KUA, Rundown, Ringkasan Cetak, dan Editor Undangan. Data yang sudah disimpan tidak dihapus ketika akses dibatasi.
- Undangan yang telah terbit dan RSVP publik diuji tetap dapat diakses ketika Editor Undangan dibatasi. Saat Rundown atau Editor Undangan dibatasi, grup navigasi tetap dapat menuju anak yang tersedia.

## Titik terakhir: verifikasi Studio visual

Kontrol per kelompok untuk `studio-drafts` sudah dihubungkan ke katalog, server resource, halaman Studio, navigasi, dashboard, status trial, dan gate layar penuh. Pengujian layanan membuktikan RSVP dan undangan Studio yang sudah terbit tetap dapat diakses saat editor Studio dibatasi.

Review menemukan dan perubahan terakhir telah memperbaiki dua masalah: tautan Studio di daftar/kartu undangan harus mengikuti status `studio-drafts`, dan pesan pembatasan Studio layar penuh harus menyediakan tautan kembali. Skenario untuk kedua kasus ini sudah ditambahkan ke `tests/e2e/superadmin-controls.spec.ts`, termasuk pengguna percobaan yang membuat undangan saat Studio dibatasi.

Pada 29 Oktober setelah dua perbaikan terakhir, build produksi lulus dan lima tes browser `superadmin-controls.spec.ts` serta `pencil-sidebar.spec.ts` lulus dengan database terisolasi `r22`. Tes unit keseluruhan juga lulus: 799 tes pada 170 file. Lint dan pemeriksaan arsitektur lulus dengan 17 peringatan lint yang sudah ada. Tinjauan jalur Studio mencakup tautan kartu dan daftar, gate layar penuh, serta tujuan keluar ketika undangan dibatasi. Verifikasi ini tidak berarti modul lain atau keseluruhan sistem rilis bertahap sudah selesai.

## Seserahan dan Katering

Keduanya telah dimasukkan ke kontrol per kelompok. Anggaran dan riwayat terhubung disaring ketika sumber dibatasi; saldo tetap mencerminkan seluruh transaksi, dengan pemberitahuan kepada pengguna. Data tersembunyi dipertahankan ketika anggaran lain disimpan dan retry transaksi yang sudah selesai tetap dikenali. Pengaturan lama dinetralkan sekali dan dicatat dalam audit.

## Pengelolaan Tamu

Kontrol `guests` sudah tersedia per kelompok. Halaman tamu, check-in, dashboard, navigasi, API resource, dan ekspor mengikuti status; RSVP publik tetap berfungsi. Katering berhenti membaca daftar tamu saat dibatasi dan draf menu yang menggunakan data tamu disembunyikan sampai akses pulih. Migrasi sekali jalan menetralkan pembatasan lama yang belum didukung dan mencatatnya dalam audit.

Verifikasi terbaru: 804 tes unit lulus; pemeriksaan arsitektur lulus; build produksi lulus; tiga tes browser superadmin dan Katering lulus dengan database terisolasi `r25`. Skenario browser meliputi pemilik dan trial; pembatasan pasangan dan RSVP publik diuji di tingkat layanan. Uji browser tambahan lintas peran, formulir, dan dependensi tetap diperlukan pada regresi akhir.

## Yang masih kurang

1. Kontrol fitur per kelompok untuk modul yang tercakup sudah dihubungkan, termasuk Seserahan, Katering, Keuangan, Vendor, Bantuan, Pengelolaan Tamu, dan Custom Domain. Verifikasi akhir browser terbaru dicatat pada bagian akhir dokumen.
2. Pengelolaan rilis bertahap belum lengkap: sasaran workspace/paket, draf, pratinjau per role/paket, validasi dependensi, publikasi/jadwal, riwayat konfigurasi dan rollback belum tersedia sebagai sistem menyeluruh. Pengaturan saat ini menggunakan SQLite pada database aplikasi; belum ada mekanisme sinkronisasi multi-instance.
3. Pengelolaan akun belum mencakup seluruh operasi keanggotaan workspace dan kebijakan role/izin yang lengkap. Role identitas `customer/admin/superadmin` berbeda dari role workspace `owner/partner`.
4. Tinjau seluruh sidebar, isi menu, copy, keadaan kosong/gagal, aksesibilitas dan responsivitas; sebagian sudah diperbaiki, tetapi belum disisir penuh atau divalidasi dengan pelanggan nyata.
5. Jalankan regresi menyeluruh, uji role/paket/workspace, akses URL/API, perubahan saat formulir terbuka, dependensi dan rollback setelah implementasi selesai. Tes unit terakhir: **799 tes lulus**, sebelum perubahan berikutnya.

## Pemisahan anggaran terkait

`expense-visibility.ts` terhubung ke layanan Keuangan, API resource, dashboard, laporan, dan tampilan trial. Pengujian layanan mencakup alokasi, penyimpanan item lain, retry, dan pemulihan. Pastikan menjalankan regresi browser dan seluruh pemeriksaan setelah perubahan terakhir; saldo agregat dapat mencerminkan aktivitas yang disembunyikan.

## Verifikasi dan perintah untuk melanjutkan

Pada sesi sebelumnya, build produksi dan uji browser untuk Editor Undangan lulus; pengujian browser sebelumnya juga memverifikasi draf Moodboard tetap ada setelah akses dibatasi dan dipulihkan, perubahan Kalender pada dashboard yang terbuka, serta pembatasan Dokumen ketika permintaan masih tertunda. Tes terarah terbaru untuk Studio: 18 lulus. Build terakhir yang lulus **mendahului perubahan Studio terbaru**.

Di PowerShell pada `Menuju_Akad_V2`, pastikan Node 24 tersedia, lalu jalankan `npm test`, `npm run lint`, `npm run typecheck`, dan `npm run build` sesuai kebutuhan. Lint sebelumnya lulus dengan 17 peringatan lama di bagian lain dan skrip `.review-tmp`; periksa hasil baru setelah perubahan berikutnya.

Uji browser superadmin memakai database sementara, bukan database pengguna. Setelah build sukses, gunakan nama file unik yang belum dipakai (mis. `r22`; jika sudah ada, pilih nomor baru):

```powershell
$env:PATH = 'C:/Users/ASUS/nodejs-24;' + $env:PATH
$env:E2E_BASE_URL = 'http://127.0.0.1:3206'
$env:AUTH_URL = 'http://127.0.0.1:3206'
$env:AUTH_TRUST_HOST = 'true'
$env:AUTH_SECRET = 'isolated-test-secret-not-for-production-2026'
$env:AUTH_DATABASE_PATH = 'C:/Breadwinner/Breadwinner-menujuakad/Menuju_Akad_V2/.review-tmp/isolated-superadmin-e2e-r22-auth.sqlite'
$env:E2E_SUPERADMIN_AUTH_DB = $env:AUTH_DATABASE_PATH
$env:PAYMENT_DATABASE_PATH = 'C:/Breadwinner/Breadwinner-menujuakad/Menuju_Akad_V2/.review-tmp/isolated-superadmin-e2e-r22-payment.sqlite'
$env:REVIEWS_DATABASE_PATH = 'C:/Breadwinner/Breadwinner-menujuakad/Menuju_Akad_V2/.review-tmp/isolated-superadmin-e2e-r22-reviews.sqlite'
$env:SUPERADMIN_EMAIL = ''
$env:SUPERADMIN_PASSWORD = ''
& 'C:/Users/ASUS/nodejs-24/node.exe' node_modules/@playwright/test/cli.js test tests/e2e/superadmin-controls.spec.ts tests/e2e/pencil-sidebar.spec.ts --reporter=line
```

Tes ini dapat memerlukan beberapa menit karena memverifikasi pembaruan berkala dengan beberapa halaman terbuka. Jika gagal, baca `test-results/.../error-context.md`, pastikan perbaikannya sesuai penyebab, dan jalankan kembali dengan database bernama baru.

## Verifikasi akhir kontrol fitur — 30 Oktober 2026

Kontrol per kelompok mencakup modul yang tercantum dalam `Menuju_Akad_V2/docs/superpowers/plans/2026-10-29-feature-availability.md`, termasuk Custom Domain. Akses dan penyimpanan diperiksa pada server; pembatasan mempertahankan data dan draf, sementara RSVP publik dan pesanan vendor yang sudah ada tetap dapat digunakan. Saat Seserahan atau Katering dibatasi, saldo agregat masih mencerminkan seluruh transaksi dan dapat mengungkap aktivitas secara tidak langsung.

Verifikasi terakhir: 827 tes pada 179 file lulus; typecheck, build produksi, lint, dan pemeriksaan arsitektur lulus. Lint memiliki 17 peringatan yang sudah ada. Lima tes browser lulus memakai database terisolasi r33, termasuk dialog terbuka, dependensi tamu dan Katering, serta kontrol superadmin. Pemeriksaan DNS domain memiliki perlindungan untuk hasil yang selesai tidak berurutan. Sistem rilis bertahap, pengelolaan keanggotaan menyeluruh, dan peninjauan seluruh sidebar tetap menjadi pekerjaan terpisah sebagaimana dicatat di atas.

## Serah terima poin 2 â€” 30 Oktober 2026

Pengguna meminta melanjutkan poin 2, lalu meminta melanjutkannya pada sesi baru. Pekerjaan rilis bertahap **belum dinyatakan selesai**. Jangan menghapus atau me-reset perubahan yang belum di-commit; workspace berisi pekerjaan sebelumnya dan pekerjaan baru.

Implementasi saat ini: `feature-rollout.ts`, `feature-rollout-validation.ts`, `feature-rollout-dependencies.ts`, API `/api/superadmin/feature-rollout`, panel `feature-rollout-*`, dan integrasi konteks workspace/paket ke pemeriksaan ketersediaan pada halaman serta layanan. Fitur mencakup draf, sasaran kelompok/paket/workspace, pratinjau sebelum/sesudah, peringatan dependensi Keuangan dan Tamu/Katering, publikasi langsung/terjadwal, riwayat, pemeriksaan revisi dan rollback. Jadwal dievaluasi saat aplikasi membaca konfigurasi. Pengaturan tersimpan di SQLite aplikasi; database terpisah antar instance belum disinkronkan dan tidak boleh diklaim siap untuk deployment multi-instance. Lihat `Menuju_Akad_V2/docs/superpowers/specs/2026-10-30-feature-rollout-design.md` dan `docs/superpowers/plans/2026-10-30-feature-rollout.md`.

Verifikasi: 834 tes unit lulus pada run terakhir. Review independen menemukan peringatan dependensi Tamu/Katering yang hilang; sudah diperbaiki dan tesnya lulus. Regresi browser `superadmin-controls.spec.ts` lulus pada r34. Tes baru `tests/e2e/feature-rollout.spec.ts` pertama menemukan bug alasan terhapus saat pemuatan; panel diperbaiki agar formulir muncul setelah data siap dan isian diinisialisasi secara sinkron, serta kontrol dinonaktifkan selama penyimpanan. Tes berikutnya r35 membuktikan draf tersimpan tetapi gagal karena locator `getByLabel("Kelompok")`; snapshot menunjukkan combobox bernama Kelompok. Skrip baru saja diubah memakai `getByRole("combobox", { name: "Kelompok", exact: true })` serta `browser.newContext({ baseURL })`; **perubahan tes ini belum dijalankan**. Gunakan database isolasi baru r36 atau nomor lain yang belum ada; lihat perintah r22 di atas, ubah nama database, dan jalankan `tests/e2e/feature-rollout.spec.ts`.

Build produksi terakhir berhasil sebelum refaktor kecil memindahkan komponen pemuatan ke `feature-rollout-targets.tsx` untuk memenuhi batas 200 baris; pemeriksaan arsitektur setelah refaktor lulus. Jalankan kembali `npm run lint`, `npm run build`, dan tes browser pada build terbaru; jika tes browser gagal, baca error-context dan perbaiki penyebab. Tes terarah `feature-rollout.test.ts` juga memverifikasi jadwal menjadi aktif pada waktu yang ditentukan dan rollback membatalkan jadwal lama. Jangan mengklaim lint/build/browser terbaru lulus sebelum dijalankan kembali.

Poin 2 masih memiliki keterbatasan nyata: tidak ada sinkronisasi database multi-instance, pratinjau sasaran/sakelar tidak mengklaim mengevaluasi seluruh hak paket atau izin tindakan, dan pengujian menyeluruh lintas role/paket/workspace masih perlu ditambah. Jangan mem-push atau menghapus perubahan pengguna tanpa instruksi.

## Penyelesaian poin 2 - 30 Oktober 2026

Rilis bertahap telah diimplementasikan untuk database aplikasi: draf, sasaran kelompok/paket/workspace, pratinjau sasaran dan sakelar kelompok, peringatan dependensi, publikasi langsung atau terjadwal, riwayat, konflik revisi, dan rollback. Jadwal dievaluasi saat konfigurasi dibaca. Hak paket, keanggotaan dan pemeliharaan tetap berlaku. Pratinjau tidak menghitung seluruh izin tindakan atau hak paket; panel menjelaskan batas ini. SQLite terpisah antar-instance tidak tersinkronisasi; diperlukan penyimpanan bersama sebelum deployment multi-instance. Ini batas arsitektur yang dipilih, bukan dukungan multi-instance.

Tes browser baru feature-rollout-audiences.spec.ts memeriksa pemilik Premium, pasangan yang memakai paket dan workspace pemilik, workspace lain, tamu, pratinjau, akses baca/tulis langsung, penolakan revisi lama, dan rollback. Tes feature-rollout.spec.ts diperbaiki agar menunggu respons publikasi dan rollback, bukan nomor versi yang mungkin sudah ada dari tes lain. Keduanya lulus bersama pada database terisolasi r40. Regresi superadmin-controls.spec.ts dan pencil-sidebar.spec.ts lulus 5 tes pada r37. Sebelumnya build produksi dan typecheck lulus; 834 tes unit pada 182 file lulus; lint dan arsitektur lulus dengan 17 peringatan lama. Playwright memerlukan akses di luar sandbox karena spawn EPERM di sandbox.

Poin 2 selesai sesuai spesifikasi penyimpanan satu database; jangan menyatakan dukungan database terpisah multi-instance. Poin pengelolaan keanggotaan dan peninjauan menyeluruh sidebar masih terpisah. Perubahan belum di-commit atau di-push; jangan hapus atau reset pekerjaan pengguna.
Pemeriksaan akhir setelah perubahan tes: npm test 834/834 pada 182 file, typecheck, lint dan arsitektur lulus; lint tetap 17 peringatan lama. Build produksi lulus sebelum perubahan yang hanya menyentuh tes browser.

## Lanjutan poin 3 - administrasi keanggotaan

Panel Pengguna sekarang memiliki dialog Keanggotaan: melihat workspace dan role owner/partner, melihat akun pasangan, serta mencabut pasangan dengan alasan dan konfirmasi. API hanya untuk superadmin dan memeriksa origin. Pencabutan memeriksa pasangan dan revisi workspace, menghapus undangan terkait, mempertahankan data dan pemilik, dan mencatat aktor, sasaran, alasan dan waktu secara atomik di database workspace. Riwayat pencabutan tersedia dalam dialog. Role akun customer/admin/superadmin tetap terpisah dari role workspace owner/partner. Pengguna yang dicabut kehilangan akses server ke workspace tersebut; sesi akun lain tetap ada.

Tes browser admin-membership.spec.ts lulus pada database terisolasi r41; tes layanan dan API memeriksa akses, konflik, perlindungan pemilik dan rollback saat audit gagal. Build produksi dan lint/arsitektur lulus; lint memiliki 17 peringatan lama. Lihat docs/superpowers/plans/2026-10-30-workspace-administration.md.

Poin 3 belum mencakup transfer kepemilikan, penambahan anggota oleh superadmin, role baru, atau matriks izin aksi menyeluruh. Kebijakan untuk operasi itu belum ditetapkan; jangan menyatakan seluruh administrasi keanggotaan selesai. Jangan commit, push, hapus, atau reset pekerjaan pengguna tanpa instruksi.
Pemeriksaan akhir poin 3: 836 tes unit pada 184 file lulus, typecheck lulus setelah build selesai, dan tes browser r41 lulus. Perubahan masih belum di-commit atau di-push.

## Poin 3 - pembatalan undangan dan kebijakan akses

Superadmin dapat membatalkan undangan pasangan yang masih aktif melalui dialog Keanggotaan dengan alasan dan konfirmasi. Pemeriksaan hash undangan mencegah pembatalan undangan baru oleh formulir yang usang; penghapusan undangan dan audit terjadi dalam satu transaksi. Pengujian juga memeriksa rollback jika audit gagal, pembatasan partner dan penolakan nonanggota. Dokumen docs/workspace-access-policy.md merangkum kebijakan server saat ini, termasuk perbedaan role identitas dan role workspace.

Verifikasi terbaru: 839 tes unit pada 184 file lulus; lima tes layanan/API terarah lulus; lint, arsitektur, typecheck dan build produksi lulus (17 peringatan lint lama); browser admin-membership.spec.ts lulus menggunakan database terisolasi r42, termasuk pembatalan undangan. Perubahan belum di-commit atau di-push.

Poin 3 belum dapat dinyatakan menyeluruh: keputusan produk tentang perpindahan kepemilikan dan dampaknya pada paket/data telah diminta dan belum diterima; transfer tidak diimplementasikan. Penambahan pasangan tetap memerlukan undangan dan penerimaan oleh pasangan; role workspace tambahan dan matriks izin yang dapat dikonfigurasi belum ada. Jangan menganggap permintaan keputusan yang belum dijawab sebagai persetujuan.