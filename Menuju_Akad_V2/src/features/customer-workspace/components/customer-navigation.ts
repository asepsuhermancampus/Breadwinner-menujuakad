export const customerNavigation = [
  {
    title: "PERENCANAAN",
    items: [
      { label: "Ringkasan & Kesiapan", href: "/dashboard", icon: "calendar" },
      {
        label: "Checklist & Tugas",
        href: "/planner/tasks",
        icon: "checklist",
        feature: "unlimited-tasks",
      },
      { label: "Persyaratan KUA", href: "/planner/kua", icon: "documents" },
      { label: "Rundown & Kepanitiaan", href: "/planner/rundown", icon: "rundown" },
      { label: "Kalender Koordinasi", href: "/planner/calendar", icon: "calendar" },
      { label: "Kalkulator Katering", href: "/planner/catering", icon: "catering" },
      { label: "Seserahan", href: "/planner/seserahan", icon: "gift" },
      { label: "Moodboard", href: "/planner/moodboard", icon: "sparkles", feature: "moodboard" },
      { label: "Perlengkapan Darurat", href: "/planner/emergency", icon: "shield" },
    ],
  },
  {
    title: "KEUANGAN & VENDOR",
    items: [
      { label: "Tabungan & Anggaran", href: "/planner/finance", icon: "wallet" },
      { label: "Marketplace Vendor", href: "/marketplace", icon: "store" },
    ],
  },
  {
    title: "TAMU & UNDANGAN",
    items: [
      {
        label: "CRM Tamu & WhatsApp",
        href: "/planner/guests",
        icon: "users",
        feature: "unlimited-guests",
      },
      {
        label: "Undangan",
        href: "/planner/invitations",
        icon: "documents",
        feature: "premium-templates",
      },
      {
        label: "Studio Undangan",
        href: "/planner/invitations/studio",
        icon: "studio",
        feature: "studio",
      },
      { label: "Wedding Kit", href: "/planner/wedding-kit", icon: "gift", feature: "pdf" },
    ],
  },
  {
    title: "AKUN & AKSES",
    items: [
      {
        label: "Multi-undangan",
        href: "/planner/invitations",
        icon: "documents",
        feature: "multi-invitation",
      },
      {
        label: "Custom domain",
        href: "/account?section=domain",
        icon: "link",
        feature: "custom-domain",
      },
      {
        label: "Prioritas bantuan",
        href: "/account?section=support",
        icon: "shield",
        feature: "priority-support",
      },
    ],
  },
] satisfies {
  title: string;
  items: { label: string; href: string; icon: string; feature?: string }[];
}[];
