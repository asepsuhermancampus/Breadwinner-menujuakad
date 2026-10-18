# Laporan Batch 03 — Keuangan, sumber dana, rekening dan anggaran

Tanggal: 18 Oktober 2026. Track increment: **UI_SLICING**, status: **UI_MOCK**.
Batch 03 dinyatakan selesai setelah seluruh modul buku besar keuangan, tabungan, anggaran 11 kategori, pengeluaran, jadwal termin, laporan/ekspor CSV, rekening alokasi & mutasi, serta pemisahan konteks lamaran berhasil dislice dan seluruh gate verifikasi hijau.

## Hasil verifikasi

| Gate                    | Perintah               | Hasil                                 |
| ----------------------- | ---------------------- | ------------------------------------- |
| Format                  | `npm run format:check` | lulus                                 |
| Lint + batas arsitektur | `npm run lint`         | lulus, 273 modul, <=200 baris/berkas  |
| Typecheck strict        | `npm run typecheck`    | lulus                                 |
| Prisma validate         | `npm run db:validate`  | lulus                                 |
| Unit/integration        | `npm test`             | 79 tes / 18 berkas lulus              |
| Build produksi          | `npm run build`        | lulus, 30 route                       |
| Browser E2E             | `npm run test:e2e`     | 9 tes finance + seluruh regresi lulus |

## Yang dibangun

1. **Canonical Route `/planner/finance`**:
   - Terintegrasi langsung pada dock navigasi utama grup `KEUANGAN & VENDOR` ("Tabungan & Anggaran") dan Command Palette (`Cmd/Ctrl+K`).
   - Menyediakan 7 tab modul: **Ringkasan**, **Tabungan**, **Anggaran**, **Pengeluaran**, **Jadwal termin**, **Laporan**, dan **Rekening & mutasi**.
   - Penegasan disclaimer non-bank: _"Saldo alokasi dana acara, bukan saldo bank. Ketujuh pembayaran contoh memakai dana acara; biaya pribadi di luar alokasi tidak memotong saldo ini."_

2. **Ringkasan Keuangan (`w7nKVL`, `I3oh1`)**:
   - 4 Metrik utama: Target dana Rp 150.000.000, Pembayaran tercatat Rp 57.500.000, Sisa dana acara Rp 55.000.000, dan Sisa rencana biaya Rp 92.500.000.
   - Progres pendanaan bersama 75% dengan rincian kontribusi penyetor: Andi (Rp 55 jt), Risa (Rp 42,5 jt), Keluarga (Rp 15 jt).
   - Pengingat termin terdekat (DP Souvenir 01 Nov 2026 Rp 2 jt) dan pratinjau 5 anggaran terbesar.

3. **Tabungan Bersama & Catat Setoran (`OpGQi`, `viFWB`)**:
   - Strip total kontributor dan riwayat 7 setoran tervalidasi.
   - Drawer Catat Setoran 480px (`viFWB`): simulasi draf setoran Rp 5.000.000 menghasilkan proyeksi kontribusi Rp 117.500.000 sebelum posted ke ledger.

4. **Target Dana & Simulator Kontribusi Transparan (`HYcrO`)**:
   - Menampilkan total setoran tercatat dari ledger bersifat _read-only_ (Rp 112.500.000).
   - Perhitungan gap Rp 37.500.000 dibagi 4 periode = Rp 9.375.000 per periode; split 50/50 = Rp 4.687.500 per orang per periode dengan slider proporsi fleksibel.

5. **Buku Anggaran 11 Kategori & Edit Inline (`kXCB3`, `f3gyC`)**:
   - 11 Kategori rencana vs realisasi dengan PIC anggaran (Venue, Katering, MUA, Dokumentasi, Dekorasi, Busana, Cincin & mahar, Hiburan, Souvenir, Undangan, Transportasi & lainnya).
   - Edit inline rencana nominal (Enter simpan, Esc batal) dengan deteksi otomatis overbudget jika total > Rp 150 jt.
   - Dialog Konflik Edit Versi (`f3gyC`): diff 3 arah antara Base (v17: 30 jt), Server (v18: 31 jt), dan Draf Lokal (v19: 32 jt) dengan opsi rekonsiliasi yang aman.

6. **Pengeluaran & Detail Bukti Audit (`YGhuy`, `yX59Y`, `TzWN3`, `KyFHp`)**:
   - Buku kas pengeluaran dengan filter kategori dan pencarian ID/judul.
   - Detail Pembayaran Inspector 480px (`yX59Y`): pratinjau lampiran bukti transaksi, status DP/Lunas, pemisahan payer vs recorder, dan jejak audit versi.
   - Formulir Catat Pengeluaran (`KyFHp`, `TzWN3`): pemisahan sumber pendanaan riil antara **Dana Acara** (memotong kas rekening Mandiri/BCA/Jago) vs **Pribadi Eksternal** (kas acara tetap utuh Rp 55 jt).

7. **Jadwal 13 Termin Manual (`AMdWi`)**:
   - 13 rencana termin manual senilai Rp 92.500.000 (total pengingat November Rp 9,5 jt).
   - Penegasan status Vendor Hidden: _"Vendor Hidden · kontrak dan jadwal tetap dicatat manual. Tidak ada sinkronisasi escrow."_

8. **Laporan & Ekspor CSV (`BbisD`, `tepqM`)**:
   - Visualisasi arus kas masuk vs keluar dan filter pihak pembayar.
   - Dialog Ekspor Laporan (`tepqM`): CSV format standar UTF-8 dengan delimiter titik koma (;) dan opsi perlindungan privasi catatan rahasia.

