import type { FinanceContext, FinanceState, ReconcileInput } from "../types/admin-finance";
import { commit, failure, financeGuard, intentGuard, replay, success } from "./finance-guards";

export function reconcilePayment(
  state: FinanceState,
  input: ReconcileInput,
  context: FinanceContext,
) {
  const blocked = financeGuard(context, "reconcile") ?? intentGuard(input);
  if (blocked) return failure(state, blocked);
  const fingerprint = JSON.stringify([
    input.transactionId,
    input.eventId,
    input.paymentId,
    input.amount,
    input.currency,
    input.status,
    input.key,
  ]);
  const row = state.reconciliations.find((item) => item.id === input.transactionId);
  if (!row) return failure(state, "Transaksi tidak dikenal. Tidak ada koreksi dibuat.");
  const number = row.id.replace("TX-", "");
  if (
    !input.signatureValid ||
    input.eventId !== `evt-${number}-settled` ||
    input.key !== `PAY:TX${number}:SETTLED`
  )
    return failure(state, "Signature, sumber event, atau kunci idempotensi tidak valid.");
  if (input.paymentId !== row.paymentId || input.amount !== row.amount || input.currency !== "IDR")
    return failure(state, "Pembayaran, nominal, atau mata uang tidak cocok dengan snapshot.");
  if (input.status !== "SETTLED" || row.provider !== "settled" || row.internal === "expired")
    return failure(state, "Event ambigu atau mundur urutannya. Koreksi diblokir.");
  const repeated = replay(state, input.operationId, fingerprint);
  if (repeated) return repeated;
  if (row.internal === "paid")
    return success(
      state,
      "Event terverifikasi sudah diterapkan. Duplikat no-op, tanpa jurnal baru.",
    );
  if (row.version !== input.expectedVersion)
    return failure(state, "Versi transaksi berubah. Muat dan tinjau ulang.");
  const next = {
    ...state,
    reconciliations: state.reconciliations.map((item) =>
      item.id === row.id ? { ...item, internal: "paid" as const, version: item.version + 1 } : item,
    ),
  };
  return commit(
    state,
    next,
    context,
    input,
    "reconciliation.synced",
    row.id,
    fingerprint,
    "Status internal disinkronkan dalam mock lokal; tidak ada penagihan baru.",
  );
}
