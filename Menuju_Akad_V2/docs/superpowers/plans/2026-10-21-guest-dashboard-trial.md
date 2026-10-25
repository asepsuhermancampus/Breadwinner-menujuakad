# Guest Dashboard Trial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Menyediakan dashboard SaaS bersama untuk tamu dan pelanggan, dengan sepuluh perubahan Free lokal bagi tamu dan akses akun sesuai paket.

**Architecture:** Gunakan konteks akses eksplisit `guest` atau `account`, shell bersama dan adapter penyimpanan terpisah. Penyimpanan tamu memakai satu snapshot localStorage berversi dan Web Locks untuk serialisasi perubahan lintas tab; server pelanggan tetap mempertahankan autentikasi serta validasi capability. Komponen mengomit tindakan sebelum memperbarui tampilan final sehingga penolakan kuota tidak menghasilkan data semu.

**Tech Stack:** Next.js 16.4.2 App Router, React 19, TypeScript, Auth.js, localStorage/Web Locks, Vitest dan Playwright; Node 24.

**Spec:** `docs/superpowers/specs/2026-10-21-guest-dashboard-trial-design.md` — telah disetujui pengguna.

## Global Constraints

- Tamu: **maksimal 10 perubahan berhasil secara total**, bukan per fitur atau per ketikan; sepuluh tersimpan, kesebelas ditolak.
- Akun Free tidak terkena batas trial; tetap maksimum 100 tamu dan satu undangan dasar.
- Tidak ada penulisan database, publikasi atau tindakan eksternal dari input trial tamu.
- Label paket: **Free**, **Premium**, **Lifetime**; navbar tamu **Masuk** dan **Coba dashboard gratis**; akun login **Dashboard**.
- Data trial tidak otomatis diimpor setelah login; data akun tidak masuk penyimpanan trial.
- Pertahankan pembayaran, kredit upgrade, panduan fitur dan pengingat yang ada.
- Tidak commit, push, worktree, dependensi baru atau penghapusan data pengguna. Pertahankan tes regresi; hapus hanya artefak sementara milik verifikasi ini.
- Baca panduan Next lokal yang relevan sebelum mengubah route; semua modul sumber tetap maksimal 200 baris setelah format.

## Review Focus

1. Dua tab mengomit perubahan kesepuluh secara bersamaan: tepat satu berhasil, tidak ada kuota lebih atau kehilangan data yang sudah dikomit.
2. Storage penuh/tidak tersedia atau snapshot rusak: kegagalan terlihat, tidak mengaku tersimpan dan tidak mereset kuota rusak secara diam-diam.
3. Formulir memegang state optimistis: perubahan ditolak tidak boleh bertahan sebagai data tersimpan; input draf boleh tetap ada untuk disalin.
4. Sesi berubah atau logout: tidak menampilkan data akun sebelumnya pada trial dan tidak memakai trial sebagai data akun.
5. URL langsung dan navigasi lama: fitur berbayar atau halaman contoh tidak menyediakan jalur mutasi tanpa pemeriksaan akses/kuota.

## File Structure

Paths berikut relatif terhadap `Menuju_Akad_V2/`.

- Buat `src/features/dashboard-trial/{types.ts,domain/trial-snapshot.ts,domain/trial-validation.ts,storage/trial-store.ts,hooks/use-trial-resource.ts,components/trial-provider.tsx,components/trial-notice.tsx}`: kontrak, validasi, komit lokal dan status trial. Pecah lock/storage-events bila perlu agar tiap modul kecil.
- Buat `src/features/customer-workspace/domain/dashboard-access.ts`: konteks akses dan workspace Free netral untuk tamu, tanpa akses server.
- Buat `src/features/customer-workspace/components/{customer-sidebar.tsx,customer-sidebar.module.css,customer-header.tsx,customer-sign-out.tsx,resource-editor.tsx,invitation-editor.tsx}`: sidebar, header, logout dan batas antara draf serta data yang sudah disimpan.
- Ubah `customer-shell.tsx`, `customer-resources.tsx`, `customer-invitations.tsx`, `customer-account.tsx`, serta hook resource: gunakan komponen bersama dan kontrak komit yang dapat ditolak.
- Ubah route dashboard, resource, undangan, studio, wedding-kit, akun dan halaman planner contoh; gunakan resolver konteks bersama di `src/app/_components/`.
- Ubah landing nav dan CTA Free; tambahkan status sesi nyata tanpa membawa data privat ke cache publik.
- Buat tes unit colocated untuk domain/store/access; buat `tests/e2e/dashboard-trial.spec.ts` dan `tests/e2e/dashboard-session.spec.ts`; daftarkan pada `playwright.customer.config.ts`.

