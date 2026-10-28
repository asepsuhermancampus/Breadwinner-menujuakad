"use client";
import Link from "next/link";
import { PageHeading } from "@/components/ui/page-heading";
import type { CustomerWorkspace } from "../types";
import { DomainSettings } from "./domain-settings";
import { PrioritySupport } from "./priority-support";
import { SupportQueue } from "./support-queue";
import { AccountSecurity } from "@/features/auth/components/account-security";
import { CustomerProfile } from "./customer-profile";
import { CustomerPlans } from "./customer-plans";
import { GuestAccountPanel } from "./guest-account-panel";
import { CustomerSignOut } from "./customer-sign-out";
import { accountTabs, type AccountTab } from "../config/account-tabs";
import styles from "@/features/account/components/account.module.css";
import visuals from "./customer-settings.module.css";
import layout from "./customer-settings-navigation.module.css";
export function CustomerAccount({
  workspace,
  tab,
  operator = false,
  guest = false,
}: {
  workspace: CustomerWorkspace;
  tab: AccountTab;
  operator?: boolean;
  guest?: boolean;
}) {
  const active = accountTabs.find((item) => item.id === tab)!;
  return (
    <div className={`${styles.screen} ${visuals.settings}`}>
      <header className={layout.header}>
        <div>
          <p className={styles.eyebrow}>Akun & preferensi</p>
          <PageHeading key={tab} title="Pengaturan" description={active.description} />
        </div>
        <div className={layout.accountAction}>
          {guest ? (
            <Link
              className="customer-control"
              href={`/login?returnTo=${encodeURIComponent(active.href)}`}
            >
              Masuk
            </Link>
          ) : (
            <CustomerSignOut />
          )}
        </div>
      </header>
      <nav className={layout.tabs} aria-label="Pengaturan akun" data-customer-tabs>
        {accountTabs.map(({ id, href, label }) => (
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
      <section data-settings-panel role="region" aria-label={active.label}>
        {tab === "plans" && <CustomerPlans workspace={workspace} guest={guest} />}
        {guest && tab !== "plans" && <GuestAccountPanel tab={tab} />}
        {!guest && tab === "security" && (
          <div className={visuals.security}>
            <AccountSecurity />
          </div>
        )}
        {!guest && tab === "profile" && <CustomerProfile workspace={workspace} />}
        {!guest && tab === "domain" && (
          <DomainSettings
            owner={workspace.role === "owner"}
            enabled={
              workspace.role === "owner" &&
              workspace.subscription.capabilities.includes("custom-domain")
            }
          />
        )}
        {!guest && tab === "support" && (
          <div className="grid gap-6">
            <PrioritySupport
              priority={workspace.subscription.capabilities.includes("priority-support")}
            />
            {operator && <SupportQueue />}
          </div>
        )}
      </section>
    </div>
  );
}
