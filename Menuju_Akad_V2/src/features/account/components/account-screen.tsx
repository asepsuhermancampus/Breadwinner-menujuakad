"use client";

import Link from "next/link";
import { PlansScreen } from "@/features/plans/components/plans-screen";
import type { AccountAdapter, AccountSnapshot } from "../types/account";
import { ProfileScreen } from "./profile-screen";
import { SecurityScreen } from "./security-screen";
import styles from "./account.module.css";

const tabs = [
  { id: "profile", href: "/account", label: "Profil & akses" },
  { id: "plans", href: "/account/plans", label: "Paket & langganan" },
  { id: "security", href: "/account/security", label: "Privasi & keamanan" },
] as const;

export function AccountScreen({
  tab,
  initial,
  adapter,
}: {
  tab: "profile" | "security" | "plans";
  initial: AccountSnapshot;
  adapter: AccountAdapter;
}) {
  const copy = {
    profile: ["Profil & akses", "Kelola identitas, akses, dan teman merencanakan."],
    plans: [
      "Paket & langganan",
      "Pilih dukungan yang pas. Rencana dan kenangan tetap milik kalian.",
    ],
    security: [
      "Privasi & keamanan",
      "Atur kabar yang masuk, akses perangkat, dan kenyamanan ruang kalian.",
    ],
  }[tab];

  return (
    <div className={styles.screen}>
      <p className={styles.eyebrow}>Pengaturan</p>
      <h1 className={styles.heading}>{copy[0]}</h1>
      <p className={styles.description}>{copy[1]}</p>
      <nav className={styles.tabs} aria-label="Pengaturan akun">
        {tabs.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={styles.tab}
            aria-current={tab === item.id ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      {tab === "profile" && <ProfileScreen initial={initial} adapter={adapter} />}
      {tab === "security" && <SecurityScreen initial={initial} adapter={adapter} />}
      {tab === "plans" && (
        <PlansScreen
          entitlement={initial.entitlement}
          adapter={adapter}
          asOf={initial.asOf}
          invoices={initial.invoices}
        />
      )}
    </div>
  );
}
