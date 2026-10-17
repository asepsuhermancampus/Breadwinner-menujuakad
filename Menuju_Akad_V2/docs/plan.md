# Rencana implementasi Batch 01

1. **Baseline dan keputusan** — baca rules01–07, global, batch1, inventaris,
   token, aset dan handoff; inspeksi19 frame via MCP. Catat source/V2 path,
   status Git awal dan perbedaan. Output `docs/design.md`, ADR dan migration plan.
2. **Scaffold dan token** — package/lock, strict TypeScript, Next16/Tailwind4,
   `src/styles`, fonts lokal, aset editorial sumber. Verifikasi install/build.
3. **Primitive** — `src/components/ui`, Button cva/cn, field/select, checkbox/radio
   semantik, native dialog/drawer focus trap/return, status dan icon facade.
4. **Kontrak dan mock** — kontrak per fitur, `src/preview/adapters` menyuntik
   clock, failure states dan local storage tervalidasi. Tulis tes perilaku domain.
5. **Auth** — editorial login/register/phone PIN, OTP paste/autofill/cooldown,
   recovery generik dan verified reset. Route whitelist `/preview-ui/auth/*`.
6. **Onboarding** — profile/family, event terpisah, draft next/back, local photo
   validation, scoped opaque invite/revoke/redeem dan pairing success.
7. **Shell dan akun** — dock272/68, rich tooltip hover/focus, role membership,
   contextual header, command palette; profile, inspector, privacy, devices,
   deletion dengan fresh proof dan plans dengan Premium aktual.
8. **Enforcement** — line-count200, import boundary/cycle, ESLint, Prettier,
   strict typecheck, Prisma validate, Vitest, build dan Playwright no-secret.
9. **Review** — periksa sumber visual desktop/mobile, state/error/dirty/focus,
   hasil tes, mapping19 frame dan checkpoint; perbaiki temuan blocking.

Urutan kerja TDD diterapkan pada invariant penting; perubahan visual sederhana
diverifikasi melalui browser. Pekerjaan modul independen didelegasikan dengan
kepemilikan berkas terpisah. Tidak ada pekerjaan batch2/ekspansi atau provider
live dalam increment ini.
