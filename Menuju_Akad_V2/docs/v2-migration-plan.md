# Peta migrasi V2

Track aktif batch1 UI_SLICING. Seluruh kemampuan V1 dipertahankan pada aplikasi V1;
belum ada migrasi data atau cutover. Status di tabel adalah target increment ini.

| Sumber                                           | Modul/use case             | Adapter/data                   | Route/state V2                    | Policy/invariant                                          | Status/tes                            |
| ------------------------------------------------ | -------------------------- | ------------------------------ | --------------------------------- | --------------------------------------------------------- | ------------------------------------- |
| V1 auth opaque sessions + MNC2H/hMEbg/VgqXJ      | auth                       | typed mock; DB pending         | preview auth login/register       | OTP challenge tidak menerbitkan role                      | UI_MOCK / unit+E2E                    |
| wZeSu/Qyl3s/rnno1                                | auth recovery/OTP          | clock/grant mock               | dialog/recovery state             | expiry/cooldown, generic response, single-use reset grant | UI_MOCK / unit+E2E                    |
| nohWZ/ppEju                                      | planner-workspaces         | draft browser adapter          | preview onboarding profile/events | dua eventId, draft bertahan                               | UI_MOCK / unit+E2E                    |
| w6pWd/VUBCF                                      | planner-workspaces pairing | opaque mock capability         | partner/join/success              | owner/scope/expiry/revoke/single-use/max2/no merge        | UI_MOCK / unit+E2E                    |
| V1 account + m34FY/uP5rs                         | account                    | scoped mock/version            | preview account/inspector         | actor dan pasangan berbeda, stale/revoked blocked         | UI_MOCK / unit+E2E                    |
| CwZFE                                            | plans                      | entitlement DTO + quote mock   | preview account/plans             | Premium bukan Lifetime; upgrade bukan payment             | UI_MOCK / unit+E2E                    |
| o6oxd/VGsCi                                      | account                    | preferences/device/proof mock  | security/delete dialog            | explicit ack, fresh proof single-use, no live delete      | UI_MOCK / unit+E2E                    |
| bi8Au/FQfll/m64RvD/tQXWQ                         | UI/shell-navigation        | semantic tokens/membership DTO | shell/modal/responsive states     | Hidden role absent, focus/reflow/reduced-motion           | UI_MOCK / browser                     |
| V1 invitations/guests/RSVP/billing/planner/admin | fitur sesuai rules03       | persistence V1 tetap           | batch berikutnya                  | scope/IDOR/transaksi/provider verified                    | backlog eksplisit; belum dimigrasikan |

Urutan UI berikutnya tetap Ekspansi →02→03→04A–D→05→06→07.
FULLSTACK_V2 batch1 kelak memigrasikan auth/account API exact paths, CSRF/throttle,
opaque session, verified contact/link/unlink, last-method protection dan Prisma
repository. DB branch/kredensial dev adalah dependensi, bukan diambil dari secret V1.

Git awal mengandung perubahan pengguna pada paket slicing dan rename folder rules.
Pekerjaan ini hanya menambahkan `Menuju_Akad_V2/`, tidak mengembalikan/meng-commit
perubahan awal tersebut.
