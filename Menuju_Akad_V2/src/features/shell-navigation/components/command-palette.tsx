"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { commands } from "../config/navigation";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, []);
  return (
    <>
      <Button
        variant="secondary"
        aria-label="Cari halaman, Ctrl atau Command K"
        onClick={() => {
          setQuery("");
          setOpen(true);
        }}
      >
        <Icon name="search" />
        <span className="hidden lg:inline">Cari</span>
        <kbd className="font-mono text-xs">⌘K</kbd>
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Mau ke mana?">
        <Field
          label="Cari halaman"
          placeholder="Profil, paket, pasangan…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoFocus
        />
        <nav aria-label="Hasil pencarian" className="mt-4 grid gap-1">
          {commands
            .filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center gap-3 rounded-control p-3 text-sm hover:bg-subtle"
              >
                <Icon name={item.icon} />
                {item.label}
                <Icon name="arrow-right" className="ml-auto" />
              </Link>
            ))}
          {!commands.some((item) => item.label.toLowerCase().includes(query.toLowerCase())) && (
            <p role="status" className="py-6 text-sm text-secondary">
              Belum ada halaman yang cocok.
            </p>
          )}
        </nav>
      </Dialog>
    </>
  );
}
