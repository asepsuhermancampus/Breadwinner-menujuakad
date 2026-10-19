import type { AccountEntry } from "../types/operations";
export const accountEntries: AccountEntry[] = [
  {
    id: "andi",
    name: "Andi Ramadhan",
    scope: "Pasangan · Premium",
    status: "Aktif",
    version: 3,
    admin: false,
    sessions: 2,
  },
  {
    id: "kalyana",
    name: "Kalyana Photography",
    scope: "Vendor · sandbox",
    status: "Disetujui",
    version: 2,
    admin: false,
    sessions: 1,
  },
  {
    id: "sinta",
    name: "Sinta Larasati",
    scope: "BA · sandbox",
    status: "Terverifikasi",
    version: 2,
    admin: false,
    sessions: 1,
  },
  {
    id: "farah",
    name: "Farah",
    scope: "Superadmin · Support",
    status: "Aktif",
    version: 4,
    admin: false,
    sessions: 2,
  },
  {
    id: "naya",
    name: "Naya",
    scope: "Superadmin · Keuangan",
    status: "Aktif",
    version: 5,
    admin: false,
    sessions: 1,
  },
];
export const supportPermissions = ["Baca tiket sesuai penugasan", "Balas & buat catatan internal"];
export const supportRestrictions = [
  "Lihat dokumen KTP / rekening",
  "Ubah fee / jalankan payout",
  "Ekspor kontak tamu",
];
