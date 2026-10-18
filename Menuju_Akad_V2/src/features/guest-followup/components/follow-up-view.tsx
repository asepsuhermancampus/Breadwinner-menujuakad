"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { FollowUpReviewDialog } from "./follow-up-review-dialog";
import { FollowUpGuestTable } from "./follow-up-guest-table";
import { followUpMockAdapter } from "../adapters/mock-followup";
import { toggleVisibleSelection } from "../domain/selection";
import {
  followUpCampaignId,
  followUpContext,
  followUpFilters,
  followUpGuests as followUpFixture,
  followUpNote,
} from "@/features/guest-followup/content/followup-content";
import type { FollowUpGuest } from "../types/followup";

export function FollowUpView() {
  const [guests, setGuests] = useState<FollowUpGuest[]>(followUpFixture);
  const [query, setQuery] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);

  const filtered = useMemo(
    () => guests.filter((g) => g.name.toLowerCase().includes(query.trim().toLowerCase())),
    [guests, query],
  );
  const selected = guests.filter((guest) => guest.selected);

  function toggle(id: string) {
    setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, selected: !g.selected } : g)));
  }

  function toggleAll() {
    setGuests((prev) =>
      toggleVisibleSelection(
        prev,
        filtered.map((guest) => guest.id),
      ),
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tamu yang perlu ditindaklanjuti</h1>
          <p className="mt-1 text-xs text-secondary">
            Segmentasi dari CRM · tidak membuat daftar tamu baru.
          </p>
        </div>
        <Button onClick={() => setReviewOpen(true)}>Tinjau {selected.length} pengingat</Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Belum menjawab",
            value: `${followUpContext.unanswered} undangan`,
            note: "Semua undangan tanpa jawaban",
          },
          {
            label: "Memenuhi filter",
            value: `${followUpContext.eligible} undangan`,
            note: "Izin ada, terkirim ≥7 hari lalu",
          },
          {
            label: "Di luar filter",
            value: `${followUpContext.excluded} undangan`,
            note: "Tidak dikirim otomatis",
          },
          { label: "Konteks sesi", value: "Resepsi", note: followUpContext.sessionNote },
        ].map((m) => (
          <div key={m.label} className="rounded-card border border-border bg-surface p-4">
            <p className="text-[10px] font-bold tracking-widest text-secondary">{m.label}</p>
            <p className="mt-1 text-xl font-bold text-foreground">{m.value}</p>
            <p className="mt-0.5 text-[11px] text-muted">{m.note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["Pihak", followUpFilters.side],
          ["Sesi", followUpFilters.session],
          ["Kondisi", followUpFilters.condition],
        ].map(([label, value]) => (
          <label key={label} className="grid gap-1.5">
            <span className="text-xs font-semibold text-foreground">{label}</span>
            <span className="flex min-h-11 items-center justify-between rounded-control border border-ux-control-border bg-surface px-3 text-sm text-foreground">
              {value}
              <Icon name="chevron-down" size={14} className="text-secondary" />
            </span>
          </label>
        ))}
      </div>

      <div className="flex items-center gap-3 rounded-control border border-ux-border bg-ux-dock px-3 py-2">
        <Icon name="search" size={16} className="text-secondary" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama atau kelompok tamu…"
          className="min-h-9 flex-1 bg-transparent text-sm text-foreground outline-none"
          aria-label="Cari tamu pada hasil filter"
        />
        <span className="font-mono text-xs font-semibold text-foreground">
          {selected.length} dipilih
        </span>
      </div>

      <FollowUpGuestTable guests={filtered} onToggle={toggle} onToggleAll={toggleAll} />

      <p className="text-xs text-secondary">
        {selected.length} dipilih dari {followUpContext.eligible} undangan yang memenuhi filter ·
        tinjau sebelum kirim.
      </p>

      <div className="rounded-card border border-border bg-canvas p-4">
        <p className="text-xs font-bold text-foreground">{followUpNote.title}</p>
        <p className="mt-1 text-xs text-secondary">{followUpNote.body}</p>
      </div>

      {reviewOpen && (
        <FollowUpReviewDialog
          open={reviewOpen}
          onClose={() => setReviewOpen(false)}
          selected={selected}
          onDispatch={() =>
            followUpMockAdapter.dispatch(
              followUpCampaignId,
              selected.map((guest) => guest.id),
              guests,
            )
          }
        />
      )}
    </div>
  );
}
