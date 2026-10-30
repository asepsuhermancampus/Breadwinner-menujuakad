# Analisis sidebar, pengalaman pelanggan, dan pengelolaan fitur oleh superadmin

Tanggal analisis: 28 Oktober 2026  
Objek: kode aplikasi `Menuju_Akad_V2` pada workspace saat ini.  
Tujuan: bahan tinjauan dan pengambilan keputusan produk, bukan spesifikasi implementasi yang sudah disetujui.

## 1. Kesimpulan utama

Aplikasi sudah memiliki fondasi perencanaan yang luas: tugas, dokumen, jadwal, keuangan, tamu, undangan, katering, seserahan, dan ekspor. Yang paling perlu dibenahi terlebih dahulu adalah **kejelasan navigasi dan janji fitur**, bukan menambah banyak menu baru. Nama beberapa menu belum mencerminkan isi, sebagian fitur berada pada halaman lain tanpa jalur sidebar yang jelas, dan konfigurasi navigasi lebih dari satu berpotensi menampilkan informasi yang bertentangan.

Visi superadmin sebagai penyusun fitur bertahap layak dikembangkan, tetapi fondasi yang ditemukan saat ini belum merupakan pengelola fitur menyeluruh. Perlu katalog fitur yang terdaftar, kebijakan akses di server, kontrol rilis dan pemeliharaan, serta audit. Menghilangkan tombol atau card saja tidak cukup untuk membatasi akses ke halaman, API, atau tautan langsung.

**Prioritas yang disarankan:** (1) selaraskan inventaris fitur dan teks yang aktif, (2) rapikan struktur menu dan jalur utama pelanggan, (3) bangun kontrol rilis server dan audit, (4) tambah pengaturan section/card secara bertahap, (5) uji pengguna sebelum memperluas fitur.

## 2. Lingkup dan batas keyakinan

Analisis ini berdasarkan pembacaan sumber navigasi, route, komponen halaman, model data, akses peran, dan kapabilitas paket. Tidak dilakukan wawancara pelanggan, pengujian kegunaan, pemeriksaan menyeluruh di browser, atau audit keamanan/operasional produksi. Temuan yang menyebut kode adalah observasi; rancangan menu, prioritas, dan fitur baru adalah rekomendasi yang perlu divalidasi. Keberadaan komponen tidak otomatis membuktikan setiap aksi telah terhubung sempurna atau aman digunakan dalam produksi. Daftar teks di bawah adalah contoh prioritas, bukan inventaris seluruh kalimat aplikasi.

## 3. Kondisi yang ditemukan

