# PROMPT BATCH 04 — CRM, undangan, check-in dan Marketplace/checkout

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


## Tugas spesifik dan pembagian pengerjaan
Batch 04 mencakup **CRM yang sudah ada** dan **addendum Marketplace52A–52P** untuk menutup master Tahap4. Jangan menghapus CRM, mengganti nama seluruh batch menjadi Marketplace, atau membuat Batch 08. Gunakan checkpoint4A CRM,4B undangan/check-in,4C discovery/bundler,4D checkout/recovery. Batch baru dinyatakan selesai setelah semua subbagian dipetakan.

Anchor: `o3Lcg.png`, `mkFcs.png`, `PFaIp.png`. Dependency: shell/auth/flags, keuangan hanya melalui adapter; detailed editor dilanjutkan Batch 06 dan operasional order Batch 07.

## 4A — CRM dan komunikasi
- `o3Lcg` guest table; `y3Mltv` create; `JVhyJ` inspector; `IteDr` import; `W1HD4` seating.
- `lHjOQ` WhatsApp composer; `JGjTa` eligibility/review; `c7xjuR` outcomes/retry.
- Model `GuestInvitation`, group, quota, sessionResponses, consent, contact, seatingAssignment, deliveryCampaign/recipient. Pisahkan jumlah **undangan, kuota, orang RSVP, status delivery, admission**.
- Create memerlukan nama dan positive integer quota; telepon optional; import nomor tidak berarti consent WA. Save tamu bukan send.
- Normalisasi E.164; invalid phone terpisah dari duplicate. Compare sebelum merge; jangan auto mengadopsi consent dari file.
- Archive tamu perlu konfirmasi, revoke token/ticket sesuai policy dan retain audit; jangan hard-delete tanpa aturan.
- Seating memakai jumlah orang/grup dan kapasitas. Rombongan3 tidak boleh masuk meja sisa2; tawarkan alternatif, jangan auto split.
- WhatsApp: eligible dihitung dari consent terbaru, phone valid, cooldown, dedup dan availability. Review selection lalu explicit send via adapter; pending tidak boleh double dispatch.
- Retry hanya definitively failed. Unknown/processing/read/delivered tidak boleh dikirim ulang massal. Recheck consent saat dispatch, bukan hanya saat membuka composer.

### Fixture CRM/WA
350 undangan, kuota 600;170 hadir/340 orang,30 tidak hadir,150 belum jawab. WA consent240, phone valid 330,220 delivered termasuk16 read (204 delivered-only+16 read).
- Import3 ready Alya2+Dimas1+Novi3→353 undangan/606quota; invalid Eko dan duplicate Budi excluded.
- Seating340RSVP,320 seated/20 unplaced,400 chairs=40×10. Table04 sisa2 tidak cukup Rafi3; Table05 sisa5 adalah alternatif.
- WA14 selected→10 eligible+4 excluded (2already sent+1no consent+1invalid). Quota 100→90 **hanya setelah accepted dispatch**.
- Outcome10=8 delivered+1 processing+1 failed. Follow-up eligibility tidak otomatis memilih semua row.

## 4B — Studio ringkas, public invitation dan check-in
- `seJ6W` themes; `dJfnu` settings/draft; `OZ2XF` publish review.
- `qSqgx` invitation; `uj3cI` RSVP; `l2XjAp` pass; `SqslJ` invalid link.
- `RJRrI` check-in console; `a50cJX` scan; `o5w7r3` exceptions; `kUeNq` staff scope/revoke.
- Draftv4 terpisah publicv3. Theme switch mempertahankan content/RSVP; no silent overwrite. Publish memerlukan izin, entitlement, version dan valid pin/upload, bukan upgrade paksa.
- Public14Feb2027: akad 08.00/resepsi 10.00 WIB/Bumi Samami. Deadline RSVP7Feb23.59 WIB. Hadiah off; no autoplay. Noindex bukan access control.
- Tamu memakai token opaque tanpa akun; tidak boleh membaca guest list/private quota orang lain. Invalid/revoked recovery generik melalui pengirim, tanpa membuka data owner.
- Budi quota 2/Table04. RSVP hadir harus positive integer≤kuota; decline0. Sessions tidak boleh dijumlahkan sebagai unique people.
- QR demo bukan ticket aktif. **Scan bukan admission.** Fresh online validate token/event/session/quota/status, tampilkan arriving count, lalu explicit atomic/idempotent commit.
- Check-in fixture 14 Feb:340RSVP=214validated+126remaining;3offlineexcluded. Budi arriving2→216/124 setelah commit satu kali. Duplicate2/2 atau remaining1/input2 harus ditolak/ditinjau, bukan increment lagi.
- Staff DinaGateA/RakaGateB/NayaCoordinator;14Feb07–16 WIB; invite24h. Tidak berhak finance/export kontak/edit quota. Revoke sesi dan revalidate queued action; correction perlu reason/audit.

