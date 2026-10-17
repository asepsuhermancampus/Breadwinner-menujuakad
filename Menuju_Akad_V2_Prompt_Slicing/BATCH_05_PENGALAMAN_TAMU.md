# PROMPT BATCH 05 — Multi-undangan dan pengalaman tamu

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
Lanjutkan CRM/RSVP/publishing Batch 04 menjadi manager multi-undangan dan microsite editorial yang mobile-first. Jangan membuat domain editor/model RSVP kedua yang berbeda dari batch lain. Anchor `orG6X.png`; inspeksi mobile source420 px dan implementasikan fluid hingga375 px.

## Scope
- `orG6X` invitation manager; `ej3Si` slug; `w10ww` domain/DNS internal; `iybkq` compare themes; `oh4K3` analytics; `Z5R5x` follow-up CRM.
- `LQOhS` profile/story; `gb4IQ` guest guide; `saA1w` masonry/lightbox/media; `JLu7e` RSVP per sesi.
- `L5Awxn` wishes, `Ll4xj` photo upload, `MddxL` moderation; `E8d5oa` gifts inactive/internal.
- `IdxPj` optional-feature inventory/fallback. Ini reference scope, bukan alasan membuka semua fitur ke publik.

## Manager, slug, tema dan versi
- Active Pernikahanv3 memiliki350 undangan; draft v4 berbeda. Lamaran draft terpisah. VIP12 adalah subset350, bukan12 orang tambahan; duplicate invitation project tidak otomatis duplicate guest data/consent/ticket.
- Slug aktif `menujuakad.id/andi-risa`; proposed `andi-risa-story` unavailable tanpa membocorkan pemilik, suggestion `andi-risa-14feb2027`. Editing draft slug tidak langsung memutus URL/token personal aktif.
- Preview, save draft, publish, duplicate dan archive punya state terpisah; tidak ada hidden autosave yang mempublikasikan.
- Theme comparison memakai konten/RSVP yang sama. Premium cukup sesuai sumber; jangan memaksa upgrade Lifetime atau reset data saat ganti tema.
- Domain preview `undangan.andi-risa.example`, CNAME/TXT `.example` adalah simulasi; TXT missing/SSL belum terbit harus tetap status pending. Jangan melakukan DNS/issuance nyata. Domain produksi tetap Hidden.

## Public microsite
- Hero/profile memakai Andi/Risa dan keluarga resmi dari kontrak global. Timeline2022/2025/2027 adalah konten ilustratif, jangan diklaim histori terverifikasi.
- Guide: akad 08.00, resepsi 10.00WIB14Feb2027/Bumi Samami. Aset `SR9iY.png` adalah denah skematis, **bukan peta venue terverifikasi**. Link arah/panduan akses tidak meminta geolocation otomatis.
- Galeri masonry/lightbox: pakai aset yang sama/crop yang benar; keyboard close/prev/next, focus return, alt text, lazy loading, explicit play/mute. Tidak ada audio/video autoplay wajib.
- No workspace dock pada public. Personal token opaque; jangan expose contact list, financial data, alamat kado atau kuota orang lain.

## RSVP per sesi dan consent
- Budi contoh: Akad 1/2, Resepsi 2/2. Ini **bukan3 unique people**. Validasi deadline/kuota/status per sesi dari server adapter; decline0, attend positive integer.
- Wishes: public display name berbeda dari identity/contact privat. Consent publikasi unchecked by default; submit invalid/unchecked tidak aktif. Tidak auto mempublikasikan konten submit.
- Photo fixture 2,8 MB; JPG/PNG≤10 MB; progress/retry/private preview. Review sebelum tampil, consent/withdrawal/retention dan kepemilikan jelas. Upload tidak otomatis visible di galeri publik.
- Moderation12 pending=8wishes+4photos,26 shown,3 hidden;4 rows adalah sample subset. Human action memiliki reason/version/audit; no-contact detector bukan vonis otomatis.
- Gifts tetap **inactive** untuk undangan aktif. Jangan menampilkan rekening/QRIS/alamat kado dari hidden source node atau mewajibkan hadiah sebelum RSVP.

