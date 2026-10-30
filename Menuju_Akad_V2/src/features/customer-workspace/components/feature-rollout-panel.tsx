"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RolloutLoading, RolloutTargets } from "./feature-rollout-targets";
import { RolloutPreview } from "./feature-rollout-preview";
import { RolloutHistory } from "./feature-rollout-history";
import {
  availabilityFeatures,
  controllableFeatures,
  type AvailabilityFeature,
} from "../domain/feature-availability-catalog";

import { type Policy, type Release, type Workspace } from "./feature-rollout-types";
const initial: Policy = {
  audiences: ["guest", "owner", "partner"],
  plans: ["free", "premium", "lifetime"],
  workspaces: [],
};
export function FeatureRolloutPanel() {
  const [feature, setFeature] = useState<AvailabilityFeature>("tasks");
  const [releases, setReleases] = useState<Partial<Record<AvailabilityFeature, Release>>>({});
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [policy, setPolicy] = useState<Policy>(initial);
  const [reason, setReason] = useState("");
  const [schedule, setSchedule] = useState("");
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const current = releases[feature];
  function loadEditor(item: Release | undefined) {
    setPolicy(
      item?.draft ??
        item?.history.find(
          (entry) => !entry.cancelled && Date.parse(entry.effectiveAt) <= Date.now(),
        )?.policy ??
        initial,
    );
    setReason(item?.reason ?? "");
    setPreview("");
  }
  async function refresh() {
    const response = await fetch("/api/superadmin/feature-rollout", { cache: "no-store" });
    if (!response.ok) throw new Error("Rilis fitur belum dapat dimuat.");
    const data = (await response.json()) as {
      releases: Record<AvailabilityFeature, Release>;
      workspaces: Workspace[];
    };
    loadEditor(data.releases[feature]);
    setReleases(data.releases);
    setWorkspaces(data.workspaces);
  }
  useEffect(() => {
    void Promise.resolve()
      .then(refresh)
      .catch(() => setMessage("Rilis fitur belum dapat dimuat."));
    // The first load runs once; feature changes update the editor synchronously.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  async function send(action: Record<string, unknown>) {
    if (busy) return;
    setBusy(true);
    setMessage("");
    setPreview("");
    try {
      const response = await fetch("/api/superadmin/feature-rollout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(action),
      });
      const result = (await response.json()) as {
        error?: string;
        allowed?: boolean;
        current?: boolean;
      };
      if (!response.ok) throw new Error(result.error ?? "Perubahan belum tersimpan.");
      if (action.action === "preview")
        setPreview(
          `Sekarang: ${result.current ? "tersedia" : "dibatasi"}. Draf: ${result.allowed ? "tersedia" : "dibatasi"}.`,
        );
      else {
        await refresh();
        setMessage("Perubahan rilis tersimpan.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Perubahan belum tersimpan.");
    } finally {
      setBusy(false);
    }
  }
  function toggle<K extends keyof Policy>(key: K, value: Policy[K][number]) {
    setPolicy((previous) => ({
      ...previous,
      [key]: previous[key].includes(value as never)
        ? previous[key].filter((item) => item !== value)
        : [...previous[key], value],
    }));
  }
  if (!current) return <RolloutLoading message={message} />;
  return (
    <section
      className="max-w-3xl space-y-4 rounded-card border border-ux-border bg-surface p-5"
      aria-labelledby="rollout-title"
    >
      <h2 id="rollout-title" className="text-lg font-semibold">
        Rilis fitur bertahap
      </h2>
      <p className="text-sm text-secondary">
        Draf tidak memengaruhi pengguna sebelum diterbitkan. Sasaran membatasi akses; izin
        workspace, hak paket, dan pemeliharaan tetap berlaku.
      </p>
      <label className="grid gap-1 text-sm">
        Fitur
        <select
          disabled={busy}
          value={feature}
          onChange={(e) => {
            const next = e.target.value as AvailabilityFeature;
            loadEditor(releases[next]);
            setFeature(next);
          }}
          className="rounded-control border border-ux-border p-2"
        >
          {controllableFeatures.map((key) => (
            <option key={key} value={key}>
              {availabilityFeatures[key]}
            </option>
          ))}
        </select>
      </label>
      <RolloutTargets
        policy={policy}
        setPolicy={setPolicy}
        toggle={toggle}
        workspaces={workspaces}
        feature={feature}
        busy={busy}
      />
      {current?.warnings.map((warning) => (
        <p key={warning} role="status">
          {warning}
        </p>
      ))}
      <label className="grid gap-1 text-sm">
        Alasan perubahan
        <textarea
          disabled={busy}
          maxLength={500}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="rounded-control border border-ux-border p-2"
        />
      </label>
      <Button
        disabled={
          busy || !current || !reason.trim() || !policy.audiences.length || !policy.plans.length
        }
        onClick={() =>
          void send({ action: "draft", feature, revision: current?.revision, policy, reason })
        }
      >
        Simpan draf
      </Button>
      <RolloutPreview
        feature={feature}
        current={current}
        workspaces={workspaces}
        busy={busy}
        preview={preview}
        send={send}
      />
      <div className="space-y-2">
        <label className="grid gap-1 text-sm">
          Jadwal publikasi (opsional, waktu perangkat)
          <input
            type="datetime-local"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            className="rounded-control border border-ux-border p-2"
          />
        </label>
        <Button
          disabled={busy || !current?.draft}
          onClick={() =>
            void send({
              action: "publish",
              feature,
              revision: current?.revision,
              scheduledAt: schedule ? new Date(schedule).toISOString() : null,
            })
          }
        >
          {schedule ? "Jadwalkan rilis" : "Terbitkan sekarang"}
        </Button>
      </div>
      {message && <p role="status">{message}</p>}
      <RolloutHistory feature={feature} current={current} reason={reason} busy={busy} send={send} />
    </section>
  );
}
