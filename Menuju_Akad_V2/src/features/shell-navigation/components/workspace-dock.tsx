"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
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
          <Link href="/account" className="flex min-h-11 items-center font-serif text-xl">
            {compact ? "ma" : "menuju akad"}
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
            className="grid gap-1 rounded-card border border-border bg-surface p-3 text-left"
            onClick={() => setRoles(true)}
            aria-haspopup="dialog"
          >
            <span className="flex items-center justify-between text-[10px] tracking-widest text-secondary">
              PASANGAN
              <Icon name="chevron-down" size={14} />
            </span>
            <strong className="text-sm">Andi & Risa</strong>
            <span className="text-xs text-secondary">Ruang rencana bersama</span>
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
          <div className="grid gap-2 rounded-card bg-surface p-3 text-xs">
            <span className="flex justify-between">
              Siap menuju akad <span className="font-mono">84%</span>
            </span>
            <div className="h-1 rounded-full bg-subtle">
              <div className="h-1 w-[84%] rounded-full bg-primary" />
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Premium</span>
              <Link href="/account/plans">Upgrade Lifetime ↗</Link>
            </div>
          </div>
        )}
        <Link href="/account" className={cn(styles.account, compact && styles.iconButton)}>
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/15 text-sm">
            R
          </span>
          {!compact && (
            <span>
              <strong className="block text-xs">{name}</strong>
              <small className="text-white/75">Pasangan · Premium</small>
            </span>
          )}
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
