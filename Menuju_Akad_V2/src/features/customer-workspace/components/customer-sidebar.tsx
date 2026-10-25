"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getPlan } from "@/features/plans/domain/catalog";
import type { DashboardAccess } from "../domain/dashboard-access";
import { CustomerSignOut } from "./customer-sign-out";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import styles from "@/features/shell-navigation/components/workspace-dock.module.css";
import { customerNavigation } from "./customer-navigation";
export function CustomerSidebar({
  access,
  close,
  compact = false,
  toggle,
  mobile = false,
}: {
  access: DashboardAccess;
  close?: () => void;
  compact?: boolean;
  toggle?: () => void;
  mobile?: boolean;
}) {
  const pathname = usePathname();
  const { workspace, mode } = access;
  const name = workspace.profile.fullName || "Ruang kalian";
  const couple = workspace.profile.partnerName
    ? name + " & " + workspace.profile.partnerName
    : name;
  const plan = getPlan(workspace.subscription.planId).label;
  return (
    <aside
      className={cn(styles.dock, compact && styles.compact, mobile && styles.mobile)}
      aria-label="Navigasi ruang bersama"
    >
      <div className="flex min-h-10 items-center justify-between">
        <Link href="/" className="flex min-h-11 items-center gap-2.5" aria-label="Menuju Akad">
          <BrandLogo variant="cypress" width={compact ? 32 : 40} height={compact ? 15 : 19} />
          {!compact && (
            <span className="text-base font-semibold tracking-[-0.6px]">menuju akad</span>
          )}
        </Link>
        {!compact && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Ringkas navigasi"
            onClick={() => (toggle ?? close)?.()}
          >
            <Icon name="panel-left-close" />
          </Button>
        )}
      </div>
      {compact ? (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Perluas navigasi"
          onClick={() => toggle?.()}
        >
          <Icon name="panel-left-open" />
        </Button>
      ) : (
        <Link
          href="/account"
          onClick={() => close?.()}
          className="grid gap-2 rounded-control border border-primary bg-primary p-3 text-left text-white"
        >
          <span className="flex items-center justify-between text-[10px] font-semibold tracking-widest text-champagne">
            <span className="flex items-center gap-2">
              <Icon name="users" size={14} /> PASANGAN
            </span>
            <Icon name="chevron-down" size={14} />
          </span>
          <strong className="text-base font-medium text-canvas">{couple}</strong>
          <span className="text-xs text-ux-on-dark">
            {mode === "guest" ? "Ruang percobaan kalian" : "Ruang rencana bersama"}
          </span>
        </Link>
      )}
      <nav className={styles.navigation} aria-label="Navigasi dashboard">
        {customerNavigation.map((group) => (
          <div key={group.title} className="grid gap-1">
            {!compact && (
              <p className="mb-1 px-3 text-[10px] tracking-wider text-secondary">{group.title}</p>
            )}
            {group.items.map((item) => (
              <div className={styles.navItem} key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => close?.()}
                  aria-label={item.label}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={cn(styles.navButton, compact && styles.iconButton)}
                  title={compact ? item.label : undefined}
                >
                  <Icon name={item.icon} size={17} />
                  {!compact && <span>{item.label}</span>}
                </Link>
              </div>
            ))}
          </div>
        ))}
      </nav>
      {!compact && (
        <div className="grid gap-2 rounded-control border border-ux-border bg-canvas p-3 text-xs">
          <span className="font-medium">Ruang rencana bersama</span>
          <span className="text-[11px] text-secondary">
            {mode === "guest"
              ? "Perubahan disimpan di browser ini"
              : "Data terhubung dengan akun kalian"}
          </span>
          <div className="flex items-center justify-between border-t border-ux-border pt-2">
            <span className="font-semibold text-ux-gold-ink">{plan}</span>
            <Link
              href="/account/plans"
              onClick={() => close?.()}
              className="text-[11px] text-secondary hover:underline"
            >
              Lihat paket ↗
            </Link>
          </div>
        </div>
      )}
      <Link
        href="/account"
        onClick={() => close?.()}
        className={cn(styles.account, compact && styles.iconButton)}
        aria-label="Profil & akses"
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ux-dock text-xs font-bold">
          {name.slice(0, 1).toUpperCase()}
        </span>
        {!compact && (
          <>
            <span className="min-w-0 flex-1">
              <strong className="block truncate text-xs">{name}</strong>
              <small className="text-[11px] text-secondary">Pasangan · {plan}</small>
            </span>
            <Icon name="settings" size={15} />
          </>
        )}
      </Link>
      <footer className="w-full border-t border-ux-border pt-2">
        {mode === "account" ? (
          <CustomerSignOut />
        ) : (
          <Link
            href="/login?returnTo=%2Fdashboard"
            className="block rounded-control bg-primary px-3 py-3 text-center text-xs font-semibold text-white"
          >
            {compact ? <Icon name="users" size={17} /> : "Masuk untuk melanjutkan"}
          </Link>
        )}
      </footer>
    </aside>
  );
}