1. Sidebar pelanggan aktif membaca `customerNavigation` dan menampilkan tiga kelompok serta Pengaturan. Meskipun beberapa item memiliki `children`, komponen `CustomerSidebar` hanya merender item induk. Akibatnya Kalender Koordinasi, Perlengkapan Darurat, Moodboard, dan Studio visual tidak otomatis muncul sebagai submenu di sidebar. Sumber: `src/features/customer-workspace/components/customer-navigation.ts`, `customer-sidebar.tsx`.
2. Nama **Rundown & Kepanitiaan** mengarah ke rundown, sedangkan anak yang didefinisikan adalah rundown, kalender, dan perlengkapan darurat. Data rundown memuat nama penanggung jawab, tetapi hal ini belum menunjukkan adanya pengelolaan kepanitiaan lengkap. **Seserahan & Moodboard** juga mengarah langsung ke seserahan dan menggabungkan dua kebutuhan yang berbeda.
3. **Pesanan & Kontrak** mengarah ke `/marketplace/bundles`; anaknya mencantumkan checkout jasa, tetapi route `/checkout/services` saat ini justru memanggil halaman katalog. Nama tersebut dapat menimbulkan harapan bahwa riwayat pesanan dan kontrak tersedia di sana. Verifikasi alur transaksi nyata sebelum memberi label yang menjanjikan fungsi tersebut.
4. **CRM Tamu & WhatsApp** menuju halaman berjudul **Daftar Tamu & RSVP**, yang berisi tab tamu, penempatan meja, pengiriman WA, dan tindak lanjut. Nama sidebar terlalu teknis dan tidak sama dengan nama halaman. `/checkin` memiliki pencatatan jumlah hadir, tetapi tidak menjadi item sidebar tersebut.
5. Konfigurasi lain, `src/features/shell-navigation/config/navigation.ts`, memuat badge dan deskripsi statis seperti angka dokumen/tamu, katering “Segera”, dan Wedding Kit “Maintenance”. Jangan menganggap teks tersebut sebagai status aktual tanpa memeriksa penggunaannya. Route katering aktif memanggil `CustomerPlanningPage` dengan editor katering; route Wedding Kit aktif memanggil tampilan ekspor cetak. Ada komponen pratinjau lama dengan pesan berbeda. Status produksi tetap perlu diuji langsung.
6. Dashboard memuat tautan fitur paket melalui `customer-feature-links.tsx`, sementara pencarian perintah memiliki daftar tersendiri. Kontrol rilis kelak harus mencakup sidebar, dashboard, pencarian, tautan dalam halaman, route, dan API; tidak hanya satu daftar.
7. Mode tamu dan akun menggunakan adapter berbeda untuk sejumlah halaman. Paket Free/Premium/Lifetime memiliki daftar kapabilitas di `src/features/plans/domain/capabilities.ts`; sebagian pembatasan juga diterapkan pada server, misalnya validasi resource dan domain. Ini fondasi hak paket, bukan sistem rilis modular umum.
8. Akun identitas memiliki role `customer`, `admin`, `superadmin`; anggota workspace memiliki `owner` dan `partner`. Ini dua dimensi berbeda. Operator live `/admin` memiliki ringkasan, bantuan, permintaan pelanggan, keamanan akun, dan tautan ulasan khusus superadmin. `/superadmin/reviews` adalah moderasi ulasan. `preview/components/operations-navigation.ts` memuat banyak menu operasi dan label **Modular Feature Studio**, tetapi label itu tidak memiliki `view` di daftar tersebut; tidak ditemukan implementasi kontrol fitur menyeluruh dari pencarian kode yang dilakukan. Jangan menyamakan pratinjau operasi dengan fungsi live.

## 4. Prinsip navigasi yang disarankan

- Gunakan kata yang menjelaskan tujuan pengguna: “Daftar tamu” lebih mudah daripada “CRM”; “Dokumen pernikahan” lebih luas dan jelas daripada jargon internal.
- Nama sidebar dan judul halaman harus selaras. Setiap menu memiliki satu tujuan utama dan satu tindakan utama yang terlihat.
- Maksimal dua tingkat navigasi; kelompokkan berdasarkan kegiatan, bukan struktur teknis. Submenu yang tersedia harus benar-benar dapat dibuka dengan keyboard dan layar kecil.
- Tampilkan angka hanya bila berasal dari data terkini, memiliki arti jelas, dan dapat diakses pembaca layar. Hindari titik tanpa penjelasan.
- Halaman kosong harus menjelaskan apa manfaatnya, langkah pertama, dan tombol yang relevan. Status gagal menyimpan harus memberi langkah pemulihan tanpa menjanjikan data aman bila belum dipastikan.
- Istilah, kapitalisasi, sapaan “kalian”, tanggal, rupiah, dan status harus konsisten. Bahasa hangat boleh dipertahankan, tetapi judul dan tombol tetap menjelaskan tindakan.

## 5. Usulan struktur sidebar pelanggan

Ini struktur usulan untuk diuji, bukan perubahan route wajib. Kelompok boleh disembunyikan bila seluruh isinya tidak tersedia untuk pengguna. Submenu dapat berupa tab halaman bila jumlah item bertambah; yang penting seluruh tujuan punya jalur yang dapat ditemukan.

```text
Beranda
  Ringkasan
Persiapan
  Tugas
  Dokumen pernikahan
  Jadwal & hari acara
    Kalender
    Susunan acara
    Perlengkapan darurat
  Seserahan
  Inspirasi
Keuangan
  Tabungan & anggaran
  Katering
Tamu & undangan
  Daftar tamu & RSVP
  Undangan digital
  Kehadiran tamu
Vendor & pesanan
  Cari vendor
  Vendor tersimpan
  Pesanan & kontrak [hanya bila benar-benar tersedia]
Dokumen & berbagi
  Ringkasan untuk dibagikan
Pengaturan
```

Jika terlalu panjang di ponsel, jadikan bagian “Vendor & pesanan” dan “Dokumen & berbagi” fitur bertahap dan ukur frekuensi penggunaannya. Jangan memindahkan data atau menghapus URL lama tanpa redirect dan pengujian tautan. “Inspirasi” dapat tetap bernama “Moodboard” bila riset pengguna menunjukkan istilah itu lebih dikenal; penjelasan singkat membantu keduanya.

