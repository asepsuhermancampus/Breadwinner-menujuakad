"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { CommandPalette } from "./command-palette";
import styles from "./workspace-header.module.css";

export function WorkspaceHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
  const [event, setEvent] = useState("wedding");
  const date = event === "wedding" ? "2027-02-14" : "2026-11-22";
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
  const days = Math.max(
    0,
    Math.ceil(
      (Date.parse(`${date}T00:00:00+07:00`) - Date.parse(`${today}T00:00:00+07:00`)) / 86_400_000,
    ),
  );
  return (
    <header className={styles.topbar}>
      <Button
        variant="ghost"
        size="icon"
        className={styles.mobileMenu}
        aria-label="Buka navigasi"
        onClick={onOpenMenu}
      >
        <Icon name="panel-left-open" />
      </Button>
      <div className={styles.identity}>
        <span className={styles.avatars}>
          <span>A</span>
          <span>R</span>
        </span>
        <div>
          <strong>Andi & Risa</strong>
          <small>● Ruang bersama</small>
        </div>
      </div>
      <div className={styles.eventSwitch} aria-label="Konteks acara">
        <button aria-pressed={event === "engagement"} onClick={() => setEvent("engagement")}>
          Mode Lamaran
        </button>
        <button aria-pressed={event === "wedding"} onClick={() => setEvent("wedding")}>
          Akad & Resepsi
        </button>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <CommandPalette />
        <span className="hidden rounded-full bg-subtle px-3 py-2 font-mono text-[10px] xl:block">
          H–{days} · {event === "wedding" ? "14 Feb 2027" : "22 Nov 2026"}
        </span>
        <Link
          href="/preview-ui/account/plans"
          className="rounded-full bg-champagne/15 px-3 py-2 text-xs text-foreground"
        >
          Premium
        </Link>
      </div>
    </header>
  );
}
