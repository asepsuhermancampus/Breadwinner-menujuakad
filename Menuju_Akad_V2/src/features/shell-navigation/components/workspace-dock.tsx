"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { BrandLogo } from "@/components/ui/brand-logo";
import { cn } from "@/lib/cn";
import { navigationGroups } from "../config/navigation";
import styles from "./workspace-dock.module.css";

type Props = {
  compact: boolean;
  toggle: () => void;
  name: string;
  memberships: { id: string; label: string; detail: string }[];
  mobile?: boolean;
};
export function WorkspaceDock({ compact, toggle, name, memberships, mobile = false }: Props) {
  const [notice, setNotice] = useState("");
  const [roles, setRoles] = useState(false);
  return (
    <>
      <aside
        className={cn(styles.dock, compact && styles.compact, mobile && styles.mobile)}
        aria-label="Navigasi ruang bersama"
      >
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex min-h-11 items-center gap-2.5"
            aria-label="Menuju Akad"
          >
            <BrandLogo variant="cypress" width={compact ? 32 : 40} height={compact ? 15 : 19} />
            {!compact && (
              <span className="font-sans text-base font-semibold tracking-[-0.6px] text-primary">
                menuju akad
              </span>
            )}
          </Link>
          {!compact && (
            <Button variant="ghost" size="icon" aria-label="Ringkas navigasi" onClick={toggle}>
              <Icon name="panel-left-close" />
            </Button>
          )}
        </div>
        {compact ? (
          <Button variant="ghost" size="icon" aria-label="Perluas navigasi" onClick={toggle}>
            <Icon name="panel-left-open" />
          </Button>
        ) : (
          <button
            className="grid gap-1 rounded-control bg-primary text-white p-3 border border-primary text-left transition-opacity hover:opacity-95"
            onClick={() => setRoles(true)}
            aria-haspopup="dialog"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest text-champagne">
                <span className="flex size-5 items-center justify-center rounded-full bg-white/10 text-canvas">
                  <Icon name="users" size={11} />
                </span>
                PASANGAN
              </span>
              <Icon name="chevron-down" size={14} className="text-white/70" />
            </div>
            <strong className="text-base text-canvas font-medium mt-0.5">Andi & Risa</strong>
            <span className="text-xs text-ux-on-dark">Ruang rencana bersama</span>
          </button>
        )}
        <nav className={styles.navigation}>
          {navigationGroups.map((group) => (
            <div key={group.title} className="grid gap-1">
              {!compact && (
                <p className="mb-1 px-3 text-[10px] tracking-wider text-secondary">{group.title}</p>
              )}
              {group.items.map((item) => (
                <div key={item.label} className={styles.navItem}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={cn(styles.navButton, compact && styles.iconButton)}
                      aria-label={item.label}
                      aria-describedby={
                        compact ? `tip-${item.icon}-${item.label.length}` : undefined
                      }
                    >
                      <Icon name={item.icon} size={17} />
                      {!compact && (
                        <>
                          <span>{item.label}</span>
                          {item.badge && <small>{item.badge}</small>}
                        </>
                      )}
                    </Link>
                  ) : (
                    <button
                      className={cn(styles.navButton, compact && styles.iconButton)}
                      aria-label={item.label}
                      aria-describedby={
                        compact ? `tip-${item.icon}-${item.label.length}` : undefined
                      }
                      onClick={() => setNotice(item.label)}
                    >
                      <Icon name={item.icon} size={17} />
                      {!compact && (
                        <>
                          <span>{item.label}</span>
                          {item.badge && <small>{item.badge}</small>}
                        </>
                      )}
                    </button>
                  )}
                  {compact && (
                    <span
                      role="tooltip"
                      id={`tip-${item.icon}-${item.label.length}`}
                      className={styles.tooltip}
                    >
                      <strong>{item.label}</strong>
                      <span>{item.detail}</span>
                      <small>
                        {item.href ? "Buka halaman fitur" : "Pratinjau navigasi · batch berikutnya"}
                      </small>
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </nav>
        {!compact && (
          <div className="grid gap-2 rounded-control bg-canvas p-3 border border-ux-border text-xs">
            <div className="flex justify-between items-center">
              <span className="font-medium text-primary text-xs">Siap menuju akad</span>
              <span className="font-mono text-xs font-semibold text-primary">84%</span>
            </div>
            <span className="text-[11px] text-secondary">Perubahan tersinkronisasi</span>
            <div className="h-1 rounded-full bg-ux-dock overflow-hidden">
              <div className="h-1 w-[84%] rounded-full bg-primary" />
            </div>
            <div className="flex justify-between items-center text-xs pt-1">
              <span className="font-semibold text-ux-gold-ink text-[11px]">Premium</span>
              <Link
                href="/account/plans"
                className="text-secondary hover:text-primary transition-colors text-[11px]"
              >
                Upgrade Lifetime ↗
              </Link>
            </div>
          </div>
        )}
        <Link href="/account" className={cn(styles.account, compact && styles.iconButton)}>
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ux-dock text-xs font-bold text-primary">
            R
          </span>
          {!compact && (
            <span className="truncate flex-1">
              <strong className="block text-xs font-semibold text-foreground truncate">
                {name}
              </strong>
              <small className="text-secondary text-[11px]">Pasangan · Premium</small>
            </span>
          )}
          {!compact && <Icon name="settings" size={15} className="text-secondary shrink-0" />}
        </Link>
      </aside>
      <Dialog open={Boolean(notice)} onClose={() => setNotice("")} title={notice || "Navigasi"}>
        <p className="text-sm leading-relaxed text-secondary">
          Bagian ini akan dikerjakan pada batch berikutnya. Batch 1 berfokus pada akun, akses, dan
          ruang bersama.
        </p>
        <Button className="mt-5 w-full" onClick={() => setNotice("")}>
          Kembali ke pengaturan
        </Button>
      </Dialog>
      <Dialog open={roles} onClose={() => setRoles(false)} title="Ruang dan aksesmu">
        {memberships.map((membership) => (
          <div key={membership.id} className="mb-3 rounded-control bg-subtle p-4">
            <strong className="text-sm">{membership.label}</strong>
            <p className="mt-1 text-xs text-secondary">{membership.detail}</p>
          </div>
        ))}
        <p className="text-xs text-secondary">
          Hanya keanggotaan aktif yang tersedia untuk akunmu.
        </p>
      </Dialog>
    </>
  );
}
