# 06 — Traceability Frame Pencil Menuju Akad V2

## Sumber dan batas bukti

Inventaris ini mencatat seluruh **180 root** dari [FRAME_INVENTORY.json](../Menuju_Akad_V2_Prompt_Slicing/references/FRAME_INVENTORY.json) dan [PACKAGE_MANIFEST.json](../Menuju_Akad_V2_Prompt_Slicing/PACKAGE_MANIFEST.json). Semua ID di bawah berasal dari **snapshot paket slicing**. Inventaris canvas aktif juga dibaca melalui MCP Pencil pada **17 Oktober 2026**; jumlah root serta pasangan ID/nama sesuai snapshot. Kesesuaian inventaris tidak membuktikan seluruh konten, override instance, style, aset atau hash file identik.

Penyusunan tabel ini hanya membaca Markdown/JSON; file `.pen` tidak dibaca melalui filesystem dan desain tidak diubah. Saat implementasi, inspeksi hierarchy, instance, descendants/override dan screenshot melalui MCP Pencil. File `.pen` hanya diakses melalui alat Pencil yang didukung.

**180 root bukan 180 route aplikasi.** Canvas memuat screen, state, inspector, library, referensi mobile, handoff, marker dan audit. Tentukan route dari alur pengguna/domain dan kontrak data; beberapa frame dapat dipenuhi satu screen melalui state atau komponen bersama. Koordinat board bukan layout aplikasi. Keyboard/status bar OS, resize handles dan catatan desainer tidak menjadi elemen web.

Gunakan bersama [arsitektur 01](01_TECH_STACK_AND_ARCHITECTURE.md), [clean-code 02](02_CLEAN_CODE_AND_ANTI_SPAGHETTI_RULES.md), [blueprint 03](03_ROLES_AND_FEATURES_BLUEPRINT.md), [master prompt 04](04_MASTER_AGENT_PROMPT.md), [kontrak global slicing](../Menuju_Akad_V2_Prompt_Slicing/00_KONTRAK_GLOBAL_AGENT.md), [handoff remediasi](../Menuju_Akad_V2_Prompt_Slicing/references/audit/REMEDIATION_HANDOFF_MENUJU_AKAD_V2.md) dan [QA desain tersimpan](../Menuju_Akad_V2_Prompt_Slicing/references/audit/REMEDIATION_QA.json).

## Rekap klasifikasi

| Jenis sumber | Jumlah | Perlakuan implementasi |
|---|---:|---|
| `screen-or-state` | 150 | Label konservatif; tidak menebak screen utama versus modal/state |
| `component-library-not-route` | 10 | Library/primitive/pola bersama, bukan route |
| `responsive-reference-board-not-whole-page` | 5 | Slice screen dan state responsif, bukan seluruh board |
| `optional-scope-reference` | 1 | Referensi fitur opsional/status/fallback |
| `technical-handoff-not-route` | 1 | Kontrak teknis, bukan route |
| **Subtotal desain/library/state/handoff** | **167** | Cakupan 8 prompt batch |
| `area-marker-not-route` | 9 | Organisasi canvas, bukan UI produk |
| `audit-not-route` | 4 | Papan audit, bukan route |
| **Seluruh root** | **180** | Seluruh ID dicatat di tabel inventaris |

Label tabel `screen/state`, `library`, `referensi responsif/state`, `referensi scope opsional` dan `handoff teknis` mengikuti jenis sumber di atas. Nama pada tabel mempertahankan nama sumber setelah prefiks `Batch ... |`; prefiks dipindahkan ke judul kelompok dan kolom prompt.

## Rekap 8 batch

Urutan dependency: **01 → Ekspansi → 02 → 03 → 04 → 05 → 06 → 07**. Tetap tujuh batch dan Batch Ekspansi; tidak membuat Batch 08. Jumlah frame mengikuti manifest dan mengecualikan marker/audit.

