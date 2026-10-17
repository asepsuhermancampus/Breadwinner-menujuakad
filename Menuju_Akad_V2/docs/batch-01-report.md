# Laporan Batch 01 — Fondasi, autentikasi, onboarding dan akun

Tanggal: 18 Oktober 2026. Track increment: **UI_SLICING**, status: **UI_MOCK**.
Batch 01 dinyatakan selesai setelah semua gate verifikasi hijau. Tidak ada
pekerjaan Batch 02/Ekspansi atau integrasi provider live pada increment ini.

## Hasil verifikasi

| Gate                    | Perintah               | Hasil                                |
| ----------------------- | ---------------------- | ------------------------------------ |
| Format                  | `npm run format:check` | lulus                                |
| Lint + batas arsitektur | `npm run lint`         | lulus, 110 modul, <=200 baris/berkas |
| Typecheck strict        | `npm run typecheck`    | lulus                                |
| Prisma validate         | `npm run db:validate`  | lulus                                |
| Unit/integration        | `npm test`             | 57 tes / 10 berkas lulus             |
| Build produksi          | `npm run build`        | lulus, 9 route                       |
| Browser E2E             | `npm run test:e2e`     | 35 tes lulus                         |

## Yang dibangun

- Primitive UI: button/field/select/card/status/dialog/drawer/icon di
  `src/components/ui`, dialog dengan focus trap eksplisit dan focus return.
- Auth: login email + telepon/PIN, OTP 6 digit (paste/autofill/cooldown/kedaluwarsa),
  recovery generik dan reset terverifikasi di `src/features/auth`.
- Onboarding: profil mempelai/keluarga, dua event terpisah, draft tahan next/back/reload,
  pairing invite opaque (expiry/revoke/redeem) di `src/features/planner-workspaces`.
- Shell: dock 272/68, topbar 76, rich tooltip hover+fokus, role switcher dan
  Cmd/Ctrl+K di `src/features/shell-navigation`.
- Akun dan paket: profil, quick inspector, privasi/perangkat, hapus akun dengan
  konfirmasi eksplisit, serta paket Free/Premium/Lifetime di `src/features/account`
  dan `src/features/plans`. Paket aktif tetap **Premium**.
- Data contoh dan adapter mock terisolasi di `src/preview`; route preview di
  `src/app/preview-ui` (noindex, private/no-store, whitelist, gagal tertutup).

## Perbaikan pada increment ini

1. Focus trap `<dialog>`: Tab/Shift+Tab kini membungkus di dalam modal
   (`src/components/ui/dialog.tsx`). Sebelumnya fokus bocor ke `BODY`.
2. Label status onboarding: saat adapter gagal, status kini menulis
   "Draf belum tersimpan" alih-alih klaim palsu "Draf tersimpan"
   (`src/features/planner-workspaces/components/onboarding-screen.tsx`).
3. Batas redirect: asersi E2E `Location` diubah agar menyelesaikan target relatif
   ke origin uji, sesuai perilaku `Location` yang di-emit Next
   (`tests/e2e/boundaries.spec.ts`).

## Pemetaan 19 frame

Semua frame batch 1 dipetakan ke kode/state: library `bi8Au`/`rnno1`/`FQfll` menjadi
primitive dan shell, layar auth `MNC2H`/`hMEbg`/`VgqXJ`/`wZeSu`/`Qyl3s`, onboarding
`nohWZ`/`ppEju`/`w6pWd`/`VUBCF`, akun `m34FY`/`uP5rs`/`m64RvD`/`o6oxd`/`VGsCi`,
paket `CwZFE`, dan board responsif `tQXWQ` menjadi state 375 px. Tidak ada frame
yang menjadi dead-end CTA; tidak ada penambahan route per frame.

## Batas dan pekerjaan tertunda

- Mock tidak membuktikan otorisasi server, persistensi DB, provider sandbox atau
  kesiapan produksi. Baseline release #43 tidak dilonggarkan: Vendor/BA Hidden,
  katering Coming Soon, Wedding Kit Maintenance, domain internal, hadiah nonaktif.
- Prisma/Neon disiapkan sebagai kontrak fondasi tanpa koneksi atau migrasi layanan.
- FULLSTACK_V2 (API auth/account exact path, CSRF/throttle, session opaque,
  repository Prisma) belum dikerjakan dan menjadi backlog eksplisit.

## Langkah berikutnya

Menunggu review pengguna. Batch 02 (Perencanaan) belum dimulai.