## 6. Tinjauan tiap menu dan rekomendasi

### Ringkasan Kesiapan → Ringkasan

**Pertahankan:** gambaran bersama dan tautan menuju fitur. **Perbaikan minor:** tampilkan tanggal acara yang dipilih, penjelasan status, dan tindakan jelas seperti “Lihat tugas”. **Perbaikan mayor:** urutkan berdasarkan kebutuhan nyata: tugas terlambat/terdekat, kelengkapan dokumen, anggaran, RSVP, lalu langkah berikutnya. Hanya tampilkan card jika fiturnya tersedia bagi pengguna dan datanya siap. Jika angka tidak tersedia, tampilkan “Belum ada data”, bukan angka contoh. Jangan menyamakan persentase checklist dengan kesiapan pernikahan secara menyeluruh.

### Checklist & Tugas → Tugas

**Saat ini:** tambah tugas, penanggung jawab, tenggat, prioritas, pencarian, filter dan progres. **Pertahankan** kerja bersama dan filter. **Minor:** bedakan keadaan “belum ada tugas” dari “tidak ada hasil pencarian”; jelaskan tugas terlewat dan tindakan tambah. Ada dua kolom “Status”; perjelas kolom centang menjadi “Selesai”. **Mayor:** template opsional berdasarkan tahap acara, pengingat yang bisa diatur, dan hubungan ke dokumen/jadwal; hindari mengisi otomatis tanpa persetujuan. Definisikan penanggung jawab dan izin edit pasangan.

### Persyaratan KUA → Dokumen pernikahan

**Saat ini:** checklist, pemilihan template, pilihan manual dan ekspor. **Pertahankan:** panduan untuk konfirmasi ke KUA setempat dan pemisahan dokumen utama/tambahan. **Minor:** beri konteks bahwa panduan ini untuk proses KUA; kebutuhan dapat berbeda menurut keadaan dan lokasi. “Mulai berkas utama” kurang menggambarkan aksi pemilihan dokumen. **Mayor:** pertimbangkan alur berdasarkan kebutuhan pengguna, status dan tenggat, sumber serta tanggal pembaruan yang dapat dikelola. Bila cakupan hanya KUA, pertahankan nama “Dokumen KUA” dan jangan menjanjikan semua jenis pernikahan.

### Rundown & Kepanitiaan → Jadwal & hari acara

**Saat ini:** rundown memuat urutan, waktu, penanggung jawab dan catatan; kalender dan perlengkapan darurat adalah route tersendiri. **Pertahankan** ketiganya, tetapi tampilkan jalurnya dengan jelas. **Minor:** jelaskan perbedaan kalender persiapan dan susunan acara hari-H; ganti PIC menjadi “Penanggung jawab”. **Mayor:** jika kepanitiaan dijanjikan, rancang daftar anggota, kontak, tugas, peran dan cara berbagi secara eksplisit; saat ini jangan menyebutnya sudah lengkap. Kelola acara melewati tengah malam, zona waktu dan konflik jadwal setelah validasi kebutuhan.

### Seserahan & Moodboard → Seserahan dan Inspirasi

**Saat ini:** seserahan mencatat jumlah, biaya dan status; moodboard memiliki koleksi dan palet dan dibatasi paket untuk akun tertentu. **Pertahankan** pencatatan dan referensi visual. **Minor:** pisahkan tujuan, tunjukkan total sebagai estimasi berdasarkan masukan, dan jelaskan kunci paket sebelum pengguna kehilangan konteks. **Mayor:** opsi pengelompokan penerima/kategori dan berbagi referensi ke vendor, dengan izin akses yang jelas. Jangan mengasumsikan semua pasangan memerlukan seserahan.

### Tabungan & Anggaran

**Pertahankan:** pengelolaan dana dan anggaran sebagai kebutuhan inti. **Minor:** bedakan target, uang terkumpul, anggaran, tagihan, pembayaran dan sisa; jelaskan apakah angka berasal dari pencatatan pengguna. **Mayor:** hubungan kategori, jatuh tempo dan pembayaran ke vendor/katering hanya setelah aturan sumber data dan pencegahan hitung ganda disepakati. Jangan menyiratkan saldo bank atau pembayaran otomatis jika fitur hanya mencatat.

