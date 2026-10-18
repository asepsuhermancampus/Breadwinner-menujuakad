# Laporan Batch 05 — Multi-undangan dan Pengalaman Tamu

Tanggal: 19 Oktober 2026. Track increment: **UI_SLICING**, status: **UI_MOCK**.
Batch 05 dinyatakan selesai setelah manajer multi-undangan, alamat/slug, domain & DNS internal (Hidden), perbandingan tema, analitik undangan, moderasi ucapan & foto, CRM tindak lanjut berizin, dan microsite editorial tamu (profil/cerita, panduan, galeri/lightbox, RSVP per sesi, ucapan, foto momen, hadiah nonaktif) berhasil dislice ke rute kanonikal produksi dan seluruh gate verifikasi hijau.

---

## Hasil Verifikasi

| Gate                    | Perintah                   | Hasil                                           |
| ----------------------- | -------------------------- | ----------------------------------------------- |
| Format                  | `npm run format:check`     | lulus, 100% Prettier code style                 |
| Lint + batas arsitektur | `npm run lint`             | lulus, 307 modul, ≤200 baris/berkas, nol siklus |
| Typecheck strict        | `npm run typecheck`        | lulus, 0 error                                  |
| Prisma validate         | `npm run db:validate`      | lulus, skema valid 🚀                           |
| Unit/integration        | `npm test`                 | 93 tes / 21 berkas lulus (tambah 3 berkas baru) |
| Build produksi          | `npm run build`            | lulus, 33 rute kanonikal                        |
| Browser E2E             | `CI=1 npx playwright test` | 67 tes lulus (regresi penuh, termasuk batch 04) |

---

## Rute Kanonikal

| Rute                          | Fungsi                                                                             |
| ----------------------------- | ---------------------------------------------------------------------------------- |
| `/planner/invitations`        | Manajer multi-undangan (frame 53) + panel bandingkan tema/analitik/moderasi/domain |
| `/planner/invitations/studio` | Studio Undangan Batch 04 (dipindah; tab CRM "Studio Undangan ↗" mengarah ke sini)  |
| `/planner/guests`             | CRM Batch 04 + tab baru **Tindak Lanjut** (frame 66)                               |
| `/i/[token]`                  | Undangan personal + tiket Batch 04 (tidak berubah)                                 |
| `/i/[token]/acara`            | Microsite editorial tamu Batch 05, tanpa dock workspace                            |

---

## Pemetaan 16 Frame Desain

