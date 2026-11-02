"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  dashboardAudiences,
  dashboardCardLabels,
  type DashboardAudience,
  type DashboardCard,
} from "../domain/dashboard-card-catalog";
type Setting = {
  card: DashboardCard;
  audience: DashboardAudience;
  visible: boolean;
  version: number;
};
type Audit = {
  card: DashboardCard;
  audience: DashboardAudience;
  actor: string;
  new_visible: number;
  reason: string;
  created_at: string;
};
export function DashboardCardsPanel({ initial }: { initial: Setting[] }) {
  const [cards, setCards] = useState(initial);
  const [audience, setAudience] = useState<DashboardAudience>("guest");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [audit, setAudit] = useState<Audit[] | null>(null);
  async function refresh() {
    const response = await fetch("/api/superadmin/dashboard-cards", { cache: "no-store" });
    if (!response.ok) throw new Error("Pengaturan card belum dapat dimuat.");
    const body = (await response.json()) as { cards: Setting[]; audit: Audit[] };
    setCards(body.cards);
    setAudit(body.audit);
    setError("");
  }
  async function save(item: Setting) {
    if (busy || !reason.trim()) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/superadmin/dashboard-cards", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...item, visible: !item.visible, reason }),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(body.error ?? "Perubahan belum tersimpan.");
      setReason("");
      await refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Perubahan belum tersimpan.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section
      className="w-full space-y-4 rounded-card border border-ux-border bg-surface p-5 shadow-xs"
      aria-labelledby="dashboard-cards-title"
    >
        <h2 id="dashboard-cards-title" className="text-base font-semibold">
          Kartu Ringkasan Dashboard
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            Kelompok pengguna
            <select
              className="rounded-control border border-ux-border p-2 bg-surface"
              value={audience}
              onChange={(e) => setAudience(e.target.value as DashboardAudience)}
            >
              {Object.entries(dashboardAudiences).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            Alasan perubahan
            <textarea
              className="rounded-control border border-ux-border p-2 bg-surface"
              maxLength={500}
              rows={1}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </label>
        </div>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {cards
            .filter((item) => item.audience === audience)
            .map((item) => (
              <li
                key={item.card}
                className="flex flex-col justify-between gap-2.5 rounded-control border border-ux-border bg-canvas/30 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{dashboardCardLabels[item.card]}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${item.visible ? "bg-success-bg text-success" : "bg-warning-bg text-warning"
                      }`}
                  >
                    {item.visible ? "Ditampilkan" : "Disembunyikan"}
                  </span>
                </div>
                <Button
                  size="small"
                  variant={item.visible ? "secondary" : "primary"}
                  disabled={busy || !reason.trim()}
                  onClick={() => void save(item)}
                >
                  {item.visible ? "Sembunyikan" : "Tampilkan"} {dashboardCardLabels[item.card]}
                </Button>
              </li>
            ))}
        </ul>
        {error && (
          <p role="alert" className="text-danger">
            {error}{" "}
            <button
              className="underline"
              onClick={() =>
                void refresh().catch(() => setError("Pengaturan card belum dapat dimuat."))
              }
            >
              Muat ulang
            </button>
          </p>
        )}
        <Button
          variant="secondary"
          size="small"
          disabled={busy}
          onClick={() => void refresh().catch(() => setError("Riwayat belum dapat dimuat."))}
        >
          Muat riwayat
        </Button>
        {audit && (
          <section aria-label="Riwayat card">
            <h3 className="font-semibold">Riwayat card terbaru</h3>
            {audit.length === 0 ? (
              <p className="text-sm text-secondary">Belum ada perubahan.</p>
            ) : (
              <ul className="mt-2 max-h-52 space-y-2 overflow-y-auto app-scroll pr-1">
                {audit.map((entry, index) => (
                  <li key={`${entry.created_at}-${index}`} className="text-sm border-b border-ux-border/50 pb-1.5">
                    {dashboardCardLabels[entry.card]} · {dashboardAudiences[entry.audience]} ·{" "}
                    {entry.new_visible ? "Ditampilkan" : "Disembunyikan"} · {entry.created_at}
                    <p className="text-xs text-secondary">
                      {entry.reason} · {entry.actor}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
    </section>
  );
}