### Kalkulator Katering → Katering

**Saat ini:** halaman perencanaan membaca tamu, pengaturan katering dan anggaran, lalu menyediakan estimasi dan menu. **Pertahankan** hubungan ini; jangan menggunakan status “segera” dari konfigurasi lain sebagai bukti halaman tidak tersedia. **Minor:** jelaskan sumber jumlah tamu, asumsi cadangan, perbedaan undangan dan orang, serta bahwa hasil adalah perkiraan. **Mayor:** bandingkan skenario dan hubungkan ke anggaran dengan indikasi sumber, opsi pembaruan, dan pencegahan duplikasi. Uji batas data kosong dan sumber tamu gagal dimuat.

### Pesanan & Kontrak → Cari vendor / Pesanan & kontrak

**Saat ini:** label sidebar mengarah ke paket/katalog; route checkout jasa yang diperiksa mengarah ke katalog. **Minor:** beri nama sesuai isi yang benar-benar dilihat, seperti “Cari vendor” atau “Rangkai paket”. **Mayor:** tampilkan “Pesanan & kontrak” hanya setelah ada daftar pesanan nyata, status, rincian, kontrak, pembayaran dan bantuan yang benar-benar terhubung; tautkan ke pesanan milik pengguna dengan pemeriksaan server. Pisahkan catatan vendor manual dari transaksi marketplace jika keduanya berbeda.

### CRM Tamu & WhatsApp → Daftar tamu & RSVP

**Saat ini:** daftar, impor, meja, WhatsApp dan tindak lanjut; ada route check-in terpisah. **Pertahankan** daftar dan tab yang sudah bermakna. **Minor:** jelaskan RSVP sebagai konfirmasi kehadiran pada penggunaan pertama, konsistenkan “WhatsApp”, “undangan”, “tamu”, dan “orang”. Beri tautan ke Kehadiran tamu dan pastikan instruksi halaman check-in menunjuk menu yang benar. **Mayor:** tampilkan secara jujur apakah pesan hanya disiapkan/dibuka di WhatsApp atau benar-benar dikirim otomatis; jangan menandai terkirim tanpa bukti. Definisikan persetujuan komunikasi, akses petugas, pembatasan kuota, privasi dan penanganan konflik perubahan.

### Studio Undangan → Undangan digital

**Saat ini:** daftar undangan, draf/terbit, template dan tautan studio visual; kemampuan berbeda berdasarkan paket. **Pertahankan** pemisahan draf dan terbit. **Minor:** tempatkan “Buat undangan”, “Lihat pratinjau”, “Terbitkan” dan “Salin tautan” sesuai status; jelaskan batas paket sebelum tombol dinonaktifkan. Studio visual adalah alat di dalam alur undangan. **Mayor:** alur publikasi dengan pemeriksaan informasi acara, pratinjau seluler, konfirmasi perubahan publik, dan status penyimpanan. Periksa bahwa link undangan terbit tidak rusak saat suatu fitur dinonaktifkan.

### Wedding Kit → Ringkasan untuk dibagikan

**Saat ini:** halaman menawarkan dokumen cetak dari data terbaru; untuk PDF pengguna diarahkan memakai fungsi cetak browser, dengan batas paket. **Pertahankan** pratinjau dan penjelasan sumber data. **Minor:** nama yang menjelaskan hasil lebih jelas; tombol “Buka dokumen cetak”, lalu petunjuk “Pilih Simpan sebagai PDF pada menu cetak”. Jelaskan isi sensitif dan pilih penerima sebelum berbagi. **Mayor:** pilih bagian yang ingin dibagikan, pratinjau data pribadi dan keluaran yang teruji; jangan menyebut unduhan PDF langsung jika implementasinya masih melalui dialog cetak.

### Pengaturan

**Saat ini:** Profil & akses, Paket & langganan, Privasi & keamanan, Custom domain, Prioritas bantuan. **Pertahankan** lokasi pengaturan dan pemisahan keamanan. **Minor:** “Profil & pasangan”, “Paket & langganan”, “Keamanan akun”, “Alamat undangan”, “Bantuan”; jelaskan mana yang merupakan hak paket. “Prioritas bantuan” bisa membuat pelanggan lain merasa tidak bisa menghubungi bantuan: gunakan “Bantuan” dengan indikator prioritas bila sesuai. **Mayor:** perjelas konsekuensi undang/cabut pasangan, ekspor dan hapus akun, serta siapa yang berwenang melakukannya.

