# 05 — Scope Desain Pencil dan Perluasan Fitur V2

## Kedudukan dokumen dan sumber

Pembaruan 17 Oktober 2026 setelah permintaan pengguna untuk memasukkan fitur desain/slicing ke aturan refactor. **Seluruh kemampuan desain di bawah masuk scope target V2**, dengan availability dan prasyarat masing-masing; bukan sekadar ide yang boleh diabaikan. Statusnya **DESIGNED**, bukan backend selesai atau diaktifkan produksi.

Canvas aktif yang dibaca melalui MCP Pencil: `/C:/Users/ASUS/.pencil/documents/c5a247e7-ec44-4202-b361-d7caca1734c1/Menuju_Akad_v2.pen`. Paket lokal bernama **`Menuju_Akad_V2_Prompt_Slicing`**, bukan `Menuju_Akad_V2_Promt_Slicing`.

Sumber wajib:

- [Kontrak global](../Menuju_Akad_V2_Prompt_Slicing/00_KONTRAK_GLOBAL_AGENT.md), [README](../Menuju_Akad_V2_Prompt_Slicing/README.md), dan delapan prompt batch.
- [Inventaris frame](../Menuju_Akad_V2_Prompt_Slicing/references/FRAME_INVENTORY.json), [token](../Menuju_Akad_V2_Prompt_Slicing/references/DESIGN_TOKENS.json), [manifest aset](../Menuju_Akad_V2_Prompt_Slicing/references/ASSET_MANIFEST.json).
- [Handoff remediasi terkini](../Menuju_Akad_V2_Prompt_Slicing/references/audit/REMEDIATION_HANDOFF_MENUJU_AKAD_V2.md) dan [QA desain tersimpan](../Menuju_Akad_V2_Prompt_Slicing/references/audit/REMEDIATION_QA.json).
- [06 — Traceability](06_PENCIL_FRAME_TRACEABILITY.md) menghubungkan seluruh root snapshot dengan batch; [01](01_TECH_STACK_AND_ARCHITECTURE.md), [02](02_CLEAN_CODE_AND_ANTI_SPAGHETTI_RULES.md), [03](03_ROLES_AND_FEATURES_BLUEPRINT.md), dan [04](04_MASTER_AGENT_PROMPT.md) memakai perluasan ini sebagai kontrak.

Urutan otoritas: instruksi pengguna terbaru → desain V2 setelah remediasi → handoff terkini → kontrak batch → spesifikasi historis V1. Jika canvas aktif berubah dari snapshot, catat delta dan jangan menimpa perubahan pengguna. **`.pen` hanya diakses melalui MCP Pencil**, tanpa parsing/grep/read filesystem, termasuk ketika paket lama menyarankan fallback tersebut.

Audit ini menginventarisasi **180 root**, membaca detail teks/state pada **30 frame**, memeriksa variabel canvas, dan melihat screenshot sampel `bi8Au`, `mkFcs`, `A5HAQ`. Penghitungan snapshot: **167 design/library/state/handoff + 9 marker + 4 audit**, delapan batch, 12 PNG anchor. Bukan 180 halaman atau bukti seluruh alur executable. Inventaris nama/ID tidak membuktikan hash/konten canvas identik dengan snapshot.

Manifest menyimpan provenance dan hasil QA desain; audit ini tidak menghitung ulang hash `.pen`, menjalankan backend/browser test, atau menguji layanan. Angka **37 pemeriksaan aritmetika desain** dan **24 skenario R01–R24 + 6 A01–A06 pending** berasal dari handoff, bukan hasil test aplikasi baru.

## Dua track pelaksanaan yang berbeda

| Track | Kontrak |
|---|---|
| `UI_SLICING` | Default paket slicing: UI berfungsi dengan typed deterministic mock adapter, state/navigasi/validasi lokal. Tanpa bank/payment/OTP/WA/DNS/storage produksi; jangan mengklaim tersimpan atau terkirim sungguhan |
| `FULLSTACK_V2` | Implementasi use case, persistence, service/repository/policy, provider sandbox dan tes DB terpisah menurut 01–04; UI memakai kontrak domain yang sama. Aktivasi eksternal/produksi tetap terpisah |

