# Kebijakan akses akun dan workspace saat ini

Role identitas (`customer`, `admin`, `superadmin`) terpisah dari keanggotaan workspace (`owner`, `partner`). Menjadi admin atau superadmin tidak menjadikan akun anggota semua workspace. Keanggotaan diperiksa server untuk setiap workspace dan tidak ditentukan oleh menu atau pilihan di browser.

| Tindakan | Kebijakan yang diterapkan |
| --- | --- |
| Undang atau cabut pasangan | Pemilik workspace; undangan diterima oleh akun penerima. Superadmin dapat mencabut pasangan atau membatalkan undangan aktif dengan alasan dan audit. |
| Memilih atau membaca workspace | Hanya pemilik atau pasangan yang tercatat. Setelah pencabutan, permintaan langsung ke workspace itu ditolak; sesi akun tidak otomatis dihapus. |
| Data perencanaan dan ekspor | Anggota yang berhak, dibatasi paket pemilik, ketersediaan fitur, pemeliharaan dan validasi tindakan. Keuangan menerapkan pembatasan aktor/sisi untuk perintah tertentu. |
| Domain undangan | Pemilik, dengan hak paket dan ketersediaan fitur yang sesuai. |
| Akun dan role identitas | Superadmin dapat mengubah status atau role customer/admin dengan alasan, audit dan pencabutan sesi; akun superadmin dilindungi dari perubahan di panel tersebut. |
| Operasi bantuan | Admin dan superadmin dapat mengakses operasi bantuan yang disediakan; ini bukan hak untuk masuk ke semua workspace. |

Paket mengikuti pemilik workspace, termasuk ketika pasangan mengaksesnya. Superadmin tidak dapat langsung menambahkan pasangan, memindahkan kepemilikan, atau membuat role workspace baru lewat panel ini. Pendaftaran pasangan tetap melalui undangan yang diterima pengguna. Kebijakan perpindahan pemilik dan role tambahan belum ditetapkan; tidak ada klaim bahwa seluruh izin tindakan sudah menjadi matriks yang dapat dikonfigurasi. Riwayat tindakan superadmin dan data aplikasi disimpan di SQLite aplikasi, sehingga database terpisah antar-instance tidak tersinkronisasi.
