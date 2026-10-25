# Audit alur produk — 22 Oktober 2026

Perubahan diterapkan pada route aplikasi utama. Guest menyimpan data di browser, akun melalui API workspace dengan pemeriksaan membership, paket dan revision.

| Alur                                              | Sumber data dan tindakan nyata                                                                        |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Dashboard, tugas, anggaran, KUA                   | Resource browser/SQLite; template KUA editable sekali, daftar yang sengaja dikosongkan tetap kosong   |
| Kalender, rundown, seserahan, emergency, catering | CRUD resource guest/akun; validasi tanggal, waktu, jumlah dan nominal                                 |
| Tamu, CSV, penempatan meja, tindak lanjut         | Data input pengguna; ID/token acak, catatan dan meja tersimpan                                        |
| WhatsApp                                          | Draf tersimpan, tautan manual wa.me untuk akun dengan nomor dan persetujuan; tidak mengklaim terkirim |
| Undangan dan Studio                               | Dokumen aktual; guest menyimpan eksplisit di browser; publikasi memerlukan akun dan paket             |
| RSVP publik                                       | Token tamu unik dan undangan aktif; kuota divalidasi; perubahan menaikkan revision resource           |
| Check-in                                          | Jumlah aktual tamu workspace, tidak boleh melebihi kuota                                              |
| Moodboard                                         | Tambah, edit, hapus resource pengguna                                                                 |
| Wedding kit                                       | Dokumen resource aktual; melihat gratis, tindakan cetak/PDF lima percobaan guest                      |
| Login, daftar, pemulihan                          | Google Auth yang sudah terhubung                                                                      |
| Bergabung workspace                               | Token membership nyata, autentikasi dan validasi server                                               |
| Paket dan QRIS                                    | Integrasi KlikQRIS yang ada, status/webhook/pembatalan/aktivasi; klaim diskon baru wajib akun         |
| Marketplace, favorit, bundel                      | Katalog SQLite diisi pengelola; permintaan penawaran nyata, ringkasan privat bagi pemilik             |
| Route dev                                         | Mengarah ke halaman produk/administrasi berautentikasi                                                |

## Konfigurasi pemilik layanan

- Katalog: email pengelola di `OPERATIONS_EMAIL_ALLOWLIST`, lalu isi vendor sebenarnya. Permintaan tampil di inbox pengelola; belum merupakan kontrak atau pembayaran vendor.
- OTP dan WhatsApp otomatis: provider belum dipilih. Login Google dan WhatsApp manual tersedia, tanpa status pengiriman palsu.
- Fulfillment digital: perlu katalog, berkas sebenarnya dan aturan kontrak/pembayaran. Route lama tidak menerbitkan kuitansi atau unduhan fiktif.
- Custom domain: verifikasi TXT nyata tersedia. Hosting/routing/TLS harus dihubungkan; bukti DNS saja tetap menunggu hosting.

Tes pembayaran memakai database terisolasi dan respons provider terkontrol. Kelulusannya tidak menyatakan ada transfer uang nyata baru.
