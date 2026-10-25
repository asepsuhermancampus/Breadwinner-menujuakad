# Dashboard bersama dan trial tamu

Tanggal: 21 Oktober 2026. Status: disetujui pengguna dan selesai diimplementasikan; verifikasi akhir 22 Oktober 2026.

## Tujuan

Semua pengunjung dapat membuka dashboard dengan sidebar SaaS yang sama. Tamu dapat mencoba fitur Free menggunakan data browser, lalu diminta masuk setelah sepuluh perubahan berhasil. Akun login menggunakan data akun dan hak paket sebenarnya. Dashboard tidak lagi menyamarkan data contoh sebagai data pengguna.

## Pilihan pendekatan

1. Menambah penghitung pada halaman preview: lebih kecil, tetapi mempertahankan dua dashboard dan berisiko memberi akses lewat halaman preview yang belum dilindungi.
2. Memakai komponen dashboard bersama dengan penyimpanan browser atau akun sesuai sesi: direkomendasikan; tampilan dan pemeriksaan fitur konsisten, sementara penyimpanan tetap terpisah.
3. Membuat akun tamu di server: dapat membatasi trial lintas perangkat, tetapi menulis database sebelum login dan bertentangan dengan kebutuhan pengguna.

Gunakan pilihan kedua. Tata letak sidebar yang ada dapat dipakai kembali setelah identitas, badge, tautan dan tindakan contoh diganti dengan konteks nyata.

## Akses dan tampilan

| Status         | Label paket                            | Fitur Free                                                | Fitur paket lebih tinggi         | Penyimpanan  |
| -------------- | -------------------------------------- | --------------------------------------------------------- | -------------------------------- | ------------ |
| Belum login    | Free, dengan keterangan Mode percobaan | Maksimal 10 perubahan berhasil secara total               | Terlihat dan terkunci            | Browser saja |
| Login Free     | Free                                   | Tanpa batas 10 perubahan trial; batas paket tetap berlaku | Terlihat dan terkunci            | Data akun    |
| Login Premium  | Premium                                | Aktif                                                     | Premium aktif, Lifetime terkunci | Data akun    |
| Login Lifetime | Lifetime                               | Aktif                                                     | Semua hak Lifetime aktif         | Data akun    |

- Sidebar tersedia di desktop dan drawer di ponsel, menampilkan menu aktif dan kunci fitur berbayar.
- Nama paket yang mudah dibaca ada pada identitas dashboard/sidebar, termasuk Free. Identitas tamu memakai nama netral, bukan pasangan contoh.
- Tamu melihat sisa trial, misalnya “Sisa 7 dari 10 percobaan”, serta keterangan bahwa datanya tersimpan di browser ini.
- Navbar landing tamu: **Masuk** dan **Coba dashboard gratis**. Keduanya menuju login dan dashboard masing-masing.
- Navbar landing akun login: hanya tombol akun **Dashboard**, selain navigasi bagian landing yang ada.
- Status navbar berasal dari sesi Auth.js sesungguhnya. Jangan menampilkan keadaan tamu yang menyesatkan selama sesi sedang dimuat.
- Tombol **Keluar** berada di bagian bawah sidebar untuk akun login; gunakan sign-out Auth.js. Untuk tamu, area tersebut berisi **Masuk untuk melanjutkan**.
- CTA Free yang mengajak mencoba dashboard diarahkan ke dashboard, tanpa mewajibkan pendaftaran lebih dahulu.

## Fitur dan jalur langsung

- Trial mencakup fitur Free yang sudah mempunyai alur data pelanggan: checklist tugas, dokumen/KUA dasar, tamu sampai 100 data, anggaran sederhana, dan satu undangan dasar.
- Studio visual, moodboard dan PDF terkunci bagi tamu/Free. Multi-undangan, custom domain dan prioritas bantuan mengikuti hak Lifetime. Penguncian berlaku juga pada URL langsung dan command palette.
- Menu lain tetap dapat dilihat. Halaman yang saat ini hanya berupa contoh, seperti kalender, rundown, seserahan dan emergency, harus diberi keterangan contoh/pratinjau yang jujur; jangan menyediakan jalur perubahan data yang melewati penghitung trial. Membuka halaman contoh tidak mengurangi kuota.
- Catering dan menu yang belum tersedia tetap diberi keterangan **Segera tersedia**, bukan diklaim sebagai fitur paket yang sudah berfungsi.
- Tidak menambah hak paket baru atau menjanjikan penyimpanan server untuk fitur yang belum memiliki implementasi pelanggan.
- Publikasi undangan, pengiriman pesan, undangan anggota, bantuan pelanggan dan tindakan eksternal lain memerlukan login serta pemeriksaan hak yang sesuai. Tamu hanya dapat menyusun dan melihat draf undangan lokal.

