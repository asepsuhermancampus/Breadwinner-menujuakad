export type CustomerNavigationItem = {
  label: string;
  href: string;
  icon: string;
  badge?: string;
  dot?: boolean;
  children?: { label: string; href: string }[];
};

export const customerNavigation: { title: string; items: CustomerNavigationItem[] }[] = [
  {
    title: "Perencanaan",
    items: [
      { label: "Ringkasan Kesiapan", href: "/dashboard", icon: "squares-four" },
      { label: "Checklist & Tugas", href: "/planner/tasks", icon: "checks" },
      { label: "Persyaratan KUA", href: "/planner/kua", icon: "file-text" },
      {
        label: "Jadwal & hari acara",
        href: "/planner/rundown",
        icon: "calendar-blank",
        children: [
          { label: "Rundown", href: "/planner/rundown" },
          { label: "Kalender Koordinasi", href: "/planner/calendar" },
          { label: "Perlengkapan Darurat", href: "/planner/emergency" },
        ],
      },
      { label: "Seserahan", href: "/planner/seserahan", icon: "image" },
      { label: "Inspirasi & moodboard", href: "/planner/moodboard", icon: "image" },
    ],
  },
  {
    title: "Keuangan",
    items: [
      { label: "Tabungan & Anggaran", href: "/planner/finance", icon: "wallet" },
      {
        label: "Kalkulator Katering",
        href: "/planner/catering",
        icon: "fork-knife",
      },
    ],
  },
  {
    title: "Vendor",
    items: [
      {
        label: "Cari vendor",
        href: "/marketplace",
        icon: "notebook",
        children: [
          { label: "Semua vendor", href: "/marketplace" },
          { label: "Vendor tersimpan", href: "/marketplace/favorites" },
        ],
      },
      {
        label: "Rangkai paket jasa",
        href: "/marketplace/bundles",
        icon: "files",
        children: [
          { label: "Rangkai paket", href: "/marketplace/bundles" },
          { label: "Lihat katalog jasa", href: "/checkout/services" },
        ],
      },
    ],
  },
  {
    title: "Tamu & undangan",
    items: [
      { label: "Daftar tamu & RSVP", href: "/planner/guests", icon: "envelope-simple" },
      {
        label: "Undangan digital",
        href: "/planner/invitations",
        icon: "envelope-open",
        children: [
          { label: "Undangan", href: "/planner/invitations" },
          { label: "Studio visual", href: "/planner/invitations/studio" },
        ],
      },
      { label: "Kehadiran tamu", href: "/checkin", icon: "checks" },
      { label: "Ringkasan untuk dibagikan", href: "/planner/wedding-kit", icon: "file-pdf" },
    ],
  },
];
