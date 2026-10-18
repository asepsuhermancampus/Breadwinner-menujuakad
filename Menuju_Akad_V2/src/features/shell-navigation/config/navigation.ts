export type NavigationItem = {
  label: string;
  icon: string;
  detail: string;
  badge: string;
  href?: string;
};

export type NavigationGroup = {
  title: string;
  items: NavigationItem[];
};

export const navigationGroups: NavigationGroup[] = [
  {
    title: "PERENCANAAN",
    items: [
      {
        label: "Ringkasan & Kesiapan",
        icon: "calendar",
        href: "/dashboard",
        detail: "Pantau kesiapan pernikahan kalian.",
        badge: "",
      },
      {
        label: "Checklist & Tugas",
        icon: "checklist",
        href: "/planner/tasks",
        detail: "Tugas dan tanggung jawab bersama.",
        badge: "3 Hari Ini",
      },
      {
        label: "Persyaratan KUA",
        icon: "documents",
        href: "/planner/kua",
        detail: "5 dari 7 dokumen lengkap. Pantau kesiapan berkas nikah kalian.",
        badge: "5/7",
      },
      {
        label: "Rundown & Kepanitiaan",
        icon: "rundown",
        href: "/planner/rundown",
        detail: "Jadwal dan koordinasi hari istimewa.",
        badge: "",
      },
      {
        label: "Kalkulator Katering",
        icon: "catering",
        href: "/planner/catering",
        detail: "Coming Soon. Perhitungan katering belum tersedia.",
        badge: "Segera",
      },
      {
        label: "Seserahan & Moodboard",
        icon: "gift",
        href: "/planner/seserahan",
        detail: "Inspirasi dan rencana seserahan kalian.",
        badge: "",
      },
    ],
  },
  {
    title: "KEUANGAN & VENDOR",
    items: [
      {
        label: "Tabungan & Anggaran",
        icon: "wallet",
        detail: "Dana dan anggaran acara tetap terpisah.",
        badge: "75%",
      },
      {
        label: "Catatan Vendor Manual",
        icon: "store",
        detail: "Catatan tim pendukung hari kalian.",
        badge: "",
      },
    ],
  },
  {
    title: "TAMU & UNDANGAN",
    items: [
      {
        label: "CRM Tamu & WhatsApp",
        icon: "users",
        detail: "Kelola daftar tamu dan izin komunikasi.",
        badge: "350",
      },
      {
        label: "Studio Undangan",
        icon: "studio",
        detail: "Ruang untuk undangan personal kalian.",
        badge: "",
      },
      {
        label: "Wedding Kit",
        icon: "gift",
        detail: "Maintenance. Data pembelian lama tetap aman.",
        badge: "",
      },
    ],
  },
];

export const commands = [
  { label: "Ringkasan & kesiapan (Dashboard)", href: "/dashboard", icon: "calendar" },
  { label: "Checklist & tugas", href: "/planner/tasks", icon: "checklist" },
  { label: "Persyaratan KUA", href: "/planner/kua", icon: "documents" },
  { label: "Perlengkapan darurat Hari-H", href: "/planner/emergency", icon: "shield" },
  { label: "Rundown acara", href: "/planner/rundown", icon: "rundown" },
  { label: "Kalender koordinasi", href: "/planner/calendar", icon: "calendar" },
  { label: "Kalkulator katering", href: "/planner/catering", icon: "catering" },
  { label: "Seserahan hantaran", href: "/planner/seserahan", icon: "gift" },
  { label: "Moodboard inspirasi", href: "/planner/moodboard", icon: "sparkles" },
  { label: "Wedding Kit", href: "/planner/wedding-kit", icon: "gift" },
  { label: "Produk digital (Fulfillment)", href: "/fulfillment/DIG-SIM-49", icon: "orders" },
  { label: "Profil & akses", href: "/account", icon: "users" },
  { label: "Paket & langganan", href: "/account/plans", icon: "sparkles" },
  { label: "Privasi & keamanan", href: "/account/security", icon: "shield" },
  { label: "Profil mempelai & keluarga", href: "/onboarding/profile", icon: "heart" },
  { label: "Rencana acara", href: "/onboarding/events", icon: "calendar" },
  { label: "Undang pasangan", href: "/onboarding/partner", icon: "link" },
];