| Batch | Lingkup | Frame manifest | Marker | Prompt |
|---|---|---:|---:|---|
| 01 | Fondasi, auth dan akun | 19 | 1 | [Batch 01](../Menuju_Akad_V2_Prompt_Slicing/BATCH_01_FONDASI_AUTH_AKUN.md) |
| Ekspansi | Role, feature flags dan release engine | 14 | 1 | [Ekspansi](../Menuju_Akad_V2_Prompt_Slicing/BATCH_EKSPANSI_ROLE_FEATURE_FLAGS.md) |
| 02 | Perencanaan | 18 | 1 | [Batch 02](../Menuju_Akad_V2_Prompt_Slicing/BATCH_02_PERENCANAAN.md) |
| 03 | Keuangan | 21 | 1 | [Batch 03](../Menuju_Akad_V2_Prompt_Slicing/BATCH_03_KEUANGAN.md) |
| 04 | CRM, Marketplace dan checkout | 36 | 2 | [Batch 04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| 05 | Pengalaman tamu | 16 | 1 | [Batch 05](../Menuju_Akad_V2_Prompt_Slicing/BATCH_05_PENGALAMAN_TAMU.md) |
| 06 | Studio editor | 13 | 1 | [Batch 06](../Menuju_Akad_V2_Prompt_Slicing/BATCH_06_STUDIO_EDITOR.md) |
| 07 | Vendor, BA dan operasi admin | 30 | 1 | [Batch 07](../Menuju_Akad_V2_Prompt_Slicing/BATCH_07_VENDOR_BA_ADMIN.md) |
| **Total** | **8 prompt** | **167** | **9** | Empat papan audit terpisah |

## Inventaris 167 frame desain/library/state/handoff

### Batch 01 — Fondasi, auth dan akun (19)

| ID root | Nama sumber | Jenis artefak | Prompt batch |
|---|---|---|---|
| `bi8Au` | 00 · Sistem desain V2 — Modern Quiet Luxury | library | [01](../Menuju_Akad_V2_Prompt_Slicing/BATCH_01_FONDASI_AUTH_AKUN.md) |
| `rnno1` | 00B · Status & recovery V2 — Frictionless UX | library | [01](../Menuju_Akad_V2_Prompt_Slicing/BATCH_01_FONDASI_AUTH_AKUN.md) |
| `FQfll` | 00C · Architectural Luxury Dock — App shell system | library | [01](../Menuju_Akad_V2_Prompt_Slicing/BATCH_01_FONDASI_AUTH_AKUN.md) |
| `MNC2H` | 01 · Masuk — Email & kata sandi | screen/state | [01](../Menuju_Akad_V2_Prompt_Slicing/BATCH_01_FONDASI_AUTH_AKUN.md) |
| `hMEbg` | 02 · Daftar — Akun pasangan | screen/state | [01](../Menuju_Akad_V2_Prompt_Slicing/BATCH_01_FONDASI_AUTH_AKUN.md) |
| `VgqXJ` | 03 · Masuk — Nomor telepon & PIN | screen/state | [01](../Menuju_Akad_V2_Prompt_Slicing/BATCH_01_FONDASI_AUTH_AKUN.md) |
| `wZeSu` | 04 · Verifikasi OTP — Modal keamanan | screen/state | [01](../Menuju_Akad_V2_Prompt_Slicing/BATCH_01_FONDASI_AUTH_AKUN.md) |
| `Qyl3s` | 05 · Pemulihan — Kata sandi & PIN | screen/state | [01](../Menuju_Akad_V2_Prompt_Slicing/BATCH_01_FONDASI_AUTH_AKUN.md) |
| `nohWZ` | 06 · Onboarding 01 — Profil mempelai & keluarga | screen/state | [01](../Menuju_Akad_V2_Prompt_Slicing/BATCH_01_FONDASI_AUTH_AKUN.md) |
| `ppEju` | 07 · Onboarding 02 — Rencana acara | screen/state | [01](../Menuju_Akad_V2_Prompt_Slicing/BATCH_01_FONDASI_AUTH_AKUN.md) |
| `w6pWd` | 08 · Onboarding 03 — Undang pasangan | screen/state | [01](../Menuju_Akad_V2_Prompt_Slicing/BATCH_01_FONDASI_AUTH_AKUN.md) |
| `VUBCF` | 09 · Pairing berhasil — Dua akun tersinkronisasi | screen/state | [01](../Menuju_Akad_V2_Prompt_Slicing/BATCH_01_FONDASI_AUTH_AKUN.md) |
| `m34FY` | 10 · Pengaturan — Profil & akses peran | screen/state | [01](../Menuju_Akad_V2_Prompt_Slicing/BATCH_01_FONDASI_AUTH_AKUN.md) |
| `uP5rs` | 10B · Detail pasangan — Quick Inspector & inline edit | screen/state | [01](../Menuju_Akad_V2_Prompt_Slicing/BATCH_01_FONDASI_AUTH_AKUN.md) |
| `m64RvD` | 10C · App shell — Compact rail & rich tooltip | screen/state | [01](../Menuju_Akad_V2_Prompt_Slicing/BATCH_01_FONDASI_AUTH_AKUN.md) |
| `CwZFE` | 11 · Paket — Free, Premium & Lifetime Access | screen/state | [01](../Menuju_Akad_V2_Prompt_Slicing/BATCH_01_FONDASI_AUTH_AKUN.md) |
| `o6oxd` | 12 · Pengaturan — Privasi, notifikasi & perangkat | screen/state | [01](../Menuju_Akad_V2_Prompt_Slicing/BATCH_01_FONDASI_AUTH_AKUN.md) |
| `VGsCi` | 13 · Keamanan — Konfirmasi penghapusan akun | screen/state | [01](../Menuju_Akad_V2_Prompt_Slicing/BATCH_01_FONDASI_AUTH_AKUN.md) |
| `tQXWQ` | 13A · Masuk & verifikasi ·375px | referensi responsif/state | [01](../Menuju_Akad_V2_Prompt_Slicing/BATCH_01_FONDASI_AUTH_AKUN.md) |

### Batch Ekspansi — Role, feature flags dan release engine (14)

| ID root | Nama sumber | Jenis artefak | Prompt batch |
|---|---|---|---|
| `rOsoG` | 00E · Multi-role system — Shells, flags & public entrypoints | library | [Ekspansi](../Menuju_Akad_V2_Prompt_Slicing/BATCH_EKSPANSI_ROLE_FEATURE_FLAGS.md) |
| `bLaVb` | 24 · Superadmin — Modular Feature Studio & impact inspector | screen/state | [Ekspansi](../Menuju_Akad_V2_Prompt_Slicing/BATCH_EKSPANSI_ROLE_FEATURE_FLAGS.md) |
| `T1iXe` | 24B · Superadmin — Review cascade & konfirmasi rilis | screen/state | [Ekspansi](../Menuju_Akad_V2_Prompt_Slicing/BATCH_EKSPANSI_ROLE_FEATURE_FLAGS.md) |
| `xUTSV` | 24C · Superadmin — Security gate sebelum produksi | screen/state | [Ekspansi](../Menuju_Akad_V2_Prompt_Slicing/BATCH_EKSPANSI_ROLE_FEATURE_FLAGS.md) |
| `arf9l` | 25 · Pasangan — Collaborative Planner / release #43 | screen/state | [Ekspansi](../Menuju_Akad_V2_Prompt_Slicing/BATCH_EKSPANSI_ROLE_FEATURE_FLAGS.md) |
| `J0C5L` | 26 · Pasangan — Katering Coming Soon / teaser publik | screen/state | [Ekspansi](../Menuju_Akad_V2_Prompt_Slicing/BATCH_EKSPANSI_ROLE_FEATURE_FLAGS.md) |
| `V9L0nn` | 26B · Pasangan — Berhasil masuk daftar prioritas | screen/state | [Ekspansi](../Menuju_Akad_V2_Prompt_Slicing/BATCH_EKSPANSI_ROLE_FEATURE_FLAGS.md) |
| `sCBWB` | 27 · Pasangan — Wedding Kit Maintenance / data aman | screen/state | [Ekspansi](../Menuju_Akad_V2_Prompt_Slicing/BATCH_EKSPANSI_ROLE_FEATURE_FLAGS.md) |
| `wnYOo` | 28 · Pasangan — Vendor Hidden / catatan manual otomatis | screen/state | [Ekspansi](../Menuju_Akad_V2_Prompt_Slicing/BATCH_EKSPANSI_ROLE_FEATURE_FLAGS.md) |
| `lrAK9` | 29 · Mitra Vendor — B2B Studio & Escrow / Preset 3 | screen/state | [Ekspansi](../Menuju_Akad_V2_Prompt_Slicing/BATCH_EKSPANSI_ROLE_FEATURE_FLAGS.md) |
| `xbJUF` | 30 · Brand Ambassador — Growth & Commission Hub / Preset 3 | screen/state | [Ekspansi](../Menuju_Akad_V2_Prompt_Slicing/BATCH_EKSPANSI_ROLE_FEATURE_FLAGS.md) |
| `cN7lO` | 31 · Tamu — Undangan personal & Smart RSVP / mobile | screen/state | [Ekspansi](../Menuju_Akad_V2_Prompt_Slicing/BATCH_EKSPANSI_ROLE_FEATURE_FLAGS.md) |
| `wVmls` | 31B · Tamu — QR Pass & Wallet / hadiah nonaktif | screen/state | [Ekspansi](../Menuju_Akad_V2_Prompt_Slicing/BATCH_EKSPANSI_ROLE_FEATURE_FLAGS.md) |
| `u0TtL` | 32 · Publik — Checkout produk digital tanpa akun / BA Hidden | screen/state | [Ekspansi](../Menuju_Akad_V2_Prompt_Slicing/BATCH_EKSPANSI_ROLE_FEATURE_FLAGS.md) |

### Batch 02 — Perencanaan (18)

| ID root | Nama sumber | Jenis artefak | Prompt batch |
|---|---|---|---|
| `v90AJl` | 00D · Planning system — Batch 2 components & imagery | library | [02](../Menuju_Akad_V2_Prompt_Slicing/BATCH_02_PERENCANAAN.md) |
| `Dx42c` | 14 · Dashboard kesiapan — Pernikahan | screen/state | [02](../Menuju_Akad_V2_Prompt_Slicing/BATCH_02_PERENCANAAN.md) |
| `Un4o0` | 14B · Dashboard — Mode acara lamaran | screen/state | [02](../Menuju_Akad_V2_Prompt_Slicing/BATCH_02_PERENCANAAN.md) |
| `N2dqI` | 15 · Checklist & tugas — Smart task manager | screen/state | [02](../Menuju_Akad_V2_Prompt_Slicing/BATCH_02_PERENCANAAN.md) |
| `Hz044` | 15B · Detail tugas — Contextual quick inspector | screen/state | [02](../Menuju_Akad_V2_Prompt_Slicing/BATCH_02_PERENCANAAN.md) |
| `FUxIj` | 16 · Dokumen KUA — Kelengkapan kedua mempelai | screen/state | [02](../Menuju_Akad_V2_Prompt_Slicing/BATCH_02_PERENCANAAN.md) |
| `gK7r1` | 16B · KUA — Unggah revisi & pratinjau berkas | screen/state | [02](../Menuju_Akad_V2_Prompt_Slicing/BATCH_02_PERENCANAAN.md) |
| `OKEKY` | 17 · Perlengkapan darurat — Checklist tas Hari-H | screen/state | [02](../Menuju_Akad_V2_Prompt_Slicing/BATCH_02_PERENCANAAN.md) |
| `aXVUJ` | 18 · Rundown acara — Builder dari catatan layanan manual | screen/state | [02](../Menuju_Akad_V2_Prompt_Slicing/BATCH_02_PERENCANAAN.md) |
| `WBpK5` | 18B · Rundown — Pengaturan generator otomatis | screen/state | [02](../Menuju_Akad_V2_Prompt_Slicing/BATCH_02_PERENCANAAN.md) |
| `V4Cg4P` | 19 · Kalender koordinasi — Fitting, test food & tenggat | screen/state | [02](../Menuju_Akad_V2_Prompt_Slicing/BATCH_02_PERENCANAAN.md) |
| `AXNnj` | 20 · Kalkulator katering — Pratinjau desain internal | screen/state | [02](../Menuju_Akad_V2_Prompt_Slicing/BATCH_02_PERENCANAAN.md) |
| `X0IiC` | 21 · Seserahan — Daftar visual & progres belanja | screen/state | [02](../Menuju_Akad_V2_Prompt_Slicing/BATCH_02_PERENCANAAN.md) |
| `ioFcn` | 22 · Moodboard — Referensi visual bersama | screen/state | [02](../Menuju_Akad_V2_Prompt_Slicing/BATCH_02_PERENCANAAN.md) |
| `E0Whvt` | 22B · Moodboard — Simpan inspirasi & catatan vendor | screen/state | [02](../Menuju_Akad_V2_Prompt_Slicing/BATCH_02_PERENCANAAN.md) |
| `eLw4l` | 23 · Wedding Kit — Pratinjau desain internal | screen/state | [02](../Menuju_Akad_V2_Prompt_Slicing/BATCH_02_PERENCANAAN.md) |
| `JVyCP` | 23A · Tugas & inspector mobile ·375px | referensi responsif/state | [02](../Menuju_Akad_V2_Prompt_Slicing/BATCH_02_PERENCANAAN.md) |
| `USpKE` | 23B · Produk digital · setelah pembayaran | screen/state | [02](../Menuju_Akad_V2_Prompt_Slicing/BATCH_02_PERENCANAAN.md) |

### Batch 03 — Keuangan (21)

| ID root | Nama sumber | Jenis artefak | Prompt batch |
|---|---|---|---|
| `I3oh1` | 00F · Sistem Keuangan — Komponen & feedback | library | [03](../Menuju_Akad_V2_Prompt_Slicing/BATCH_03_KEUANGAN.md) |
| `w7nKVL` | 33 · Ringkasan Keuangan — Dana acara & sisa rencana | screen/state | [03](../Menuju_Akad_V2_Prompt_Slicing/BATCH_03_KEUANGAN.md) |
| `OpGQi` | 34 · Tabungan Bersama — Riwayat & kontribusi | screen/state | [03](../Menuju_Akad_V2_Prompt_Slicing/BATCH_03_KEUANGAN.md) |
| `viFWB` | 34B · Catat Setoran — Inspector & bukti transfer | screen/state | [03](../Menuju_Akad_V2_Prompt_Slicing/BATCH_03_KEUANGAN.md) |
| `HYcrO` | 35 · Target Dana — Simulasi kontribusi transparan | screen/state | [03](../Menuju_Akad_V2_Prompt_Slicing/BATCH_03_KEUANGAN.md) |
| `kXCB3` | 36 · Buku Anggaran — 11 kategori & edit inline | screen/state | [03](../Menuju_Akad_V2_Prompt_Slicing/BATCH_03_KEUANGAN.md) |
| `f3gyC` | 36B · Konflik Edit — Rekonsiliasi versi aman | screen/state | [03](../Menuju_Akad_V2_Prompt_Slicing/BATCH_03_KEUANGAN.md) |
| `YGhuy` | 37 · Pengeluaran — Buku kas & lampiran pembayaran | screen/state | [03](../Menuju_Akad_V2_Prompt_Slicing/BATCH_03_KEUANGAN.md) |
| `yX59Y` | 37B · Detail Pembayaran — Bukti, termin & jejak audit | screen/state | [03](../Menuju_Akad_V2_Prompt_Slicing/BATCH_03_KEUANGAN.md) |
| `AMdWi` | 38 · Jadwal Termin — Pengingat & kebutuhan pendanaan | screen/state | [03](../Menuju_Akad_V2_Prompt_Slicing/BATCH_03_KEUANGAN.md) |
| `BbisD` | 39 · Laporan Keuangan — Arus dana & rekonsiliasi | screen/state | [03](../Menuju_Akad_V2_Prompt_Slicing/BATCH_03_KEUANGAN.md) |
| `tepqM` | 39B · Ekspor Laporan — CSV, periode & privasi | screen/state | [03](../Menuju_Akad_V2_Prompt_Slicing/BATCH_03_KEUANGAN.md) |
| `FoaEJ` | 40 · Impor CSV — Pemetaan, validasi & deduplikasi | screen/state | [03](../Menuju_Akad_V2_Prompt_Slicing/BATCH_03_KEUANGAN.md) |
| `q44djF` | 41 · Mobile Keuangan — Ringkasan & aktivitas | screen/state | [03](../Menuju_Akad_V2_Prompt_Slicing/BATCH_03_KEUANGAN.md) |
| `TzWN3` | 41B · Mobile Catat Pengeluaran — Bottom sheet | screen/state | [03](../Menuju_Akad_V2_Prompt_Slicing/BATCH_03_KEUANGAN.md) |
| `KAMys` | 42 · Keuangan Lamaran — Konteks & dana terpisah | screen/state | [03](../Menuju_Akad_V2_Prompt_Slicing/BATCH_03_KEUANGAN.md) |
| `AsgIs` | 42A · Rekening dana acara & mutasi | screen/state | [03](../Menuju_Akad_V2_Prompt_Slicing/BATCH_03_KEUANGAN.md) |
| `I1fa2` | 42B · Catat mutasi, bukan kirim uang | screen/state | [03](../Menuju_Akad_V2_Prompt_Slicing/BATCH_03_KEUANGAN.md) |
| `Q8dVnf` | 42C · Perbaiki & bandingkan sebelum impor | screen/state | [03](../Menuju_Akad_V2_Prompt_Slicing/BATCH_03_KEUANGAN.md) |
| `KyFHp` | 42D · Catat biaya · keyboard & keluar draf | referensi responsif/state | [03](../Menuju_Akad_V2_Prompt_Slicing/BATCH_03_KEUANGAN.md) |
| `dXzYX` | 42E · Rekening & koreksi catatan | screen/state | [03](../Menuju_Akad_V2_Prompt_Slicing/BATCH_03_KEUANGAN.md) |

### Batch 04 — CRM, Marketplace dan checkout (36)

| ID root | Nama sumber | Jenis artefak | Prompt batch |
|---|---|---|---|
| `dxIqb` | 00G · Sistem Tamu — Definisi, status & komponen | library | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `o3Lcg` | 43 · CRM Tamu — Undangan, kuota & RSVP | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `y3Mltv` | 43A · Tambah Undangan — Data minimum & izin terpisah | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `JVhyJ` | 43B · Detail Undangan — Kuota, izin & tiket personal | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `IteDr` | 44 · Impor Tamu — Normalisasi nomor & deduplikasi | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `W1HD4` | 45 · Penempatan Meja — Kapasitas & rombongan | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `lHjOQ` | 46 · WhatsApp — Template & penerima yang memenuhi syarat | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `JGjTa` | 46B · Tinjauan WhatsApp — Pengecualian & konfirmasi | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `c7xjuR` | 47 · Hasil WhatsApp — Status pesan & retry terarah | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `seJ6W` | 48 · Galeri Tema — Editorial, Cypress & Monochrome | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `dJfnu` | 49 · Studio Undangan — Draf, RSVP & privasi | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `OZ2XF` | 49B · Publikasi Undangan — Draf ke versi aktif | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `qSqgx` | 50 · Undangan Personal Mobile — Tamu tanpa akun | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `uj3cI` | 50B · RSVP Mobile — Kuota & jawaban pribadi | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `l2XjAp` | 50C · Tiket Personal — Konfirmasi & QR demo | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `SqslJ` | 50D · Tautan Tidak Tersedia — Privasi & pemulihan | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `RJRrI` | 51 · Konsol Check-in — Akses operasional terbatas | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `a50cJX` | 51B · Pindai Tiket — Validasi sebelum catat kedatangan | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `o5w7r3` | 51C · State Check-in — Offline, duplikat & batas kuota | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `kUeNq` | 52 · Akses Petugas — Cakupan acara & pencabutan | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `mkFcs` | 52A · Temukan tim untuk hari kalian. | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `VKRRC` | 52B · Satu tanggal. Semua vendor diperiksa. | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `y39xp` | 52C · Lensa Teduh Photo | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `KQuvx` | 52D · Favorit & draf paket | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `RB5cT` | 52E · Racik paket lintas vendor | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `p1hIw` | 52F · Harga berubah / hold berakhir | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `PFaIp` | 52G · Checkout jasa tanpa akun | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `c1GHr` | 52H · Pilih cara pembayaran | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `sCDXm` | 52I · Pembayaran manual · preview internal | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `f9tDH` | 52J · Status pembayaran yang tidak menebak | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `I7adT5` | 52K · Satu item ditolak, paket tetap aman. | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `CyKZk` | 52L · Tinjau kontrak sebelum menyetujui | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `YDHrr` | 52M · Invoice, receipt & termin berikutnya | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `EudS2` | 52N · Ajukan sengketa secara terarah | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `c6ReWy` | 52P · Akses aman dan pemulihan katalog | screen/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `fyvrX` | 52O · Checkout mobile ·375px | referensi responsif/state | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |

### Batch 05 — Pengalaman tamu (16)

| ID root | Nama sumber | Jenis artefak | Prompt batch |
|---|---|---|---|
| `DNjlJ` | 00H · Sistem Pengalaman Tamu — Privasi & sesi | library | [05](../Menuju_Akad_V2_Prompt_Slicing/BATCH_05_PENGALAMAN_TAMU.md) |
| `orG6X` | 53 · Multi-Undangan — Acara, varian & versi | screen/state | [05](../Menuju_Akad_V2_Prompt_Slicing/BATCH_05_PENGALAMAN_TAMU.md) |
| `ej3Si` | 54 · Alamat Undangan — Slug & konflik | screen/state | [05](../Menuju_Akad_V2_Prompt_Slicing/BATCH_05_PENGALAMAN_TAMU.md) |
| `w10ww` | 55 · Domain & DNS — Preview internal / Hidden | screen/state | [05](../Menuju_Akad_V2_Prompt_Slicing/BATCH_05_PENGALAMAN_TAMU.md) |
| `iybkq` | 56 · Bandingkan Tema — Akses, gerak & keterbacaan | screen/state | [05](../Menuju_Akad_V2_Prompt_Slicing/BATCH_05_PENGALAMAN_TAMU.md) |
| `oh4K3` | 57 · Analitik Undangan — Kunjungan & konversi RSVP | screen/state | [05](../Menuju_Akad_V2_Prompt_Slicing/BATCH_05_PENGALAMAN_TAMU.md) |
| `Z5R5x` | 66 · CRM Lanjutan — Sesi & tindak lanjut berizin | screen/state | [05](../Menuju_Akad_V2_Prompt_Slicing/BATCH_05_PENGALAMAN_TAMU.md) |
| `LQOhS` | 58 · Profil & Cerita — Microsite editorial | screen/state | [05](../Menuju_Akad_V2_Prompt_Slicing/BATCH_05_PENGALAMAN_TAMU.md) |
| `gb4IQ` | 59 · Panduan Tamu — Acara, denah & kenyamanan | screen/state | [05](../Menuju_Akad_V2_Prompt_Slicing/BATCH_05_PENGALAMAN_TAMU.md) |
| `saA1w` | 60 · Galeri, Lightbox & Media — Pilihan tamu | screen/state | [05](../Menuju_Akad_V2_Prompt_Slicing/BATCH_05_PENGALAMAN_TAMU.md) |
| `JLu7e` | 61 · RSVP Per Sesi — Kuota & batas konfirmasi | screen/state | [05](../Menuju_Akad_V2_Prompt_Slicing/BATCH_05_PENGALAMAN_TAMU.md) |
| `MddxL` | 65 · Moderasi Ucapan & Foto — Persetujuan sebelum publik | screen/state | [05](../Menuju_Akad_V2_Prompt_Slicing/BATCH_05_PENGALAMAN_TAMU.md) |
| `L5Awxn` | 62 · Ucapan & Doa — Nama publik dan persetujuan | screen/state | [05](../Menuju_Akad_V2_Prompt_Slicing/BATCH_05_PENGALAMAN_TAMU.md) |
| `Ll4xj` | 63 · Foto Momen — Izin, unggah & moderasi | screen/state | [05](../Menuju_Akad_V2_Prompt_Slicing/BATCH_05_PENGALAMAN_TAMU.md) |
| `E8d5oa` | 64 · Hadiah Opsional — Preview internal / nonaktif | screen/state | [05](../Menuju_Akad_V2_Prompt_Slicing/BATCH_05_PENGALAMAN_TAMU.md) |
| `IdxPj` | 66A · Fitur opsional, statusnya terang. | referensi scope opsional | [05](../Menuju_Akad_V2_Prompt_Slicing/BATCH_05_PENGALAMAN_TAMU.md) |

### Batch 06 — Studio editor (13)

| ID root | Nama sumber | Jenis artefak | Prompt batch |
|---|---|---|---|
| `fBaKE` | 00I · Sistem Studio — Kanvas, kontrol & status | library | [06](../Menuju_Akad_V2_Prompt_Slicing/BATCH_06_STUDIO_EDITOR.md) |
| `A5HAQ` | 67 · Studio Visual — Editor tiga panel | screen/state | [06](../Menuju_Akad_V2_Prompt_Slicing/BATCH_06_STUDIO_EDITOR.md) |
| `lIjG4` | 68 · Form Mode — Konten tanpa manipulasi kanvas | screen/state | [06](../Menuju_Akad_V2_Prompt_Slicing/BATCH_06_STUDIO_EDITOR.md) |
| `DrJJ4` | 69 · Layer & Transform — Grup, kunci & urutan | screen/state | [06](../Menuju_Akad_V2_Prompt_Slicing/BATCH_06_STUDIO_EDITOR.md) |
| `N6QLFs` | 70 · Aset & Crop — Unggah, kuota & rasio | screen/state | [06](../Menuju_Akad_V2_Prompt_Slicing/BATCH_06_STUDIO_EDITOR.md) |
| `D1zXDn` | 71 · Animasi & Reduced Motion — Efek yang terkontrol | screen/state | [06](../Menuju_Akad_V2_Prompt_Slicing/BATCH_06_STUDIO_EDITOR.md) |
| `boSgn` | 72 · Riwayat Versi — Preview & pulihkan sebagai draf | screen/state | [06](../Menuju_Akad_V2_Prompt_Slicing/BATCH_06_STUDIO_EDITOR.md) |
| `J42RnE` | 73 · Ketahanan Editor — Offline, konflik & gagal simpan | screen/state | [06](../Menuju_Akad_V2_Prompt_Slicing/BATCH_06_STUDIO_EDITOR.md) |
| `TfQDh` | 74 · Pre-Publish Gate — Validasi yang memblokir | screen/state | [06](../Menuju_Akad_V2_Prompt_Slicing/BATCH_06_STUDIO_EDITOR.md) |
| `WcY8K` | 75 · Review Snapshot — Siap dengan persetujuan eksplisit | screen/state | [06](../Menuju_Akad_V2_Prompt_Slicing/BATCH_06_STUDIO_EDITOR.md) |
| `lgfpG` | 76 · Siklus Publikasi — Terbit, tarik & arsip | screen/state | [06](../Menuju_Akad_V2_Prompt_Slicing/BATCH_06_STUDIO_EDITOR.md) |
| `hj9yS` | 77 · Responsive Preview — Mobile, tablet & desktop | screen/state | [06](../Menuju_Akad_V2_Prompt_Slicing/BATCH_06_STUDIO_EDITOR.md) |
| `W214ws` | 77A · Studio compact · Form & inspector375px | referensi responsif/state | [06](../Menuju_Akad_V2_Prompt_Slicing/BATCH_06_STUDIO_EDITOR.md) |

### Batch 07 — Vendor, BA dan operasi admin (30)

| ID root | Nama sumber | Jenis artefak | Prompt batch |
|---|---|---|---|
| `zqegy` | 00J · Sistem Operasional — Akses, dana & pemulihan | library | [07](../Menuju_Akad_V2_Prompt_Slicing/BATCH_07_VENDOR_BA_ADMIN.md) |
| `CJw2i` | 78 · Vendor · Katalog & profil usaha | screen/state | [07](../Menuju_Akad_V2_Prompt_Slicing/BATCH_07_VENDOR_BA_ADMIN.md) |
| `mDQYw` | 79 · Vendor · KYB / revisi pembaruan rekening | screen/state | [07](../Menuju_Akad_V2_Prompt_Slicing/BATCH_07_VENDOR_BA_ADMIN.md) |
| `jVxHU` | 80 · Vendor · Pesanan per item & kontrak | screen/state | [07](../Menuju_Akad_V2_Prompt_Slicing/BATCH_07_VENDOR_BA_ADMIN.md) |
| `PeBEY` | 81 · Vendor · Kalender, blok & slot terkunci | screen/state | [07](../Menuju_Akad_V2_Prompt_Slicing/BATCH_07_VENDOR_BA_ADMIN.md) |
| `ZYbW5` | 82 · Vendor · Dompet escrow & jurnal | screen/state | [07](../Menuju_Akad_V2_Prompt_Slicing/BATCH_07_VENDOR_BA_ADMIN.md) |
| `VXnZN` | 82B · Vendor · Review permohonan pencairan | screen/state | [07](../Menuju_Akad_V2_Prompt_Slicing/BATCH_07_VENDOR_BA_ADMIN.md) |
| `aSy8W` | 83 · BA · Rekrutmen vendor & atribusi | screen/state | [07](../Menuju_Akad_V2_Prompt_Slicing/BATCH_07_VENDOR_BA_ADMIN.md) |
| `huATE` | 84 · BA · Komisi lintas program | screen/state | [07](../Menuju_Akad_V2_Prompt_Slicing/BATCH_07_VENDOR_BA_ADMIN.md) |
| `rGfR1` | 84B · BA · Review penarikan komisi | screen/state | [07](../Menuju_Akad_V2_Prompt_Slicing/BATCH_07_VENDOR_BA_ADMIN.md) |
| `f5KPKj` | 85 · Admin · Executive & funnel kohort | screen/state | [07](../Menuju_Akad_V2_Prompt_Slicing/BATCH_07_VENDOR_BA_ADMIN.md) |
| `X5XMjO` | 86 · Admin · Kalender lintas vendor | screen/state | [07](../Menuju_Akad_V2_Prompt_Slicing/BATCH_07_VENDOR_BA_ADMIN.md) |
| `SiDny` | 87 · Admin · KYB & tinjauan dokumen | screen/state | [07](../Menuju_Akad_V2_Prompt_Slicing/BATCH_07_VENDOR_BA_ADMIN.md) |
| `gTU8N` | 88 · Admin · Moderasi & pemindai kontak | screen/state | [07](../Menuju_Akad_V2_Prompt_Slicing/BATCH_07_VENDOR_BA_ADMIN.md) |
| `bpoHM` | 89 · Admin · Rekonsiliasi provider | screen/state | [07](../Menuju_Akad_V2_Prompt_Slicing/BATCH_07_VENDOR_BA_ADMIN.md) |
| `XSNpx` | 89B · Admin · Webhook & idempotensi | screen/state | [07](../Menuju_Akad_V2_Prompt_Slicing/BATCH_07_VENDOR_BA_ADMIN.md) |
| `I1LPbH` | 90 · Admin · Kelayakan & antrean payout | screen/state | [07](../Menuju_Akad_V2_Prompt_Slicing/BATCH_07_VENDOR_BA_ADMIN.md) |
| `UJ7nm` | 91 · Admin · Sengketa & jurnal refund | screen/state | [07](../Menuju_Akad_V2_Prompt_Slicing/BATCH_07_VENDOR_BA_ADMIN.md) |
| `MbVXe` | 91B · Admin · Review refund yang aman | screen/state | [07](../Menuju_Akad_V2_Prompt_Slicing/BATCH_07_VENDOR_BA_ADMIN.md) |
| `uz02N` | 92 · Admin · Pengaturan keuangan terkunci | screen/state | [07](../Menuju_Akad_V2_Prompt_Slicing/BATCH_07_VENDOR_BA_ADMIN.md) |
| `aMmL5` | 92B · Admin · Verifikasi OTP keuangan | screen/state | [07](../Menuju_Akad_V2_Prompt_Slicing/BATCH_07_VENDOR_BA_ADMIN.md) |
| `XjU3V` | 92C · Admin · Review perubahan terotorisasi | screen/state | [07](../Menuju_Akad_V2_Prompt_Slicing/BATCH_07_VENDOR_BA_ADMIN.md) |
| `J5qwCa` | 93 · Admin · Audit log & perubahan versi | screen/state | [07](../Menuju_Akad_V2_Prompt_Slicing/BATCH_07_VENDOR_BA_ADMIN.md) |
| `SHE9M` | 94 · Admin · Antrean notifikasi & retry | screen/state | [07](../Menuju_Akad_V2_Prompt_Slicing/BATCH_07_VENDOR_BA_ADMIN.md) |
| `PS9AV` | 95 · Admin · Tiket bantuan & percakapan | screen/state | [07](../Menuju_Akad_V2_Prompt_Slicing/BATCH_07_VENDOR_BA_ADMIN.md) |
| `s0GCv` | 96 · Admin · CMS & versi konten | screen/state | [07](../Menuju_Akad_V2_Prompt_Slicing/BATCH_07_VENDOR_BA_ADMIN.md) |
| `NUj9z` | 97 · Admin · Kesehatan layanan & maintenance | screen/state | [07](../Menuju_Akad_V2_Prompt_Slicing/BATCH_07_VENDOR_BA_ADMIN.md) |
| `g7JcA` | 98 · Admin · Akun & otorisasi massal | screen/state | [07](../Menuju_Akad_V2_Prompt_Slicing/BATCH_07_VENDOR_BA_ADMIN.md) |
| `XZ8eT` | 99 · Bantuan Mobile — Tiket pribadi & PWA opsional | screen/state | [07](../Menuju_Akad_V2_Prompt_Slicing/BATCH_07_VENDOR_BA_ADMIN.md) |
| `HDg7g` | 99A · Kontrak navigasi, izin & state | handoff teknis | [07](../Menuju_Akad_V2_Prompt_Slicing/BATCH_07_VENDOR_BA_ADMIN.md) |

## Inventaris 9 marker area — bukan route

| ID root | Nama sumber | Jenis artefak | Prompt batch |
|---|---|---|---|
| `M1lriz` | Penanda area — Fondasi, Akun & Onboarding | marker area | [01](../Menuju_Akad_V2_Prompt_Slicing/BATCH_01_FONDASI_AUTH_AKUN.md) |
| `THMWH` | Penanda area — Multi-role & Superadmin | marker area | [Ekspansi](../Menuju_Akad_V2_Prompt_Slicing/BATCH_EKSPANSI_ROLE_FEATURE_FLAGS.md) |
| `q6FYh` | Penanda area — Perencanaan Pernikahan | marker area | [02](../Menuju_Akad_V2_Prompt_Slicing/BATCH_02_PERENCANAAN.md) |
| `ZnBpv` | Penanda area — Keuangan & Anggaran | marker area | [03](../Menuju_Akad_V2_Prompt_Slicing/BATCH_03_KEUANGAN.md) |
| `qWzt0` | Penanda area — Tamu & Undangan | marker area | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `zynG1` | Penanda addendum — Marketplace & checkout sandbox | marker area | [04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md) |
| `mJj5C` | Penanda area — Pengalaman Tamu & Multi-Undangan | marker area | [05](../Menuju_Akad_V2_Prompt_Slicing/BATCH_05_PENGALAMAN_TAMU.md) |
| `t6rp8` | Penanda area — Studio Editor Visual | marker area | [06](../Menuju_Akad_V2_Prompt_Slicing/BATCH_06_STUDIO_EDITOR.md) |
| `Y05J89` | Penanda area — Vendor, BA & Operasi Platform | marker area | [07](../Menuju_Akad_V2_Prompt_Slicing/BATCH_07_VENDOR_BA_ADMIN.md) |

## Inventaris 4 papan audit — bukan route

Papan audit tidak memiliki batch produk sendiri. Link berikut menunjuk handoff yang menjelaskan status bukti; audit awal tidak mengalahkan hasil remediasi terbaru.

| ID root | Nama sumber | Jenis artefak | Referensi |
|---|---|---|---|
| `GuXYq` | Audit Final \| 01 · Ringkasan keputusan & matriks lintas batch | audit desain | [Handoff](../Menuju_Akad_V2_Prompt_Slicing/references/audit/REMEDIATION_HANDOFF_MENUJU_AKAD_V2.md) |
| `g29PF` | Audit Final \| 02 · Traceability master spec & bukti temuan | audit desain | [Handoff](../Menuju_Akad_V2_Prompt_Slicing/references/audit/REMEDIATION_HANDOFF_MENUJU_AKAD_V2.md) |
| `qdmlm` | Audit Final \| 03 · Backlog P0–P2 & acceptance criteria | audit desain | [Handoff](../Menuju_Akad_V2_Prompt_Slicing/references/audit/REMEDIATION_HANDOFF_MENUJU_AKAD_V2.md) |
| `TzrQC` | Audit Final \| 04 · Hasil remediasi P0–P2 & status UAT | audit desain | [Handoff](../Menuju_Akad_V2_Prompt_Slicing/references/audit/REMEDIATION_HANDOFF_MENUJU_AKAD_V2.md) |

## Dua belas PNG anchor

Anchor adalah sampel visual 1×, bukan bukti seluruh frame sudah ditinjau secara visual atau berfungsi. Baca seluruh frame batch, termasuk state/override tanpa PNG anchor.

| ID anchor | Lingkup | PNG |
|---|---|---|
| MNC2H | Auth editorial | [PNG](../Menuju_Akad_V2_Prompt_Slicing/references/previews/MNC2H.png) |
| m34FY | Shell pasangan/settings | [PNG](../Menuju_Akad_V2_Prompt_Slicing/references/previews/m34FY.png) |
| Dx42c | Planner | [PNG](../Menuju_Akad_V2_Prompt_Slicing/references/previews/Dx42c.png) |
| w7nKVL | Keuangan setelah remediasi | [PNG](../Menuju_Akad_V2_Prompt_Slicing/references/previews/w7nKVL.png) |
| o3Lcg | CRM | [PNG](../Menuju_Akad_V2_Prompt_Slicing/references/previews/o3Lcg.png) |
| mkFcs | Marketplace sandbox | [PNG](../Menuju_Akad_V2_Prompt_Slicing/references/previews/mkFcs.png) |
| PFaIp | Guest service checkout | [PNG](../Menuju_Akad_V2_Prompt_Slicing/references/previews/PFaIp.png) |
| orG6X | Multi-undangan | [PNG](../Menuju_Akad_V2_Prompt_Slicing/references/previews/orG6X.png) |
| A5HAQ | Studio editor | [PNG](../Menuju_Akad_V2_Prompt_Slicing/references/previews/A5HAQ.png) |
| f5KPKj | Admin operations | [PNG](../Menuju_Akad_V2_Prompt_Slicing/references/previews/f5KPKj.png) |
| bLaVb | Feature Studio | [PNG](../Menuju_Akad_V2_Prompt_Slicing/references/previews/bLaVb.png) |
| KyFHp | Mobile keyboard/dirty-dismiss | [PNG](../Menuju_Akad_V2_Prompt_Slicing/references/previews/KyFHp.png) |

## Provenance snapshot dan status validasi

- Source file tercatat: `Menuju_Akad_v2.pen`.
- Source SHA-256 tercatat: `005991f0834e246eb007b577881466ceb047915e32fa2a4a498e29ae43fd8d14`.
- Portable snapshot SHA-256 tercatat: `f99f7c036ca67ffd3ed27681e3dd4bc37488ad16dcb345cb936c8f8f8cb17b85`.
- Nilai hash **disalin dari manifest, belum dihitung ulang** pada audit ini. Tidak ada klaim hash canvas aktif sama dengan snapshot.
- Manifest mencatat `sourceNotModified: true`, `canvasModified: false`; perubahan portabel hanya melokalkan URL foto remote tercache, tanpa perubahan geometri/konten/flag menurut provenance paket.
- Paket mencatat 11 aset lokal asli dan 2 foto remote tercache, dengan 0 remote belum tercache. Referensi dan hak penggunaan mengikuti [ASSET_MANIFEST.json](../Menuju_Akad_V2_Prompt_Slicing/references/ASSET_MANIFEST.json).
- QA tersimpan mencatat 180 root, nol overflow/tabrakan/placeholder dan 37 pemeriksaan aritmetika fixture lulus. Ini hasil QA desain historis, bukan hasil pengujian aplikasi baru.
- Handoff menyatakan backend, route enforcement, transaksi/transfer, OTP/WA, publikasi, DNS/SSL, admission QR dan instalasi PWA belum dibuktikan. Sebanyak 24 skenario fungsi/security/payment/privacy dan 6 aksesibilitas/resilience menunggu runtime UAT pada handoff; `executed: 0`.
- Release 43 berbeda dari Preset 3 sandbox. Kehadiran frame Vendor/BA/Marketplace tidak mengaktifkan fitur produksi, memberikan entitlement atau membuktikan provider terintegrasi.

## Menjaga traceability saat implementasi

Untuk setiap ID pada 167 frame desain, buat catatan implementasi pada checkpoint batch dengan kontrak berikut. Jangan mengubah snapshot/inventaris sumber untuk menutupi frame yang belum dikerjakan.

| Field | Isi wajib |
|---|---|
| `frameId` dan batch | ID sumber tepat serta prompt batch |
| `artifactKind` | Screen/state/library/referensi responsif/scope opsional/handoff |
| `domainModule` | Pemilik `src/features/<domain>` atau primitive/layout bersama |
| `screenStateComponent` | Screen/state/komponen yang memenuhi frame; cantumkan mapping banyak-frame-ke-satu-screen |
| `routeOrTrigger` | Route yang dibutuhkan atau trigger modal/inspector/state; library/handoff diberi tidak berlaku |
| `deliveryStatus` | `planned`, `implemented` atau `blocked`, disertai bukti; implemented tidak otomatis tested |
| `dataStatus` | Mock deterministik, persistensi pengembangan, provider sandbox terverifikasi atau produksi terverifikasi; hanya dengan bukti aktual |
| `permissionAndAvailability` | Role/membership/action/object/event/entitlement/effective flag/version dan owner recovery bila relevan |
| `testStatusAndEvidence` | `not-run`, `passed` atau `failed`; nama tes/perintah/environment/hasil dan screenshot yang benar-benar diperiksa |
| `blocker` | Masalah spesifik, dependency dan langkah berikutnya |

Cakupan lengkap berarti setiap ID memiliki mapping implementasi atau blocker jelas. Bukti mock tidak diganti label menjadi integrasi nyata. Marker/audit ditandai referensi saja dan tidak dihitung sebagai fitur terimplementasi. Jika canvas aktif berubah, inspeksi ulang melalui MCP, catat delta ID/nama/konten dan sumber keputusan, lalu perbarui catatan implementasi tanpa menimpa pekerjaan pengguna.
