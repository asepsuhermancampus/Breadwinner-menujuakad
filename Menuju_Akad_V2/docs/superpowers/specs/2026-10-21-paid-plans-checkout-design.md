# Pembelian paket landing, diskon, akses fitur, dan panduan

Status: disetujui dan diimplementasikan secara lokal pada 21 Oktober 2026. Pengujian memakai pembayaran simulasi; pembayaran nyata dilakukan pengguna. Aktivasi custom domain menunggu konfigurasi hosting/HTTPS.

## Hasil yang diminta

- Pembelian memakai card paket pada landing bagian “Pilih ruang yang sesuai dengan rencana kalian”.
- Free tetap Rp0 dan tidak memiliki klaim diskon maupun transaksi QRIS.
- Premium tetap Rp149.000 per enam bulan; Lifetime tetap Rp399.000 sekali bayar.
- Klaim diskon pengguna baru 5% berada di samping harga pada kedua card berbayar.
- Klaim memperbarui harga pada card, termasuk kode unik resmi, tanpa navigasi atau menampilkan QR.
- CTA pembelian berikutnya membuka payment; pengguna belum login melewati login lalu kembali ke pesanan yang sama.
- Profil yang belum lengkap tidak menghalangi pembelian, aktivasi, atau akses dashboard.
- Pembayaran terverifikasi mengaktifkan fitur tier, membuka popup fitur yang baru tersedia, dan panduan Next/Back yang memfokuskan fitur terkait.
- Hover tombol Free dan Lifetime menggunakan warna tombol Premium; tampilan tombol Premium tetap.

## Temuan pada implementasi sekarang

1. `landing-pricing.tsx` menyimpan katalog sendiri; kedua CTA berbayar menuju `/account/plans` tanpa identitas tier.
2. Halaman paket, akun, dan dashboard memakai adapter/fixture preview. Fixture akun sudah Premium; perubahan paket pada adapter hanya simulasi.
3. `PaymentService.create()` membuat tagihan uji Rp5.000, tidak mencatat produk, periode, atau hak akses langganan.
4. Login Google mengunci tujuan akhir ke `/account`, mengabaikan tujuan checkout; tautan login/register juga tidak membawa pilihan pembelian.
5. Invoice SQLite persisten dan verifikasi provider sudah ada. Belum ada reservasi tamu, pengikatan pesanan setelah login, atau grant langganan.
6. Reproduksi read-only tombol Cek Status pada tagihan uji menghasilkan HTTP200, PENDING→PENDING, tanpa error JavaScript. Provider juga masih PENDING. UI belum memberi konfirmasi pemeriksaan selesai ketika status tetap sama. Gejala spesifik pada akun pengguna masih menunggu keterangan tambahan.
7. Fitur PDF/Wedding Kit dan custom domain masih berstatus maintenance/simulasi; sebagian data planner tersimpan pada state/browser, belum pada penyimpanan akun nyata.

## Harga dan reservasi resmi

Satu katalog milik server mendefinisikan ID, revisi harga, durasi, dan fitur tier. Landing, halaman paket, checkout, dan grant memakai katalog yang sama. Browser tidak menentukan harga atau hak akses.

| Tier     | Harga awal |   Potongan 5% | Nominal sebelum kode unik |
| -------- | ---------: | ------------: | ------------------------: |
| Free     |        Rp0 | Tidak berlaku |      Tidak ada pembayaran |
| Premium  |  Rp149.000 |       Rp7.450 |                 Rp141.550 |
| Lifetime |  Rp399.000 |      Rp19.950 |                 Rp379.050 |

Diskon dibulatkan ke bawah dalam rupiah utuh. Pengguna baru berarti belum memiliki pembelian paket produksi yang berhasil; tagihan uji Rp5.000 dan sandbox tidak menghabiskan promo.

