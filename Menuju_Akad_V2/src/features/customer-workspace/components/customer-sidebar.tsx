"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { cn } from "@/lib/cn";
import { customerNavigation } from "./customer-navigation";
import { customerNavigationActive } from "../domain/feature-groups";
import styles from "./customer-sidebar.module.css";

function Glyph({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className={styles.glyph}
      style={{ maskImage: `url(/assets/icons/sidebar/${name}.svg)` }}
    />
  );
}

export function CustomerSidebar({
  close,
  compact = false,
  toggle,
  mobile = false,
}: {
  close?: () => void;
  compact?: boolean;
  toggle?: () => void;
  mobile?: boolean;
}) {
  const pathname = usePathname();
  const navigate = () => {
    close?.();
  };
  return (
    <>
      <aside
        className={cn(styles.dock, compact && styles.compact, mobile && styles.mobile)}
        aria-label="Navigasi ruang bersama"
      >
        <header className={styles.brand}>
          <Link href="/" aria-label="Menuju Akad">
            <BrandLogo
              variant="cypress"
              width={compact ? 32 : 48}
              height={compact ? 15 : 23}
              className="h-auto shrink-0"
            />
            {!compact && <span>Menuju Akad</span>}
          </Link>
        </header>
        <button
          className={styles.toggle}
          aria-label={mobile ? "Tutup navigasi" : compact ? "Perluas navigasi" : "Ringkas navigasi"}
          onClick={() => (toggle ?? close)?.()}
        >
          {compact ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
        <nav className={cn("app-scroll", styles.navigation)} aria-label="Navigasi dashboard">
          {customerNavigation.map((group) => (
            <section key={group.title} className={styles.group}>
              {!compact && <h2>{group.title}</h2>}
              <div className={styles.rows}>
                {group.items.map((item) => {
                  const active = customerNavigationActive(item.href, pathname);
                  return (
                    <div className={styles.row} key={item.href}>
                      <Link
                        data-sidebar-link
                        href={item.href}
                        onClick={navigate}
                        aria-label={item.label}
                        aria-current={active ? "page" : undefined}
                        title={compact ? item.label : undefined}
                        className={styles.link}
                      >
                        <Glyph name={item.icon} />
                        {!compact && (
                          <>
                            <span className={styles.label}>{item.label}</span>
                            {item.badge && <small className={styles.badge}>{item.badge}</small>}
                            {item.dot && <span className={styles.dot} aria-hidden="true" />}
                          </>
                        )}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
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
            <Glyph name="gear-six" />
            {!compact && <span className={styles.label}>Pengaturan</span>}
          </Link>
        </footer>
      </aside>
    </>
  );
}
