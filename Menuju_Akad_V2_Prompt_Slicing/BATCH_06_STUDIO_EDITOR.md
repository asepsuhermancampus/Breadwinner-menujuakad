# PROMPT BATCH 06 — Studio editor Visual/Form dan siklus publikasi

> Prompt ini mandiri: kontrak global disertakan di bawah. Kerjakan scope khusus batch setelah membaca kontrak. Referensi relatif mengikuti folder paket unduh.

## Kontrak global wajib

## Misi dan mode kerja
Kamu adalah senior frontend engineer yang melakukan **slicing menjadi kode UI yang berfungsi**, bukan mendesain ulang, membuat mockup baru, atau hanya menulis rencana. Kerjakan hanya batch yang diminta. Jangan mengubah file sumber `.pen`. Pertahankan implementasi batch sebelumnya.

Mode default: **frontend slicing dengan adapter data mock deterministik**. Implementasikan navigasi, form, validasi, filter, modal, state dan simulasi lokal yang dapat diuji. Jangan menyebut simulasi sebagai transaksi/OTP/publish sungguhan. Jika API sudah tersedia, gunakan kontraknya; perubahan backend atau aktivasi produksi memerlukan scope/izin terpisah.

1. Inspeksi repository: package manifest, lockfile, framework, routing, styling, komponen, auth/data client, scripts dan test runner. Gunakan stack/versi yang sudah terpasang; jangan mengganti arsitektur atau upgrade major.
2. Jika repository benar-benar kosong dan tidak ada stack yang ditentukan, fallback yang diusulkan adalah Next.js App Router + TypeScript + Tailwind; verifikasi kompatibilitas versi saat scaffold. Keputusan stack yang sudah diberikan pengguna selalu mengalahkan fallback ini.
3. Gunakan komponen yang ada sebelum membuat baru. Pisahkan presentational UI, domain/state dan adapter API/mock. Jangan memasang dependency besar tanpa kebutuhan nyata.
4. Default adapter tidak menghubungi payment gateway, bank, OTP, WA, DNS, storage publik atau endpoint produksi. Secrets tidak boleh ditaruh di client.
   Gateway V2 dipilih **KlikQRIS**; label provider lama pada snapshot/inventaris bukan instruksi memakai Mayar/Midtrans/Xendit. Baca [panduan KlikQRIS](../Menuju_Akad_V2_Promt_Rules/07_KLIKQRIS_PAYMENT_GATEWAY.md); mode slicing tetap mock, bukan integrasi atau aktivasi produksi.
5. Hasil akhir harus kode aplikasi, bukan screenshot statis atau halaman berisi instruksi. Laporkan perubahan, perintah yang benar-benar dijalankan, hasil test, dan integrasi yang belum tersedia. Jangan mengarang hasil test.

## Sumber desain dan prioritas
- Snapshot lengkap: `references/design/Menuju_Akad_v2.pen`; aset relatif berada di `references/design/images/`.
- Inventaris: `references/FRAME_INVENTORY.json`; token: `references/DESIGN_TOKENS.json`; aset: `references/ASSET_MANIFEST.json`.
- Keputusan terkini: `references/audit/REMEDIATION_HANDOFF_MENUJU_AKAD_V2.md` dan `REMEDIATION_QA.json`.
- Jika bekerja langsung di folder asal, file aktif bernama `Menuju_Akad_v2.pen`. Jika ada perubahan setelah snapshot, baca ulang frame aktif dan konfirmasi perbedaannya; jangan menimpa kerja pengguna.
- Gunakan MCP Pen/Get/TakeScreenshot bila tersedia. Jika tidak, baca schema `.pen` termasuk variables, `ref` dan `descendants`, serta PNG anchor pada `references/previews/`. Jangan mengabaikan override instance atau menyalin nilai default komponen secara buta.
- Urutan otoritas: instruksi pengguna terbaru → desain V2 setelah remediasi → handoff terkini → spesifikasi fungsional lama. Jangan mengembalikan estetika heritage atau contoh Rama/Sinta menjadi identitas Andi/Risa.
- Jika sumber/asset tidak dapat dibuka, sebutkan blocker spesifik; jangan mengarang desain, foto, kebijakan atau backend. Periksa lisensi/attribution aset sebelum produksi.
- `enabled:false` dalam canvas berarti node tidak ditampilkan; jangan merendernya sebagai elemen HTML disabled yang masih terlihat. Ini penting untuk hidden icon, bank/gift lama dan handles. ID frame adalah referensi desain, bukan ID bisnis atau bukti endpoint tersedia.

