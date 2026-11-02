import { FileCheck, Wallet, Users2 } from "lucide-react";

export const quickStats = [
  {
    icon: FileCheck,
    label: "Berkas KUA",
    value: "8 / 8 Lengkap",
    sub: "Pengantar desa & tes medis",
    progress: 100,
    progressColor: "bg-emerald-600",
    badge: "Selesai",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
  },
  {
    icon: Wallet,
    label: "Alokasi Vendor",
    value: "Rp 85 Juta",
    sub: "Katering, dekor & busana",
    progress: 75,
    progressColor: "bg-amber-600",
    badge: "75% Terkunci",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200/80",
  },
  {
    icon: Users2,
    label: "Tamu & RSVP",
    value: "450 Terdata",
    sub: "Buku tamu QR siap pakai",
    progress: 90,
    progressColor: "bg-teal-600",
    badge: "Siaga",
    badgeClass: "bg-teal-50 text-teal-800 border-teal-200/80",
  },
];

export const recentActivities = [
  {
    initial: "S",
    avatarBg: "bg-emerald-100 text-emerald-800 border-emerald-200",
    user: "Sarah",
    action: "Menandai berkas pengantar & tes medis selesai",
    time: "Baru saja",
  },
  {
    initial: "D",
    avatarBg: "bg-teal-100 text-teal-800 border-teal-200",
    user: "Dimas",
    action: "Mengonfirmasi DP katering & reservasi 600 pax",
    time: "1 jam lalu",
  },
];
