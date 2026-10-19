import type { GateContext } from "../types/operations";
import { accepted, blocked, guardOperation } from "./guards";
export function prepareMaintenance(reason: string, eta: string, context: GateContext) {
  const gate = guardOperation({ ...context, action: "maintenance.draft" });
  if (!gate.ok) return gate;
  if (reason.trim().length < 8 || !Number.isFinite(Date.parse(eta)))
    return blocked("Isi alasan dan estimasi selesai yang valid.");
  return accepted(
    "Draf Vendor · sandbox Preset 3 siap untuk review dampak di Feature Studio. Rilis #43 tetap Hidden; belum ada layanan diubah.",
  );
}
