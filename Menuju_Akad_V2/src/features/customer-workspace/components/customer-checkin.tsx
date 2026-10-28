"use client";
import { useState } from "react";
import { useCustomerResource } from "../hooks/use-customer-resource";
import { useTrialResource } from "@/features/dashboard-trial/hooks/use-trial-resource";
import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/ui/page-heading";
import { PageSkeleton } from "@/components/ui/page-skeleton";
type Guest = {
  id: string;
  name: string;
  quota: number;
  checkedInCount?: number;
  isArchived?: boolean;
};
type State = { data: unknown[] | null; error: string; save: (data: unknown[]) => Promise<boolean> };
function Entry({ guest, save }: { guest: Guest; save: (n: number) => Promise<boolean> }) {
  const [count, setCount] = useState(guest.checkedInCount ?? 0),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <form
      className="flex flex-wrap items-center gap-3 rounded-card border border-ux-border bg-surface p-4"
      onSubmit={async (e) => {
        e.preventDefault();
        if (busy) return;
        setBusy(true);
        try {
          setError((await save(count)) ? "" : "Belum tersimpan. Periksa pesan dan coba kembali.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <strong className="flex-1">{guest.name}</strong>
      <label className="grid gap-1 text-sm">
        Jumlah hadir {guest.name}
        <input
          className="w-24 rounded-control border border-ux-border bg-canvas p-2"
          type="number"
          min={0}
          max={guest.quota}
          required
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
        />
      </label>
      <Button size="small" type="submit" disabled={busy}>
        Simpan kehadiran
      </Button>
      <p className="w-full text-xs text-secondary">
        Tercatat: {guest.checkedInCount ?? 0} dari {guest.quota} orang
      </p>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
function Content({ state }: { state: State }) {
  const guests = (state.data ?? []) as Guest[];
  if (state.data === null && !state.error) {
    return <PageSkeleton label="Memuat tamu" />;
  }
  return (
    <section className="space-y-4">
      <PageHeading
        title="Check-in tamu"
        description="Catat jumlah tamu yang hadir saat acara berlangsung."
      />
      {state.data !== null && (
        <p>Total kedatangan: {guests.reduce((n, g) => n + (g.checkedInCount ?? 0), 0)} orang.</p>
      )}
      {state.error && <p role="alert">{state.error}</p>}
      {state.data === null ? null : guests.length === 0 ? (
        <p>Tambahkan tamu melalui menu Tamu & RSVP.</p>
      ) : (
        guests
          .filter((g) => !g.isArchived)
          .map((g) => (
            <Entry
              key={g.id + ":" + (g.checkedInCount ?? 0)}
              guest={g}
              save={(n) =>
                state.save(guests.map((i) => (i.id === g.id ? { ...i, checkedInCount: n } : i)))
              }
            />
          ))
      )}
    </section>
  );
}
export function AccountCheckin({ workspaceId }: { workspaceId: string }) {
  const state = useCustomerResource("guests", workspaceId);
  return <Content state={state} />;
}
export function TrialCheckin() {
  const state = useTrialResource("guests");
  return <Content state={state} />;
}
