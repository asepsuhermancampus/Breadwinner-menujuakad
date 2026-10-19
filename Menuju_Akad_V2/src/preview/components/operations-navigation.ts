import type { OperationsNavItem } from "@/features/operations-shell/types/navigation";
export const adminNavigation: OperationsNavItem[] = [
  { label: "Ringkasan Bisnis", icon: "studio", view: "executive" },
  { label: "Kalender Vendor", icon: "calendar", view: "calendar" },
  {
    label: "Transaksi & Escrow",
    icon: "wallet",
    children: [
      { label: "Rekonsiliasi provider", view: "reconciliation" },
      { label: "Webhook & idempotensi", view: "webhook" },
      { label: "Antrean payout", view: "payouts" },
      { label: "Sengketa", view: "dispute" },
      { label: "Review refund", view: "refund" },
      { label: "Pengaturan keuangan", view: "settings" },
    ],
  },
  {
    label: "Moderasi Vendor",
    icon: "shield",
    children: [
      { label: "Tinjauan KYB", view: "kyb" },
      { label: "Moderasi konten", view: "moderation" },
    ],
  },
  {
    label: "Notifikasi & Helpdesk",
    icon: "bell",
    children: [
      { label: "Antrean notifikasi", view: "notifications" },
      { label: "Tiket bantuan", view: "helpdesk" },
      { label: "Tiket pribadi pemilik", view: "owner-help" },
    ],
  },
  { label: "CMS & Konten", icon: "documents", view: "cms" },
  { label: "Akun & Otorisasi", icon: "users", view: "accounts" },
  { label: "Audit & Riwayat Rilis", icon: "clock", view: "audit" },
  { label: "Keamanan Platform", icon: "lock", view: "health" },
  { label: "Modular Feature Studio", icon: "settings" },
];
export const ambassadorNavigation: OperationsNavItem[] = [
  { label: "Ringkasan Pertumbuhan", icon: "studio", view: "recruitment" },
  { label: "Referral & Konversi", icon: "users", view: "recruitment" },
  {
    label: "Komisi & Pencairan",
    icon: "wallet",
    children: [
      { label: "Jurnal komisi", view: "ledger" },
      { label: "Review penarikan", view: "withdrawal" },
    ],
  },
  { label: "Marketing Kit", icon: "documents" },
  { label: "Kode Promo", icon: "gift", view: "recruitment" },
];
export const financeViews = [
  "reconciliation",
  "webhook",
  "payouts",
  "dispute",
  "refund",
  "settings",
  "audit",
] as const;
export const platformViews = [
  "notifications",
  "helpdesk",
  "cms",
  "health",
  "accounts",
  "owner-help",
] as const;
