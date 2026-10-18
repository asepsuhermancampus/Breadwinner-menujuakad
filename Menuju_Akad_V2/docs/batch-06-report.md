# Laporan Batch 06 — Studio editor undangan

Tanggal: 19 Oktober 2026. Mode **UI_MOCK**, penyimpanan lokal perangkat.
Rute `/planner/invitations/studio?project=…` membuka proyek yang dipilih dari
manager Batch 05. Frame aktif diperiksa melalui Pencil; file `.pen` tidak diedit.
Semua 13 frame library/screen/state/reference dipetakan di bawah, tanpa membuat
route tersendiri untuk setiap variasi canvas.

## Implementasi

- Editor Visual/Form memakai satu `StudioDocument` typed dengan project/event,
  node, seksi, cover/crop, motion, privacy, revision dan expected version. Draf
  awal v4 terpisah dari snapshot aktif v3; Lamaran dan proyek baru terisolasi.
- Kanvas bekerja pada model **375 CSS px**; zoom 125% menghasilkan tampilan
  468,75 px tanpa mengubah geometri document. Properti judul sumber
  **X24/Y389/W327/H54, font54, line-height1** dipertahankan. Penyelarasan renderer
  terakhir mencakup foto pasangan yang sesuai referensi dan geometri judul pada
  kanvas/preview; build akhir setelah penyesuaian ini lulus.
- Form, inline text dan inspector tersinkron; select/group/rename/lock/order,
  posisi/ukuran/rotasi/opasitas, flip serta undo/redo bekerja pada model sama.
  Tombol reorder dan field angka menyediakan alternatif drag.
- Unggah JPG/PNG/WebP diproses lokal dengan validasi ukuran/kuota 42/100 MB,
  pemeriksaan decode, progres, error/cancel/retry dan perlindungan aset lama.
  Crop menyimpan original, posisi, scale, ratio dan reset secara nondestruktif.
  Berkas/URL yang tidak aman tidak dieksekusi sebagai markup.
- Penyimpanan memakai localStorage per project, validasi recovery, autosave
  debounce dan ekspor JSON. Offline, gagal simpan, konflik versi dan izin dicabut
  mempertahankan draf; conflict resolution memerlukan pilihan eksplisit.
  Keluar saat storage gagal menjelaskan risiko kehilangan dan meminta acknowledgement.
- Riwayat memperlihatkan preview/perbandingan; fixture v2 hanya milik proyek
  Pernikahan utama. Restore membuat draf versi berikutnya, tanpa mengganti aktif,
  RSVP atau tiket. Proyek tanpa sejarah menampilkan keadaan kosong yang jujur.
- Gate publikasi memeriksa isi wajib, pin, tanggal/deadline, unggahan, izin,
  paket, availability, versi, status draf dan hadiah nonaktif. Review menangkap
  snapshot; checkbox awal unchecked dan commit memeriksa ulang versi serta guard.
  Operation ID mencegah publikasi ganda pada simulasi lokal.
- New/duplicate memakai project ID terpisah; tamu/consent/tiket tidak disalin.
  Unpublish konten/RSVP, archive/delete draf dan revoke tiket adalah tindakan
  terpisah dengan konfirmasi dampak. Preview aktif dari manager terikat proyek.
- Preview iframe memakai viewport aktual 375/768/1280 dan reflow responsif,
  tanpa handles/editor chrome. Renderer memakai node/crop document yang sama
  dengan kanvas. Reduced motion perangkat dan opsi preview dihormati; tidak ada
  musik autoplay. Compact mobile menampilkan panel Form/layer/inspector bergantian.

## Pemetaan 13 frame Pencil

| Frame    | Implementasi/state                                                                             |
| -------- | ---------------------------------------------------------------------------------------------- |
| `fBaKE`  | Fondasi `StudioDocument`, reducer, komponen kontrol dan status; library bukan route            |
| `A5HAQ`  | `StudioScreen` / `StudioHeader` / `StudioCanvas`; editor tiga panel                            |
| `lIjG4`  | `StudioForm`; konten tersinkron dengan kanvas dan inspector                                    |
| `DrJJ4`  | `StudioLayers` / `StudioInspector`; selection, group, lock, order dan transform                |
| `N6QLFs` | `StudioAssets` / `StudioCrop`; unggah lokal, kuota, crop/reset dan retry                       |
| `D1zXDn` | `StudioMotion`; preferensi tersimpan dan reduced motion efektif                                |
| `boSgn`  | `StudioHistory`; preview/diff v2 dan restore menjadi draf baru                                 |
| `J42RnE` | `StudioResilience` / `useStudioEditor`; offline, conflict, save/upload failure, revoked access |
| `TfQDh`  | `getPublishBlockers` / `StudioReview`; validasi pemblokir dengan arah perbaikan                |
| `WcY8K`  | `StudioReview` / `publishEditor`; snapshot, ack, version check dan operation dedup             |
| `lgfpG`  | `StudioProjectActions`; publish/unpublish, archive/delete, duplicate/new, revoke tiket         |
| `hj9yS`  | `StudioPreview`, `preview-html` / `preview-scene`; actual viewport dan reflow                  |
| `W214ws` | CSS compact + navigasi panel; Form dan inspector 375 px, bukan dua mockup telepon              |

## Verifikasi aktual

Verifikasi gabungan task utama: **167 tes / 31 berkas PASS**, typecheck PASS,
lint/arsitektur **359 modul PASS** dengan 12 warning nonfatal, format check PASS,
Prisma validate PASS, dan build akhir **33 route PASS**, termasuk penyesuaian
renderer terakhir. ESLint pada sumber yang terakhir diubah dan pemeriksaan
arsitektur juga lulus; warning gambar tetap nonfatal.

E2E terarah mencakup **30 tes unik yang seluruhnya lulus setelah rerun terarah**.
Run awal menghasilkan 28 PASS dan 2 kegagalan selector ambigu. Selector tanggal
Studio dibuat exact dan selector alert foto dibatasi ke region `Foto momen`.
Dua tes browser terakhir lulus: upload foto/offline/retry/withdrawal dan edit
judul langsung/Visual/Form/zoom/recovery. Suite penuh tidak diulang untuk selector.

Tes meliputi sinkronisasi Visual/Form, transform/lock/history, scope dan recovery,
snapshot/version/publish guard, upload/crop, safe preview, serta reflow pada
375/768/1280. Screenshot dan inspeksi Pencil dipakai untuk review visual; tidak
ada klaim pixel-diff otomatis yang belum dijalankan.

## Batas integrasi

Editor adalah simulasi lokal yang dapat dipakai dan diuji, bukan publikasi
backend. localStorage tidak menyediakan persistence remote, kolaborasi lintas
perangkat, atau otorisasi server. Version/permission/availability dan operation
ledger saat ini dimodelkan lokal. Riwayat fixture bukan audit produksi; upload
tidak mengirim ke storage publik. Pengujian kepemilikan/event di server, sanitasi
metadata produksi, asset scanning, retensi, DNS/SSL, distribusi laman dan
revocation tiket nyata masih memerlukan integrasi. Domain tetap Hidden, hadiah
nonaktif, entitlement Premium; tidak ada biaya atau pesan produksi yang dibuat.
