"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { dashboardAudiences, type DashboardAudience } from "../domain/dashboard-card-catalog";
import type { AvailabilityFeature } from "../domain/feature-availability-catalog";
import type { PlanId } from "@/features/plans/types/plans";
import { planNames, type Release, type Workspace } from "./feature-rollout-types";
export function RolloutPreview({
  feature,
  current,
  workspaces,
  busy,
  preview,
  send,
}: {
  feature: AvailabilityFeature;
  current: Release | undefined;
  workspaces: Workspace[];
  busy: boolean;
  preview: string;
  send: (value: Record<string, unknown>) => Promise<void>;
}) {
  const [previewAudience, setPreviewAudience] = useState<DashboardAudience>("owner");
  const [previewPlan, setPreviewPlan] = useState<PlanId>("free");
  const [previewWorkspace, setPreviewWorkspace] = useState("");
  return (
    <>
      <div className="space-y-2 rounded-control border border-ux-border p-3">
        <h3 className="font-semibold">Pratinjau draf tersimpan</h3>
        <p className="text-sm">
          Pratinjau menguji sasaran dan sakelar kelompok. Hak paket dan izin tindakan tetap
          diperiksa saat fitur digunakan.
        </p>
        <label className="mr-3">
          Kelompok{" "}
          <select
            value={previewAudience}
            onChange={(e) => setPreviewAudience(e.target.value as DashboardAudience)}
          >
            {Object.entries(dashboardAudiences).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="mr-3">
          Paket{" "}
          <select value={previewPlan} onChange={(e) => setPreviewPlan(e.target.value as PlanId)}>
            {Object.entries(planNames).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label>
          Workspace{" "}
          <select value={previewWorkspace} onChange={(e) => setPreviewWorkspace(e.target.value)}>
            <option value="">Tidak ada</option>
            {workspaces.map((w) => (
              <option key={w.id} value={w.id}>
                {w.full_name || w.id}
              </option>
            ))}
          </select>
        </label>
        <div>
          <Button
            disabled={busy || !current?.draft}
            onClick={() =>
              void send({
                action: "preview",
                feature,
                audience: previewAudience,
                plan: previewPlan,
                workspaceId: previewWorkspace || null,
              })
            }
          >
            Periksa pratinjau
          </Button>
        </div>
        {preview && <p role="status">{preview}</p>}
      </div>
    </>
  );
}
