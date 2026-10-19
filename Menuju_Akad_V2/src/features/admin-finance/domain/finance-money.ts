import type {
  FinanceContext,
  FinanceIntent,
  FinanceState,
  RefundInput,
} from "../types/admin-finance";
import { commit, failure, financeGuard, intentGuard, replay } from "./finance-guards";

export function scheduleFinancePayout(
  state: FinanceState,
  id: string,
  input: FinanceIntent,
  context: FinanceContext,
) {
  const blocked = financeGuard(context, "payout") ?? intentGuard(input);
  if (blocked) return failure(state, blocked);
  const fingerprint = JSON.stringify(["payout", id, "2026-10-26"]);
  const repeated = replay(state, input.operationId, fingerprint);
  if (repeated) return repeated;
  const row = state.payouts.find((item) => item.id === id);
  if (!row || row.version !== input.expectedVersion)
    return failure(state, "Permohonan berubah atau tidak ditemukan. Tinjau ulang versi terbaru.");
  if (!row.bankVerified || row.disputed || !row.serviceComplete || row.holdAmount !== row.amount)
    return failure(
      state,
      "Rekening, sengketa, penyelesaian layanan, dan hold harus memenuhi syarat.",
    );
  if (row.status === "scheduled")
    return failure(state, "Permohonan sudah dijadwalkan; jangan membuat transfer kedua.");
  const next = {
    ...state,
    payouts: state.payouts.map((item) =>
      item.id === id
        ? {
            ...item,
            status: "scheduled" as const,
            scheduledFor: "2026-10-26",
            version: item.version + 1,
          }
        : item,
    ),
  };
  return commit(
    state,
    next,
    context,
    input,
    "payout.scheduled",
    id,
    fingerprint,
    "Dijadwalkan 26 Oktober 2026 dalam mock. Belum ditransfer; hold tidak dipotong lagi.",
  );
}
export function requestFinanceRefund(
  state: FinanceState,
  input: RefundInput,
  context: FinanceContext,
) {
  const blocked = financeGuard(context, "refund") ?? intentGuard(input);
  if (blocked) return failure(state, blocked);
  const fingerprint = JSON.stringify([
    "refund",
    input.paymentId,
    input.disputeId,
    input.amount,
    input.originalMethod,
  ]);
  const repeated = replay(state, input.operationId, fingerprint);
  if (repeated) return repeated;
  const payment = state.payment;
  if (
    payment.id !== input.paymentId ||
    payment.version !== input.expectedVersion ||
    state.dispute.id !== input.disputeId ||
    state.dispute.version !== input.expectedDisputeVersion ||
    !state.dispute.active
  )
    return failure(state, "Pembayaran atau sengketa berubah. Tinjau ulang versi terbaru.");
  if (payment.status !== "captured" || payment.reservedRefund > 0)
    return failure(
      state,
      "Refund sebelumnya menunggu atau hasilnya belum diketahui. Periksa permintaan yang sama.",
    );
  if (
    !input.originalMethod ||
    !Number.isSafeInteger(input.amount) ||
    input.amount <= 0 ||
    input.amount > payment.captured - payment.refunded - payment.reservedRefund
  )
    return failure(
      state,
      "Nominal melampaui sisa captured atau metode bukan metode pembayaran asal.",
    );
  if (input.response === "failed")
    return failure(
      state,
      "Simulasi provider menolak. Tidak ada refund atau jurnal yang diterapkan.",
    );
  const next = {
    ...state,
    payment: {
      ...payment,
      reservedRefund: input.amount,
      status:
        input.response === "unknown" ? ("refund-unknown" as const) : ("refund-pending" as const),
      version: payment.version + 1,
    },
  };
  return commit(
    state,
    next,
    context,
    input,
    "refund.requested",
    payment.id,
    fingerprint,
    input.response === "unknown"
      ? "Hasil provider belum diketahui. Periksa kunci permintaan yang sama; jangan buat refund kedua."
      : "Permintaan refund diterima dalam mock. Menunggu provider; belum ada pengembalian selesai.",
  );
}
export function refundImpact(amount: number, captured = 15_000_000) {
  const remaining = captured - amount;
  const feeBefore = Math.round((captured * 500) / 10_000);
  const feeAfter = Math.round((remaining * 500) / 10_000);
  return {
    remaining,
    feeBefore,
    feeAfter,
    feeReversal: feeBefore - feeAfter,
    vendorBefore: captured - feeBefore,
    vendorAfter: remaining - feeAfter,
    vendorReduction: amount - (feeBefore - feeAfter),
  };
}