Pencatatan desain saat ini tidak mengeksekusi salah satu track. Pada sesi implementasi, nyatakan track per batch dan status **DESIGNED → UI_MOCK → PERSISTENT_LOCAL → SANDBOX_VERIFIED → PRODUCTION_VERIFIED**. `Live` dalam fixture availability bukan bukti `PRODUCTION_VERIFIED`.

Urutan dependensi UI: **01 → Ekspansi → 02 → 03 → 04 → 05 → 06 → 07**. Ini tujuh batch bernomor dan satu Ekspansi, **tanpa Batch 08**. Batch 04 memiliki checkpoint 4A–4D agar CRM/check-in dan commerce tidak saling menghilangkan. Track fullstack boleh menyusun ulang increment backend menurut dependensi, tetap menjaga seluruh traceability dan paritas V1.

## Baseline availability dan feature release

**Release `#43` adalah baseline fixture desain**, bukan nomor rilis produksi yang diverifikasi audit ini.

| Fitur/pengalaman | Baseline desain | Perilaku wajib |
|---|---|---|
| Pasangan/planner/undangan | Live sesuai izin | Tetap cek membership, event, action, entitlement bila relevan |
| Vendor dan Brand Ambassador | **Hidden** | Registrasi/portal/entry baru ditutup; tampilan lengkap hanya sandbox Preset 3 |
| Marketplace/bundle/escrow/vendor-sync | Ikuti effective parent Vendor; vendor-sync Hidden | Tidak membuka checkout baru walau configured child Live/ComingSoon; fallback catatan vendor manual |
| Katering | **Coming Soon** | Teaser/waitlist; kalkulator lengkap hanya internal preview |
| Wedding Kit | **Maintenance** | Penjelasan/fallback; ownership pembelian lama tidak hilang |
| Custom domain/DNS | **Hidden/internal** | Tidak mengaktifkan DNS/SSL nyata dari preview |
| Hadiah undangan | **Nonaktif** | Rekening/QR/alamat subtree tersembunyi tidak dirender; RSVP tetap berjalan |
| Produk digital satuan/akses historis | Jalur terpisah | Tidak dimatikan otomatis karena Vendor/BA Hidden atau Wedding Kit Maintenance; tetap cek flag/policy produk |

Engine memisahkan configured state dan effective state: `Live | ComingSoon | Maintenance | Hidden`, `parentKey`, role availability, feature configuration, waitlist/maintenance message, release version dan audit. **Parent Hidden mengalahkan child Live tanpa menghapus konfigurasi anak.**

Preset 1/2/3 dan Custom Puzzle adalah draft konfigurasi. Alur rilis: edit → impact/cascade → alasan → acknowledgement → scoped verification/OTP → review versi → explicit publish. OTP tidak memberi permission, tidak langsung menerapkan release, dan tidak mengganti verifikasi terbaru saat commit. Rollback membuat penerapan versi yang diaudit.

Beta whitelist hanya boleh melewati status availability tertentu, bukan izin objek/role/entitlement. Internal preview memakai lingkungan/akses terisolasi; jangan query parameter publik untuk bypass. Hidden menutup operasi baru, tetapi tidak menghapus akun, order, saldo, hak beli atau recovery owner-scoped historis.

## Batch 01 — Fondasi, auth, akun dan pairing

Sumber: [Batch 01](../Menuju_Akad_V2_Prompt_Slicing/BATCH_01_FONDASI_AUTH_AKUN.md), terutama baris 81–118. Frame kunci: `MNC2H`, `VgqXJ`, `w6pWd`, `VUBCF`, `m34FY`, `tQXWQ`.