API KlikQRIS memberikan `total_amount`, signature, expiry, dan QR pada pembuatan transaksi. Tidak ada endpoint penawaran nominal terpisah yang terdokumentasi. Karena itu, menampilkan total persis pada card membutuhkan pembuatan reservasi invoice provider di belakang layar. Sumber: https://klikqris.com/dokumentasi-api.

### Urutan klaim

1. Klik klaim hanya mengirim ID tier dan niat klaim ke endpoint reservasi server dengan validasi Origin.
2. Server menyimpan reservasi sebelum menghubungi provider, menghitung nominal dari katalog, lalu memanggil create sekali dengan order ID tersebut.
3. Card menampilkan loading selama nominal belum pasti. Timeout tidak menghasilkan invoice baru: status order yang sama diperiksa/dipulihkan.
4. Respons untuk landing hanya berisi ID intent, tier, harga awal, diskon, nominal dasar, kode unik resmi, total, status, dan expiry. QR, URL QR, signature, kredensial, dan pemilik tidak dikirim.
5. Card menampilkan harga awal dicoret, diskon, kode unik, total bayar, dan masa berlaku. Klik klaim lagi atau reload memakai reservasi yang sama.
6. CTA pembelian membuka checkout untuk intent tersebut. QR baru diberikan setelah autentikasi dan kepemilikan pesanan tervalidasi.
7. Total resmi harus berada antara nominal dasar dan harga awal. Total di atas harga awal ditolak untuk pembayaran; diskon tidak dinaikkan melewati 5% dan QR tidak ditampilkan.

Klaim tidak langsung membuka halaman QR. Pembuatan tagihan provider di belakang layar diperlukan untuk memenuhi permintaan nominal card yang persis; pengguna tidak melakukan pembayaran pada tahap klaim.

### Pengunjung belum login

- Server menerbitkan identitas reservasi tamu acak melalui cookie HttpOnly, SameSite=Lax, Secure pada HTTPS; hanya hash cookie disimpan. ID intent di URL tidak cukup untuk mengambil atau mengikat invoice.
- Klaim sebelum login bersifat penawaran pengguna baru yang kelayakannya diverifikasi saat login. Teks ini ditampilkan di card.
- Setelah Google login, server mengikat reservasi secara atomik ke akun terverifikasi, dengan bukti cookie tamu dan sesi akun sekaligus.
- Akun yang ternyata tidak layak menerima konflik promo yang jelas. Harga invoice yang sudah terbit tidak diubah diam-diam dan akses tidak diberikan.
- Reservasi dibatasi frekuensinya, dideduplikasi per browser/akun, dan direkonsiliasi saat kedaluwarsa. Perubahan tier saat reservasi lain aktif memberi pilihan melanjutkan pesanan aktif, tanpa mengubah invoice menjadi produk lain.

Untuk pembelian tanpa klaim, batas harga awal tetap berlaku. Jika total resmi melebihi harga awal, checkout tidak meneruskan pembayaran. Pembelian ulang tidak diberi promo pengguna baru secara diam-diam; dukungan nominal tanpa promo tetap tunduk pada kemampuan provider. Ini konsekuensi batas harga yang sudah disepakati.

## Model data dan migrasi

Penyimpanan lokal tetap SQLite yang sudah digunakan aplikasi; migrasi transaksional mempertahankan seluruh invoice lama, signature, nominal, dan status.

- `checkout_intents`: purpose, tier, catalog revision, owner/tamu terikat, status, invoice reference, dan waktu berlaku.
- Invoice menambah snapshot purpose (`integration_test` atau `subscription`), tier, durasi, harga katalog, diskon, nominal dasar, dan intent. Snapshot tidak ditentukan ulang dari URL setelah pembayaran.
- Pisahkan reservasi aktif uji dari reservasi langganan. Dalam purpose langganan, hanya satu pesanan aktif per pemilik/environment; kecocokan tier dan harga wajib sebelum reuse.
- `subscription_grants`: satu grant unik per invoice, pemilik, tier, grantedAt, expiresAt/null, dan daftar capability/version.
- `subscription_notices`: grant, fitur yang baru terbuka, status popup, langkah guide, dan completion per pemilik.
- Identitas akun untuk akses mengikuti pemilik terverifikasi dari server, bukan fixture atau nilai localStorage.

