import type {
  AmbassadorContext,
  AmbassadorResult,
  AmbassadorState,
  AmbassadorWithdrawal,
  WithdrawalInput,
} from "../types/ambassador";
import { ambassadorBalances, ambassadorDenied, guardAmbassador } from "./ambassador-commissions";

export function requestAmbassadorWithdrawal(
  state: AmbassadorState,
  input: WithdrawalInput,
  context: AmbassadorContext,
): AmbassadorResult {
  const guard = guardAmbassador(state, context, "withdraw");
  if (guard) return guard;
  const existing = state.withdrawals.find((item) => item.operationId === input.operationId);
  if (existing) {
    if (existing.amountIdr !== input.amountIdr || existing.bankLast4 !== input.bankLast4)
      return ambassadorDenied(
        state,
        "operationId",
        "ID operasi terikat pada rincian penarikan semula.",
      );
    return {
      ok: existing.status !== "unknown",
      state,
      message:
        existing.status === "unknown"
          ? "Hasil belum pasti. Periksa permohonan yang sama; jangan membuat penarikan baru."
          : "Permohonan sudah tercatat. Saldo tidak ditahan ulang.",
    };
  }
  const versionGuard = guardAmbassador(state, context, "withdraw", input.expectedVersion);
  if (versionGuard) return versionGuard;
  if (state.withdrawals.some((item) => item.status === "unknown"))
    return ambassadorDenied(
      state,
      "operationId",
      "Periksa penarikan sebelumnya yang belum pasti terlebih dahulu.",
    );
  if (!state.bank.verified || context.disputed || input.bankLast4 !== state.bank.last4)
    return ambassadorDenied(
      state,
      "bank",
      "Rekening terverifikasi dan status sengketa belum memenuhi syarat penarikan.",
    );
  if (
    !Number.isSafeInteger(input.amountIdr) ||
    input.amountIdr <= 0 ||
    input.amountIdr > ambassadorBalances(state).availableIdr
  )
    return ambassadorDenied(
      state,
      "amount",
      "Gunakan nominal rupiah utuh dalam saldo tervalidasi yang tersedia.",
    );
  if (!input.acknowledged || !input.operationId)
    return ambassadorDenied(
      state,
      "acknowledged",
      "Tinjau rincian dan konfirmasikan permohonan ini.",
    );
  if (input.outcome === "failure")
    return ambassadorDenied(
      state,
      "request",
      "Simulasi gagal sebelum pengajuan. Saldo belum ditahan; coba lagi dengan ID yang sama.",
    );
  const request: AmbassadorWithdrawal = {
    id: `BA-WD-${105 + state.withdrawals.length}`,
    operationId: input.operationId,
    amountIdr: input.amountIdr,
    bankLast4: input.bankLast4,
    status: input.outcome === "unknown" ? "unknown" : "accepted",
  };
  const version = state.version + 1;
  return {
    ok: true,
    state: {
      ...state,
      version,
      withdrawals: [...state.withdrawals, request],
      audit: [
        ...state.audit,
        {
          id: `BA-${version}`,
          actorId: context.actorId,
          action: "withdrawal.requested",
          reference: request.id,
          version,
        },
      ],
    },
    message:
      request.status === "unknown"
        ? "Respons belum pasti. Dana ditahan satu kali; periksa permohonan yang sama."
        : "Permohonan diterima, belum dijadwalkan atau ditransfer. Dana ditahan satu kali.",
  };
}
export function reconcileAmbassadorWithdrawal(
  state: AmbassadorState,
  operationId: string,
  context: AmbassadorContext,
  status: "accepted" | "scheduled" | "completed" = "accepted",
): AmbassadorResult {
  const guard = guardAmbassador(state, context, "withdraw", state.version);
  if (guard) return guard;
  const request = state.withdrawals.find((item) => item.operationId === operationId);
  if (!request)
    return ambassadorDenied(state, "request", "Permohonan milik akun ini tidak ditemukan.");
  const rank = { unknown: 0, accepted: 1, scheduled: 2, completed: 3 };
  if (rank[status] <= rank[request.status])
    return { ok: true, state, message: "Status sudah sama atau lebih baru; saldo tidak berubah." };
  const version = state.version + 1;
  return {
    ok: true,
    state: {
      ...state,
      version,
      withdrawals: state.withdrawals.map((item) =>
        item.operationId === operationId ? { ...item, status } : item,
      ),
      audit: [
        ...state.audit,
        {
          id: `BA-${version}`,
          actorId: context.actorId,
          action: `withdrawal.${status}`,
          reference: request.id,
          version,
        },
      ],
    },
    message: "Permohonan yang sama diperiksa. Tidak ada penahanan atau pemotongan kedua.",
  };
}
