import { dashboardAudiences, type DashboardAudience } from "../domain/dashboard-card-catalog";
import type { AvailabilityFeature } from "../domain/feature-availability-catalog";
import type { PlanId } from "@/features/plans/types/plans";
import { planNames, type Policy, type Workspace } from "./feature-rollout-types";
export function RolloutLoading({ message }: { message: string }) {
  return (
    <section aria-labelledby="rollout-loading-title">
      <h2 id="rollout-loading-title">Rilis fitur bertahap</h2>
      <p role="status">{message || "Memuat pengaturan rilis…"}</p>
    </section>
  );
}
export function RolloutTargets({
  policy,
  setPolicy,
  toggle,
  workspaces,
  feature,
  busy,
}: {
  policy: Policy;
  setPolicy: (p: Policy) => void;
  toggle: <K extends keyof Policy>(key: K, value: Policy[K][number]) => void;
  workspaces: Workspace[];
  feature: AvailabilityFeature;
  busy: boolean;
}) {
  return (
    <>
      <fieldset disabled={busy}>
        <legend className="font-semibold">Kelompok yang mendapat akses</legend>
        {Object.entries(dashboardAudiences).map(([key, label]) => (
          <label className="mr-4 inline-flex gap-2" key={key}>
            <input
              type="checkbox"
              checked={policy.audiences.includes(key as DashboardAudience)}
              onChange={() => toggle("audiences", key as DashboardAudience)}
            />
            {label}
          </label>
        ))}
      </fieldset>
      <fieldset disabled={busy}>
        <legend className="font-semibold">Paket yang mendapat akses</legend>
        {Object.entries(planNames).map(([key, label]) => (
          <label className="mr-4 inline-flex gap-2" key={key}>
            <input
              type="checkbox"
              checked={policy.plans.includes(key as PlanId)}
              onChange={() => toggle("plans", key as PlanId)}
            />
            {label}
          </label>
        ))}
      </fieldset>
      <label className="grid gap-1 text-sm">
        Workspace tertentu (kosong berarti semua workspace)
        <select
          disabled={busy}
          multiple
          value={policy.workspaces}
          onChange={(e) =>
            setPolicy({
              ...policy,
              workspaces: Array.from(e.target.selectedOptions, (option) => option.value),
            })
          }
          className="min-h-24 rounded-control border border-ux-border p-2"
        >
          {workspaces.map((item) => (
            <option key={item.id} value={item.id}>
              {item.full_name || "Workspace tanpa nama"} · {item.id}
            </option>
          ))}
        </select>
      </label>
      <p className="text-sm text-secondary">
        Jika memilih workspace, tamu percobaan tidak termasuk karena tidak memiliki workspace akun.
        Paket pasangan mengikuti pemilik workspace.
      </p>
      {(feature === "catering" ||
        feature === "seserahan" ||
        feature === "finance" ||
        feature === "guests") && (
        <p className="text-sm text-secondary">
          Periksa juga Keuangan, Katering, Seserahan, dan Pengelolaan Tamu: pembatasan dapat menahan
          perubahan anggaran atau menyembunyikan data sumber. RSVP publik tetap berjalan.
        </p>
      )}
    </>
  );
}