## 7. Contoh perbaikan teks yang dapat langsung ditinjau

| Lokasi / teks saat ini | Usulan | Alasan |
|---|---|---|
| CRM Tamu & WhatsApp | Daftar tamu & RSVP | Bahasa tujuan, selaras judul halaman |
| Rundown & Kepanitiaan | Jadwal & hari acara | Tidak menjanjikan modul panitia lengkap |
| Seserahan & Moodboard | Seserahan; Inspirasi | Dua tujuan mudah ditemukan |
| Studio Undangan | Undangan digital | Menjelaskan hasil; studio menjadi alat |
| Wedding Kit | Ringkasan untuk dibagikan | Menjelaskan manfaat dan isi |
| Mulai berkas utama | Pilih dokumen | Sesuai tindakan yang membuka pemilih |
| Pilih template | Gunakan daftar contoh | Lebih mudah bagi pengguna baru; pastikan sesuai isi dialog |
| “Belum ada berkas di checklist kalian” | “Belum ada dokumen di daftar kalian” | Konsisten istilah |
| “Tidak ada tugas yang sesuai filter atau pencarian.” | Jika daftar kosong: “Belum ada tugas. Tambahkan tugas pertama.” Jika filter kosong: “Tidak ada tugas yang cocok. Ubah pencarian atau filter.” | Membedakan penyebab dan tindakan |
| “Satu undangan aktif. Lifetime menyediakan multi-undangan.” | “Paket ini dapat membuat 1 undangan. Untuk membuat beberapa undangan, lihat paket Lifetime.” | Kode membatasi jumlah entri termasuk draf, bukan hanya yang aktif |
| “Upgrade Lifetime untuk beberapa undangan.” | “Lihat paket Lifetime untuk membuat beberapa undangan.” | Bahasa lebih alami dan mengarah ke tindakan |
| “Perubahan belum tersimpan. Periksa batas percobaan atau muat ulang data terbaru.” | “Perubahan belum tersimpan. Periksa koneksi dan coba lagi.” | Gunakan hanya jika penyebab sesuai; pesan batas paket/konflik perlu spesifik |
| “Tambahkan tamu melalui menu Tamu & RSVP.” | “Tambahkan tamu di Daftar tamu & RSVP.” | Selaraskan label dan sediakan tautan |
| “Custom domain” | “Alamat undangan sendiri” | Terangkan istilah pada pengaturan |
| “Prioritas bantuan” | “Bantuan” | Tingkat prioritas menjadi keterangan paket |

Teks kegagalan harus mengikuti penyebab aktual: koneksi, batas paket, izin, konflik versi, atau pemeliharaan. Jangan menampilkan instruksi memuat ulang tanpa mempertimbangkan draf yang belum tersimpan. Audit copy lanjutan perlu mencatat lokasi, kondisi pemicu, teks lama, teks baru, pemilik keputusan, serta pengujian dalam konteks.

## 8. Rancangan kontrol superadmin: menyusun fitur seperti puzzle

### 8.1 Konsep

Buat **katalog fitur terdaftar**, bukan kemampuan superadmin menjalankan kode atau memasang komponen sembarang. Setiap fitur memiliki ID stabil, nama internal dan label pelanggan, pemilik, deskripsi, dependensi, route/API terkait, titik tampil (menu, card, tab, aksi), paket, role, status, serta dampak bila dinonaktifkan. Komponen baru tetap memerlukan pengembangan dan pengujian; panel superadmin memilih komponen yang sudah disediakan dan aman.

Unit konfigurasi bertingkat: **modul → halaman → section/card → aksi**. Contoh: `guests` → `guest-list` → `whatsapp-panel` → `compose-message`. Gunakan ID stabil yang terpisah dari label dan URL. Mulai dari modul/halaman yang memang punya batas jelas; pindah ke tingkat card setelah kontrak dan dependensinya dipetakan. Tidak semua card aman dicopot: card yang diperlukan untuk menyelesaikan pembayaran, menyimpan, menampilkan error, privasi, navigasi keluar, atau aksesibilitas harus ditandai wajib atau ditolak jika dilepas.

### 8.2 Pisahkan empat keputusan

