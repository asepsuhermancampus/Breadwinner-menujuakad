"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { FollowUpReviewDialog } from "./follow-up-review-dialog";
import { recheckEligibility } from "../domain/recheck";
import {
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
  const selected = filtered.filter((g) => g.selected);
  const allSelected = selected.length === filtered.length && filtered.length > 0;
  const mixed = selected.length > 0 && !allSelected;

  function toggle(id: string) {
    setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, selected: !g.selected } : g)));
  }

  function toggleAll() {
    setGuests((prev) =>
      prev.map((g) => (filtered.some((f) => f.id === g.id) ? { ...g, selected: !allSelected } : g)),
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

      <div className="overflow-x-auto rounded-card border border-border bg-surface">
        <table className="w-full min-w-[720px] text-left text-xs">
          <thead>
            <tr className="bg-canvas text-secondary">
              <th className="w-11 p-2">
                <button
                  type="button"
                  onClick={toggleAll}
                  aria-label={allSelected ? "Kosongkan pilihan" : "Pilih semua tamu terlihat"}
                  className={`grid size-5 place-items-center rounded border ${
                    allSelected
                      ? "bg-primary text-white"
                      : mixed
                        ? "border-primary bg-primary text-white"
                        : "border-ux-control-border bg-surface"
                  }`}
                >
                  {(allSelected || mixed) && <Icon name={mixed ? "filter" : "check"} size={12} />}
                </button>
              </th>
              <th className="p-3 font-semibold">Nama</th>
              <th className="p-3 font-semibold">Kategori</th>
              <th className="p-3 font-semibold">Pihak</th>
              <th className="p-3 font-semibold">Kuota</th>
              <th className="p-3 font-semibold">WA terakhir</th>
              <th className="p-3 font-semibold">Izin</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((g) => (
              <tr key={g.id} className="border-t border-border">
                <td className="p-2">
                  <button
                    type="button"
                    onClick={() => toggle(g.id)}
                    aria-pressed={g.selected}
                    aria-label={`Pilih ${g.name}`}
                    className={`grid size-5 place-items-center rounded border ${
                      g.selected ? "bg-primary text-white" : "border-ux-control-border bg-surface"
                    }`}
                  >
                    {g.selected && <Icon name="check" size={12} />}
                  </button>
                </td>
                <td className="p-3 font-semibold text-foreground">{g.name}</td>
                <td className="p-3 text-secondary">{g.category}</td>
                <td className="p-3 text-secondary">{g.side}</td>
                <td className="p-3 font-mono text-foreground">{g.quota}</td>
                <td className="p-3 font-mono text-secondary">{g.lastWaDate}</td>
                <td
                  className={`p-3 font-semibold ${g.consent === "Diberikan" ? "text-success" : "text-warning"}`}
                >
                  {g.consent}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-secondary">
        {selected.length} dipilih dari {followUpContext.eligible} undangan yang memenuhi filter ·
        tinjau sebelum kirim.
      </p>

      <div className="rounded-card border border-border bg-canvas p-4">
        <p className="text-xs font-bold text-foreground">{followUpNote.title}</p>
        <p className="mt-1 text-xs text-secondary">{followUpNote.body}</p>
      </div>

      <FollowUpReviewDialog
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        selected={selected}
      />
    </div>
  );
}
