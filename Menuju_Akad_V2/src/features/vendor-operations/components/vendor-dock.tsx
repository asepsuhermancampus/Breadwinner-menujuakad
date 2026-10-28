"use client";

import { BrandLogo } from "@/components/ui/brand-logo";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import styles from "./vendor-shell.module.css";

export type VendorView = "catalog" | "kyb" | "orders" | "calendar" | "wallet";
type Props = {
  view: VendorView;
  compact?: boolean;
  onNavigate: (view: VendorView) => void;
  onUnavailable: (label: string) => void;
  onToggle: () => void;
};
const items = [
  { label: "Jadwal & Slot Kalender", icon: "calendar", view: "calendar" as const },
  { label: "Pesanan & Kontrak", icon: "orders", view: "orders" as const },
  { label: "Katalog & Portofolio", icon: "store", view: "catalog" as const },
  { label: "Dompet & Pencairan", icon: "wallet", view: "wallet" as const },
  { label: "Ulasan & Performa", icon: "sparkles" },
];
export function VendorDock({ view, compact, onNavigate, onUnavailable, onToggle }: Props) {
  return (
    <div className={cn(styles.dock, "h-full")}>
      <div className="flex min-h-10 items-center gap-2">
        {!compact && (
          <>
            <BrandLogo width={32} height={16} className="h-auto shrink-0" />
            <span className="flex-1 text-sm font-semibold text-brand-secondary">menuju akad</span>
          </>
        )}
        <button
          className="grid size-11 shrink-0 place-items-center rounded-control hover:bg-subtle"
          aria-label={compact ? "Perluas navigasi vendor" : "Ringkas navigasi vendor"}
          onClick={onToggle}
        >
          <Icon name={compact ? "panel-left-open" : "panel-left-close"} />
        </button>
      </div>
      {!compact && (
        <div className="grid gap-3 rounded-control bg-ux-soft p-3.5 text-foreground">
          <p className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.16em]">
            <Icon name="store" size={16} /> MITRA VENDOR
          </p>
          <p className="text-base font-semibold">Kalyana Photography</p>
          <p className="text-xs text-secondary">Photography & Cinema</p>
        </div>
      )}
      <nav aria-label="Navigasi vendor" className="grid gap-1.5">
        {items.map((item) => {
          const active = item.view === (view === "kyb" ? "catalog" : view);
          return (
            <button
              key={item.label}
              title={compact ? item.label : undefined}
              aria-label={compact ? item.label : undefined}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-12 items-center gap-2.5 rounded-control px-3 text-left text-xs",
                active ? "bg-nav-active text-foreground" : "text-secondary hover:bg-subtle",
              )}
              onClick={() => (item.view ? onNavigate(item.view) : onUnavailable(item.label))}
            >
              <Icon name={item.icon} size={17} />
              {!compact && item.label}
            </button>
          );
        })}
      </nav>
      <div className="flex-1" />
      {!compact && (
        <div className="grid gap-2 rounded-control border border-ux-border bg-canvas p-3 text-xs">
          <p className="font-medium text-brand-secondary">Sandbox · Preset 3</p>
          <p className="text-secondary">Pratinjau, bukan rilis produksi</p>
        </div>
      )}
      <button
        className="flex min-h-12 items-center gap-2.5 rounded-control border border-ux-border bg-surface p-2.5 text-left"
        aria-label="Akses Aditya Pramana"
        onClick={() => onUnavailable("Akun Aditya Pramana")}
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-subtle text-xs">
          A
        </span>
        {!compact && (
          <>
            <span className="flex-1 text-xs">
              <strong className="block font-medium">Aditya Pramana</strong>
              <span className="mt-1 block text-secondary">Pemilik bisnis</span>
            </span>
            <Icon name="settings" size={16} />
          </>
        )}
      </button>
    </div>
  );
}