## Aturan sepuluh percobaan

1. Satu percobaan adalah satu perubahan valid yang berhasil dikomit: menambah, mengubah, menghapus atau mengubah status satu entitas melalui satu tindakan pengguna.
2. Mengetik belum dihitung. Formulir perlu tindakan simpan yang jelas; autosave setiap ketikan tidak boleh menghabiskan kuota trial. Satu formulir dengan beberapa kolom tetap satu percobaan ketika disimpan.
3. Membuka menu, melihat fitur, mencari, memfilter, menutup dialog, validasi gagal dan menyimpan data identik tidak dihitung.
4. Kuota bersifat global untuk seluruh fitur Free: misalnya 4 perubahan tugas + 3 tamu + 3 anggaran menghabiskan sepuluh, bukan sepuluh per menu.
5. Perubahan kesepuluh berhasil dan tetap tersedia. Percobaan perubahan kesebelas ditolak sebelum data lokal berubah; tampilkan dialog login dengan tautan kembali ke halaman terkait. Pengunjung tetap boleh membaca data dan menjelajah dashboard.
6. Data dan penghitung bertahan setelah reload serta perpindahan halaman, disinkronkan antar-tab pada browser yang sama. Komit lintas tab harus diserialisasi agar dua tab tidak melebihi sepuluh.
7. Data dan penghitung disimpan sebagai satu snapshot berversi. Kegagalan penyimpanan browser tidak boleh dianggap sukses atau menghabiskan kuota. Data rusak tidak boleh menyebabkan crash atau perubahan server.
8. Batas ini adalah trial browser; membersihkan penyimpanan browser dapat meresetnya. Tidak membuat identitas server/fingerprint untuk membatasi tamu.

## Pemisahan data dan autentikasi

- Tamu tidak membuat workspace server dan tidak memanggil API mutasi resource pelanggan. Tidak ada penulisan database untuk input trial.
- Data browser tamu memakai namespace terpisah dari data akun. Setelah login, dashboard mengambil data akun dan penghitung trial tidak membatasi pengguna lagi.
- Data trial tidak otomatis diimpor ke akun. Ini asumsi untuk mencegah data contoh atau data browser bersama mencampuri data pelanggan; impor dapat menjadi pekerjaan terpisah jika diminta.
- Logout membersihkan tampilan/data akun yang dicache dan kembali ke pengalaman tamu. Data akun tidak disalin ke penyimpanan trial.
- Otorisasi server untuk akun dan capability paket tetap berlaku; perubahan tampilan tidak menggantikannya.
- Masa aktif, pengingat, kredit upgrade, checkout QRIS dan panduan fitur setelah pembelian tetap mengikuti implementasi yang sudah ada.

## Temuan yang perlu diperbaiki bersamaan

- Shell preview mengandung label Premium, nama pasangan, tanggal dan statistik contoh. Ganti dengan konteks pengguna/tamu dan keadaan kosong yang akurat.
- Halaman akun paket menggunakan `LandingPlanCard` tanpa `PlanPurchaseProvider`. Tambahkan provider yang tepat agar halaman paket tidak gagal saat dibuka dari sidebar.
- Halaman keamanan akun harus menyebut tombol Keluar yang benar di sidebar, bukan panel Google yang tidak ada.

## Verifikasi penerimaan

- Uji domain trial: kuota global, perubahan kesepuluh/kesebelas, perubahan identik, validasi gagal, kegagalan storage, reload dan konkurensi dua tab.
- Uji browser tamu: sidebar lengkap, Free dan pengunci terlihat, input Free lokal bertahan reload, tidak ada request mutasi API pelanggan, tidak dapat membuka fitur berbayar lewat URL langsung.
- Uji browser dengan sepuluh perubahan tersebar di beberapa fitur: perubahan berikutnya meminta login tanpa kehilangan sepuluh perubahan sebelumnya.
- Uji akun Free: lebih dari sepuluh perubahan dapat tersimpan melalui API akun, fitur berbayar tetap terkunci dan batas 100 tamu/undangan dasar tetap berlaku.
- Uji akun Premium/Lifetime, status navbar, label paket, sidebar mobile, logout asli, halaman akun paket dan panduan fitur setelah pembayaran.
- Jalankan pemeriksaan TypeScript, lint/arsitektur, build serta regresi pembayaran yang relevan. Pertahankan tes regresi permanen; bersihkan artefak sementara yang dibuat untuk verifikasi.

## Batas pekerjaan

Tidak mengubah harga, diskon, kode unik, aturan kredit upgrade atau pilihan penyesuaian QRIS yang masih menunggu jawaban. Tidak commit, push atau membuat worktree. Tidak menghapus data pembayaran/pengguna.