## Task 1: Kontrak trial dan komit lokal yang konsisten

**Interfaces:** `TrialResourceKind = "tasks" | "documents" | "guests" | "finance" | "invitations"`; `TrialSnapshot = {version:1, revision:number, used:number, resources:Partial<Record<TrialResourceKind,unknown[]>>}`. `TrialCommitResult` adalah union `{ok:true,snapshot:TrialSnapshot,changed:boolean}` atau `{ok:false,reason:"limit"|"invalid"|"conflict"|"storage",message:string}`. `TrialStore.read(): TrialSnapshot`, `commit(kind,data,expectedRevision): Promise<TrialCommitResult>`, `subscribe(listener): () => void`.

- [x] Tulis tes gagal untuk 4 komit tugas + 3 tamu + 3 anggaran menghasilkan `used === 10`; komit ke-11 menghasilkan `reason === "limit"` dan snapshot sama. Data identik, data tidak valid, melebihi 100 tamu atau lebih dari satu undangan dasar tidak mengurangi kuota.
- [x] Jalankan `npm test -- src/features/dashboard-trial`; pastikan gagal karena kontrak belum ada.
- [x] Implementasikan validator browser yang bebas `server-only`, snapshot berversi dan satu key `menuju-akad:guest-trial:v1`. Gunakan batas/skema yang sama dengan resource Free server; jangan melonggarkan server. Tolak `published:true` dan template premium pada trial.
- [x] Implementasikan baca/komit atomik melalui Web Locks dengan nama tetap; di dalam lock baca ulang snapshot, cek revision, validasi dan tulis data+used sebagai satu nilai sebelum memberi hasil sukses. Konflik harus meminta pemuatan data terbaru, tidak menimpa snapshot tab lain. Bila Web Locks tidak tersedia, jelaskan trial simpan tidak didukung; jangan memakai lock semu yang dapat melebihi kuota.
- [x] Tambahkan tes storage gagal, snapshot rusak, reload, subscribe/storage event dan dua store bersamaan pada `used === 9`: hanya satu komit berhasil. Jalankan suite trial sampai lulus.

## Task 2: Konteks akses dan editor Free bersama

**Interfaces:** `DashboardAccess = {mode:"guest",workspace:CustomerWorkspace} | {mode:"account",workspace:CustomerWorkspace}`. `guestDashboardAccess(): DashboardAccess` menggunakan capability Free, id lokal tetap dan profil netral tanpa DB. Hook trial mengembalikan `data`, `error`, `saving`, `save(data): Promise<boolean>`; `false` berarti komit tidak terjadi. Editor menerima adapter dengan kontrak ini; hook akun disesuaikan mengembalikan keberhasilan tanpa mengubah protokol API.

- [x] Tulis tes gagal: tamu mendapat capability Free, bukan studio/moodboard/PDF; akun mempertahankan workspace dan capability server. Adapter tamu tidak pernah memanggil fetch resource pelanggan.
- [x] Jalankan tes baru untuk membuktikan kegagalan, lalu implementasikan konteks dan provider trial. Provider hanya membungkus subtree tamu; jangan memanggil hook bersyarat dalam satu komponen.
- [x] Pisahkan editor sumber daya dari pemilihan adapter pada `customer-resources.tsx`. Tambah penghalang komit pada tindakan tambah/edit/hapus/status; tinjau komponen TasksScreen, GuestCrmScreen dan CustomerNotes sebelum menyesuaikan kontraknya. State final hanya berubah setelah komit diterima. Tampilkan sumber penyimpanan yang benar.
- [x] Pisahkan `invitation-editor.tsx`: perubahan kolom menjadi draf, tombol **Simpan undangan** menghasilkan satu komit. Penambahan/penghapusan adalah tindakan masing-masing; ketikan dan perubahan template yang belum disimpan tidak dihitung. Tamu tidak mempunyai checkbox publikasi aktif atau tautan publik palsu.
- [x] Uji penolakan komit pada tugas, tamu, catatan dan undangan: data final tetap sama, kesalahan terlihat dan draf formulir tidak hilang. Uji ketikan beberapa kolom undangan hanya menambah satu kuota setelah Simpan. Jalankan tes trial/access/editor sampai lulus.