## Penerjemahan canvas menjadi aplikasi
**Canvas bukan satu halaman web besar.** Koordinat ribuan piksel adalah organisasi board, bukan posisi elemen dalam aplikasi. Frame varian/inspector adalah state dari screen terkait, bukan otomatis URL baru. Library, penanda area, audit dan handoff board bukan halaman produk.

Board mobile 1600 px berisi contoh telepon **375×812**, catatan dan state. Slice layar teleponnya menjadi UI responsif; jangan membuat halaman aplikasi berisi dua mockup telepon dan catatan desainer. Status bar OS, keyboard ilustratif, resize handles dan annotation editor bukan UI publik. Gunakan keyboard native, safe-area dan kontrol browser yang sesuai.

Pertahankan hierarki, teks Indonesia, ikon, spacing, foto, crop dan tampilan state. Gunakan layout responsif semantik; jangan memosisikan semua teks dengan absolute coordinates. Data tabel harus tetap memiliki relasi header/row/cell. Elemen panjang boleh scroll pada runtime; jangan memotong isi hanya agar sama dengan tinggi screenshot.

## Design system wajib
- Canvas `#FBFBF9`; surface `#FFFFFF`; subtle `#F4F4F0`; border `#EAE9E4`.
- Text utama `#141413`; sekunder `#5E5D59`; muted `#96948E` hanya untuk konten yang sesuai, bukan otomatis semua teks kecil.
- Cypress `#1E3F32`, hover `#183429`; Champagne `#C9A66B`; Rose `#B86B5A`, rose teks aksesibel `#914F43`.
- Success `#166534`/`#F0FDF4`; warning `#9A5B13`/`#FEFCE8`; maintenance `#B45309`/`#FEF3C7`; danger/Hidden `#BE123C`/`#FFF1F2`.
- Plus Jakarta Sans untuk UI; Instrument Serif hanya judul editorial/emosional; Geist Mono/tabular numbers untuk rupiah, persen, countdown dan key teknis. Ikuti font asli, bukan mengganti semua menjadi serif.
- Radius card16 px, control12 px, shell20 px; control/hit target minimal44 px. Glass putih82% blur16 px jika dipakai sumber. Jangan menambah shadow berat, neon gradient, paper grain, wax seal atau ornamen botanical.
- Canonical pasangan: referensi desktop1600×1160, dock272 px/compact68 px, inset/gap 12 px, topbar76 px, padding body32 px. Vendor/BA dock240 px; Admin desktop1760×1200/dock240 px. Auth sumber1440 px tetap ikuti proporsinya. Jangan memaksa fixed viewport untuk semua perangkat.
- Maksimal4 metrik/baris, satu region dominan, progressive disclosure, inspector sekitar480 px, inline edit dan command search Cmd/Ctrl+K. Public invitation/checkout **tanpa dock workspace**.
- Gunakan design tokens/CSS variables/theme existing, bukan hardcode warna di setiap komponen. Uji kontras aktual; pemakaian token tidak otomatis lulus WCAG.

## Identitas, waktu dan fixture
- Andi Ramadhan & Risa Pratiwi; keluarga Andi: Bapak H. Budi Santoso & Ibu Hj. Siti Aminah; keluarga Risa: Bapak H. Dedi Prasetyo & Ibu Hj. Ratna Dewi.
- Paket aktual contoh: **Premium**. Lifetime adalah tawaran upgrade, bukan entitlement yang sudah dimiliki.
- Pernikahan: **14 Februari2027, Bumi Samami, Bandung, Asia/Jakarta**. Akad 08.00–09.00, resepsi 10.00–14.00 WIB. MUA 04.30–07.30, keluarga 07.00, KUA 07.30, foto 09.00, transisi 09.30.
- Lamaran22 November2026 dan seluruh ledger/task-nya terpisah. Jangan mengganti waktu appointment lain atau acara Rama/Sinta/Arga/Nadya.
- Fixture planner memakai snapshot 25 Oktober2026: H–112 Pernikahan/H–28 Lamaran. Clock harus injectable/frozen untuk test; runtime menghitung countdown dari event date dan timezone, bukan hardcode H–112 selamanya.
- Nilai uang disimpan sebagai integer IDR; persentase gunakan representasi presisi yang sesuai. UI memakai `Intl.NumberFormat('id-ID')` dan label Rp; payload CSV/API tidak memakai angka berformat lokal.
- Sebelum/sesudah, preview impor, draft pembayaran dan skenario koreksi adalah vignette terpisah, bukan tambahan transaksi aktual.

