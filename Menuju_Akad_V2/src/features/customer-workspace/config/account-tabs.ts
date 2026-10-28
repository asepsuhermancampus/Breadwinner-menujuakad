export const accountTabs = [
  {
    id: "profile",
    href: "/account",
    label: "Profil & akses",
    description: "Kelola identitas, akses, dan teman merencanakan.",
  },
  {
    id: "plans",
    href: "/account/plans",
    label: "Paket & langganan",
    description: "Pilih dukungan yang pas. Rencana dan kenangan tetap milik kalian.",
  },
  {
    id: "security",
    href: "/account/security",
    label: "Privasi & keamanan",
    description: "Kelola password dan akses masuk ke ruang kalian.",
  },
  {
    id: "domain",
    href: "/account/domain",
    label: "Custom domain",
    description: "Atur alamat undangan milik kalian dan pantau verifikasi domain.",
  },
  {
    id: "support",
    href: "/account/support",
    label: "Prioritas bantuan",
    description: "Hubungi tim bantuan dan pantau permintaan dari ruang kalian.",
  },
] as const;

export type AccountTab = (typeof accountTabs)[number]["id"];
export function isAccountTab(value: string): value is AccountTab {
  return accountTabs.some((tab) => tab.id === value);
}
