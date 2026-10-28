"use client";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import type { OperationsNavItem } from "../types/navigation";
import { OperationsDock } from "./operations-dock";
type Props = {
  children: ReactNode;
  roleLabel: string;
  identity: string;
  description: string;
  account: string;
  title: string;
  active: string;
  items: OperationsNavItem[];
  onNavigate: (view: string) => void;
  live?: boolean;
};
export function OperationsShell(props: Props) {
  const [compact, setCompact] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [unavailable, setUnavailable] = useState("");
  const commands = props.items.flatMap(
    (item) => item.children ?? (item.view ? [{ label: item.label, view: item.view }] : []),
  );
  function navigate(view: string) {
    setSearch(false);
    setMobile(false);
    props.onNavigate(view);
  }
  useEffect(() => {
    function key(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (document.querySelector("dialog[open]")) return;
        setSearch((value) => !value);
      }
    }
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, []);
  const dockProps = {
    ...props,
    onNavigate: navigate,
    onUnavailable: props.live ? () => navigate("/account/security") : setUnavailable,
  };
  return (
    <div
      className={`app-frame grid min-h-dvh grid-cols-[minmax(0,1fr)] gap-0 bg-ux-shell p-2 lg:p-3 ${compact ? "lg:grid-cols-[68px_minmax(0,1fr)]" : "lg:grid-cols-[240px_minmax(0,1fr)]"}`}
    >
      <aside className="hidden min-w-0 lg:block">
        <OperationsDock {...dockProps} compact={compact} onToggle={() => setCompact(!compact)} />
      </aside>
      <div className="min-w-0 overflow-clip rounded-[10px] border border-control-border bg-surface lg:rounded-l-none lg:border-l-0">
        <header className="flex min-h-[76px] flex-wrap items-center gap-4 border-b border-control-border bg-surface px-4 py-3 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={`Buka navigasi ${props.roleLabel}`}
            onClick={() => setMobile(true)}
          >
            <Icon name="panel-left-open" />
          </Button>
          <p className="min-w-0 flex-1 text-sm font-semibold">{props.title}</p>
          <span className="rounded-lg bg-warning-bg px-3 py-2 font-mono text-[10px] text-warning">
            {props.live ? "AKSES INTERNAL" : "SANDBOX · PRESET 3"}
          </span>
          <button
            className="flex min-h-11 w-full items-center gap-3 rounded-control bg-ux-dock px-3 text-xs text-secondary sm:w-[280px]"
            onClick={() => setSearch(true)}
          >
            <Icon name="search" size={16} />
            <span className="flex-1 text-left">Cari menu atau data…</span>
            <kbd>⌘K</kbd>
          </button>
        </header>
        <main
          id="main-content"
          className="grid min-w-0 content-start gap-7 p-4 sm:p-6 xl:p-8 [&>*]:min-w-0"
        >
          {props.children}
        </main>
      </div>
      <Dialog
        open={mobile}
        title={`Navigasi ${props.roleLabel}`}
        onClose={() => setMobile(false)}
        side
      >
        <OperationsDock {...dockProps} onToggle={() => setMobile(false)} />
      </Dialog>
      <Dialog open={search} title={`Cari menu ${props.roleLabel}`} onClose={() => setSearch(false)}>
        <Field label="Cari menu operasi" value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="mt-4 grid gap-2">
          {commands
            .filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
            .map((item) => (
              <Button
                key={`${item.label}-${item.view}`}
                variant="ghost"
                className="justify-start"
                onClick={() => navigate(item.view)}
              >
                {item.label}
              </Button>
            ))}
          {!commands.some((item) => item.label.toLowerCase().includes(query.toLowerCase())) && (
            <p role="status" className="p-4 text-sm text-secondary">
              Tidak ada hasil pada scope ini.
            </p>
          )}
        </div>
      </Dialog>
      {!props.live && (
        <Dialog
          open={Boolean(unavailable)}
          title={unavailable || "Akses program"}
          onClose={() => setUnavailable("")}
        >
          <p className="text-sm leading-relaxed text-secondary">
            Bagian ini belum terhubung pada pratinjau lokal. Tidak ada perubahan akun, rilis, atau
            transaksi produksi yang dilakukan.
          </p>
          <Link
            href="/dev/operations"
            className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-brand-secondary"
          >
            Kembali ke galeri internal →
          </Link>
        </Dialog>
      )}
    </div>
  );
}
