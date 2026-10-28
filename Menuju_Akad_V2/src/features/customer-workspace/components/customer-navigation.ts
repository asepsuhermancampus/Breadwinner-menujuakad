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
      { label: "Ringkasan & Kesiapan", href: "/dashboard", icon: "squares-four" },
      { label: "Checklist & Tugas", href: "/planner/tasks", icon: "checks" },
      { label: "Persyaratan KUA", href: "/planner/kua", icon: "file-text" },
      {
        label: "Rundown & Kepanitiaan",
        href: "/planner/rundown",
        icon: "calendar-blank",
        children: [
          { label: "Rundown", href: "/planner/rundown" },
          { label: "Kalender Koordinasi", href: "/planner/calendar" },
          { label: "Perlengkapan Darurat", href: "/planner/emergency" },
        ],
      },
      {
        label: "Kalkulator Katering",
        href: "/planner/catering",
        icon: "fork-knife",
      },
      {
        label: "Seserahan & Moodboard",
        href: "/planner/seserahan",
        icon: "image",
        children: [
          { label: "Seserahan", href: "/planner/seserahan" },
          { label: "Moodboard", href: "/planner/moodboard" },
        ],
      },
    ],
  },
  {
    title: "Keuangan & vendor",
    items: [
      { label: "Tabungan & Anggaran", href: "/planner/finance", icon: "wallet" },
      {
        label: "Catatan Vendor Manual",
        href: "/marketplace",
        icon: "notebook",
        children: [
          { label: "Marketplace Vendor", href: "/marketplace" },
          { label: "Vendor pilihan", href: "/marketplace/favorites" },
        ],
      },
      {
        label: "Pesanan & Kontrak",
        href: "/marketplace/bundles",
        icon: "files",
        children: [
          { label: "Rangkai paket", href: "/marketplace/bundles" },
          { label: "Checkout jasa", href: "/checkout/services" },
        ],
      },
    ],
  },
  {
    title: "Tamu & undangan",
    items: [
      { label: "CRM Tamu & WhatsApp", href: "/planner/guests", icon: "envelope-simple" },
      {
        label: "Studio Undangan",
        href: "/planner/invitations",
        icon: "envelope-open",
        children: [
          { label: "Undangan", href: "/planner/invitations" },
          { label: "Studio visual", href: "/planner/invitations/studio" },
        ],
      },
      { label: "Wedding Kit", href: "/planner/wedding-kit", icon: "file-pdf", dot: true },
    ],
  },
];
