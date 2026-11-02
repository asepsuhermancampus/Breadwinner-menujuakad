"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { dashboardAudiences, type DashboardAudience } from "../domain/dashboard-card-catalog";
import {
  availabilityFeatures,
  type AvailabilityFeature,
} from "../domain/feature-availability-catalog";

type Setting = {
  feature: AvailabilityFeature;
  audience: DashboardAudience;
  available: boolean;
  version: number;
};
type Audit = {
  feature: AvailabilityFeature;
  audience: DashboardAudience;
  actor: string;
  new_available: number;
  reason: string;
  created_at: string;
  version: number;
};
export function FeatureAvailabilityPanel() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [audit, setAudit] = useState<Audit[]>([]);
  const [audience, setAudience] = useState<DashboardAudience>("guest");
  const [feature, setFeature] = useState<AvailabilityFeature>("tasks");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function refresh() {
    const response = await fetch("/api/superadmin/feature-availability", { cache: "no-store" });
    if (!response.ok) throw new Error("Pengaturan fitur belum dapat dimuat.");
    const body = (await response.json()) as { settings: Setting[]; audit: Audit[] };
    setSettings(body.settings);
    setAudit(body.audit);
    setError("");
  }
  useEffect(() => {
    void Promise.resolve()
      .then(refresh)
      .catch(() => setError("Pengaturan fitur belum dapat dimuat."));
  }, []);
  const setting = settings.find((item) => item.audience === audience && item.feature === feature);
  async function save() {
    if (!setting || busy || !reason.trim()) return;
    setBusy(true);
    try {
      const response = await fetch("/api/superadmin/feature-availability", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...setting, available: !setting.available, reason }),
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
      aria-labelledby="feature-availability-title"
    >
      <h2 id="feature-availability-title" className="text-base font-semibold">
        Ketersediaan Fitur per Kelompok
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm">
          Fitur
          <select
            className="rounded-control border border-ux-border p-2 bg-surface"
            value={feature}
            onChange={(event) => setFeature(event.target.value as AvailabilityFeature)}
          >
            {Object.entries(availabilityFeatures)
              .filter(([key]) => settings.some((item) => item.feature === key))
              .map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Kelompok pengguna
          <select
            className="rounded-control border border-ux-border p-2 bg-surface"
            value={audience}
            onChange={(event) => setAudience(event.target.value as DashboardAudience)}
          >
            {Object.entries(dashboardAudiences).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {setting && (
        <p className="rounded-control bg-subtle p-2.5 text-sm">
          Status: <strong className={setting.available ? "text-success" : "text-danger"}>{setting.available ? "Tersedia" : "Belum tersedia"}</strong>
        </p>
      )}
      <label className="grid gap-1 text-sm">
        Alasan perubahan
        <textarea
          className="rounded-control border border-ux-border p-2"
          maxLength={500}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
      </label>
      <Button disabled={!setting || busy || !reason.trim()} onClick={() => void save()}>
        {busy
          ? "Menyimpan…"
          : `${setting?.available ? "Batasi" : "Sediakan"} ${availabilityFeatures[feature]}`}
      </Button>
      {error && (
        <p role="alert" className="text-danger">
          {error}{" "}
          <button
            className="underline"
            onClick={() =>
              void refresh().catch(() => setError("Pengaturan fitur belum dapat dimuat."))
            }
          >
            Muat ulang
          </button>
        </p>
      )}
      <section aria-label="Riwayat ketersediaan fitur">
        <h3 className="font-semibold">Riwayat terbaru</h3>
        {audit.length === 0 ? (
          <p className="text-sm text-secondary">Belum ada perubahan.</p>
        ) : (
          <ul className="mt-2 max-h-52 space-y-2 overflow-y-auto app-scroll pr-1">
            {audit.map((entry) => (
              <li key={`${entry.feature}-${entry.audience}-${entry.version}`} className="text-sm border-b border-ux-border/50 pb-1.5">
                {availabilityFeatures[entry.feature]} · {dashboardAudiences[entry.audience]} ·{" "}
                {entry.new_available ? "Tersedia" : "Dibatasi"} · {entry.created_at}
                <p className="text-xs text-secondary">
                  {entry.reason} · {entry.actor}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}