## Task 3: Sidebar SaaS, identitas dan sesi nyata

**Interfaces:** `CustomerShell` menerima `access: DashboardAccess`, children dan `autoStartGuide`; call site akun dapat dimigrasi bersama. Sidebar menerima `access`, pathname dan handler tutup drawer. Semua label/kunci diturunkan dari capability aktif, bukan fixture. `TrialNotice` membaca provider untuk `used` serta dialog limit dan tautan login dengan return path lokal.

- [x] Tulis tes gagal untuk label Free/Premium/Lifetime, navigasi terkunci, sisa kuota dan logout di bawah sidebar. Tambah browser assertion sidebar mobile dapat dibuka, ditutup dan dipakai dengan keyboard.
- [x] Implementasikan sidebar/header bersama dengan visual SaaS yang ada, tanpa nama/statistik/tanggal palsu. Pertahankan ID fokus fitur dan SubscriptionExperience untuk pemilik akun saja. Tamu tidak menjalankan efek panduan paket akun.
- [x] Implementasikan TrialNotice: sukses ke-10 tetap tersimpan; percobaan berikutnya membuka dialog **Masuk untuk melanjutkan**. Penjelajahan/menu tetap tersedia ketika kuota habis.
- [x] Implementasikan logout Auth.js asli dengan CSRF/session flow resmi yang digunakan proyek. Kosongkan cache tampilan akun melalui navigasi/refresh yang sesuai, tanpa menyalin data akun ke localStorage. Hindari logout preview.
- [x] Uji quota notice, akses keyboard/drawer dan logout yang mengganti konteks ke tamu tanpa data akun. Jalankan tes terkait sampai lulus.

## Task 4: Route bersama dan penguncian semua jalur

**Interfaces:** resolver server mengembalikan `DashboardAccess` memakai `customerContext()` untuk sesi nyata dan guest netral jika tidak ada sesi; tamu tidak membuat workspace. Komponen resource menerima konteks dari resolver. Penolakan capability menampilkan penjelasan dan CTA paket/login sesuai mode.

- [x] Baca panduan page/layout Next lokal. Tulis browser regression gagal untuk dashboard tamu, URL langsung moodboard/studio/PDF dan halaman planner contoh yang tidak boleh menyediakan mutasi bebas.
- [x] Migrasikan `/dashboard`, `/planner/{tasks,kua,guests,finance,invitations,moodboard}`, studio, wedding-kit dan `/account` ke shell/konteks bersama. Free trial menggunakan editor Task 2. Akun menggunakan data server tanpa penghitung tamu.
- [x] Audit kalender, rundown, seserahan, emergency serta command palette/tautan dashboard. Halaman yang belum mempunyai alur pelanggan tampil sebagai pratinjau dengan label jujur dan kontrol mutasi dinonaktifkan; catering/menu placeholder bertanda Segera tersedia. Jangan mempertahankan fallback preview yang membuka fitur berbayar.
- [x] Tamu di pengaturan akun melihat ajakan login, tidak form akun yang diam-diam mengirim API atau data profil contoh. Halaman paket tetap dapat dibaca dengan provider pembayaran yang sesuai; checkout mempertahankan aturan login yang ada.
- [x] Perbaiki `customer-account.tsx` dengan PlanPurchaseProvider untuk LandingPlanCard; perbarui petunjuk Keluar pada tab keamanan.
- [x] Uji halaman paket tidak melempar “Plan purchase provider missing”; uji URL langsung berbayar, command palette dan menu contoh. Pastikan tidak ada request mutasi pelanggan oleh guest. Jalankan tes route dan regresi akses paket sampai lulus.

## Task 5: Navbar landing mengikuti sesi dan perpindahan login

**Interfaces:** landing nav memperoleh status sesi terverifikasi melalui komposisi server atau endpoint sesi Auth.js, bukan `/api/auth/status` yang hanya menyatakan konfigurasi provider. Data yang dikirim ke nav cukup status autentikasi, tanpa kredensial/profil yang tidak diperlukan.

