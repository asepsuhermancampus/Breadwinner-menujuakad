# Dashboard fungsional dan trial per fitur

Tanggal: 22 Oktober 2026.
Status: spesifikasi dan rencana disetujui pengguna; implementasi diterapkan langsung pada aplikasi lokal. Verifikasi akhir dicatat pada rencana implementasi.

## Tujuan dan keputusan pengguna

Terapkan perubahan pada aplikasi yang benar-benar digunakan di web lokal. Tidak membuat mockup, situs demo, atau implementasi sementara yang nanti harus dipindahkan lagi. Seluruh halaman produk harus menjalankan tindakan nyata sesuai identitas pengguna dan hak paket. Mengganti teks pratinjau saja tidak memenuhi kebutuhan ini.

Dokumen ini menggantikan ketentuan trial global sepuluh kali, penguncian trial fitur berbayar, dan placeholder pelanggan pada spesifikasi 21 Oktober. Aturan harga, langganan, pembayaran, kredit upgrade, dan data akun yang tidak disebutkan tetap berlaku.

## Pendekatan

1. Mengaktifkan komponen contoh secara langsung: sedikit perubahan awal, tetapi membawa data pasangan contoh dan keberhasilan simulasi. Ditolak.
2. Memakai halaman dan komponen produk yang sama, dengan adapter browser untuk tamu serta penyimpanan server untuk akun. Dipilih: pekerjaan diterapkan sekali pada aplikasi nyata, dan batas akses tetap jelas.
3. Membuat akun sementara server untuk tamu: memudahkan penggunaan API yang sama, tetapi bertentangan dengan kebutuhan sebelumnya agar input tamu tidak masuk database. Ditolak.

## Sidebar, sesi, dan akses

- Urutan dan menu sidebar sama untuk tamu, Free, Premium, dan Lifetime, termasuk tampilan mobile. Tidak ada tulisan Terkunci atau Segera pada sidebar.
- Label paket tetap Free, Premium, atau Lifetime sesuai keadaan sebenarnya. Tamu menggunakan Free dengan keterangan percobaan dan penyimpanan browser.
- Tamu dapat menggunakan editor fitur semua tier, dengan batas trial per fitur. Ini bukan pemberian langganan berbayar atau hak publikasi server.
- Akun login tetap memakai hak paket sebenarnya. Untuk akun Free yang membuka fitur berbayar, halaman menjelaskan kebutuhan paket dan menawarkan upgrade; menyembunyikan tulisan pada sidebar tidak melemahkan pemeriksaan API.
- Navbar sesi, logout, isolasi data tamu/akun, dan sinkronisasi perubahan sesi tetap bekerja. Tidak mengimpor data tamu otomatis ke akun.

## Perhitungan trial

- Hapus batas sepuluh perubahan global. Setiap fitur memiliki lima perubahan berhasil sendiri-sendiri: Tugas, Tamu & RSVP, Anggaran, Undangan, Studio visual, Moodboard, Kalender, Rundown, Seserahan, Emergency, dan Catering.
- Simpan formulir, tambah, edit, hapus, serta perubahan status yang valid adalah satu tindakan. Satu simpan dengan beberapa kolom tetap satu tindakan. Kelima diterima; keenam ditolak sebelum mengubah data, dan membuka dialog daftar/login.
- Membuka halaman, mengetik, mencari, memfilter, kegagalan validasi, data identik, dan kegagalan penyimpanan tidak menghabiskan percobaan. Batasi simpan eksplisit, bukan setiap ketikan.
- Wedding kit/PDF menggunakan lima ekspor berhasil. Melihat isi hasil dokumen tidak menghabiskan jatah. Jangan menghitung ulang pada refresh.
- KUA memakai aturan khusus lima checklist aktif, bukan lima perubahan seumur trial. Tambah/edit/hapus judul atau catatan tidak menghabiskan penghitung fitur lain. Membatalkan centang membebaskan slot. Pencetangan keenam ditolak dan membuka dialog login.
- Data dan penghitung tersimpan bersama dalam snapshot browser berversi, tersinkron antartab dengan komit atomik. Konflik tidak boleh menimpa perubahan pengguna lain atau menghilangkan isi formulir.
- Migrasi snapshot v1 mempertahankan data, menyimpan salinan lama, dan memulai penghitung per fitur dari nol: riwayat v1 tidak cukup untuk mengetahui pemakaian per fitur. Jangan menebak pemakaian dari jumlah baris. Data rusak tidak dihapus diam-diam.
- Jika data KUA lama memiliki lebih dari lima centang, pertahankan seluruh data; tamu boleh membatalkan centang, tetapi penambahan centang baru ditolak sampai jumlahnya di bawah lima.
- Browser tanpa penyimpanan/locking yang diperlukan menampilkan kegagalan yang jujur dan pilihan login. Tidak melaporkan simpan berhasil apabila sebenarnya gagal.

