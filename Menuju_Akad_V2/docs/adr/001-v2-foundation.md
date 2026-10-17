# ADR 001 — Fondasi modular dan transisi V2

Status: diterapkan pada fondasi UI_SLICING.

## Keputusan

Gunakan Next16/React19, TypeScript5.9 strict, Tailwind4, Zod4, cva dan cn.
Prisma CLI/client/adapter Neon dipin bersama pada7.10.1. Node24.22.0 disediakan
melalui `.nvmrc` dan executable development lokal; sistem host22 tidak diubah.
Patch framework diverifikasi melalui registry npm dan dokumentasi resmi.

Gunakan modular monolith berbasis fitur. Hindari folder kosong serta generic
repository. Preview composition root menyuntik adapter deterministic; modul
produk tidak boleh membaca fixture atau depend pada preview.

Sesi penuh kelak tetap opaque DB + HttpOnly cookie; model migrasi CLIENT dan
SUPERADMIN dipertahankan. Workspace OWNER/PARTNER terpisah dari platform role.
Onboarding invite tidak menggabungkan workspace. Preview tidak menerbitkan sesi
server dan canonical routes fail closed sampai increment FULLSTACK_V2.

Media runtime statis dikelola manifest/checksum/lisensi. Photo source desain
disalin seperlunya; foto pengguna lokal hanya demonstrasi object URL/data URL
tervalidasi, belum storage provider. Font lokal berlisensi OFL memakai next/font.

Gateway diputuskan KlikQRIS. Mode PG/MY PG belum dipilih dan tidak dibutuhkan
batch1. Upgrade paket mock tidak menerbitkan entitlement. Availability baseline43
tetap, tanpa engine publish release yang menjadi scope Ekspansi.

Ledger/payment/provider/migrasi V1 belum dipindahkan pada track ini. Migrasi
berikutnya memakai expand–backfill–verify–contract, DB branch terpisah, mappingID,
rehearsal/rollback dan verifikasi scope. Tidak menurunkan fitur DB V1 ke mock:
V1 tetap berjalan terpisah, dan V2 belum menggantikannya.

## Referensi resmi

- [Next installation](https://nextjs.org/docs/app/getting-started/installation)
- [Next proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)
- [Tailwind4 Next](https://tailwindcss.com/docs/installation/framework-guides/nextjs)
- [Prisma7 config](https://www.prisma.io/docs/orm/v7/reference/prisma-config-reference)
