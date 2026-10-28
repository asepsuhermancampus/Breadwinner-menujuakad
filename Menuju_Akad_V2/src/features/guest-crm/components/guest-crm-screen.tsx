"use client";
import { useUrlTab } from "@/hooks/use-url-tab";

import { useState } from "react";
import { PageHeading } from "@/components/ui/page-heading";
import { useCommittedList } from "@/hooks/use-committed-list";
import type { GuestInvitation } from "../types/guest";
import { canUpdateGuestQuota } from "../utils/guest-filter";
import { GuestMetrics } from "./guest-metrics";
import { GuestTable } from "./guest-table";
import { GuestCreateDialog } from "./guest-create-dialog";
import { GuestInspectorDrawer } from "./guest-inspector-drawer";
import { GuestImportDialog } from "./guest-import-dialog";
import { CustomerGuestImport } from "./customer-guest-import";
import { CustomerGuestTools } from "./customer-guest-tools";
import { newGuestIdentity } from "../utils/customer-import";
import { WhatsappComposerView } from "./whatsapp-composer-view";
import { FollowUpView } from "@/features/guest-followup/components/follow-up-view";
import styles from "./guest-crm.module.css";

type Tab = "guests" | "seating" | "whatsapp" | "followup";
type Props = {
  initialGuests: GuestInvitation[];
  initialTab?: Tab;
  onChange?: (guests: GuestInvitation[]) => void | Promise<boolean | void>;
  customerLabel?: string;
  trial?: boolean;
};

export function GuestCrmScreen({
  initialGuests,
  initialTab = "guests",
  onChange,
  customerLabel,
  trial = false,
}: Props) {
  const [activeTab, setActiveTab] = useUrlTab<Tab>(
    "tab",
    ["guests", "seating", "whatsapp", "followup"],
    initialTab,
  );
  const [guests, setGuests] = useCommittedList(initialGuests, onChange);
  const [selectedGuest, setSelectedGuest] = useState<GuestInvitation | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  async function handleSaveGuest(data: Omit<GuestInvitation, "id" | "personalToken">) {
    const newGuest: GuestInvitation = {
      ...data,
      ...newGuestIdentity(),
    };
    return await setGuests((prev) => [newGuest, ...prev]);
  }

  function handleImportConfirm(newGuests: GuestInvitation[]) {
    setGuests((prev) => [...newGuests, ...prev]);
  }

  async function handleUpdateQuota(id: string, newQuota: number) {
    const target = guests.find((g) => g.id === id);
    if (!target) return { success: false, error: "Undangan tidak ditemukan." };

    const check = canUpdateGuestQuota(target, newQuota);
    if (!check.allowed) {
      return { success: false, error: check.error || "Gagal mengubah kuota." };
    }

    if (
      !(await setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, quota: newQuota } : g))))
    )
      return { success: false, error: "Perubahan belum tersimpan." };
    setSelectedGuest((prev) => (prev && prev.id === id ? { ...prev, quota: newQuota } : prev));
    return { success: true };
  }

  async function handleArchive(id: string) {
    if (
      !(await setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, isArchived: true } : g))))
    )
      return;
    setSelectedGuest(null);
  }

  return (
    <div className={styles.crmContainer}>
      <PageHeading
        title="Daftar Tamu & RSVP"
        description={
          <>
            Kelola daftar tamu, pantau RSVP, dan siapkan tindak lanjut WhatsApp. Saat ini ada{" "}
            {guests.filter((g) => !g.isArchived).length} undangan ·{" "}
            {customerLabel ?? "Rencana pernikahan kalian"}
          </>
        }
      />

      <div className={`app-scroll ${styles.tabBar}`} data-customer-tabs>
        <button
          type="button"
          onClick={() => setActiveTab("guests")}
          aria-pressed={activeTab === "guests"}
          className={`${styles.tabButton} ${activeTab === "guests" ? styles.tabButtonActive : ""}`}
        >
          Tamu & RSVP
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("seating")}
          aria-pressed={activeTab === "seating"}
          className={`${styles.tabButton} ${activeTab === "seating" ? styles.tabButtonActive : ""}`}
        >
          Penempatan Meja
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("whatsapp")}
          aria-pressed={activeTab === "whatsapp"}
          className={`${styles.tabButton} ${activeTab === "whatsapp" ? styles.tabButtonActive : ""}`}
        >
          Pengiriman WA
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("followup")}
          aria-pressed={activeTab === "followup"}
          className={`${styles.tabButton} ${activeTab === "followup" ? styles.tabButtonActive : ""}`}
        >
          Tindak Lanjut
        </button>
        <a href="/planner/invitations/studio" className={styles.tabButton}>
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

      {customerLabel && activeTab !== "guests" ? (
        <CustomerGuestTools
          guests={guests}
          tool={activeTab}
          trial={trial}
          save={(next) => setGuests(next)}
        />
      ) : (
        <>
          {activeTab === "seating" && (
            <CustomerGuestTools
              guests={guests}
              tool="seating"
              trial={trial}
              save={(next) => setGuests(next)}
            />
          )}
          {activeTab === "whatsapp" && <WhatsappComposerView />}
          {activeTab === "followup" && <FollowUpView />}
        </>
      )}

      <GuestCreateDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={handleSaveGuest}
      />

      <GuestInspectorDrawer
        key={selectedGuest ? selectedGuest.id : "closed"}
        guest={selectedGuest}
        open={Boolean(selectedGuest)}
        onClose={() => setSelectedGuest(null)}
        onUpdateQuota={handleUpdateQuota}
        onArchive={handleArchive}
        trial={trial}
      />

      {customerLabel ? (
        <CustomerGuestImport
          open={importOpen}
          close={() => setImportOpen(false)}
          save={(next) => setGuests([...next, ...guests])}
        />
      ) : (
        <GuestImportDialog
          open={importOpen}
          onClose={() => setImportOpen(false)}
          onConfirmImport={handleImportConfirm}
        />
      )}
    </div>
  );
}