## Role, izin dan availability
Lima pengalaman: Pasangan, Mitra Vendor, Brand Ambassador, Tamu/Publik, Superadmin. Petugas check-in adalah delegasi event; Support/Finance scope terbatas Superadmin, bukan workspace bebas akses baru.

**Baseline release #43:** Vendor/BA **Hidden**, katering **Coming Soon**, Wedding Kit **Maintenance**, domain **Hidden/internal**, hadiah undangan aktif **nonaktif**. Marketplace/vendor/BA lengkap hanya preview sandbox Preset 3. Jangan mengaktifkan produksi demi menunjukkan hasil slicing. Sediakan internal component gallery/dev preview bila perlu, bukan query parameter publik yang membypass auth/flag.

- Live: tersedia sesuai izin. Coming Soon: teaser/waitlist, bukan workflow aktif. Maintenance: penjelasan/fallback, tanpa hilangkan data. Hidden: entrypoint baru hilang dan direct route/API harus dibatasi pada implementasi server.
- Parent Hidden mengalahkan child Live. Draft preset atau OTP saja tidak menerapkan release. Rilis perlu impact/reason/ack, verifikasi scope dan explicit publish.
- Role, action permission, event/object ownership, entitlement, effective availability dan version terpisah. OTP tidak memberi izin baru. Client gate bukan pengganti server authorization.
- Historical purchase recovery owner-scoped berbeda dari katalog/portal baru. Hidden tidak menghapus akun, order, escrow atau hak akses produk yang sudah dibeli.
- Simulasi frontend harus memodelkan revoked/expired/stale/forbidden states; tandai server enforcement sebagai pending jika backend belum ada.

## Kriteria lintas batch dan cara membuktikan
- Implementasikan empty, loading, ready, dirty, saving, saved, invalid, upload error, offline, permission-revoked dan stale conflict sesuai konteks. Tombol disabled harus punya alasan; retry tidak menggandakan aksi.
- Focus visible, tab order, label/error association, modal focus trap/return, dirty-dismiss, screen-reader status dan reduced-motion. Checkbox grafik20 px tetap target 44 px. Jangan hanya mengandalkan warna.
- Test desktop sesuai anchor dan responsif375/768/1280 px; tidak ada horizontal page overflow, control tertutup keyboard, atau data terpotong. Desain mobile belum membuktikan runtime keyboard benar.
- Jalankan typecheck, lint, build, unit/integration dan browser tests yang tersedia. Bandingkan screenshot implementasi dengan frame dalam konteks, bukan hanya komponen terisolasi. Tulis test kritis batch.
- QA canvas terakhir:180 root, nol overflow/tabrakan/placeholder;37 pemeriksaan aritmetika fixture lulus. Itu **bukan hasil test kode**. Ada24 skenario fungsi/security/payment dan 6 aksesibilitas/resilience yang belum diuji runtime pada saat handoff.
- Sebelum menyatakan batch selesai: semua frame dipetakan ke screen/state/component yang diimplementasikan atau blocker yang jujur; tidak ada dead-end CTA tanpa penjelasan; batch sebelumnya tidak rusak; laporan membedakan mock, sandbox dan integrasi nyata.


---


## Tugas spesifik
Implementasikan editor interaktif berdasarkan sumber, bukan screenshot editor dengan handles statis. Reuse project/content/RSVP model Batch 04–05 dan assets/tokens Batch 01. Anchor `A5HAQ.png`. Semua state versi, publish dan conflict harus dapat disimulasikan melalui adapter typed tanpa publikasi sungguhan.