1. **Otorisasi:** apakah identitas dan peran boleh melakukan aksi atas data tertentu? Ditetapkan server dan mencakup kepemilikan workspace.
2. **Hak paket:** apakah paket dan masa aktif memberikan kemampuan tersebut? Pertahankan mekanisme entitlement dan perjelas batasnya.
3. **Status rilis:** apakah fitur tersedia bagi lingkungan, kelompok pengguna, atau workspace tertentu? Default aman adalah tidak tersedia untuk fitur baru.
4. **Presentasi:** apakah menu/card ditampilkan, urutannya, dan teks yang diizinkan? Kontrol visual tidak boleh meningkatkan hak akses.

Evaluasi yang disarankan: autentikasi dan kepemilikan → izin aksi → entitlement paket → status rilis/pemeliharaan → presentasi. Terapkan keputusan yang sama pada halaman, server/API, pencarian, card, dan tautan. Jangan mengandalkan frontend. Status publik harus disaring agar tidak membocorkan fitur internal atau informasi pengguna lain.

### 8.3 Status dan perilaku yang diusulkan

| Status | Menu / tampilan | Route dan API | Data dan dampak |
|---|---|---|---|
| Tersembunyi | Tidak ditampilkan pada seluruh titik masuk | Akses langsung ditolak dengan respons aman; jangan anggap tautan rahasia sebagai keamanan | Data tetap disimpan; jangan otomatis hapus |
| Uji terbatas | Hanya muncul pada pengguna/workspace yang dipilih dan berhak | Server memeriksa sasaran dan izin | Catat versi, pemilik dan hasil uji; jangan pakai data pelanggan tanpa dasar yang sesuai |
| Aktif | Ditampilkan bila role dan paket memenuhi syarat | Aksi sesuai izin dan entitlement | Perubahan tercatat sesuai kebutuhan |
| Pemeliharaan | Pesan jelas, alasan umum dan perkiraan hanya jika benar-benar diketahui | Blokir penulisan terdampak; tentukan membaca/ekspor secara eksplisit | Lindungi data, tampilkan jalur bantuan; proses transaksi dan webhook tidak boleh otomatis dimatikan |
| Baca saja | Tampilkan data dengan penjelasan | GET yang diizinkan berjalan; operasi tulis ditolak server | Sediakan ekspor bila aman dan tersedia |
| Dihentikan | Petunjuk migrasi dan tanggal bila tersedia | Kebijakan akses/transisi ditentukan per fitur | Kebijakan retensi, ekspor dan migrasi harus disetujui sebelum penghentian |

“Terkunci paket” adalah hasil entitlement, bukan status rilis. “Tersembunyi” bukan otomatis berarti fitur tidak ada di backend. Pemeliharaan pada undangan publik, pembayaran, webhook, ekspor dan data sensitif memerlukan kebijakan khusus; jangan menerapkan satu sakelar global yang dapat memutus kewajiban transaksi atau akses tamu.

### 8.4 Panel superadmin yang direkomendasikan

Menu awal: Ringkasan operasional; Pengguna & workspace; Fitur & rilis; Konten & teks; Bantuan; Ulasan; Audit & keamanan. Fungsi pengguna dimulai dengan pencarian, status akun, keanggotaan dan riwayat tindakan. Pemberian/pencabutan role, reset akses atau intervensi workspace harus dibatasi, tercatat dan dirancang sesuai kewenangan; tidak perlu akses otomatis ke seluruh isi pribadi pelanggan.

Pada **Fitur & rilis** tampilkan daftar fitur, status sekarang, sasaran, paket, dependensi, lokasi tampil, jumlah workspace terdampak jika dapat dihitung, dan penanggung jawab. Halaman detail menyediakan draf, pratinjau sebagai role/paket yang dipilih menggunakan data uji, validasi dependensi, perbandingan sebelum/sesudah, alasan perubahan, jadwal opsional, publikasi, riwayat versi dan rollback. Simpan snapshot konfigurasi terakhir yang diketahui baik; cache punya versi dan mekanisme pembaruan yang jelas. Rollback mengembalikan konfigurasi, bukan menghapus atau membalikkan data transaksi pelanggan.

Untuk teks, mulai dari kamus pesan yang sudah disetujui dan terstruktur; hindari editor HTML/skrip bebas. Lindungi placeholder, tautan, panjang, aksesibilitas dan fallback. Hak mengubah teks terpisah dari hak mengubah akses atau status rilis.

### 8.5 Matriks peran awal yang perlu disepakati