| ID Frame | Nama Sumber                                        | Implementasi Kode                                                                                 |
| -------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `DNjlJ`  | 00H · Sistem Pengalaman Tamu — Privasi & sesi      | Kontrak domain `guest-experience/domain/session-rsvp.ts`; prinsip privasi diterapkan lintas seksi |
| `orG6X`  | 53 · Multi-Undangan — Acara, varian & versi        | `ManagerScreen` + `ProjectCard` di `/planner/invitations`                                         |
| `ej3Si`  | 54 · Alamat Undangan — Slug & konflik              | `AddressInspector` + `invitation-manager/domain/slug.ts` (conflict tidak membocorkan pemilik)     |
| `w10ww`  | 55 · Domain & DNS — Preview internal / Hidden      | `DomainPanel` (panel state, bukan route publik; simulasi ≠ keberhasilan produksi)                 |
| `iybkq`  | 56 · Bandingkan Tema — Akses, gerak & keterbacaan  | `ThemeComparePanel` (konten & RSVP sama, tidak direset)                                           |
| `oh4K3`  | 57 · Analitik Undangan — Kunjungan & konversi RSVP | `AnalyticsPanel` (280/340/210/168·80%, rekonsiliasi CRM 150+18 / 20+12 = 170+30)                  |
| `LQOhS`  | 58 · Profil & Cerita — Microsite editorial         | `MicrositeScreen` home (hero, keluarga resmi, milestone 2022/2025/2027)                           |
| `gb4IQ`  | 59 · Panduan Tamu — Acara, denah & kenyamanan      | `GuestGuideSection` (denah skematik SR9iY.png + disclaimer, tanpa geolocation otomatis)           |
| `saA1w`  | 60 · Galeri, Lightbox & Media — Pilihan tamu       | `GuestGallerySection` (masonry, lightbox Esc, video/musik opt-in eksplisit)                       |
| `JLu7e`  | 61 · RSVP Per Sesi — Kuota & batas konfirmasi      | `SessionRsvpSection` + `validateSessionRsvp` (Akad 1/2, Resepsi 2/2, decline=0, deadline)         |
| `L5Awxn` | 62 · Ucapan & Doa — Nama publik dan persetujuan    | `WishesSection` (consent unchecked default; submit disabled tanpa consent)                        |
| `Ll4xj`  | 63 · Foto Momen — Izin, unggah & moderasi          | `MomentsSection` (JPG/PNG ≤10 MB, consent, masuk antrean moderasi)                                |
| `E8d5oa` | 64 · Hadiah Opsional — Preview internal / nonaktif | `GiftsSection` (rekening disamarkan, tanpa QRIS aktif, alamat privat)                             |
| `MddxL`  | 65 · Moderasi Ucapan & Foto — Persetujuan          | `ModerationPanel` (12 pending=8+4, 26 shown, 3 hidden; tolak wajib alasan)                        |
| `Z5R5x`  | 66 · CRM Lanjutan — Sesi & tindak lanjut berizin   | `FollowUpView` di tab Tindak Lanjut (150/42/108; 4 sampel terpilih, recheck saat dispatch)        |
| `IdxPj`  | 66A · Fitur opsional, statusnya terang             | Inventaris status opsional direfleksikan di panel domain/hadiah (Hidden/nonaktif, bukan live)     |

---

## Keputusan Arsitektur

- **Manajer vs Studio:** `/planner/invitations` kini manajer multi-undangan (frame 53); studio Batch 04 pindah ke `/planner/invitations/studio` — satu `goto` di `tests/e2e/batch04-crm-marketplace.spec.ts` disesuaikan; regresi batch 04 tetap hijau.
- **Domain & DNS bukan route:** sesuai kontrak "Hidden tidak dapat diaktifkan lewat URL langsung", frame 55 diimplementasikan sebagai panel state di dalam manajer.
- **Pemisahan content vs fixture:** konten demo dimiliki feature (`features/*/content/`); `src/preview/fixtures/*` hanya re-export untuk adapter preview — batas arsitektur (fitur tidak boleh mengimpor fixture) tetap terjaga.
- **Domain logic typed:** `checkSlug` (slug registry deterministik, tanpa kebocoran identitas), `validateSessionRsvp` (deadline 7 Feb 2027 23.59 WIB, kuota per sesi, decline=0, pax integer positif), `recheckEligibility` (consent + jawaban + cooldown) — semua diuji vitest.
- **Handoff Batch 06:** manajer memakai `InvitationProject` typed (state/version/slug/sourcePool) — schema document/project yang sama dipakai studio editor Batch 06; draf v4 vs aktif v3 tetap terpisah.

## Batasan & Pembedaan Mode

- Seluruh data (slug registry, analytics, moderasi, follow-up, microsite) adalah **mock deterministik Preset 3** — tidak ada WhatsApp nyata, DNS nyata, upload nyata, atau QRIS.
- Domain tetap **Hidden**; simulasi verifikasi eksplisit menyatakan "Domain tetap Hidden pada rilis aktif — tidak tersedia untuk produksi".
- Hadiah **nonaktif** pada undangan aktif: rekening contoh disamarkan (••••), tanpa QRIS, alamat pengiriman hanya via kanal privat.
- Ucapan/foto tidak pernah tampil publik tanpa consent + moderasi pasangan; nama publik default "Tamu undangan".
- Sesi RSVP tidak dijumlahkan sebagai orang unik; kuota per sesi diverifikasi ulang saat simpan (server enforcement ditandai pending).
