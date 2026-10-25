"use client";
import Link from "next/link";
import type { CustomerWorkspace } from "../types";
import { DomainSettings } from "./domain-settings";
import { PrioritySupport } from "./priority-support";
import { SupportQueue } from "./support-queue";
import { AccountSecurity } from "@/features/auth/components/account-security";
import { CustomerProfile } from "./customer-profile";
import { CustomerPlans } from "./customer-plans";
import { GuestAccountPanel } from "./guest-account-panel";
import styles from "@/features/account/components/account.module.css";
import visuals from "./customer-settings.module.css";
const tabs = [
  ["profile", "/account", "Profil & akses"],
  ["plans", "/account/plans", "Paket & langganan"],
  ["security", "/account/security", "Privasi & keamanan"],
] as const;
export function CustomerAccount({
  workspace,
  tab,
  operator = false,
  guest = false,
}: {
  workspace: CustomerWorkspace;
  tab: "profile" | "security" | "plans";
  operator?: boolean;
  guest?: boolean;
}) {
  const copy = {
    profile: ["Profil & akses", "Kelola identitas, akses, dan teman merencanakan."],
    plans: [
      "Paket & langganan",
      "Pilih dukungan yang pas. Rencana dan kenangan tetap milik kalian.",
    ],
    security: ["Privasi & keamanan", "Kelola password dan akses masuk ke ruang kalian."],
  }[tab];
  return (
    <div className={`${styles.screen} ${visuals.settings}`}>
      <p className={styles.eyebrow}>Pengaturan</p>
      <h1 className={styles.heading}>{copy[0]}</h1>
      <p className={styles.description}>{copy[1]}</p>
      <nav className={styles.tabs} aria-label="Pengaturan akun">
        {tabs.map(([id, href, label]) => (
          <Link
            key={id}
            href={href}
            className={styles.tab}
            aria-current={tab === id ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>
      {tab === "plans" && <CustomerPlans workspace={workspace} guest={guest} />}
      {guest && tab !== "plans" && <GuestAccountPanel tab={tab} />}
      {!guest && tab === "security" && (
        <div className={visuals.security}>
          <AccountSecurity />
        </div>
      )}
      {!guest && tab === "profile" && (
        <>
          <CustomerProfile workspace={workspace} />
          <div className={visuals.additional}>
            <DomainSettings
              owner={workspace.role === "owner"}
              enabled={
                workspace.role === "owner" &&
                workspace.subscription.capabilities.includes("custom-domain")
              }
            />
            <PrioritySupport
              priority={workspace.subscription.capabilities.includes("priority-support")}
            />
            {operator && <SupportQueue />}
          </div>
        </>
      )}
    </div>
  );
}
