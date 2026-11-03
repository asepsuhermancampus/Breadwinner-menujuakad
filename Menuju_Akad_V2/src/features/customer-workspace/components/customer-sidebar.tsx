"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, ChevronDown, Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { cn } from "@/lib/cn";
import { customerNavigation } from "./customer-navigation";
import { customerNavigationActive } from "../domain/feature-groups";
import { isAvailableFeaturePath, defaultFeatureAvailability, availableNavigationDestination, type FeatureAvailability } from "../domain/feature-availability-catalog";
import styles from "./customer-sidebar.module.css";

function Glyph({ name, label }: { name: string; label: string }) {
  return (
    <span aria-hidden="true" className={styles.glyph} style={{ maskImage: `url(/assets/icons/sidebar/${name}.svg)` }} title={label} />
  );
}

type SidebarProps = { close?: () => void; compact?: boolean; toggle?: () => void; mobile?: boolean; availability?: FeatureAvailability; plan?: string; };

export function CustomerSidebar({
  close, compact = false, toggle, mobile = false, availability = defaultFeatureAvailability(true), plan,
}: SidebarProps) {
  const pathname = usePathname();
  const [userToggledGroups, setUserToggledGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (href: string) => {
    setUserToggledGroups((prev) => ({ ...prev, [href]: !(prev[href] ?? true) }));
  };

  const navigate = () => { close?.(); };
  return (
    <>
      <aside
        className={cn(styles.dock, compact && styles.compact, mobile && styles.mobile)}
        aria-label="Navigasi ruang bersama"
      >
        <header className={styles.brand}>
          <div className="flex items-center justify-between gap-2">
            <Link href="/" aria-label="Menuju Akad">
              <BrandLogo
                variant="cypress"
                width={compact ? 32 : 48}
                height={compact ? 15 : 23}
                className="h-auto shrink-0"
              />
              {!compact && <span>Menuju Akad</span>}
            </Link>
            {mobile && plan && (
              <Link
                href="/account/plans"
                onClick={navigate}
                className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-500/30 shrink-0"
              >
                <Sparkles size={11} className="text-emerald-600 dark:text-emerald-400" />
                <span>{plan}</span>
              </Link>
            )}
          </div>
        </header>
        <button
          className={styles.toggle}
          aria-label={mobile ? "Tutup navigasi" : compact ? "Perluas navigasi" : "Ringkas navigasi"}
          onClick={() => (toggle ?? close)?.()}
        >
          {compact ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
        <nav className={cn("app-scroll", styles.navigation)} aria-label="Navigasi dashboard">
          {customerNavigation.map((group) => {
            const visibleItems = group.items.filter((item) =>
              availableNavigationDestination(item, availability),
            );
            if (!visibleItems.length) return null;
            return (
              <section key={group.title} className={styles.group}>
                {!compact && <h2>{group.title}</h2>}
                <div className={styles.rows}>
                  {visibleItems.map((item) => {
                    const destination = availableNavigationDestination(item, availability);
                    if (!destination) return null;
                    const active = customerNavigationActive(item.href, pathname);
                    const hasChildren =
                      !compact && Boolean(item.children && item.children.length > 0);
                    const isExpanded = hasChildren && (userToggledGroups[item.href] ?? true);
                    return (
                      <div className={styles.row} key={item.href}>
                        <div className={styles.linkWrapper}>
                          <Link
                            data-sidebar-link
                            href={destination}
                            onClick={navigate}
                            aria-label={item.label}
                            aria-current={pathname === destination ? "page" : undefined}
                            data-active={active || undefined}
                            title={compact ? item.label : undefined}
                            className={cn(styles.link, hasChildren && styles.linkWithChildren)}
                          >
                            <Glyph name={item.icon} label={item.label} />
                            {!compact && (
                              <>
                                <span className={styles.label}>{item.label}</span>
                                {item.badge && <small className={styles.badge}>{item.badge}</small>}
                                {item.dot && <span className={styles.dot} aria-hidden="true" />}
                              </>
                            )}
                          </Link>
                          {hasChildren && (
                            <button
                              type="button"
                              className={cn(
                                styles.toggleChevron,
                                isExpanded && styles.toggleChevronExpanded,
                              )}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleGroup(item.href);
                              }}
                              aria-label={
                                isExpanded
                                  ? `Tutup sub-menu ${item.label}`
                                  : `Buka sub-menu ${item.label}`
                              }
                            >
                              <ChevronDown size={14} className={styles.chevronIcon} />
                            </button>
                          )}
                        </div>
                        {!compact && isExpanded && item.children && (
                          <div
                            className={styles.children}
                            role="group"
                            aria-label={`Sub-navigasi ${item.label}`}
                          >
                            {item.children
                              .filter(
                                (child) =>
                                  child.href !== destination &&
                                  isAvailableFeaturePath(child.href, availability),
                              )
                              .map((child) => {
                                const isChildActive = pathname === child.href;
                                return (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    onClick={navigate}
                                    aria-current={isChildActive ? "page" : undefined}
                                    className={styles.childLink}
                                  >
                                    <span className={styles.childDot} aria-hidden="true" />
                                    <span className={styles.childLabel}>{child.label}</span>
                                  </Link>
                                );
                              })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
          {customerNavigation.every(
            (group) =>
              !group.items.some((item) => availableNavigationDestination(item, availability)),
          ) && (
            <div className={styles.empty}>
              <p className={styles.emptyLabel}>Tidak ada navigasi yang tersedia.</p>
            </div>
          )}
        </nav>
        <footer className={styles.account}>
          <Link
            href="/account"
            onClick={navigate}
            aria-label="Pengaturan"
            aria-current={pathname.startsWith("/account") ? "page" : undefined}
            title={compact ? "Pengaturan" : undefined}
            className={styles.link}
          >
            <Glyph name="gear-six" label="Pengaturan" />
            {!compact && <span className={styles.label}>Pengaturan</span>}
          </Link>
        </footer>
      </aside>
    </>
  );
}
