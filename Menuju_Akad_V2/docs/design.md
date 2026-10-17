# Arsitektur dan desain Batch 01

Tanggal: 17 Oktober 2026. Track increment: **UI_SLICING**, status target **UI_MOCK**.
Instruksi pengguna telah mengotorisasi implementasi lokal bertahap; desain produk
dan keputusan stack bersumber dari paket rules dan Pencil, bukan rancangan ulang.

## Batas aplikasi

`Menuju_Akad_V2/` adalah modular monolith Next 16 App Router. V1, snapshot,
canvas aktif, environment produksi dan layanan eksternal tetap baca saja.
Folder sumber aktual `Menuju_Akad_V2_Prompt_Rules` memperbaiki ejaan `Promt`
yang masih muncul di beberapa tautan historis.

Server page menyusun komponen dari kontrak domain. UI interaktif menerima adapter
lewat props. Seluruh data contoh dan adapter mock berada dalam `src/preview`.
Fitur tidak mengimpor fixture. Domain berikutnya akan menambahkan query/action,
service dan repository sesuai kebutuhan tanpa menggandakan UI.

## Identitas dan keamanan

Actor, pasangan, workspace, membership, event, entitlement dan availability adalah
dimensi berbeda. Role migrasi tetap CLIENT/SUPERADMIN. OTP tidak menambah izin.
Rute nyata terlindungi gagal tertutup menuju `/login`; tidak ada cookie mock
yang dianggap sesi server. `/preview-ui/*` synthetic, noindex, private/no-store,
terbatas whitelist route dan tertutup pada build produksi kecuali flag server
`UI_PREVIEW_ENABLED=true` dinyalakan secara eksplisit untuk lingkungan lokal.

Baseline #43: Vendor/BA Hidden, katering ComingSoon, Wedding Kit Maintenance,
domain internal, gifts off. Tidak ada portal atau checkout baru yang diaktifkan.
Prisma 7/Neon disiapkan sebagai kontrak fondasi, tanpa koneksi/migrasi layanan.

## Pemilik modul

- `auth`: validasi login, OTP challenge, recovery grant dan state kredensial.
- `account`: profil actor, preferensi, sesi perangkat dan sensitive deletion.
- `planner-workspaces`: profil keluarga, event terisolasi dan pairing capability.
- `plans`: entitlement saat ini dan penawaran upgrade; Premium tetap Premium.
- `shell-navigation`: dock, konteks acara, membership menu dan command palette.
- `components/ui`: primitive netral, fokus, dialog/drawer dan feedback.

## Sumber visual

19 frame batch 1 dibaca melalui MCP Pencil, termasuk resolved instance overrides.
Anchor aktif MNC2H: split640/800 pada1440, foto inset24/radius28, form440,
caption/masthead plate Obsidian92%. Anchor m34FY: dock272/68, inset12,
topbar76, body32. UI menggunakan Cypress, offwhite, Plus Jakarta Sans,
Instrument Serif selektif dan Geist Mono; viewport375/768/1280 harus reflow.

## Strategi verifikasi

Unit menguji OTP clock/cooldown/recovery, invite expiry/revoke/replay/scope,
versi profil, entitlement dan failure preservation. Browser menguji navigasi,
paste OTP, onboarding next/back, dialog focus, compact dock, Cmd/Ctrl+K,
pending/invalid/offline dan overflow. Mock tidak membuktikan otorisasi server,
persistensi DB, provider sandbox maupun kesiapan produksi.
