# Pembatalan pesanan, perpindahan klaim, dan upgrade langganan

## Tujuan dan status

Memudahkan pelanggan mencoba klaim antar paket dan bertahap menuju Lifetime tanpa membayar ulang seluruh harga selama periode promosi upgrade. Harga card, QRIS, dan akses yang diberikan harus mengikuti satu perhitungan server.

Rancangan ini melanjutkan checkout QRIS dan entitlement yang sudah ada. Belum diimplementasikan. Tidak ada perubahan credential, tagihan nyata, commit, atau push pada tahap rancangan.

## Aturan dari pengguna

- Checkout memiliki tombol Batalkan pesanan.
- Klaim diskon Premium dapat dipindahkan ke Lifetime dan sebaliknya setelah konfirmasi.
- Paket aktif ditampilkan grayscale dan berlabel Paket aktif.
- Selama paket berbayar aktif, Free tidak dapat dipilih dan ditampilkan grayscale.
- Upgrade Premium ke Lifetime mengurangi harga Lifetime dengan nilai Premium hanya selama dua bulan pertama sejak Premium aktif.
- Setelah batas tersebut, Lifetime kembali menggunakan harga normal.
- Free tidak memberi kredit upgrade.
- Premium memiliki tanggal berakhir; reminder mulai ditampilkan 15 hari sebelum berakhir.
- Lifetime tidak memiliki tanggal berakhir atau reminder perpanjangan.

## Asumsi yang ditawarkan untuk dua pilihan terbuka

1. Kredit Premium menggunakan nilai paket yang benar-benar dibayar setelah diskon, tanpa kode unik. Alternatif: gunakan harga katalog Premium Rp149.000. Pilihan ini menentukan kebijakan bisnis dan harus jelas sebelum perhitungan produksi diubah.
2. Reminder berupa banner dashboard saat aplikasi dibuka. Email otomatis merupakan alternatif yang memerlukan penyedia email, pengiriman terjadwal, dan deduplikasi pengiriman; belum ada konfigurasi tersebut yang diverifikasi dalam pemeriksaan ini.

Contoh asumsi pertama: Premium dibayar Rp141.550 + kode unik Rp51. Kredit upgrade Rp141.550; harga dasar Lifetime Rp399.000 - Rp141.550 = Rp257.450. QRIS menampilkan total resmi beserta kode uniknya sebelum pelanggan membayar. Pembelian kedua tidak mendapat diskon pengguna baru lagi.

## Alur card dan klaim

- Landing mengambil keadaan langganan milik pengguna yang login dan satu klaim/pesanan aktif milik identitas yang sama.
- Guest tetap dapat klaim; kepemilikan memakai cookie aman yang sudah ada dan diverifikasi lagi ketika login.
- Ketika Premium memiliki klaim aktif lalu pelanggan menekan klaim Lifetime, tampil dialog Perubahan klaim diskon paket: asal, tujuan, dan penjelasan bahwa pesanan lama akan dibatalkan di aplikasi.
- Batal/Tutup dialog mempertahankan klaim dan harga lama tanpa memanggil pembuatan tagihan.
- Konfirmasi merekonsiliasi status tagihan lama. Jika sudah dibayar, pembatalan/perpindahan ditolak dan langganan dimuat ulang.
- Jika belum dibayar, tandai pesanan lama dibatalkan, lalu buat satu reservasi paket tujuan menggunakan nominal dari server.
- Klaim lama hilang dari card asal; card tujuan menampilkan diskon dan total resmi. Tidak menampilkan QR atau langsung berpindah halaman setelah klaim.
- Mekanisme yang sama berlaku berulang dalam dua arah. Klik ganda, tab berbeda, dan permintaan paralel tidak boleh menghasilkan dua pesanan aktif.
- Batas reservasi penyedia tetap diberlakukan. Jika batas tercapai, tampilkan pesan coba lagi; jangan menghapus batas biaya/penyalahgunaan yang ada demi perpindahan tanpa batas.
- Bila pembuatan pengganti gagal atau timeout, pulihkan pesanan pengganti yang sama; jangan menghidupkan ulang tagihan lama atau membuat tagihan ganda.

## Pembatalan dan pembayaran terlambat

- Tombol Batalkan pesanan hanya tersedia untuk pesanan yang belum dibayar dan belum dibatalkan.
- Dialog konfirmasi menjelaskan agar pelanggan tidak membayar QR lama. Setelah berhasil, QR disembunyikan, polling checkout dihentikan, dan tersedia tautan Kembali ke pilihan paket.
- Server memvalidasi pemilik dan origin, memeriksa status resmi, dan menolak pembatalan pesanan yang sudah dibayar.
- Jangan menghapus invoice, signature, nominal, atau riwayat pembatalan; data ini dibutuhkan untuk webhook dan pembayaran terlambat.
- Dokumentasi https://klikqris.com/dokumentasi mengarah ke halaman login saat pemeriksaan. Client yang ada hanya menyediakan create dan status. Dukungan pembatalan QR di gateway belum dapat dipastikan.
- Karena itu, pembatalan yang dapat dirancang sekarang adalah pembatalan pesanan aplikasi. Jangan menyatakan QR di gateway sudah dinonaktifkan tanpa endpoint resmi yang terverifikasi.
- Webhook valid pada QR lama tetap direkonsiliasi dengan penyedia. Pembayaran nyata yang terverifikasi tetap dicatat dan ditangani; tidak diabaikan hanya karena pelanggan menutup atau membatalkan pesanan di aplikasi.
- Ketika pembayaran terlambat mengubah kelayakan pesanan pengganti, jangan menerbitkan QR baru memakai kelayakan lama. Pesanan pengganti perlu diperiksa ulang; kasus dua QR yang telanjur sama-sama dibayar harus terlihat pada catatan pembayaran/bantuan, tanpa menjanjikan refund otomatis.

