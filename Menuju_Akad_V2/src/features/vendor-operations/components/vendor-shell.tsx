"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { VendorDock, type VendorView } from "./vendor-dock";
import styles from "./vendor-shell.module.css";

type Props = {
  children: ReactNode;
  view: VendorView;
  onNavigate: (view: VendorView) => void;
  name: string;
};
const commands: { label: string; view: VendorView }[] = [
  { label: "Katalog & Portofolio", view: "catalog" },
  { label: "Dokumen & KYB", view: "kyb" },
  { label: "Pesanan & Kontrak", view: "orders" },
  { label: "Jadwal & Slot Kalender", view: "calendar" },
  { label: "Dompet & Pencairan", view: "wallet" },
];
export function VendorShell({ children, view, onNavigate, name }: Props) {
  const [compact, setCompact] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [unavailable, setUnavailable] = useState("");
  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (document.querySelector("dialog[open]")) return;
        setSearch((value) => !value);
      }
    }
    document.addEventListener("keydown", shortcut);
    return () => document.removeEventListener("keydown", shortcut);
  }, []);
  function navigate(next: VendorView) {
    setMobile(false);
    setSearch(false);
    onNavigate(next);
  }
  const dockProps = { view, onNavigate: navigate, onUnavailable: setUnavailable };
  return (
    <div className={cn("app-frame", styles.shell, compact && styles.compact)}>
      <aside className={styles.desktopDock}>
        <VendorDock {...dockProps} compact={compact} onToggle={() => setCompact(!compact)} />
      </aside>
      <div className={styles.canvas}>
        <header className={styles.header}>
          <Button
            variant="ghost"
            size="icon"
            className={styles.mobileMenu}
            aria-label="Buka navigasi vendor"
            onClick={() => setMobile(true)}
          >
            <Icon name="panel-left-open" />
          </Button>
          <p className="min-w-0 flex-1 text-sm font-semibold">{name}</p>
          <span className="rounded-lg bg-warning-bg px-3 py-2 font-mono text-[10px] text-warning">
            SANDBOX · PRESET 3
          </span>
          <button
            className="flex min-h-11 w-full items-center gap-3 rounded-control bg-ux-dock px-3 text-xs text-secondary sm:w-60"
            onClick={() => setSearch(true)}
          >
            <Icon name="search" size={16} />
            <span className="flex-1 text-left">Cari menu atau data…</span>
            <kbd>⌘K</kbd>
          </button>
        </header>
        <main id="main-content" className={styles.body}>
          {children}
        </main>
      </div>
      <Dialog open={mobile} title="Ruang kerja vendor" onClose={() => setMobile(false)} side>
        <VendorDock {...dockProps} onToggle={() => setMobile(false)} />
      </Dialog>
      <Dialog open={search} title="Cari di ruang vendor" onClose={() => setSearch(false)}>
        <Field label="Cari menu vendor" value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="mt-4 grid gap-2">
          {commands
            .filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
            .map((item) => (
              <Button
                key={item.view}
                variant="ghost"
                className="justify-start"
                onClick={() => navigate(item.view)}
              >
                {item.label}
              </Button>
            ))}
          {!commands.some((item) => item.label.toLowerCase().includes(query.toLowerCase())) && (
            <p role="status" className="py-4 text-sm text-secondary">
              Tidak ada menu yang cocok.
            </p>
          )}
        </div>
      </Dialog>
      <Dialog
        open={Boolean(unavailable)}
        title={unavailable || "Belum tersedia"}
        onClose={() => setUnavailable("")}
      >
        <p className="text-sm leading-relaxed text-secondary">
          Bagian ini belum tersedia pada pratinjau ini. Profil, paket, dokumen KYB dan pesanan tetap
          dapat dikelola melalui menu vendor.
        </p>
        <Button variant="secondary" className="mt-5" onClick={() => setUnavailable("")}>
          Kembali ke ruang vendor
        </Button>
      </Dialog>
    </div>
  );
}
