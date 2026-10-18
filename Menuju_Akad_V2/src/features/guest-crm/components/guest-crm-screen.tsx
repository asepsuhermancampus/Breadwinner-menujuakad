"use client";

import { useState } from "react";
import type { GuestInvitation } from "../types/guest";
import { GuestMetrics } from "./guest-metrics";
import { GuestTable } from "./guest-table";
import { GuestCreateDialog } from "./guest-create-dialog";
import { GuestInspectorDrawer } from "./guest-inspector-drawer";
import { GuestImportDialog } from "./guest-import-dialog";
import { GuestSeatingView } from "./guest-seating-view";
import { WhatsappComposerView } from "./whatsapp-composer-view";
import styles from "./guest-crm.module.css";

type Tab = "guests" | "seating" | "whatsapp";

type Props = {
  initialGuests: GuestInvitation[];
  initialTab?: Tab;
};

export function GuestCrmScreen({ initialGuests, initialTab = "guests" }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [guests, setGuests] = useState<GuestInvitation[]>(initialGuests);
  const [selectedGuest, setSelectedGuest] = useState<GuestInvitation | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  function handleSaveGuest(data: Omit<GuestInvitation, "id" | "personalToken">) {
    const newGuest: GuestInvitation = {
      ...data,
      id: `gst-${Date.now()}`,
      personalToken: `tok-${Math.random().toString(36).substring(2, 8)}`,
    };
    setGuests((prev) => [newGuest, ...prev]);
  }

  function handleImportConfirm(newGuests: GuestInvitation[]) {
    setGuests((prev) => [...newGuests, ...prev]);
  }

  function handleUpdateQuota(id: string, newQuota: number) {
    setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, quota: newQuota } : g)));
    setSelectedGuest((prev) => (prev && prev.id === id ? { ...prev, quota: newQuota } : prev));
  }

  function handleArchive(id: string) {
    setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, isArchived: true } : g)));
    setSelectedGuest(null);
  }

  return (
    <div className={styles.crmContainer}>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Daftar Tamu & RSVP</h1>
        <p className="text-xs text-secondary mt-1">
          {guests.filter((g) => !g.isArchived).length} undangan untuk maksimal 600 orang ·
          Pernikahan Andi & Risa
        </p>
      </div>

      <div className={styles.tabBar}>
        <button
          type="button"
          onClick={() => setActiveTab("guests")}
          className={`${styles.tabButton} ${activeTab === "guests" ? styles.tabButtonActive : ""}`}
        >
          Tamu & RSVP
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("seating")}
          className={`${styles.tabButton} ${activeTab === "seating" ? styles.tabButtonActive : ""}`}
        >
          Penempatan Meja
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("whatsapp")}
          className={`${styles.tabButton} ${activeTab === "whatsapp" ? styles.tabButtonActive : ""}`}
        >
          Pengiriman WA
        </button>
        <a href="/planner/invitations" className={styles.tabButton}>
          Studio Undangan ↗
        </a>
      </div>

      {activeTab === "guests" && (
        <div className="space-y-4">
          <GuestMetrics guests={guests} />
          <GuestTable
            guests={guests}
            onSelectGuest={(g) => setSelectedGuest(g)}
            onOpenCreate={() => setCreateOpen(true)}
            onOpenImport={() => setImportOpen(true)}
          />
        </div>
      )}

      {activeTab === "seating" && <GuestSeatingView />}

      {activeTab === "whatsapp" && <WhatsappComposerView />}

      <GuestCreateDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={handleSaveGuest}
      />

      <GuestInspectorDrawer
        guest={selectedGuest}
        open={Boolean(selectedGuest)}
        onClose={() => setSelectedGuest(null)}
        onUpdateQuota={handleUpdateQuota}
        onArchive={handleArchive}
      />

      <GuestImportDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onConfirmImport={handleImportConfirm}
      />
    </div>
  );
}