- [x] Tambah browser regression gagal: navbar tamu berisi **Masuk** dan **Coba dashboard gratis**; tombol kedua menuju `/dashboard`. Akun login hanya mempunyai CTA **Dashboard**. Uji viewport mobile juga.
- [x] Implementasikan status nav dengan keadaan loading yang tidak menampilkan CTA tamu seolah sudah dipastikan. Jika memakai komposisi server, cegah cache HTML sesi privat antar-pengguna. Ubah CTA coba Free agar konsisten.
- [x] Uji sesi tamu yang sudah menghabiskan 10 trial kemudian login: akun Free dapat menyimpan lebih dari 10 perubahan akun, data trial tetap terpisah. Sesudah logout tampil trial lokal sebelumnya tanpa data akun. Pastikan callback login kembali ke path aplikasi yang aman.
- [x] Jalankan tes navbar dan perpindahan sesi sampai lulus; jangan mengubah login Google, login checkout atau aturan pembayaran.

## Task 6: Verifikasi lengkap, review dan lingkungan lokal

- [x] Daftarkan kedua spec browser pada konfigurasi customer dengan database SQLite sementara. Gunakan helper sesi pelanggan yang ada, bukan kredensial Google produksi; jangan membuat tagihan gateway riil.
- [x] Jalankan browser trial: 10 perubahan di beberapa fitur, reload, tab kedua, penolakan ke-11, URL berbayar, perangkat mobile, kegagalan storage dan nol request mutasi resource pelanggan saat tamu. Jalankan akun Free/Premium/Lifetime, halaman paket, logout serta regresi checkout/guide/upgrade.
- [x] Jalankan `npm test`, `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run build`, lalu `npm run test:e2e:customer -- --reporter=line`. Format file yang diubah saja sebelum pengujian final. Build dan server pengujian menggunakan port terpisah dari dev 3201.
- [x] Jalankan satu review independen menyeluruh setelah implementasi, sesuai executing-plans; tinjau akses server, kuota browser, route preview, kebocoran sesi dan regresi pembayaran. Perbaiki temuan penting dan ulangi pemeriksaan yang relevan.
- [x] Bersihkan hanya file sementara dan database E2E buatan tugas ini setelah proses berhenti; jangan menghapus ledger pembayaran riil, env atau tes permanen. Pastikan lokal `http://127.0.0.1:3201` tetap dapat dibuka untuk pengguna.
- [x] Laporkan perubahan, jumlah tes yang benar-benar lulus dan batas browser trial. Jangan mengklaim selesai bila pemeriksaan belum dijalankan atau gagal.

## Execution Handoff

Rekomendasi: **Native / langsung di sesi ini**, mengikuti izin pengguna sebelumnya ketika Gemini/AGY tidak tersedia. Kontrak penyimpanan, editor dan shell saling bergantung; satu pelaksana mengurangi perubahan antarmuka yang bertabrakan, dengan satu reviewer independen di akhir. Rencana telah disetujui dan dieksekusi langsung di sesi ini.

## Implementation evidence (22 October 2026)

- Completed all six tasks; changes remain local, without commits, push or worktree.
- 497 unit tests in 93 files passed; 41 customer browser tests passed against the final production build and isolated temporary SQLite database.
- Production build and TypeScript passed; formatting passed; lint has zero errors and 12 existing warnings. Architecture passed: 701 modules, all within 200 lines.
- Independent review found four Important issues, all fixed with reproductions and passing regressions: stale task overwrite, invitation draft loss, optimistic moodboard lost save, and logout visibility across tabs. Inline guest form failure feedback was also fixed.
- Session guard exempts a locally initiated logout from reload so Auth.js redirect completes; other tabs invalidate on session broadcast and revalidate on focus/visibility.
- Controlled checkboxes wait for persistence before display; browser regression uses click plus a retrying checked assertion.
- Trial and account data remain separate. Paid access, checkout, upgrade credit and feature guide regressions pass. Unsupported Web Locks fail closed with a login path.
- Desktop and mobile visuals inspected; local dashboard and health endpoint returned HTTP 200 on port 3201.
- Permanent regression tests retained. Temporary runner config, browser artifacts, scratch reports/screenshots and isolated E2E databases cleaned after verification.