## Scope lengkap
- `A5HAQ` Visual mode; `lIjG4` Form mode; `DrJJ4` layer/group/lock/transform.
- `N6QLFs` assets/upload/crop; `D1zXDn` animation/reduced motion; `boSgn` history/restore.
- `J42RnE` offline/conflict/upload fail/access lost; `TfQDh` pre-publish gate; `WcY8K` snapshot review; `lgfpG` publication lifecycle.
- `hj9yS` actual375/768/1280 previews; `W214ws` mobile Form/inspector 375×812. `fBaKE` library bukan route.

## Layout dan canvas geometry
- Desktop1600×1160, topbar80 px, toolbar64 px; left panel256 px (Form320 px), right inspector 304 px; garis pembatas ringan, bukan kartu bertingkat di setiap kontrol.
- Working content **375 CSS px** pada zoom 125% menjadi468,75≈469 px rendered. Jangan mengubah model width menjadi469. Zoom adalah transform/view scale; posisi/properti document tetap satuan model.
- Base cover375×340; working zoom cover≈469×425. Selected text sumber: X24/Y389/W327/H54, font 54, line-height1; zoom font 67,5 hanya tampilan. Baca node geometry aktual sebelum mengimplementasikan selection/crop.
- Preview actual375/768/1280 bukan tiga tampilan sama yang diperbesar. Public preview tidak menampilkan selection handles/editor chrome.
- Transform handles/layer selection harus sesuai model coordinate, zoom dan scroll; jangan hardcode overlay pada page coordinates yang salah saat zoom berubah.

## Document, layer dan asset model
Gunakan schema typed dengan project/event, sections/blocks/nodes, layout/style/asset references, visibility/lock/order, animation preferences, revision/expectedVersion, draft/active snapshot. Hindari menyimpan seluruh editor sebagai HTML string tanpa model.

Sections: Sampul, Kutipan, Mempelai, Detail acara, Peta & denah, Cerita cinta, Galeri, RSVP & ucapan, Hadiah, Penutup. Hadiah hidden pada active invitation. Theme/template switch tidak me-reset RSVP atau guest ownership.

- Visual/Form adalah dua tampilan atas document sama, bukan dua state data terpisah. Inline text/field/property edit, select/group/rename/lock/reorder/flip, undo/redo harus konsisten.
- Cover locked tidak bisa digeser diam-diam. Sediakan reorder/properties via keyboard/menu; drag bukan satu-satunya cara.
- Assets42/100 MB fixture; upload/pending/error/cancel/retry, progress dan quota validation. Keep old asset sampai replacement valid; crop nondestructive dengan original/reset/ratio, bukan merusak file asli.
- SVG/import URL perlu sanitasi sesuai stack, bukan eksekusi script/unsafe markup. Ambil geometry sumber apa adanya untuk asset vector; jangan menggambar ulang logo/ilustrasi dari tebakan.

## State persistence dan concurrency
- Contoh draft v4 saved10.42, active v3. Save draft tidak publish. Autosave debounce dengan pending/saved/error yang jujur; dirty-before-unload tidak boleh kehilangan data.
- Restorev2 membuat **draft v5**, bukan rollback silent active v3 atau RSVP. History memakai preview/diff/confirm, actor/timestamp/version.
- Conflict original BumiSamami/server Garden/local Hall: tampilkan compare dan pilihan resolve/reapply, dengan expected version baru. Jangan last-write-wins diam-diam.
- Offline5 local changes tetap terlihat dan dirty; reconnection revalidate permission/server version. Access lost memblokir save/publish dan mempertahankan draft secara aman, bukan pretending saved.
- Cover upload8,2 MB fail: preview asset lama tetap valid; retry tidak membuat duplicate upload/overwrite.