- Login email/password dan telepon/PIN; OTP enam digit, paste/autofill/resend/expired/wrong/network state; recovery password/PIN generik, rate-limited, tanpa kebocoran keberadaan akun.
- Onboarding profil/keluarga, rencana acara, invite partner, lanjut sendiri, pairing dua akun, quick inspector profil, privasi/notifikasi/perangkat/sesi, penghapusan akun dengan konfirmasi sensitif.
- Free/Premium/Lifetime memakai entitlement server. Fixture memiliki **Premium**, Lifetime hanya tawaran upgrade. Pemilih role hanya menampilkan konteks membership sah.
- Pisahkan actor, workspace, pasangan, event dan entitlement. Partner invite opaque, expiry/revoke/single-use; cegah duplicate membership dan jangan otomatis merge dua workspace.
- Dock expanded/compact, tooltip yang dapat diakses keyboard, contextual topbar, command palette Cmd/Ctrl+K; detail visual wajib menurut 01.
- Modul: `auth`, `account`, `planner-workspaces`, `plans`, `shell-navigation`; model target: `WorkspaceMembership`, `PartnerInvite`, `EventContext`, `PlanEntitlement`, `DeviceSession`, `NotificationPreferences`. Ini rancangan kontrak, bukan klaim schema V1 sudah lengkap.

## Batch 02 — Perencanaan dan pemenuhan produk digital

Sumber: [Batch 02](../Menuju_Akad_V2_Prompt_Slicing/BATCH_02_PERENCANAAN.md), baris 81–128. Frame: `Dx42c`, `FUxIj`, `WBpK5`, `V4Cg4P`, `USpKE`.

- Dashboard kesiapan/countdown/priority terpisah Pernikahan dan Lamaran; task/PIC/due date/status/inline edit, quick inspector, emergency bag, kalender fitting/test-food/deadline dan deteksi konflik.
- **KUA dua mempelai:** checklist bersyarat, dokumen privat, version/review/revisi. Unggah bukan verifikasi resmi; gagal replacement mempertahankan versi sebelumnya. Persyaratan contoh tidak dianggap nasihat hukum/ketentuan KUA terkini.
- Rundown builder/generator mempertahankan locked anchor, durasi/buffer/lokasi/PIC; hasil berupa preview/diff yang harus diterapkan eksplisit. Jangan menimpa edit manual diam-diam.
- Seserahan visual/progress/estimasi vs realisasi; moodboard kolaboratif dengan asset/note/URL; metadata URL melalui adapter aman, bukan akses platform privat.
- Katering internal preview/waitlist; Wedding Kit Maintenance; **produk digital satuan Rp49.000 adalah vignette checkout berbeda**, bukan aktivasi Kit.
- Digital fulfillment: provider verified → satu entitlement idempoten → akses privat + receipt → delivery attempt. Gagal WA/email, link expired atau download retry tidak menghapus hak beli atau meminta bayar ulang. Recovery melalui kanal transaksi terverifikasi, respons anti-enumeration.
- Modul: `planner-tasks`, `kua-documents`, `emergency-checklist`, `planner-calendar`, `planner-rundown`, `wedding-preparation`, `moodboards`, `catering`, `wedding-kit`, `digital-products`. Dashboard membaca selector finance/CRM, tanpa ledger duplikat.

## Batch 03 — Ledger keuangan event

Sumber: [Batch 03](../Menuju_Akad_V2_Prompt_Slicing/BATCH_03_KEUANGAN.md), baris 78–152. Frame: `w7nKVL`, `HYcrO`, `Q8dVnf`, `AsgIs`, `I1fa2`, `dXzYX`, `KyFHp`.