## Template dokumen KUA

- Dokumen KUA langsung berisi daftar persiapan siap pakai untuk semua pengguna, tanpa nama pasangan, status selesai, atau catatan contoh pribadi.
- Template adalah daftar kerja yang dapat disesuaikan dengan KUA setempat; bukan klaim bahwa semua persyaratan hukum selalu sama. Jika memasukkan nama formulir/persyaratan resmi, verifikasi sumber primer Kemenag saat implementasi.
- Tersedia tambah, baca, edit judul/catatan, hapus, dan centang status. Batas aktif lima hanya untuk tamu; akun login mengikuti penyimpanan akun tanpa batas trial tersebut.
- Inisialisasi default dilakukan sekali per workspace/penyimpanan tamu dengan penanda versi template. Workspace lama yang belum pernah memiliki dokumen mendapat template, tetapi daftar yang sengaja dikosongkan setelah inisialisasi tidak diisi lagi setiap reload.
- Data dokumen lama dipertahankan. Tidak menambahkan template duplikat pada setiap kunjungan atau tab.

## Halaman produk yang menggantikan placeholder

| Menu            | Perilaku produk minimum yang dapat dipakai                                                                                                                    |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kalender        | Tambah/edit/hapus acara bertanggal dan waktu; navigasi bulan; tampilkan acara yang tersimpan.                                                                 |
| Rundown         | Tambah/edit/hapus urutan kegiatan, waktu, penanggung jawab, dan catatan; urutkan secara konsisten.                                                            |
| Seserahan       | Daftar barang, jumlah, perkiraan biaya, dan status siap; CRUD dan total berdasarkan data pengguna.                                                            |
| Emergency       | Checklist perlengkapan dan kontak penting; CRUD dan status siap, tanpa kontak contoh pribadi.                                                                 |
| Catering        | Rencana menu, porsi, biaya per porsi, dan catatan; CRUD serta total porsi/biaya. Ini pengelolaan rencana pelanggan, bukan klaim pesanan vendor telah dikirim. |
| Moodboard       | Tambah/edit/hapus inspirasi yang tersimpan pada adapter sesuai identitas.                                                                                     |
| Studio visual   | Editor yang sama dengan dokumen milik pengguna/browser; simpan nyata, tanpa proyek atau versi riwayat palsu.                                                  |
| Wedding kit/PDF | Hasil dokumen dari data pengguna yang benar-benar bisa diunduh/dicetak; tanpa angka atau identitas fixture.                                                   |

Semua fitur baru memiliki validasi domain dan penyimpanan akun server dengan pemeriksaan membership, hak paket, serta revision. Menu perencanaan umum mengikuti akses Free; Studio, Moodboard, PDF, dan kemampuan tier lainnya mempertahankan katalog paket yang sudah berlaku untuk akun login.

## Makna tidak ada pratinjau di seluruh web

- Audit seluruh route produk yang dapat dicapai, bukan hanya dashboard. Hilangkan halaman dummy, keberhasilan simulasi, dan panel internal yang muncul di alur pelanggan. Hubungkan tindakan produk ke penyimpanan/layanan yang sesungguhnya.
- Hasil undangan di editor merupakan render langsung dokumen yang sedang dikerjakan. Bila perlu dipisahkan untuk membaca hasil, gunakan tindakan Lihat hasil dengan data dokumen nyata; tidak ada salinan demo atau konten RSVP palsu.
- Publikasi undangan, RSVP publik, checkout, status pembayaran, webhook, dan aktivasi paket tetap merupakan alur nyata yang sudah ada. Tidak mengganti QRIS dengan QR atau status bayar palsu.
- Trial tamu menghasilkan perubahan browser nyata dan dokumen lokal nyata; tidak mempublikasikan data anonim atau mengirim pesan tanpa akun. Tindakan yang memerlukan akun membuka login secara jelas.
- Simulasi domain/DNS, WhatsApp/email, pembayaran manual, administrasi, dan vendor yang ditemukan harus diaudit. Tindakan yang memiliki integrasi dikaitkan dengan integrasi sebenarnya. Jika integrasi belum tersedia, jangan menampilkan tombol yang mengaku sukses; jelaskan kebutuhan koneksi/konfigurasi dan catat kebutuhan spesifik kepada pengguna. Jangan menyamarkan ini dengan penggantian label.
- Route development internal tidak boleh menjadi jalur produk pelanggan atau melewati autentikasi. Tidak memerlukan penghapusan helper/test bernama preview yang hanya dipakai untuk pengujian dan tidak menampilkan halaman dummy pada pengguna.
- Jangan menghapus fasilitas render/editor yang benar-benar berfungsi hanya karena nama internalnya memakai kata preview. Ukur penerimaan dari fungsi dan data nyata, bukan penggantian nama file semata.

