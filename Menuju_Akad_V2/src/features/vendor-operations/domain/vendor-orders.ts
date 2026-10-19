import type { DecisionInput, VendorContext, VendorResult, VendorWorkspace } from "../types/vendor";
import { commitVendor, denied, guardVendor, replayVendorOperation } from "./vendor-guards";

export function decideVendorOrder(
  state: VendorWorkspace,
  input: DecisionInput,
  context: VendorContext,
): VendorResult {
  const access = guardVendor(state, context, "orderDecide");
  if (access) return access;
  const action = input.action === "accept" ? "order.accepted" : "order.rejected";
  const replay = replayVendorOperation(state, input.operationId, action, input.orderId);
  if (replay) return replay;
  const blocked = guardVendor(state, context, "orderDecide", input.expectedVersion);
  if (blocked) return blocked;
  const order = state.orders.find((item) => item.id === input.orderId);
  if (!order || order.vendorId !== state.vendorId)
    return denied(state, { orderId: "Item pesanan tidak ditemukan dalam scope vendor ini." });
  const errors: Record<string, string> = {};
  if (input.expectedOrderVersion !== order.version)
    errors.orderVersion = "Versi item berubah. Buka ulang kontrak sebelum mengambil keputusan.";
  if (order.status !== "pending")
    errors.orderId = "Item ini sudah diputuskan. Tidak dapat diproses ulang.";
  if (input.action !== "accept" && input.action !== "reject")
    errors.action = "Pilih terima atau tolak item.";
  if (!input.acknowledged) errors.acknowledged = "Tinjau kontrak dan setujui keputusan item ini.";
  if (!input.operationId.trim()) errors.operationId = "Kunci operasi diperlukan.";
  if (input.action === "reject" && !input.reason.trim())
    errors.reason = "Alasan penolakan wajib diisi.";
  if (input.action === "accept" && !context.slotAvailable)
    errors.slot = "Slot tanggal ini tidak lagi tersedia. Tinjau jadwal terbaru sebelum menerima.";
  if (Object.keys(errors).length) return denied(state, errors);
  const at = context.now?.() ?? new Date().toISOString();
  const reason = input.reason.trim() || "Terima item pesanan sesuai kontrak yang ditinjau.";
  const orders = state.orders.map((item) =>
    item.id !== order.id
      ? item
      : {
          ...structuredClone(item),
          status: input.action === "accept" ? ("accepted" as const) : ("rejected" as const),
          version: item.version + 1,
          decision: { action: input.action, reason, actorId: context.actorId, at },
        },
  );
  const next = commitVendor(
    state,
    { ...context, now: () => at },
    action,
    order.id,
    reason,
    { orders },
    input.operationId,
  );
  return {
    ok: true,
    state: next,
    message:
      input.action === "accept"
        ? "Item pesanan diterima dalam simulasi. Snapshot kontrak dan termin tetap utuh."
        : "Item pesanan ditolak dalam simulasi. Alasan tercatat tanpa mengubah item lainnya.",
  };
}
