# Feature Rollout Implementation Plan

**Goal:** Rilis fitur aman per kelompok, paket, dan workspace dengan draf, pratinjau, penjadwalan, audit dan rollback.

**Architecture:** Simpan snapshot versi dalam SQLite dan evaluasi aturan yang jatuh tempo pada pembacaan; gabungkan dengan sakelar kelompok yang ada. Kirim konteks workspace dan paket melalui seluruh gerbang server dan halaman. Panel superadmin memakai API yang hanya menerima input tervalidasi dan transaksi dengan pemeriksaan revisi.

**Tech Stack:** Next.js, TypeScript, node:sqlite, Vitest, Playwright.
**Spec:** docs/superpowers/specs/2026-10-30-feature-rollout-design.md

## Global Constraints

- Data dan draf pelanggan tidak dihapus; proses publik dan transaksi yang berjalan tetap tersedia.
- Tidak ada akses tambahan di luar hak paket, keanggotaan dan pembatasan fitur yang ada.
- Database SQLite terpisah antar instance tidak tersinkronisasi.

## Review Focus

- Partner memakai paket workspace pemilik; akses API langsung tidak melewati aturan.
- Dua admin dan jadwal bersaing: revisi lama ditolak, snapshot tidak tertimpa.
- Rollback tidak menghapus data dan jadwal sebelumnya tidak diam-diam membatalkan rollback.
- Preview memakai aturan yang sama seperti keputusan akses sebenarnya.
- Fitur terkait Keuangan, Katering, RSVP dan transaksi mempertahankan perilaku aman.

## Tasks

1. Tes dan implementasikan model draf, validasi, preview, publikasi terjadwal, riwayat, dan rollback dengan konflik revisi.
2. Tes lalu sambungkan evaluator ke seluruh jalur halaman dan API menggunakan workspace dan paket yang benar, termasuk guest dan partner.
3. Tes API superadmin, otorisasi, input dan konflik; buat panel untuk mengelola dan memeriksa rilis.
4. Jalankan tes unit lengkap, lint, typecheck, build dan browser terisolasi; catat keterbatasan deployment dan hasil.