- Scope: ringkasan, tabungan/setoran/bukti, target/simulator, 11 kategori anggaran/PIC, pengeluaran/termin/bukti/audit, laporan/ekspor, CSV mapping/repair/dedupe/compare, rekening dana acara, mutasi dan koreksi.
- Pisahkan **`budgetPIC`, `paidBy`, `fundingScope/fundingAccountId`, `recordedBy`**. Rekening milik pribadi dapat memuat alokasi dana acara; pemilik rekening bukan penentu otomatis sumber biaya.
- `event_fund` menambah realisasi dan mengurangi dana acara; `external_private` menambah realisasi tanpa mengurangi dana acara. **Sisa rencana ≠ utang/tagihan terkonfirmasi**, saldo alokasi ≠ saldo bank tersinkron.
- Target/simulator tidak mem-post setoran atau autodebit. Kontribusi persentase harus 100% dengan presisi/rounding terdefinisi.
- Mutasi internal adalah debit/kredit atomik antarrekening event sama; bukan biaya/setoran tambahan atau instruksi transfer bank.
- Posted ledger immutable: koreksi **linked reversal + replacement**, alasan/bukti/actor/version/idempotency; jangan overwrite/delete transaksi posted.
- Opening allocation memakai cut-off/source yang direkonsiliasi; cegah overlap saldo awal dan import. Expense memakai `sourcePaymentId`/source key unik agar webhook/manual/import tidak double-post.
- Lamaran dan Pernikahan terisolasi pada account/ledger/target/task/izin. Pending/unknown payment bukan expense realized.
- CSV raw IDR/date; sumber dana dipilih eksplisit, invalid/duplicate tidak terpilih otomatis. Export UTF-8 semicolon, jenis laporan terpisah, data privat default-off; izin/event/filter dicek ulang saat commit/ekspor.
- Invariant: amount invalid/negatif/nol expense, overdraw, same-account transfer dan stale version ditolak; opening0 sah. Konflik menunjukkan diff/reapply; edit gagal mempertahankan draft.
- Modul `planner-finance`; model target: accounts/opening/contribution/budget/expense/evidence/installment/ledger/transfer/correction/import batch-row. Tambahkan schema/constraint bertahap, bukan scaffold seluruh model kosong.

Fixture regresi, **bukan hardcode/rekonsiliasi bank produksi**: target150 jt − kontribusi112,5 jt = gap37,5 jt; kontribusi112,5 jt − biaya57,5 jt = dana55 jt; sisa rencana92,5 jt. Alokasi10 +30,5 +14,5 jt =55 jt; mutasi9 jt tidak menambah total. Lamaran terpisah: target20, kontribusi12, biaya5, dana7, sisa rencana15 jt.

## Batch 04 — CRM, WhatsApp, seating, check-in dan marketplace

Sumber: [Batch 04](../Menuju_Akad_V2_Prompt_Slicing/BATCH_04_CRM_MARKETPLACE_CHECKOUT.md), baris 78–145. Frame: `o3Lcg`, `JGjTa`, `a50cJX`, `mkFcs`, `RB5cT`, `PFaIp`, `CyKZk`, `EudS2`, `c6ReWy`.

**CRM/dispatch/admission (checkpoint 4A–4B):**

- CRM group/contact/kuota/consent/sessionResponses/archive/revoke; import E.164, mapping, invalid/duplicate dan compare-before-merge. Save/import tamu bukan persetujuan WA atau pengiriman.
- Seating mengalokasikan rombongan menurut kapasitas; rombongan3 tidak muat pada sisa2 dan tidak dipecah otomatis.
- WA composer → eligible/excluded review → explicit dispatch → outcome/retry. Saat dispatch periksa consent terbaru, phone, dedup, cooldown, quota/availability. Retry hanya definitively failed; pending/unknown/accepted/delivered/read tidak di-blast ulang.
- Public invitation memakai token scoped; RSVP per sesi, jumlah hadir integer positif ≤ quota sesi, decline0; invalid/revoked recovery generik melalui pengirim. Angka sesi tidak dijumlahkan sebagai unique people.
- Check-in petugas event/session terbatas; **scan bukan admission**. Fresh online validation → jumlah datang → konfirmasi → commit atomik/idempoten. Offline queue belum admission; partial arrivals/duplicate/race/revoked operator harus aman.
- Petugas tidak diberi finance/export contacts/edit quota. Audit event/session/ticket/operator/gate/device/time/count dan koreksi dengan reason.
- Modul: `guests`, `rsvp`, `seating`, `check-in`, `notifications`; invitation token, order token, pairing token dan operator grant memiliki scope berbeda.