## 4C — Marketplace11 kategori, favorit dan bundler
- `mkFcs` discovery, `VKRRC` same-date check, `y39xp` vendor detail, `KQuvx` favorites/drafts, `RB5cT` bundler, `p1hIw` changed-price/expired-hold.
- Kategori **tepat11**: Prewedding; Busana/Fitting; MUA; Seserahan/Mahar; Dokumentasi; Dekorasi/Florist; Katering; Kue/Dessert; Souvenir; Undangan Digital/Cetak/Hybrid; Denah Ilustrasi. Bukan11 kategori budget.
- Filter tanggal/lokasi/rentang harga/jarak, sort/search, explicit geolocation permission dan manual location fallback. Hasil kandidat bukan booking. Same-date check menampilkan status per vendor, jangan menganggap seluruh paket available karena satu item available.
- Detail memiliki package/scope/time/location/price/portfolio dan add/save actions. Favorites dan draft owner-scoped survive refresh dalam mock persistensi yang aman.
- Bundler quantity44 px stepper, subtotal per item, total, remove/save/resume. Perubahan item menginvalidasi quote/hold lama bila diperlukan; jangan menyimpan stale quote seolah confirmed.
- Kalyana unavailable14Feb karena Rama/Sinta; Lensa Teduh alternatif fiktif. Jangan mencampur kontrak ini dengan ledger Andi/Risa yang sudah memiliki expenses 57,5 jt.

## 4D — Checkout jasa dan pemulihan
- `PFaIp` guest checkout; `c1GHr` payment choice; `sCDXm` internal manual-payment preview; `f9tDH` unknown/failed/verified; `I7adT5` rejection/replacement; `CyKZk` contract review; `YDHrr` invoice/receipt/installment; `EudS2` owner dispute; `fyvrX` mobile 375 px; `c6ReWy` access/empty/offline/permission recovery.
- Checkout tanpa wajib akun penuh: event/contact/venue pin, validasi dan consent jelas, tanpa workspace dock. Registered Premium tidak perlu membeli paket lagi untuk guest checkout.
- Hold `expiresAt` dan quote version dari adapter/server. Countdown bukan source of truth; refresh/two-tab/local-clock tidak menambah TTL. Expired/stale→review quote kembali, bukan langsung charge.
- Quote snapshot: vendor/service/item, quantity/scope, event/time/pin, harga IDR, fee/discount/tax jika relevan, terms, version dan expiry. Tidak boleh menyembunyikan perubahan harga.
- AruMUA8 jt+LensaTeduh15 jt+LumaDekor12 jt=35 jt; DP30%=10,5 jt; sisa24,5 jt. Penolakan Luma→Rona12 jt hanya mengganti item itu; accepted items dipertahankan, availability/harga dicek ulang, kontrakv9 perlu consent baru walau total tetap35 jt.
- DP item2,4 jt+4,5 jt+3,6 jt=10,5 jt. Termin berikut14jt15Jan2027 dan 10,5jt7Feb2027. Jangan menambahkan quote/DP sandbox ke ledger aktual57,5 jt.
- State: draft→quote/hold→item review→approved contract→payment intent→verified payment→receipt. Jangan membayar sebelum prerequisites kontrak terpenuhi.
- DP/full/termin sesuai approved snapshot. Invoice belum sama dengan receipt/paid. Redirect/upload proof bukan settled. Manual payment/QRIS hanya jika flag/rekening valid; baseline tetap nonaktif dan preview internal tidak meminta transfer nyata.
- Unknown/timeout: retain intent/idempotency key, periksa status provider, **jangan charge ulang**. Retry hanya setelah definitively failed/expired dan checks quote/hold/paid total terbaru. Duplicate verified webhook no-op.
- Dispute terkait owner/item/contract/payment, reason, privatePDF/JPG/PNG≤10 MB, deadline dari contract policy server, dedup/status/reply.21Feb23.59 WIB adalah contoh kontrak, bukan kebijakan legal final. Submit bukan automatic refund; respons Admin Batch 07.
- Hidden menutup purchase baru, bukan menghapus order/entitlement historis. Historical recovery harus route terpisah dengan owner verification, tidak menjadi bypass katalog/checkout baru.

## Data/adapter boundaries
Gunakan adapter typed untuk GuestCRM, Dispatch, RSVP, TicketValidation/Admission, CatalogAvailability, BundleDraft, QuoteHold, OrderItemAcceptance, ContractSnapshot, PaymentIntentStatus, Receipt dan Dispute. Server adalah otoritas izin/hold/quota/payment. Mock memungkinkan test state, tidak membuktikan enforcement sungguhan. Usulan route `/vendors`, `/bundles/:id`, `/checkout/services`, `/orders/:opaqueToken/*` harus diselaraskan dengan routing existing.