## Analytics dan follow-up
- Range 19–25 Okt 2026:280 unique visitors,340 sessions,210personal opens,168online answers→80% dari personal opens. Online150 attend+18 decline; manual20 attend+12 decline→CRM170/30.
- Sessions per hari24/28/36/44/48/72/88=340; device245mobile+75desktop+20tablet=340. Jangan menyamakan sessions dengan unique people atau total undangan.
- Export analytics agregat, bukan personal token/contact dump. Terapkan range/loading/empty/error dan label denominator.
- Follow-up 150 unanswered/42 eligible/108 excluded.4 sample Hendra/Salsa/Bayu/Ayu dipilih eksplisit. Header mixed bukan berarti42 eligible sudah dipilih. Syarat consent+phone+cooldown terakhir, recheck sebelum dispatch; no double campaign-recipient.

## Optional inventory yang harus tetap jujur
Domain/DNS/SSL, gifts/QRIS/address, media/live, hotel/transport links, IG filter dan Wallet memiliki designed/internal/deferred/unsupported states. Jangan mengarang integrasi IG/Wallet atau mengaktifkan QRIS-kado. Wallet unsupported menawarkan galeri; install PWA bukan izin notifikasi. Implementasikan fallback yang relevan dan flag gates, bukan seluruh roadmap di luar scope.

## Acceptance tests
- VIP subset tidak menambah total 350; Lamaran tidak menerima update Pernikahan.
- Slug conflict tidak membocorkan owner; draft slug/theme tidak mengubah active publication/ticket.
- Session RSVP invalid/overquota/deadline/revoked tertolak; session sums tidak tampil sebagai unique count.
- Wishes/photos tanpa consent tidak dipublish; upload retry/withdraw/moderation menjaga private identity.
- Funnel/range/denominator cocok, export agregat;4 selected tidak berubah menjadi42 selected saat bulk action.
- Gifts/domain Hidden atau inactive tidak dapat dibuka sebagai produksi; fake DNS success dilarang.
- 375/768/1280 px, lightbox keyboard/focus, reduced motion/no autoplay dan media failure fallback diuji.

## Handoff
Konten/data manager dibagikan dengan studio Batch 06 melalui document/project schema yang sama. Jangan mencampur versi global template CMS Admin dengan versi proyek undangan pasangan. Adapter public hanya menerima fields yang memang boleh dipublikasikan.


## Inventaris frame wajib — diambil dari snapshot aktual

Total **16** frame desain/library/state/reference pada batch ini. Setiap ID harus dipetakan ke kode/state/component atau blocker yang dinyatakan, bukan otomatis satu route per frame.

| ID frame | Nama sumber | Jenis referensi |
|---|---|---|
| `DNjlJ` | 00H · Sistem Pengalaman Tamu — Privasi & sesi | component-library-not-route |
| `orG6X` | 53 · Multi-Undangan — Acara, varian & versi | screen-or-state |
| `ej3Si` | 54 · Alamat Undangan — Slug & konflik | screen-or-state |
| `w10ww` | 55 · Domain & DNS — Preview internal / Hidden | screen-or-state |
| `iybkq` | 56 · Bandingkan Tema — Akses, gerak & keterbacaan | screen-or-state |
| `oh4K3` | 57 · Analitik Undangan — Kunjungan & konversi RSVP | screen-or-state |
| `LQOhS` | 58 · Profil & Cerita — Microsite editorial | screen-or-state |
| `gb4IQ` | 59 · Panduan Tamu — Acara, denah & kenyamanan | screen-or-state |
| `saA1w` | 60 · Galeri, Lightbox & Media — Pilihan tamu | screen-or-state |
| `JLu7e` | 61 · RSVP Per Sesi — Kuota & batas konfirmasi | screen-or-state |
| `L5Awxn` | 62 · Ucapan & Doa — Nama publik dan persetujuan | screen-or-state |
| `Ll4xj` | 63 · Foto Momen — Izin, unggah & moderasi | screen-or-state |
| `E8d5oa` | 64 · Hadiah Opsional — Preview internal / nonaktif | screen-or-state |
| `MddxL` | 65 · Moderasi Ucapan & Foto — Persetujuan sebelum publik | screen-or-state |
| `Z5R5x` | 66 · CRM Lanjutan — Sesi & tindak lanjut berizin | screen-or-state |
| `IdxPj` | 66A · Fitur opsional, statusnya terang. | optional-scope-reference |

Baca `references/FRAME_INVENTORY.json` untuk annotations dan instance references, lalu inspeksi source `.pen` untuk hierarchy/override/style efektif. Sumber gambar dapat dilacak melalui `ASSET_MANIFEST.json`.