**Marketplace/commerce (checkpoint 4C–4D):**

- Discovery/filter/sort date/location/distance/price; geolocation opt-in + manual fallback; detail paket/portfolio/scope/time/pin, favorit/draft milik actor, bundle lintas vendor dan item quantity.
- Tepat **11 kategori marketplace**: Prewedding; Busana/Fitting; MUA; Seserahan/Mahar; Dokumentasi; Dekorasi/Florist; Katering; Kue/Dessert; Souvenir; Undangan Digital/Cetak/Hybrid; Denah Ilustrasi. Ini bukan daftar kategori anggaran.
- Server quote+hold memiliki versi dan expiry; perubahan item menginvalidasi quote; refresh/two tabs/timer lokal tidak memperpanjang hold. Availability diperiksa per item/vendor.
- Checkout jasa **tanpa wajib akun pasangan**, tanpa dock; data kontak/event/pin/syarat dan kanal transaksi, tanpa memaksa marketing/referral. Akses order melalui opaque token + pembuktian owner.
- Alur: draft → quote/hold → review item → approved contract snapshot → payment intent → provider verified → receipt. Penolakan satu item tidak membatalkan semua item accepted; replacement/revisi kontrak membutuhkan consent baru walau total sama.
- Snapshot kontrak immutable mencakup vendor/service/quantity/scope/event/time/location/IDR/fee/tax/discount/terms/version/expiry. Harga katalog baru tidak menulis ulang kontrak lama.
- DP/full/termin mengikuti snapshot approved. Invoice ≠ receipt/paid; redirect atau unggah bukti ≠ settlement. Unknown memeriksa intent lama, bukan membuat charge baru; verified duplicate webhook no-op.
- Retry charge hanya setelah **definitively failed/expired**, dengan pemeriksaan ulang quote/hold/version/nominal/cumulative paid terbaru agar tidak overpayment. Manual transfer/QRIS **baseline nonaktif**; internal preview tidak meminta transfer nyata. Instruksi pembayaran hanya dibuka jika flag serta rekening platform valid.
- Dispute intake owner/item/contract/payment, deadline server, bukti privat PDF/JPG/PNG≤10MB, dedup/reply/audit. Mengajukan sengketa bukan refund otomatis. Historical recovery terpisah dari new checkout yang Hidden.
- Modul: `marketplace`, `bundles`, `quotes`, `service-orders`, `contracts`, `payments`, `invoices`, `disputes`. Nama modul adalah pembagian tanggung jawab, bukan keharusan microservice.

Route seperti `/vendors`, `/bundles/:draftId`, `/checkout/services`, `/orders/:accessToken` dan `/payments/:intentId` adalah **usulan desain**, bukan endpoint V1 terverifikasi. Cocokkan handoff dan route registry sebelum implementasi.

## Batch 05 — Multi-undangan dan pengalaman tamu

Sumber: [Batch 05](../Menuju_Akad_V2_Prompt_Slicing/BATCH_05_PENGALAMAN_TAMU.md), baris 78–126. Frame: `orG6X`, `JLu7e`, `MddxL`, `IdxPj`.