Invoice tamu yang belum diikat tidak mengaktifkan akun mana pun. Invoice uji dan sandbox tidak pernah menghasilkan akses produksi.

## Login dan profil

- Checkout menggunakan tujuan kembali lokal yang divalidasi, misalnya `/checkout/qris?intent=...`; tujuan eksternal dan jalur yang tidak diizinkan ditolak.
- Google sign-in, pergantian login/register, dan kelanjutan checkout mempertahankan intent. Login biasa tetap memakai tujuan akun standar.
- Form OTP/email yang sekarang mock tidak dianggap autentikasi pembayaran nyata. Jalur pembayaran memakai sesi Google yang sudah tersedia sampai autentikasi alternatif benar-benar diimplementasikan.
- Akun berprofil belum lengkap mendapat workspace awal kosong miliknya sendiri dan akses sesuai langganan. Ajakan melengkapi profil tidak memblokir payment atau tour.

## Status pembayaran dan aktivasi

- Tombol Cek Status memberi indikator loading, pesan hasil, dan waktu pemeriksaan terakhir, termasuk ketika hasilnya masih menunggu pembayaran.
- Loading berakhir pada sukses, error, timeout, dan pembatalan. Polling tidak menyembunyikan pesan manual atau mengirim permintaan yang bertumpuk.
- Kegagalan gateway ditampilkan sebagai gagal memeriksa; tidak ditafsirkan sebagai belum membayar, lunas, atau kedaluwarsa.
- Paid hanya diterima setelah GET provider cocok dengan order, nominal dasar, total, dan signature tersimpan. Webhook tetap diverifikasi, idempoten, dan direkonsiliasi lewat provider.
- Manual reconciliation dapat memeriksa pembayaran terlambat setelah expiry tanpa membuat QR/pesanan baru. Status paid tidak boleh diturunkan oleh respons lama.
- Dalam satu transaksi SQLite, settlement yang sah mencatat paid dan membuat grant unik. Request ulang, polling, dan webhook ganda tidak memperpanjang langganan dua kali.
- Premium berlaku enam bulan kalender. Pembelian ulang yang sah memperpanjang dari tanggal lebih akhir antara sekarang dan expiry aktif. Lifetime tidak kedaluwarsa dan tidak diturunkan menjadi Premium.
- Setelah akses server terlihat aktif, payment menampilkan sukses dan CTA dashboard. Popup tidak muncul hanya karena browser mengklaim pembayaran selesai.

## Akses fitur dan dashboard

Ganti jalur pelanggan yang mengandalkan fixture Premium dengan akun dan capability hasil server. Badge paket, navigation, pembatasan fitur, serta endpoint yang memodifikasi data memakai sumber akses yang sama. Akses profil tidak menjadi syarat akses langganan.

| Tier     | Akses yang perlu dipenuhi                                                                                     |
| -------- | ------------------------------------------------------------------------------------------------------------- |
| Free     | Workspace berdua, checklist/dokumen dasar, maksimal 100 tamu, satu template dasar, catatan anggaran sederhana |
| Premium  | Seluruh Free, tamu/tugas tanpa batas, template premium, studio visual, moodboard, ekspor rencana PDF          |
| Lifetime | Seluruh Premium tanpa kedaluwarsa, multi-undangan, pengaturan custom domain, prioritas bantuan                |

Data akun baru tidak boleh mengambil nama, pasangan, tamu, undangan, atau subscription dari fixture pengguna lain. Draft browser lama harus dipisah menurut akun/workspace; browser storage tidak pernah menjadi sumber hak akses.