## Paket aktif dan kredit upgrade

- Pengguna Free dapat membeli Premium atau Lifetime seperti sebelumnya.
- Pengguna Premium: Premium grayscale dengan label Paket aktif dan tanggal berakhir; Free grayscale dengan keterangan Sudah termasuk paket aktif; Lifetime tetap dapat dipilih.
- Pengguna Lifetime: Lifetime grayscale dengan label Paket aktif; Free dan Premium tidak dapat dipilih sebagai penurunan paket, dengan keterangan yang sesuai.
- Kredit upgrade hanya untuk pemilik akun dan grant Premium produksi yang masih aktif; bukan transaksi sandbox, invoice uji, atau langganan workspace pasangan.
- Jendela promosi memakai dua bulan kalender dari waktu aktivasi Premium, memakai helper kalender UTC yang sudah ada. Berlaku sampai batas waktu itu, lalu tidak berlaku setelahnya; tanggal batas ditampilkan dalam waktu lokal yang jelas.
- Perpanjangan Premium tidak mengulang jendela promosi dari aktivasi awal Premium yang masih bersambung. Kredit tidak dijumlahkan dari beberapa pembayaran Premium.
- Lifetime menampilkan harga katalog, kredit Premium, harga setelah kredit, dan batas berlaku kredit. Setelah dua bulan, tampilkan harga normal beserta alasan kredit sudah berakhir.
- Server menyimpan snapshot harga katalog, kredit upgrade, sumber grant, batas kelayakan, diskon pengguna baru, dan total QRIS pada invoice. Browser tidak boleh mengirim angka kredit sendiri.
- Jika klaim/quote dibuat sebelum batas promosi namun baru akan ditampilkan sebagai QR setelah batas lewat, jangan menampilkan harga lama sebagai harga upgrade yang masih tersedia; minta pelanggan mengonfirmasi harga terbaru.
- Jika QR sudah diterbitkan dalam periode yang valid, nominalnya tetap mengikuti snapshot hingga QR resmi kedaluwarsa. Jangan mengubah nominal QR yang sudah diterbitkan.
- Kredit upgrade hanya dipakai untuk Lifetime. Pembelian Premium berikutnya merupakan perpanjangan enam bulan, dengan harga Premium yang berlaku, tanpa kredit upgrade.
- Perpanjangan Premium tersedia dari reminder/halaman akun meskipun card paket yang sedang aktif dinonaktifkan. Pembayaran terverifikasi menambah enam bulan dari akhir masa aktif yang sekarang.

## Reminder

- Banner dashboard muncul apabila Premium masih aktif dan sisa waktu kurang dari atau sama dengan 15 hari.
- Tampilkan tanggal berakhir, sisa hari, tombol Perpanjang Premium, dan pilihan Lifetime dengan perhitungan kelayakan saat itu.
- Karena Premium berlangsung enam bulan dan kredit upgrade hanya dua bulan, reminder menjelang akhir Premium biasanya menawarkan Lifetime dengan harga normal. Jangan menyatakan kredit dua bulan masih berlaku pada reminder tersebut.
- Banner hilang setelah masa aktif diperpanjang keluar dari jendela 15 hari atau setelah Lifetime aktif. Paket yang sudah berakhir mendapat informasi berakhir yang berbeda, bukan countdown negatif.

## Implementasi dan pengujian yang diperlukan

- Migrasi SQLite menjaga seluruh invoice/grant yang ada, foreign key, dan batas harga. Kredit upgrade harus memiliki kolom/metadata tersendiri; jangan menyamarkannya sebagai diskon pengguna baru 5% atau mematikan validasi nominal.
- Tambahkan operasi pembatalan/perpindahan yang terikat pemilik dengan transisi atomik dan perlindungan permintaan paralel.
- Gunakan keadaan checkout bersama pada card agar perpindahan langsung memperbarui kedua card tanpa reload.
- Tambahkan penghitungan harga upgrade server dan tampilan paket aktif di landing; pemuatan gagal tidak boleh diam-diam menawarkan harga upgrade yang belum diverifikasi.
- Unit/integrasi: pembatalan bukan milik sendiri, pembayaran sudah masuk, duplikasi konfirmasi, webhook terlambat, reservasi pengganti timeout, batas dua bulan, akhir bulan/leap year, Free, Lifetime, Premium kedaluwarsa, pengguna lama tanpa diskon baru, migrasi data lama, dan perpanjangan tidak mengulang kredit.
- Browser: batalkan dialog tanpa perubahan; pindah Premium ke Lifetime dan kembali; batalkan checkout menyembunyikan QR; grayscale paket aktif; rincian kredit dan harga normal setelah batas; reminder dalam/luar 15 hari; perpanjangan menghilangkan reminder.
- Jalankan tes terhadap database terpisah dan provider mock. Tidak membuat pembayaran nyata untuk pengujian otomatis.