- Multi-project/event/variant; activev3 berbeda draftv4; VIP subset tamu, bukan daftar tambahan. Duplicate project tidak menggandakan consent, guest atau ticket.
- Slug availability/conflict anti-enumeration; perubahan draft tidak memutus active URL/token. Domain/DNS/SSL internal memakai nilai contoh, bukan claim verifikasi.
- Compare/switch tema mempertahankan konten/RSVP dan hak Premium, tidak memaksa Lifetime/bayar ulang.
- Microsite mempelai/keluarga/story, acara/guide/denah, gallery/lightbox/media opt-in. Denah skematis bukan lokasi terverifikasi; link hotel/transport bukan booking atau availability terjamin.
- RSVP per sesi/kuota/deadline; online answer berbeda manual owner response. Public adapter hanya allowlist data yang boleh dilihat tamu.
- Ucapan/foto: nama publik berbeda identity privat, consent publikasi default unchecked, review sebelum publik, human moderation reason/version/audit, withdrawal/retention. Guest photo JPG/PNG≤10MB; kontak/catatan/dokumen privat tidak ikut feed.
- Analytics memakai definisi unique visitor/session/personal open/source/funnel/denominator; export agregat bukan dump token/kontak. Follow-up memilih eligible recipient nyata; “4 dipilih” tidak berarti42.
- Optional inventory: hadiah/QRIS/alamat, audio/video/live, domain, hotel/transport, IG filter, Wallet/PWA; tidak semua langsung aktif. Wallet unsupported → galeri; external embed hanya setelah tindakan/consent; PWA install bukan consent notifikasi.
- Modul: `invitations`, `invitation-renderer`, `domains`, `analytics`, `wishes`, `media`, `moderation`, `gifts`. Manager dan studio memakai document/project schema yang sama; versi CMS template global berbeda dari project pasangan.

## Batch 06 — Studio Visual/Form dan lifecycle

Sumber: [Batch 06](../Menuju_Akad_V2_Prompt_Slicing/BATCH_06_STUDIO_EDITOR.md), baris 78–134. Frame: `A5HAQ`, `DrJJ4`, `N6QLFs`, `boSgn`, `J42RnE`, `WcY8K`, `lgfpG`, `W214ws`.

- Visual dan Form adalah dua view dari **satu typed document**, bukan dua sumber data atau HTML-string tunggal. Sections/blocks/nodes, layout/style/assets/visibility/lock/order/motion/revision/expectedVersion serta draft/active eksplisit.
- Canvas375 CSS px, zoom125% berarti468,75 rendered px; zoom tidak mengubah document width. Select/group/rename/lock/reorder/flip/undo/redo/crop mempunyai kontrol keyboard/form alternatif drag; handles hanya UI editor.
- Save/autosave berbeda publish. Offline menyimpan dirty draft; reconnect mengecek ulang izin/versi. Restorev2 membuat **draft baruv5**, bukan mengganti activev3/RSVP/ticket.
- Replacement asset mempertahankan aset lama sampai yang baru valid; crop nondestructive dengan original/reset/ratio. Quota/progress/cancel/retry/sanitasi dan cross-tenant references teruji.
- Reduced motion mematikan efek efektif/loop/autoplay sambil menyimpan preferensi asli. Preview375/768/1280 harus reflow, bukan skala screenshot.
- Prepublish gate: isi/pin/media siap, actor/event ownership, entitlement, availability, privacy dan expectedVersion. Review snapshot+diff+ack unchecked → commit revalidasi atomik/idempoten. Unknown → periksa operation status sebelum retry.
- Premium valid cukup untuk publish fitur yang termasuk haknya; tidak perlu order baru setiap terbit. Unpublish konten/RSVP **bukan** revoke ticket. Archive draft tidak menghapus active; revoke ticket adalah aksi terpisah.
- Modul utama `invitation-editor` dengan schema/renderer bersama `invitations` dan `invitation-renderer`; history, media, collaboration dan publish use case dipisah tanggung jawab.

## Batch 07 — Vendor, BA dan operasi platform

Sumber: [Batch 07](../Menuju_Akad_V2_Prompt_Slicing/BATCH_07_VENDOR_BA_ADMIN.md), baris 79–148. Frame: `CJw2i`, `mDQYw`, `ZYbW5`, `VXnZN`, `huATE`, `rGfR1`, `MbVXe`, `XjU3V`, `g7JcA`, `HDg7g`.