9. **Impor CSV, Pemetaan & Deduplikasi (`FoaEJ`, `Q8dVnf`)**:
   - Wizard impor 3 langkah: 1. Unggah file → 2. Petakan kolom → 3. Tinjau & impor.
   - Validasi ketat: 3 baris valid (Rp 1.500.000), 1 tanggal salah (`32 Okt 2026`) dengan perbaikan inline ke 24 Okt, dan 1 duplikat (EX-1001 Venue 15 jt) yang dikecualikan secara default.
   - Pemetaan sumber pendanaan eksplisit sebelum konfirmasi.

10. **Rekening Dana Acara, Mutasi Internal & Koreksi (`AsgIs`, `I1fa2`, `dXzYX`)**:
    - Kartu 3 rekening alokasi: BCA Andi (Rp 10 jt), Mandiri Risa (Rp 30,5 jt), Jago Bersama (Rp 14,5 jt) dengan catatan formula.
    - Catat Mutasi Internal (`I1fa2`): transfer internal BCA → Jago Rp 1 jt dengan pratinjau saldo (BCA 9 jt, Jago 15,5 jt, total kas tetap Rp 55 jt).
    - Koreksi Catatan MT-009 (`dXzYX`): simulasi reversal 9 jt dan replacement 8 jt (BCA 11 jt, Jago 13,5 jt, total kas tetap Rp 55 jt).

11. **Keuangan Mode Lamaran (`KAMys`)**:
    - Konteks acara terpisah: Target Rp 20.000.000, Kontribusi Rp 12.000.000, Pengeluaran Rp 5.000.000, Sisa kas Rp 7.000.000, Sisa rencana Rp 15.000.000.
    - Jadwal 4 setoran mingguan x Rp 2.000.000 (Andi 1 jt + Risa 1 jt) pada 31 Okt, 07 Nov, 14 Nov, 21 Nov 2026.
    - 5 Kategori anggaran khusus lamaran (Seserahan, Busana, Konsumsi, Dekorasi, Dokumentasi).

## Pemetaan 21 Frame

| ID Frame | Nama Frame                                            | Implementasi Kode                                                      |
| -------- | ----------------------------------------------------- | ---------------------------------------------------------------------- |
| `I3oh1`  | 00F · Sistem Keuangan — Komponen & feedback           | Token desain, status badge & reusable primitives                       |
| `w7nKVL` | 33 · Ringkasan Keuangan — Dana acara & sisa rencana   | `OverviewTab` di `/planner/finance`                                    |
| `OpGQi`  | 34 · Tabungan Bersama — Riwayat & kontribusi          | `SavingsTab` di `/planner/finance`                                     |
| `viFWB`  | 34B · Catat Setoran — Inspector & bukti transfer      | `DepositInspector` drawer di `/planner/finance`                        |
| `HYcrO`  | 35 · Target Dana — Simulasi kontribusi transparan     | `TargetSimulatorDialog` di `/planner/finance`                          |
| `kXCB3`  | 36 · Buku Anggaran — 11 kategori & edit inline        | `BudgetTab` di `/planner/finance`                                      |
| `f3gyC`  | 36B · Konflik Edit — Rekonsiliasi versi aman          | `BudgetConflictDialog` di `/planner/finance`                           |
| `YGhuy`  | 37 · Pengeluaran — Buku kas & lampiran pembayaran     | `ExpensesTab` di `/planner/finance`                                    |
| `yX59Y`  | 37B · Detail Pembayaran — Bukti, termin & jejak audit | `ExpenseInspector` drawer di `/planner/finance`                        |
| `AMdWi`  | 38 · Jadwal Termin — Pengingat & kebutuhan pendanaan  | `InstallmentsTab` di `/planner/finance`                                |
| `BbisD`  | 39 · Laporan Keuangan — Arus dana & rekonsiliasi      | `ReportsTab` di `/planner/finance`                                     |
| `tepqM`  | 39B · Ekspor Laporan — CSV, periode & privasi         | `ExportReportDialog` di `/planner/finance`                             |
| `FoaEJ`  | 40 · Impor CSV — Pemetaan, validasi & deduplikasi     | `CsvImportWizard` di `/planner/finance`                                |
| `q44djF` | 41 · Mobile Keuangan — Ringkasan & aktivitas          | Reflow responsif `FinanceScreen` pada viewport 375px                   |
| `TzWN3`  | 41B · Mobile Catat Pengeluaran — Bottom sheet         | `RecordExpenseDialog` modal/sheet di `/planner/finance`                |
| `KAMys`  | 42 · Keuangan Lamaran — Konteks & dana terpisah       | `EngagementFinanceView` di `/planner/finance`                          |
| `AsgIs`  | 42A · Rekening dana acara & mutasi                    | `AccountsTab` di `/planner/finance`                                    |
| `I1fa2`  | 42B · Catat mutasi, bukan kirim uang                  | `TransferModalDialog` di `/planner/finance`                            |
| `Q8dVnf` | 42C · Perbaiki & bandingkan sebelum impor             | Sub-tinjauan perbaikan tanggal & deduplikasi di `CsvImportWizard`      |
| `KyFHp`  | 42D · Catat biaya · keyboard & keluar draf            | Proyeksi pemisahan sumber dana riil di `RecordExpenseDialog`           |
| `dXzYX`  | 42E · Rekening & koreksi catatan                      | `CorrectionModalDialog` (reversal & replacement) di `/planner/finance` |