Kemampuan yang pada kode sekarang masih simulasi memerlukan pekerjaan nyata pada jalur pelanggan. Ekspor PDF harus menghasilkan dokumen dari data akun, bukan membuka tombol maintenance. Multi-undangan harus menjaga kepemilikan dan persistensi. Pengaturan custom domain boleh dibuka oleh Lifetime, tetapi status aktif hanya setelah DNS/kepemilikan/HTTPS benar-benar terverifikasi pada hosting tujuan; pembayaran tidak memalsukan proses tersebut. Prioritas bantuan harus tercatat pada kanal bantuan yang dipakai aplikasi.

Fitur tambahan pada halaman paket internal yang tidak tercantum pada landing (misalnya sinkronisasi vendor dan Wedding Kit) harus direkonsiliasi dengan katalog agar pembeli tidak menerima janji yang saling berbeda. Fitur yang belum berjalan tidak dinyatakan “siap digunakan” dalam popup.

## Popup dan panduan

- Popup pertama menampilkan tier aktif, periode, dan hanya fitur baru yang benar-benar diperoleh dibanding akses sebelumnya.
- “Mulai panduan” membuka langkah Next/Back/Lewati. Setiap langkah mempunyai target fitur yang nyata, judul, penjelasan singkat, dan tautan tujuan.
- Guide menavigasi/scroll ke target, memberi highlight, dan memindahkan fokus secara aksesibel. Perpindahan halaman mempertahankan langkah; target yang belum tersedia tidak membuat guide macet.
- Progress dan dismissal terikat akun/grant. Refresh, callback ganda, login pada perangkat lain, serta pembelian yang sama tidak menciptakan rangkaian popup duplikat.
- Tier upgrade hanya memandu fitur yang baru terbuka; fitur yang sudah dimiliki tidak dijanjikan sebagai baru.

## Tampilan tombol landing

Tombol Premium mempertahankan class dan warna sekarang. Tombol Free/Lifetime memperoleh warna hover dan focus-visible yang sama dengan tombol Premium, termasuk kontras teks. Harga, klaim, dan CTA harus tetap rapi pada mobile.

## Bukti penerimaan yang wajib

- Free tidak mempunyai promo/QR; Premium dan Lifetime memakai harga katalog yang benar.
- Klik klaim memperbarui nominal tanpa navigasi/QR, memakai kode unik resmi, dan tidak membuat duplikat saat klik/reload/timeout.
- Total tepat sama dengan harga awal diizinkan; total satu rupiah lebih tinggi diblokir.
- Login mempertahankan intent; cookie tamu/ID intent akun lain tidak bisa mengambil pesanan. Profil kosong tetap bisa membeli dan masuk dashboard.
- Cek Status diuji pada pending, paid, expired, respons lambat, timeout, signature/nominal salah, dan callback/polling yang berlomba.
- Pembayaran uji/sandbox tidak membuka fitur. Satu pembayaran produksi terverifikasi memberi satu grant; pengulangan tidak menggandakan durasi.
- Hak akses bertahan setelah restart, terpisah antar akun, dan tidak bisa diperoleh dengan mengubah localStorage atau parameter URL.
- Popup/guide benar-benar menuju fitur tier, bisa dilewati dan dilanjutkan, serta bekerja dengan keyboard dan layar mobile.
- Perubahan hover Free/Lifetime tidak mengubah tombol Premium.
- Unit/integrasi, E2E, typecheck, lint/arsitektur, format, dan build selesai. Uji pembayaran nyata oleh pengguna sendiri; tidak ada pembayaran uang otomatis oleh agen.

## Batas perubahan pada tahap rancangan

Belum ada perubahan kode aplikasi atau penciptaan tagihan langganan baru pada tahap ini. Langkah berikutnya setelah rancangan disetujui adalah rencana implementasi terurut, kemudian implementasi dan verifikasi. Tidak ada commit, push, atau deployment pada tahap rancangan.
