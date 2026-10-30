# Ketersediaan fitur berdasarkan kelompok pengguna

1. Daftarkan fitur yang memang memiliki jalur akses yang dapat dikendalikan, dengan status bawaan tersedia agar pengguna lama tidak kehilangan akses.
2. Simpan pengaturan per tamu, pemilik, dan pasangan dengan versi, alasan, dan riwayat; tolak perubahan bersamaan yang usang.
3. Sediakan API dan panel superadmin yang menjelaskan dampak pengaturan dan memungkinkan pemulihan.
4. Terapkan kebijakan pada navigasi, halaman langsung, dan operasi server yang relevan. Pertahankan undangan publik, RSVP, dan transaksi yang sudah berjalan.
5. Uji hak akses, perubahan bersamaan, jalur langsung dan API, data lama, sesi percobaan, serta skenario lintas fitur sebelum menambahkan fitur lain ke katalog.

Pengaturan ini berbeda dari izin akun, paket, dan pemeliharaan. Menyembunyikan tautan saja tidak dianggap membatasi akses. Guest menyimpan data percobaan di browser, sehingga kebijakan server tidak dapat menghapus atau mengamankan data yang sudah dimiliki pengguna di perangkatnya.

Fitur yang diterapkan: Tugas, Perlengkapan Darurat, Kalender, Inspirasi & moodboard, Dokumen KUA, Rundown, Pengelolaan Tamu, Keuangan, Seserahan, Katering, Vendor, Bantuan, Custom Domain, Ringkasan Cetak, Editor Undangan, dan Studio visual. Kebijakan mencakup jalur akses dan penyimpanan yang relevan. Undangan terbit, RSVP publik, pembayaran, dan penanganan pesanan yang sudah dibuat tetap berjalan. Pengaturan Custom Domain tetap tersimpan ketika akses dibatasi; pemeriksaan DNS yang selesai terlambat tidak boleh menimpa pemeriksaan yang lebih baru.

Dashboard dan halaman fitur memperbarui status secara berkala dan ketika jendela kembali aktif; operasi server memeriksa status pada setiap permintaan. Halaman yang sudah terbuka menyembunyikan kontennya saat akses dicabut tanpa membuang draf yang masih ada di halaman. Fitur yang berhubungan dengan data transaksi atau undangan publik memerlukan pengujian dependensi tersendiri sebelum dapat dibatasi.

Ketika Seserahan atau Katering dibatasi, anggaran dan riwayat yang terkait tidak ditampilkan; saldo tetap dihitung dari seluruh transaksi dan diberi penjelasan. Nilai agregat dapat mencerminkan aktivitas yang disembunyikan. Perubahan anggaran yang masih terlihat mempertahankan data yang disembunyikan, termasuk alokasi dan retry transaksi. Pengaturan lama yang belum didukung dinetralkan sekali dengan audit sebelum kontrol terkait diaktifkan.