| Peran | Cakupan awal yang disarankan |
|---|---|
| Tamu | Mencoba fitur yang disediakan untuk mode tamu; jelaskan masa penyimpanan dan batasnya berdasarkan perilaku aktual |
| Pelanggan / owner | Mengelola workspace sendiri dan tindakan kepemilikan yang diizinkan |
| Partner | Mengakses workspace yang diundang sesuai izin; tindakan kepemilikan dibatasi |
| Admin bantuan | Menangani tiket dan data minimum yang diperlukan; tanpa mengatur rilis atau role |
| Admin operasional/keuangan | Aksi sesuai tugas dan objek; izin sensitif dipisah |
| Superadmin | Mengelola kebijakan, role dan rilis sesuai kewenangan yang diberikan; semua tindakan sensitif diaudit |

Baris bantuan/keuangan adalah rancangan role masa depan; kode identitas yang diperiksa hanya mendefinisikan customer, admin dan superadmin, sementara owner/partner adalah keanggotaan workspace. Jangan menganggap role pratinjau sebagai role produksi. Role bukan satu-satunya kriteria: periksa workspace, objek, aksi, paket dan status fitur. Tetapkan kebijakan siapa yang boleh mengelola superadmin, mencegah hilangnya administrator terakhir, sesi kuat/MFA bila disediakan, serta persetujuan tambahan untuk tindakan berdampak tinggi sesuai kebijakan bisnis.

### 8.6 Keamanan, audit, dan kegagalan

- Audit perubahan konfigurasi dan peran: pelaku, waktu, alasan, target, nilai sebelum/sesudah, versi, hasil dan korelasi permintaan; lindungi log dari perubahan dan jangan simpan rahasia atau isi data pribadi yang tidak diperlukan.
- Validasi dependensi: contoh, panel WhatsApp membutuhkan daftar tamu; kalkulator dapat tetap berjalan dengan input manual saat sumber tamu tidak tersedia. Tampilkan dampak sebelum mempublikasikan.
- Kebijakan saat konfigurasi gagal dibaca harus ditentukan per fitur: untuk akses sensitif tutup akses; untuk proses kritis gunakan konfigurasi terakhir yang tervalidasi bila aman. Hindari menyembunyikan kegagalan sebagai “fitur belum tersedia”.
- Uji akses langsung dengan URL dan API, role salah, partner dicabut, paket kedaluwarsa, cache usang, dua admin mengedit bersamaan, rollback, dan pengguna yang sedang mengisi formulir ketika status berubah.
- Pengaturan fitur tidak boleh otomatis menghapus data, mencabut hak paket yang sudah dijanjikan, mengubah harga/kontrak, atau menghentikan pemrosesan pembayaran. Kebijakan perubahan layanan dan komunikasi pengguna perlu keputusan bisnis tersendiri.

## 9. Prioritas pekerjaan

| Prioritas | Skala | Pekerjaan | Hasil yang diharapkan |
|---|---|---|---|
| P0 | Minor–menengah | Inventaris route aktif, hapus/selaraskan label dan badge statis yang menyesatkan; verifikasi checkout, katering, ekspor | Pengguna melihat informasi sesuai fungsi nyata |
| P0 | Menengah | Render jalur submenu yang dibutuhkan atau sediakan tautan setara; selaraskan judul, pencarian dan dashboard | Fitur utama dapat ditemukan |
| P1 | Minor | Perbaiki copy tabel bagian 7, keadaan kosong, label status dan feedback penyimpanan | Langkah berikutnya mudah dipahami |
| P1 | Menengah | Rapikan grup menu, check-in, vendor, akun; uji navigasi desktop/mobile dan keyboard | Alur lebih singkat dan konsisten |
| P1 | Mayor | Petakan sumber kebenaran role, entitlement, workspace dan seluruh titik masuk fitur | Dasar pengendalian yang dapat dipercaya |
| P2 | Mayor | Katalog fitur, status server, target terbatas, audit, validasi dan rollback | Rilis bertahap dapat dikendalikan |
| P2 | Mayor | Panel pengguna dan operasi berdasarkan izin yang terpisah | Superadmin mengelola operasi dengan jejak tindakan |
| P3 | Mayor | Konfigurasi section/card, editor teks terbatas dan pratinjau lintas role | Fleksibilitas lebih rinci setelah fondasi aman |

