"use client";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  planningMaintenanceFeatures,
  type MaintainedPlanningFeature,
} from "@/features/customer-planning/domain/maintenance-catalog";

type State = {
  status: "active" | "maintenance";
  version: number;
  audit: {
    version: number;
    actor: string;
    old_status: string;
    new_status: string;
    reason: string;
    created_at: string;
  }[];
};
export function TaskMaintenancePanel({
  feature = "tasks",
}: {
  feature?: "tasks" | MaintainedPlanningFeature;
}) {
  const label = feature === "tasks" ? "Tugas" : planningMaintenanceFeatures[feature];
  const [state, setState] = useState<State | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    try {
      const response = await fetch(`/api/superadmin/features/${feature}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Pengaturan belum dapat dimuat.");
      setState((await response.json()) as State);
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Pengaturan belum dapat dimuat.");
    }
  }, [feature]);
  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);
  async function save() {
    if (!state || busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/superadmin/features/${feature}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          status: state.status === "active" ? "maintenance" : "active",
          version: state.version,
          reason,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Perubahan belum tersimpan.");
      setReason("");
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Perubahan belum tersimpan.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section
      className={`rounded-card border transition-all duration-200 p-4 flex flex-col justify-between gap-3 shadow-xs ${
        state?.status === "maintenance"
          ? "border-warning/50 bg-warning/5"
          : "border-ux-border bg-surface hover:border-brand-secondary/30"
      }`}
      aria-label={`Pengaturan ${label}`}
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-foreground tracking-tight">{label}</h2>
        {state ? (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
              state.status === "active"
                ? "bg-success-bg text-success border border-success-border/40"
                : "bg-warning-bg text-warning border border-warning-border/40"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${state.status === "active" ? "bg-success" : "bg-warning animate-pulse"}`}
            />
            {state.status === "active" ? "Aktif" : "Pemeliharaan"}
          </span>
        ) : null}
      </div>
      {state ? (
        <div className="flex flex-col gap-2">
          <label className="grid gap-1 text-xs text-secondary">
            Alasan perubahan
            <textarea
              className="rounded-control border border-ux-border p-2 text-xs text-foreground placeholder:text-muted focus:border-primary focus:outline-hidden resize-none"
              placeholder="Tulis alasan pemeliharaan/pengaktifan..."
              maxLength={500}
              rows={2}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
          </label>
          <Button
            size="small"
            className="w-full"
            variant={state.status === "active" ? "secondary" : "primary"}
            disabled={busy || !reason.trim()}
            onClick={() => void save()}
          >
            {busy
              ? "Menyimpan…"
              : state.status === "active"
                ? "Mulai pemeliharaan"
                : "Aktifkan kembali"}
          </Button>
        </div>
      ) : (
        <p className="py-2 text-xs text-secondary">Memuat pengaturan…</p>
      )}
      {error && (
        <p role="alert" className="text-xs text-danger">
          {error}{" "}
          <button className="underline" onClick={() => void load()}>
            Muat ulang
          </button>
        </p>
      )}
    </section>
  );
}
