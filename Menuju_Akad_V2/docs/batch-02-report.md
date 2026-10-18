# Laporan Batch 02 — Perencanaan pernikahan dan fulfillment digital

Tanggal: 18 Oktober 2026. Track increment: **UI_SLICING**, status: **UI_MOCK**.
Batch 02 dinyatakan selesai setelah seluruh modul planner dan fulfillment digital berhasil dislice, diintegrasikan ke canonical shell, dan semua gate verifikasi hijau.

## Hasil verifikasi

| Gate                    | Perintah               | Hasil                                |
| ----------------------- | ---------------------- | ------------------------------------ |
| Format                  | `npm run format:check` | lulus                                |
| Lint + batas arsitektur | `npm run lint`         | lulus, 162 modul, <=200 baris/berkas |
| Typecheck strict        | `npm run typecheck`    | lulus                                |
| Prisma validate         | `npm run db:validate`  | lulus                                |
| Unit/integration        | `npm test`             | 63 tes / 14 berkas lulus             |
| Build produksi          | `npm run build`        | lulus, 20 route                      |
| Browser E2E             | `npm run test:e2e`     | 42 tes lulus                         |

## Yang dibangun

1. **Dashboard Kesiapan (`Dx42c`, `Un4o0`)**:
   - Berada di route `/dashboard`.
   - Mendukung peralihan konteks acara: **Pernikahan (Akad & Resepsi)** vs **Mode Lamaran**.
   - Derived countdown & readiness:
     - Pernikahan: H–112 (14 Feb 2027), kesiapan 84%, 4 metrik perencanaan (Checklist tugas 21/25, Dokumen KUA 5/7, Target tabungan 75% Rp 112.500.000, Vendor terkonfirmasi 13/14).
     - Lamaran: H–28 (22 Nov 2026), kesiapan 60%, 4 metrik (Tugas lamaran 6/10, Keluarga 2/2, Anggaran 60% Rp 12.000.000, Seserahan 2/6).
   - Fokus kecil hari ini, janji agenda berikutnya, dan partner activity feed.

2. **Checklist & Tugas (`N2dqI`, `Hz044`, `JVyCP`)**:
   - Berada di route `/planner/tasks`.
   - Filter tab: Semua (25), Hari ini (3), Mendesak (2), Mendatang, Selesai (21).
   - Pencarian tugas real-time, ringkasan progres persentase (84%).
   - Task Quick Inspector (drawer 480px) dengan dirty-dismiss confirmation dan inline edit.
   - Responsif 375px: touch-friendly tanpa drag.

3. **Dokumen KUA (`FUxIj`, `gK7r1`)**:
   - Berada di route `/planner/kua`.
   - Ringkasan dua mempelai: Andi Ramadhan (5/7) dan Risa Pratiwi (7/7).
   - Filter Wajib 7, Opsional, Perlu perhatian 2 (Sertifikat Elsimil & Rekomendasi KUA).
   - Dialog unggah revisi (`gK7r1`) dengan simulasi progress bar, catatan revisi KUA, dan fallback proteksi berkas lama.

4. **Perlengkapan Darurat / Emergency Bag (`OKEKY`)**:
   - Berada di route `/planner/emergency`.
   - Template 24 barang dalam 5 tas (Tas mempelai wanita 4/6, pria 3/4, P3K 3/4, Jahit/makeup 5/6, Dokumen & mahar 3/4).
   - Total 18/24 siap, 6 belum siap.

5. **Rundown Acara (`aXVUJ`, `WBpK5`)**:
   - Berada di route `/planner/rundown`.
   - 7 susunan jadwal dengan kunci waktu sakral: **Akad 08:00–09:00** dan **Resepsi 10:00–14:00**.
   - Generator dialog (`WBpK5`) dengan deteksi konflik jadwal dan pratinjau sebelum diterapkan.

6. **Kalender Koordinasi (`V4Cg4P`)**:
   - Berada di route `/planner/calendar`.
   - Tampilan grid Oktober 2026 dengan penanda fitting busana, test food katering, dan batas revisi KUA.

7. **Kalkulator Katering (`AXNnj`)**:
   - Berada di route `/planner/catering`.
   - Baseline release #43: status **Coming Soon** dengan pratinjau kalkulator internal.
   - Rumus kanonikal: 500 undangan × 2 = 1.000 + 10% buffer = 1.100 tamu.
   - Buffet 60% = 660 pax, Gubukan 40% = 440 pax × 4 = 1.760 porsi, Total 2.420 porsi. Label "Orang tidak sama dengan porsi" ditegaskan.