- Vendor: katalog/profil/portfolio/paket, KYB/revisi rekening, pesanan per item/kontrak, kalender hold/confirmed/internal block, escrow/journal, request payout. Usulan rekening baru tidak menggantikan bank verified lama sebelum validasi; calendar block tidak membatalkan confirmed order.
- BA: rekrutmen vendor/atribusi, referral vs promo pasangan, komisi lintas program/marketing kit, withdrawal. Komisi15% contoh dari **eligible platform fee**, bukan GMV/registrasi; source/reversal mencegah double-credit.
- Escrow held, available, payout requested/accepted/scheduled/completed berbeda. Request hold sekali; recheck amount/KYB/bank/dispute/version/idempotency. Unknown tidak memulai pencairan baru.
- Admin: executive/funnel/cohort, calendar lintas vendor, KYB/private docs, moderation/contact scan, provider reconciliation/webhook, payout eligibility, dispute/refund, finance settings+scoped OTP, append-only audit.
- Refund cumulative cap ke metode asal, actor permission/reason/ack/version, fee/vendor journal reversal dan idempotency. Unknown ≠ failed; jangan membuat intent refund baru saat status belum pasti.
- Setting fee/bank versioned: fee baru untuk order baru, kontrak/jurnal historis tidak dihitung ulang; rekening platform berbeda dari payout vendor. OTP tidak memberi `financial_settings.write`.
- Operations: queue notifikasi/consent/dedup/retry, tiket privat/internal notes, CMS template/product/legal versions, health/maintenance, bulk accounts/session revoke. Larang self-escalation dan penghapusan last admin; recheck setiap objek bulk.
- Support hanya tiket sesuai assignment; tanpa KTP/rekening/fee/payout/export contacts. Finance diberi action scope sendiri. Mobile help/PWA bukan mobile admin universal.
- Contact scanner hanya sinyal, keputusan manusia; contoh `20×30cm` tidak otomatis dianggap nomor kontak.
- Modul: `vendor-businesses`, `vendor-kyb`, `vendor-availability`, `escrow`, `payouts`, `affiliates`, `commissions`, `reconciliation`, `disputes`, `refunds`, `payment-settings`, `audit`, `notifications`, `support`, `content`, `operations`, `users`. Domain lintas aktor dipakai bersama lewat kontrak, bukan diduplikasi per portal.

Fixture regresi terpisah: vendor available18,5 jt − request5 jt =13,5 jt; BA available6,4 jt − request1 jt =5,4 jt; pending300 rb bukan available. Captured15 jt − refund5 jt =10 jt; fee750 rb→500 rb, hak vendor14,25 jt→9,5 jt. Reconciliation12,5 jt−10,5 jt=2 jt adalah perbedaan status contoh, bukan otomatis kehilangan uang/transaksi baru.

## Acceptance lintas batch dan implementasi berikutnya

Setiap root di 06 dipetakan ke screen/state/component/handoff yang benar, modul pemilik, adapter, route bila memang diperlukan, policy, status implementasi, tes dan blocker. Marker/library/audit bukan otomatis route; mobile board berisi telepon375×812 bukan halaman berisi mockup/keyboard OS.

Retain empty/loading/ready/dirty/saving/saved/invalid/upload-error/offline/revoked/expired/stale/forbidden; retry mempertahankan draft dan tidak menggandakan side effect. Dialog focus trap/return, dirty-dismiss, keyboard375, target44, screen reader, contrast dan reduced motion harus diuji di runtime.

Gunakan fixture Andi/Risa dan waktu injeksi snapshot25 Oktober2026 untuk tes; jadwal Pernikahan14 Februari2027 Akad08–09/Resepsi10–14 WIB dan Lamaran22 November2026 terpisah. Nama keluarga/pihak/vendor dari vignette lain tidak diganti atau digabung ke ledger pasangan. Countdown runtime dihitung dari waktu/event/timezone.

Mode frontend memodelkan security/failure states, tetapi tidak mengklaim server enforcement. Track fullstack wajib menambahkan policy/data constraints/provider sandbox dan membuktikan R01–R24/A01–A06 sebelum klaim integrasi. Sesi audit ini hanya memperbarui dokumentasi; kode V1, canvas, snapshot dan paket slicing tidak diubah.