## Acceptance tests prioritas
- CRM metrics/quota/RSVP/delivery tidak tertukar; import tanpa consent; selection/eligibility/retry benar.
- RSVP invalid/overquota/revoked; QRoffline/duplicate/race/revoked-staff tidak menambah admission.
- 11categories lengkap; filter/same-date check/favorites/bundle persist; quantity/remove mengubah total benar.
- Stale price/hold expired/one item rejected memerlukan review ulang dan tidak merusak item lainnya.
- Contract version mismatch/unchecked consent mencegah commit. Unknown/double-click/duplicate webhook tidak membuat charge kedua.
- Partial invoice/DP/remaining/receipt cocok; dispute duplikat/wrong owner/deadline invalid ditolak.
- Baseline Vendor/BA Hidden, manual payment off; internal sandbox tidak bocor melalui public query bypass.
- 375 px keyboard/safe-area,44 px targets, focus return, screen-reader error/status, tanpa horizontal page overflow.


## Inventaris frame wajib — diambil dari snapshot aktual

Total **36** frame desain/library/state/reference pada batch ini. Setiap ID harus dipetakan ke kode/state/component atau blocker yang dinyatakan, bukan otomatis satu route per frame.

| ID frame | Nama sumber | Jenis referensi |
|---|---|---|
| `dxIqb` | 00G · Sistem Tamu — Definisi, status & komponen | component-library-not-route |
| `o3Lcg` | 43 · CRM Tamu — Undangan, kuota & RSVP | screen-or-state |
| `y3Mltv` | 43A · Tambah Undangan — Data minimum & izin terpisah | screen-or-state |
| `JVhyJ` | 43B · Detail Undangan — Kuota, izin & tiket personal | screen-or-state |
| `IteDr` | 44 · Impor Tamu — Normalisasi nomor & deduplikasi | screen-or-state |
| `W1HD4` | 45 · Penempatan Meja — Kapasitas & rombongan | screen-or-state |
| `lHjOQ` | 46 · WhatsApp — Template & penerima yang memenuhi syarat | screen-or-state |
| `JGjTa` | 46B · Tinjauan WhatsApp — Pengecualian & konfirmasi | screen-or-state |
| `c7xjuR` | 47 · Hasil WhatsApp — Status pesan & retry terarah | screen-or-state |
| `seJ6W` | 48 · Galeri Tema — Editorial, Cypress & Monochrome | screen-or-state |
| `dJfnu` | 49 · Studio Undangan — Draf, RSVP & privasi | screen-or-state |
| `OZ2XF` | 49B · Publikasi Undangan — Draf ke versi aktif | screen-or-state |
| `qSqgx` | 50 · Undangan Personal Mobile — Tamu tanpa akun | screen-or-state |
| `uj3cI` | 50B · RSVP Mobile — Kuota & jawaban pribadi | screen-or-state |
| `l2XjAp` | 50C · Tiket Personal — Konfirmasi & QR demo | screen-or-state |
| `SqslJ` | 50D · Tautan Tidak Tersedia — Privasi & pemulihan | screen-or-state |
| `RJRrI` | 51 · Konsol Check-in — Akses operasional terbatas | screen-or-state |
| `a50cJX` | 51B · Pindai Tiket — Validasi sebelum catat kedatangan | screen-or-state |
| `o5w7r3` | 51C · State Check-in — Offline, duplikat & batas kuota | screen-or-state |
| `kUeNq` | 52 · Akses Petugas — Cakupan acara & pencabutan | screen-or-state |
| `mkFcs` | 52A · Temukan tim untuk hari kalian. | screen-or-state |
| `VKRRC` | 52B · Satu tanggal. Semua vendor diperiksa. | screen-or-state |
| `y39xp` | 52C · Lensa Teduh Photo | screen-or-state |
| `KQuvx` | 52D · Favorit & draf paket | screen-or-state |
| `RB5cT` | 52E · Racik paket lintas vendor | screen-or-state |
| `p1hIw` | 52F · Harga berubah / hold berakhir | screen-or-state |
| `PFaIp` | 52G · Checkout jasa tanpa akun | screen-or-state |
| `c1GHr` | 52H · Pilih cara pembayaran | screen-or-state |
| `sCDXm` | 52I · Pembayaran manual · preview internal | screen-or-state |
| `f9tDH` | 52J · Status pembayaran yang tidak menebak | screen-or-state |
| `I7adT5` | 52K · Satu item ditolak, paket tetap aman. | screen-or-state |
| `CyKZk` | 52L · Tinjau kontrak sebelum menyetujui | screen-or-state |
| `YDHrr` | 52M · Invoice, receipt & termin berikutnya | screen-or-state |
| `EudS2` | 52N · Ajukan sengketa secara terarah | screen-or-state |
| `fyvrX` | 52O · Checkout mobile ·375px | responsive-reference-board-not-whole-page |
| `c6ReWy` | 52P · Akses aman dan pemulihan katalog | screen-or-state |

Baca `references/FRAME_INVENTORY.json` untuk annotations dan instance references, lalu inspeksi source `.pen` untuk hierarchy/override/style efektif. Sumber gambar dapat dilacak melalui `ASSET_MANIFEST.json`.
