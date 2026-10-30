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
      className="rounded-card border border-ux-border bg-surface p-4"
      aria-label={`Pengaturan ${label}`}
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">{label}</h2>
        {state ? (
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
              state.status === "active"
                ? "bg-success-bg text-success"
                : "bg-warning-bg text-warning"
            }`}
          >
            {state.status === "active" ? "Aktif" : "Pemeliharaan"}
          </span>
        ) : null}
      </div>
      {state ? (
        <>
          <label className="mt-3 grid gap-1 text-xs">
            Alasan perubahan
            <textarea
              className="rounded-control border border-ux-border p-2 text-sm"
              maxLength={500}
              rows={2}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
          </label>
          <Button
            size="small"
            className="mt-2 w-full"
            disabled={busy || !reason.trim()}
            onClick={() => void save()}
          >
            {busy
              ? "Menyimpan…"
              : state.status === "active"
                ? "Mulai pemeliharaan"
                : "Aktifkan kembali"}
          </Button>
        </>
      ) : (
        <p className="mt-2 text-xs text-secondary">Memuat pengaturan…</p>
      )}
      {error && (
        <p role="alert" className="mt-2 text-xs text-danger">
          {error}{" "}
          <button className="underline" onClick={() => void load()}>
            Muat ulang
          </button>
        </p>
      )}
    </section>
  );
}