## Klaim diskon dan pemeriksaan asal

- Status autentikasi diverifikasi dari sesi server. Tamu yang mengklik Klaim diskon tambahan langsung mendapat dialog daftar/login sebelum request reservasi dikirim; tidak membuat guest intent untuk klaim baru.
- API menolak klaim diskon tamu meskipun dipanggil langsung. Jangan hanya mengandalkan tombol frontend. Mekanisme checkout nonklaim dan pemulihan pesanan lama tidak dihapus tanpa kebutuhan.
- Dialog memiliki CTA masuk/daftar dan batal, dengan tujuan kembali lokal yang divalidasi. Setelah kembali pengguna dapat mengklaim paket yang dipilih; tidak membeli atau menerbitkan QR otomatis.
- Telusuri perbedaan Origin versus URL request pada lingkungan lokal sebelum mengubah guard. Uji alamat localhost dan 127.0.0.1; jika proxy meneruskan host berbeda, gunakan konfigurasi host tepercaya yang eksplisit. Jangan mempercayai sembarang header forwarded, mengizinkan wildcard, atau menonaktifkan guard.
- Pesan Akses lintas-asal ditolak tidak menjadi hasil normal klik klaim tamu. Proteksi tetap menolak request lintas asal yang benar-benar tidak sah.

## Verifikasi penerimaan

1. Lima simpan Tugas tidak menghabiskan lima simpan Anggaran; keenam masing-masing membuka login tanpa kehilangan data. Uji reload, dua tab, storage gagal, dan draft konflik.
2. Template KUA langsung terlihat untuk tamu/Free/Premium/Lifetime; CRUD bertahan reload; centang kelima diterima, keenam ditolak, batal centang memungkinkan pengganti. Template yang dihapus tidak muncul kembali.
3. Seluruh menu sidebar dapat dibuka tamu dan menjalankan tindakan lokal yang sesuai. Tidak ada mutasi resource akun oleh tamu. Akun menyimpan ke workspace sebenarnya dan hak server tetap berlaku.
4. Kalender/Rundown/Seserahan/Emergency/Catering mempunyai CRUD yang bertahan reload untuk akun, bukan sekadar UI yang berubah sampai halaman ditutup.
5. Klaim diskon tamu membuka dialog tanpa reservasi, API klaim menolak tamu, akun login tetap bisa klaim/berganti paket. Uji origin sah dan tidak sah.
6. Audit interaksi seluruh route produk yang reachable; tidak ada keberhasilan palsu, identitas fixture, atau placeholder menggantikan fungsi. Daftar integrasi yang membutuhkan konfigurasi dilaporkan secara spesifik bila ditemukan.
7. Jalankan unit/domain, browser customer, regresi autentikasi/subscription/payment terkait, TypeScript, lint/arsitektur, format, dan build. Pertahankan tes regresi permanen, bersihkan artefak sementara saja.
8. Jalankan web lokal agar pengguna menilai implementasi yang sama langsung. Tidak commit, push, menghapus data pembayaran, atau menulis ulang perubahan pengguna yang tidak terkait.

## Tinjauan spesifikasi

Ruang lingkup memperluas permintaan sebelumnya dari membuka trial menjadi menyelesaikan halaman produk yang masih dummy. Tidak menetapkan biaya layanan eksternal atau mengklaim koneksi yang belum tersedia. Rancangan percakapan telah disetujui pada 22 Oktober; persetujuan dokumen ini belum diterima. Langkah berikutnya adalah tinjauan dokumen, kemudian rencana implementasi sesuai workflow yang berlaku.