P0 bukan perkiraan durasi dan tidak berarti semua perubahan dapat diluncurkan tanpa validasi. Pekerjaan mayor perlu rincian dependensi, migrasi, pemilik dan estimasi setelah keputusan produk.

## 10. Cara memvalidasi hasil

1. Susun inventaris untuk setiap fitur: route, API, komponen, sumber data, role, paket, status, dependensi, titik masuk dan pemilik. Tandai live, pratinjau, terbatas, atau belum diverifikasi.
2. Uji tugas nyata dengan beberapa calon pelanggan dan pasangan di ponsel serta desktop: menemukan dokumen, menambah tugas, memperkirakan katering, menambah tamu, membuat undangan dan membagikan ringkasan. Catat keberhasilan, waktu, kesalahan dan kata yang mereka gunakan; jangan menganggap contoh ini sebagai hasil riset yang sudah dilakukan.
3. Verifikasi setiap menu dengan akun tamu, owner, partner, paket yang tersedia, admin dan superadmin. Cek URL langsung, API, pencarian, dashboard, aksesibilitas keyboard dan pembaca layar, serta data kosong/gagal.
4. Tetapkan ukuran awal: tingkat keberhasilan menemukan fitur dan menyelesaikan tugas, jumlah klik salah, penyebab tiket bantuan, serta tingkat kegagalan simpan. Ukur sebelum dan sesudah perubahan dengan skenario yang sama.
5. Uji rilis terbatas dan rollback pada lingkungan pengujian terlebih dahulu, termasuk ketergantungan dan perlindungan data. Untuk transaksi, periksa proses yang masih harus berjalan ketika UI dalam pemeliharaan.

## 11. Keputusan yang perlu dibahas pemilik produk

- Apakah produk hanya melayani alur KUA atau juga ingin mencakup proses pernikahan lain? Ini menentukan nama dan isi dokumen.
- Apakah vendor/pesanan merupakan produk utama atau pelengkap, dan mana transaksi yang benar-benar siap digunakan?
- Fitur apa yang harus tersedia untuk semua, ditawarkan dalam paket, diuji terbatas, atau ditunda? Apa komitmen terhadap pelanggan yang sudah membeli?
- Apakah pasangan boleh mengubah seluruh data atau hanya bagian tertentu? Apakah panitia/vendor kelak memiliki akun sendiri?
- Seberapa jauh tim bantuan boleh melihat data pelanggan, dan apa mekanisme persetujuan serta pencatatannya?
- Apakah undangan publik, RSVP, pembayaran dan webhook harus tetap tersedia saat modul terkait dalam pemeliharaan? Tentukan kebijakan per layanan.
- Siapa yang berhak mempublikasikan perubahan, kapan perlu persetujuan kedua, dan siapa yang menangani insiden/rollback?

## 12. Jejak sumber utama

- Navigasi pelanggan: `src/features/customer-workspace/components/customer-navigation.ts`, `customer-sidebar.tsx`, `src/features/customer-workspace/domain/feature-groups.ts`.
- Pencarian dan konfigurasi tambahan: `src/features/shell-navigation/config/navigation.ts`, `workspace-header.tsx`, `src/features/customer-workspace/components/customer-feature-links.tsx`.
- Route dan adapter: `src/app/planner/*/page.tsx`, `src/app/_components/customer-planning-page.tsx`, `customer-resource-page.tsx`, `src/app/checkin/page.tsx`, `src/app/checkout/services/page.tsx`.
- Konten aktual: `src/features/customer-planning/components/planning-editor.tsx`, `src/features/guest-crm/components/guest-crm-screen.tsx`, `src/features/planner-tasks/components/tasks-screen.tsx`, `src/features/kua-documents/components/document-checklist-screen.tsx`, `src/features/customer-workspace/components/customer-invitations.tsx`, `plan-export.tsx`, `customer-checkin.tsx`.
- Role dan akses: `src/server/identity/accounts.ts`, `src/server/identity/policy.ts`, `src/server/workspaces/schema.ts`, `src/server/reviews/access.ts`, `src/app/admin/page.tsx`, `src/app/superadmin/reviews/page.tsx`.
- Paket dan pembatasan: `src/features/plans/domain/capabilities.ts`, `catalog.ts`, `src/server/workspaces/resource-policy.ts`.
- Perbandingan live/pratinjau: `src/features/operations-shell/components/live-operations-shell.tsx`, `src/preview/components/operations-navigation.ts`, `src/preview/components/preview-admin.tsx`.
