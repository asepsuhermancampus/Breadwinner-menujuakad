import { Button } from "@/components/ui/button";
import type { AvailabilityFeature } from "../domain/feature-availability-catalog";
import type { Release } from "./feature-rollout-types";
export function RolloutHistory({
  feature,
  current,
  reason,
  busy,
  send,
}: {
  feature: AvailabilityFeature;
  current: Release | undefined;
  reason: string;
  busy: boolean;
  send: (value: Record<string, unknown>) => Promise<void>;
}) {
  return (
    <>
      <section aria-label="Riwayat rilis">
        <h3 className="font-semibold">Riwayat dan pemulihan</h3>
        <Button
          disabled={busy || !current?.history.length || !reason.trim()}
          onClick={() =>
            void send({
              action: "rollback",
              feature,
              revision: current?.revision,
              target: 0,
              reason,
            })
          }
        >
          Pulihkan sasaran awal
        </Button>
        {!current?.history.length ? (
          <p>Belum ada publikasi.</p>
        ) : (
          <ul className="space-y-2">
            {current.history.map((item) => (
              <li key={item.revision} className="border-t border-ux-border pt-2 text-sm">
                Versi {item.revision} Â·{" "}
                {item.cancelled ? "Dibatalkan" : `Berlaku ${item.effectiveAt}`} Â· {item.actor}
                <p>{item.reason}</p>
                <p>
                  Kelompok: {item.policy.audiences.join(", ")} Â· Paket:{" "}
                  {item.policy.plans.join(", ")} Â· Workspace:{" "}
                  {item.policy.workspaces.length || "semua"}
                </p>
                <Button
                  disabled={busy || item.cancelled || !reason.trim()}
                  onClick={() =>
                    void send({
                      action: "rollback",
                      feature,
                      revision: current.revision,
                      target: item.revision,
                      reason,
                    })
                  }
                >
                  Pulihkan versi ini
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