8. **Seserahan (`X0IiC`)**:
   - Berada di route `/planner/seserahan`.
   - 6 hantaran visual menggunakan aset editorial Pencil.
   - Estimasi keseluruhan Rp 10.200.000, Sudah dibeli 3/6, Realisasi sementara Rp 7.050.000.

9. **Moodboard (`ioFcn`, `E0Whvt`)**:
   - Berada di route `/planner/moodboard`.
   - Referensi visual per kategori (Dekorasi, Busana, Detail).
   - Palet warna yang disepakati: Cypress (#1E3F32), Champagne (#C9A66B), Canvas (#FBFBF9).
   - Dialog simpan inspirasi baru & catatan vendor (`E0Whvt`).

10. **Wedding Kit (`eLw4l`)**:
    - Berada di route `/planner/wedding-kit`.
    - Baseline release #43: status **Maintenance** dengan fallback yang jelas.
    - Hak akses Premium tetap aman; pratinjau 6 bagian dokumen ringkasan cetak A4.

11. **Fulfillment Produk Digital (`USpKE`)**:
    - Berada di route `/fulfillment/[orderId]`.
    - Standalone Rp 49.000 (DIG-SIM-49) tanpa dock workspace.
    - Simulasi 3 status pembayaran: Menunggu (file terkunci), Terverifikasi (akses aktif + receipt), dan Gagal Kirim (hak beli tetap ada, opsi kirim ulang ke email transaksi).

## Pemetaan 18 Frame

| ID Frame | Nama Frame                           | Implementasi Kode                                           |
| -------- | ------------------------------------ | ----------------------------------------------------------- |
| `v90AJl` | 00D · Planning system                | `src/features/` design tokens & editorial assets 1–7        |
| `Dx42c`  | 14 · Dashboard kesiapan — Pernikahan | `src/features/planner-overview/` & `/dashboard`             |
| `Un4o0`  | 14B · Dashboard — Mode lamaran       | State `engagement` di `/dashboard`                          |
| `N2dqI`  | 15 · Checklist & tugas               | `src/features/planner-tasks/` & `/planner/tasks`            |
| `Hz044`  | 15B · Detail tugas (Inspector)       | `TaskInspector` drawer di `/planner/tasks`                  |
| `FUxIj`  | 16 · Dokumen KUA                     | `src/features/kua-documents/` & `/planner/kua`              |
| `gK7r1`  | 16B · KUA unggah revisi              | `KuaRevisionDialog` di `/planner/kua`                       |
| `OKEKY`  | 17 · Perlengkapan darurat            | `src/features/emergency-checklist/` & `/planner/emergency`  |
| `aXVUJ`  | 18 · Rundown acara                   | `src/features/planner-rundown/` & `/planner/rundown`        |
| `WBpK5`  | 18B · Rundown generator              | `RundownGeneratorDialog` di `/planner/rundown`              |
| `V4Cg4P` | 19 · Kalender koordinasi             | `src/features/planner-calendar/` & `/planner/calendar`      |
| `AXNnj`  | 20 · Kalkulator katering             | `src/features/catering/` & `/planner/catering`              |
| `X0IiC`  | 21 · Seserahan                       | `src/features/wedding-preparation/` & `/planner/seserahan`  |
| `ioFcn`  | 22 · Moodboard                       | `src/features/moodboards/` & `/planner/moodboard`           |
| `E0Whvt` | 22B · Moodboard simpan inspirasi     | `SaveInspirationDialog` di `/planner/moodboard`             |
| `eLw4l`  | 23 · Wedding Kit                     | `src/features/wedding-kit/` & `/planner/wedding-kit`        |
| `JVyCP`  | 23A · Tugas mobile 375px             | Tampilan responsif di `TasksScreen`                         |
| `USpKE`  | 23B · Produk digital                 | `src/features/digital-products/` & `/fulfillment/[orderId]` |

## Batas dan pekerjaan berikutnya

- Angka keuangan di dashboard membaca selector ringkasan; buku besar transaksi mutasi dan rekening tabungan akan dikerjakan pada **Batch 03 (Keuangan)**.
- Kontak vendor dan tamu masih berupa catatan manual; CRM WhatsApp dan manajemen tamu akan dikerjakan pada **Batch 04**.
