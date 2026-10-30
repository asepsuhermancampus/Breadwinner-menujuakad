# Administrasi keanggotaan workspace

Tujuan: superadmin dapat memeriksa keanggotaan akun dan mencabut akses pasangan secara terkontrol. Role identitas dan role workspace tetap berbeda; tidak ada akses otomatis ke isi workspace, perubahan pemilik, atau role baru.

1. Tambahkan layanan audit dan pencabutan pasangan dengan transaksi, alasan, pemeriksaan anggota yang diharapkan dan perlindungan pemilik; uji konflik, pemulihan akses serta data yang dipertahankan.
2. Tambahkan API superadmin dengan autentikasi, pemeriksaan origin dan validasi; uji akses yang ditolak dan respons konflik.
3. Tampilkan keanggotaan dan tindakan di panel akun, dengan konfirmasi dan riwayat audit yang tidak menampilkan isi pelanggan.
4. Jalankan tes terarah, unit, lint, typecheck, build dan regresi browser terisolasi; catat kebijakan role serta batas yang belum tersedia.

Database identitas dan workspace terpisah. Pencabutan dan audit harus atomik di database workspace; validasi superadmin dilakukan pada server. Data pelanggan dan sesi akun tetap ada, tetapi pemeriksaan keanggotaan server harus langsung menolak workspace yang dicabut.
