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
        label: "Ringkasan Kesiapan",
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
        badge: "",
      },
      {
        label: "Persyaratan KUA",
        icon: "documents",
        href: "/planner/kua",
        detail: "Pantau kesiapan berkas nikah kalian.",
        badge: "",
      },
      {
        label: "Jadwal & hari acara",
        icon: "rundown",
        href: "/planner/rundown",
        detail: "Jadwal dan koordinasi hari istimewa.",
        badge: "",
      },
      {
        label: "Seserahan",
        icon: "gift",
        href: "/planner/seserahan",
        detail: "Catat rencana dan kebutuhan seserahan kalian.",
        badge: "",
      },
      {
        label: "Inspirasi & moodboard",
        icon: "sparkles",
        href: "/planner/moodboard",
        detail: "Koleksi inspirasi visual untuk pernikahan.",
        badge: "",
      },
    ],
  },
  {
    title: "KEUANGAN",
    items: [
      {
        label: "Tabungan & Anggaran",
        icon: "wallet",
        href: "/planner/finance",
        detail: "Dana dan anggaran acara tetap terpisah.",
        badge: "",
      },
      {
        label: "Kalkulator Katering",
        icon: "catering",
        href: "/planner/catering",
        detail: "Perkirakan kebutuhan katering kalian.",
        badge: "",
      },
    ],
  },
  {
    title: "VENDOR",
    items: [
      {
        label: "Cari vendor",
        icon: "store",
        href: "/marketplace",
        detail: "Temukan vendor untuk pernikahan kalian.",
        badge: "",
      },
      {
        label: "Vendor tersimpan",
        icon: "store",
        href: "/marketplace/favorites",
        detail: "Kelola vendor yang sudah disimpan.",
        badge: "",
      },
      {
        label: "Rangkai paket jasa",
        icon: "sparkles",
        href: "/marketplace/bundles",
        detail: "Susun paket jasa dan minta penawaran.",
        badge: "",
      },
    ],
  },
  {
    title: "TAMU & UNDANGAN",
    items: [
      {
        label: "Daftar tamu & RSVP",
        icon: "users",
        href: "/planner/guests",
        detail: "Kelola daftar tamu dan izin komunikasi.",
        badge: "",
      },
      {
        label: "Undangan digital",
        icon: "studio",
        href: "/planner/invitations",
        detail: "Ruang untuk undangan personal kalian.",
        badge: "",
      },
      {
        label: "Kehadiran tamu",
        icon: "shield",
        href: "/checkin",
        detail: "Pencatatan kehadiran tamu di hari-H.",
        badge: "",
      },
      {
        label: "Ringkasan untuk dibagikan",
        icon: "gift",
        href: "/planner/wedding-kit",
        detail: "Siapkan ringkasan rencana untuk dibagikan.",
        badge: "",
      },
    ],
  },
];

export const commands = [
  { label: "Ringkasan Kesiapan (Dashboard)", href: "/dashboard", icon: "calendar" },
  { label: "Daftar tamu & RSVP", href: "/planner/guests", icon: "users" },
  { label: "Undangan digital", href: "/planner/invitations", icon: "studio" },
  { label: "Kehadiran tamu", href: "/checkin", icon: "shield" },
  { label: "Cari vendor", href: "/marketplace", icon: "store" },
  { label: "Vendor tersimpan", href: "/marketplace/favorites", icon: "store" },
  { label: "Rangkai paket jasa", href: "/marketplace/bundles", icon: "sparkles" },
  { label: "Tabungan & anggaran (Keuangan)", href: "/planner/finance", icon: "wallet" },
  { label: "Checklist & tugas", href: "/planner/tasks", icon: "checklist" },
  { label: "Persyaratan KUA", href: "/planner/kua", icon: "documents" },
  { label: "Perlengkapan darurat Hari-H", href: "/planner/emergency", icon: "shield" },
  { label: "Rundown acara", href: "/planner/rundown", icon: "rundown" },
  { label: "Kalender koordinasi", href: "/planner/calendar", icon: "calendar" },
  { label: "Kalkulator katering", href: "/planner/catering", icon: "catering" },
  { label: "Seserahan hantaran", href: "/planner/seserahan", icon: "gift" },
  { label: "Inspirasi & moodboard", href: "/planner/moodboard", icon: "sparkles" },
  { label: "Ringkasan untuk dibagikan", href: "/planner/wedding-kit", icon: "gift" },
  { label: "Produk digital (Fulfillment)", href: "/fulfillment/DIG-SIM-49", icon: "orders" },
  { label: "Pengaturan · Profil & akses", href: "/account", icon: "settings" },
  { label: "Paket & langganan", href: "/account/plans", icon: "sparkles" },
  { label: "Privasi & keamanan", href: "/account/security", icon: "shield" },
  { label: "Custom domain", href: "/account/domain", icon: "link" },
  { label: "Bantuan", href: "/account/support", icon: "help" },
  { label: "Profil mempelai & keluarga", href: "/onboarding/profile", icon: "heart" },
  { label: "Rencana acara", href: "/onboarding/events", icon: "calendar" },
  { label: "Undang pasangan", href: "/onboarding/partner", icon: "link" },
];
