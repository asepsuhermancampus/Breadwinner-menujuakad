"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { CommandPalette } from "./command-palette";
import styles from "./workspace-header.module.css";

export function WorkspaceHeader({
  onOpenMenu,
  name = "Ruang kalian",
  partnerName,
  plan = "Free",
  event: selected,
  onEventChange,
}: {
  onOpenMenu: () => void;
  name?: string;
  partnerName?: string | null;
  plan?: string;
  event?: "wedding" | "engagement";
  onEventChange?: (event: "wedding" | "engagement") => void;
}) {
  const [localEvent, setLocalEvent] = useState<"wedding" | "engagement">("wedding");
  const event = selected ?? localEvent;
  const setEvent = onEventChange ?? setLocalEvent;
  const displayName = partnerName ? `${name} & ${partnerName}` : name;
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
          <span>{name.slice(0, 1).toUpperCase()}</span>
          {partnerName && <span>{partnerName.slice(0, 1).toUpperCase()}</span>}
        </span>
        <div>
          <strong>{displayName}</strong>
          <small>Ruang rencana bersama</small>
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
        <Link
          href="/planner/calendar"
          className="hidden rounded-full bg-ux-dock border border-ux-border px-3 py-1.5 text-xs text-secondary xl:block"
        >
          Kalender acara
        </Link>
        <Link
          href="/account/plans"
          className="rounded-full bg-champagne/15 border border-champagne/30 px-3 py-1.5 text-xs font-semibold text-ux-gold-ink hover:bg-champagne/25 transition-colors"
        >
          {plan}
        </Link>
      </div>
    </header>
  );
}