## Motion dan publish lifecycle
- Stored fade 600 ms/delay 0/no loop. Reduced-motion ON secara efektif mematikan fade/parallax/loop/autoplay tanpa membuang preferensi tersimpan.
- Pre-publish gate mengecek required content, pin venue, upload completion, permission/event ownership, entitlement, feature availability, document version dan privacy settings. Premium valid tidak diminta beli lagi.
- Snapshot review menunjukkan active v3→draft v4, perubahan, checkbox ack unchecked, disabled confirm sampai valid. Revalidate pada commit, bukan hanya saat modal dibuka.
- Publish explicit; unknown response harus cek status operation, tidak menerbitkan ulang membabi buta. Atomic publication snapshot, idempotent operation key pada integration contract.
- Lifecycle v4published10.55 adalah vignette terpisah. **Unpublish konten/RSVP tidak otomatis revoke tickets. Archive draft v5 tidak menghapus active v4.** Revoke tickets tindakan terpisah dengan confirmation/policy.
- Menu New/Rename/Duplicate/Archive draft/Delete draft menampilkan scope objek dan efek yang tepat; delete tidak menghapus public active project tanpa consent.

## Mobile dan aksesibilitas
- 375 px: panel dipakai satu per satu via Form/layers/inspector, bukan memaksa tiga panel desktop menyempit. Field editing dan save status tetap dapat dipakai dengan keyboard terbuka.
- Focus visible, text labels, menu keyboard, selection announcement, numeric property controls dan non-drag reorder. Jangan merender OS keyboard/mockup frame pada aplikasi.
- Autosave/status/publish error diumumkan seperlunya, bukan spam setiap keypress. Respect prefers-reduced-motion dan user setting.

## Acceptance tests
- Visual→Form→Visual mempertahankan document/selection; zoom 125% tidak mengubah ukuran model375.
- Undo/redo, lock/reorder/flip dan crop/reset konsisten; unsafe asset tidak dirender sebagai executable markup.
- Offline/reconnect/stale version/access revoke menjaga draft dan tidak auto overwrite/publish.
- Restorev2 menghasilkan draft v5 dan tidak mengubah active v3/ticket/RSVP.
- Missing pin/pending upload/unchecked ack/expired permission memblokir publish dengan perbaikan terarah.
- Unpublish/archive/delete/revoke sesuai perbedaan di atas; duplicate publish attempt tidak menghasilkan versi ganda.
- 375/768/1280 preview benar-benar reflow; public no handles; mobile focus/keyboard/reduced motion bekerja.

## Output
Kode editor, shared document/adapter contracts, deterministic fixture states dan test. Jangan mengklaim visual editor atau persistence production-ready jika yang dibuat hanya toolbar palsu, screenshot, local mock tanpa state, atau belum ada storage/authorization server.


## Inventaris frame wajib — diambil dari snapshot aktual

Total **13** frame desain/library/state/reference pada batch ini. Setiap ID harus dipetakan ke kode/state/component atau blocker yang dinyatakan, bukan otomatis satu route per frame.

| ID frame | Nama sumber | Jenis referensi |
|---|---|---|
| `fBaKE` | 00I · Sistem Studio — Kanvas, kontrol & status | component-library-not-route |
| `A5HAQ` | 67 · Studio Visual — Editor tiga panel | screen-or-state |
| `lIjG4` | 68 · Form Mode — Konten tanpa manipulasi kanvas | screen-or-state |
| `DrJJ4` | 69 · Layer & Transform — Grup, kunci & urutan | screen-or-state |
| `N6QLFs` | 70 · Aset & Crop — Unggah, kuota & rasio | screen-or-state |
| `D1zXDn` | 71 · Animasi & Reduced Motion — Efek yang terkontrol | screen-or-state |
| `boSgn` | 72 · Riwayat Versi — Preview & pulihkan sebagai draf | screen-or-state |
| `J42RnE` | 73 · Ketahanan Editor — Offline, konflik & gagal simpan | screen-or-state |
| `TfQDh` | 74 · Pre-Publish Gate — Validasi yang memblokir | screen-or-state |
| `WcY8K` | 75 · Review Snapshot — Siap dengan persetujuan eksplisit | screen-or-state |
| `lgfpG` | 76 · Siklus Publikasi — Terbit, tarik & arsip | screen-or-state |
| `hj9yS` | 77 · Responsive Preview — Mobile, tablet & desktop | screen-or-state |
| `W214ws` | 77A · Studio compact · Form & inspector375px | responsive-reference-board-not-whole-page |

Baca `references/FRAME_INVENTORY.json` untuk annotations dan instance references, lalu inspeksi source `.pen` untuk hierarchy/override/style efektif. Sumber gambar dapat dilacak melalui `ASSET_MANIFEST.json`.
