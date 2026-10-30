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
    <section className="max-w-3xl space-y-6" aria-label={`Pengaturan ${label}`}>
      <div className="space-y-4 rounded-card border border-ux-border bg-surface p-5">
        <h2 className="text-lg font-semibold">{label}</h2>
        {state ? (
          <>
            <p>
              Status: <strong>{state.status === "active" ? "Aktif" : "Dalam pemeliharaan"}</strong>
            </p>
            <p className="text-sm text-secondary">
              Saat pemeliharaan, halaman fitur tidak dapat diedit dan server menolak penyimpanan.
              Data yang sudah ada tetap tersimpan.
              {feature === "guests" &&
                " RSVP pada undangan yang sudah diterbitkan tetap dapat diterima."}
              {(feature === "invitations" || feature === "studio-drafts") &&
                " Undangan yang sudah diterbitkan dan RSVP tetap dapat diakses."}
              {feature === "finance" &&
                " Perubahan katering dan seserahan juga ditahan karena terhubung dengan anggaran. Pembayaran tetap berjalan."}
            </p>
            <label className="grid gap-2 text-sm">
              Alasan perubahan{" "}
              <textarea
                className="rounded-control border border-ux-border p-2"
                maxLength={500}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
              />
            </label>
            <Button disabled={busy || !reason.trim()} onClick={() => void save()}>
              {busy
                ? "Menyimpan…"
                : state.status === "active"
                  ? "Mulai pemeliharaan"
                  : "Aktifkan kembali"}
            </Button>
          </>
        ) : (
          <p>Memuat pengaturan…</p>
        )}
        {error && (
          <p role="alert" className="text-danger">
            {error}{" "}
            <button className="underline" onClick={() => void load()}>
              Muat ulang
            </button>
          </p>
        )}
      </div>
      {state && (
        <section>
          <h3 className="text-lg font-semibold">Riwayat perubahan terbaru</h3>
          {state.audit.length === 0 ? (
            <p>Belum ada perubahan.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {state.audit.map((entry) => (
                <li
                  key={entry.version}
                  className="rounded-card border border-ux-border p-4 text-sm"
                >
                  <strong>{entry.new_status === "active" ? "Diaktifkan" : "Pemeliharaan"}</strong> ·{" "}
                  {entry.created_at}
                  <p>{entry.reason}</p>
                  <p className="text-secondary">Oleh: {entry.actor}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </section>
  );
}
