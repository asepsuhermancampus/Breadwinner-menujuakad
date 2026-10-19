import type { VendorContext, VendorResult, VendorWorkspace } from "../types/vendor";
import { denied, guardVendor } from "./vendor-guards";

export type VendorPayoutRequest = {
  id: string;
  operationId: string;
  amountIdr: number;
  bankLast4: string;
  status: "unknown" | "accepted" | "scheduled" | "completed";
};
export type VendorWalletState = {
  escrowIdr: number;
  kybVerified: boolean;
  bankVerified: boolean;
  disputed: boolean;
  requests: VendorPayoutRequest[];
  audit: { action: string; actorId: string; operationId: string; version: number }[];
};
export type WalletWorkspace = VendorWorkspace & { wallet?: VendorWalletState };
export type VendorPayoutInput = {
  amountIdr: number;
  bankLast4: string;
  expectedVersion: number;
  operationId: string;
  acknowledged: boolean;
  outcome?: "success" | "failure" | "unknown";
};
export const vendorWalletJournal = [
  {
    id: "release-a",
    date: "20 Okt",
    label: "Pelepasan layanan A",
    grossIdr: 13_500_000,
    feeIdr: 675_000,
    netIdr: 12_825_000,
  },
  {
    id: "release-b",
    date: "22 Okt",
    label: "Pelepasan layanan B",
    grossIdr: 6_500_000,
    feeIdr: 325_000,
    netIdr: 6_175_000,
  },
  {
    id: "payout-done",
    date: "24 Okt",
    label: "Payout selesai",
    grossIdr: 0,
    feeIdr: 0,
    netIdr: -500_000,
  },
];
export function createVendorWallet(): VendorWalletState {
  return {
    escrowIdr: 45_000_000,
    kybVerified: true,
    bankVerified: true,
    disputed: false,
    requests: [],
    audit: [],
  };
}
function commitWallet(
  state: WalletWorkspace,
  wallet: VendorWalletState,
  context: VendorContext,
  action: string,
  operationId: string,
): WalletWorkspace {
  const version = state.version + 1;
  return {
    ...state,
    version,
    wallet: {
      ...wallet,
      audit: [...wallet.audit, { action, operationId, actorId: context.actorId, version }],
    },
  };
}
export function vendorAvailable(wallet: VendorWalletState) {
  return (
    vendorWalletJournal.reduce((sum, row) => sum + row.netIdr, 0) -
    wallet.requests.reduce((sum, request) => sum + request.amountIdr, 0)
  );
}
export function requestVendorPayout(
  state: WalletWorkspace,
  input: VendorPayoutInput,
  context: VendorContext,
): VendorResult {
  const guard = guardVendor(state, context, "payoutRequest");
  if (guard) return guard;
  const wallet = state.wallet ?? createVendorWallet();
  const previous = wallet.requests.find((request) => request.operationId === input.operationId);
  if (previous) {
    if (previous.amountIdr !== input.amountIdr || previous.bankLast4 !== input.bankLast4)
      return denied(state, { operationId: "ID operasi terikat pada nominal dan rekening semula." });
    return {
      ok: previous.status !== "unknown",
      state,
      message:
        previous.status === "unknown"
          ? "Status permohonan belum pasti. Periksa permohonan yang sama; jangan membuat pengajuan baru."
          : "Permohonan yang sama sudah tercatat; saldo tidak ditahan lagi.",
    };
  }
  const versionGuard = guardVendor(state, context, "payoutRequest", input.expectedVersion);
  if (versionGuard) return versionGuard;
  if (wallet.requests.some((request) => request.status === "unknown"))
    return denied(state, {
      operationId: "Periksa hasil permohonan sebelumnya sebelum membuat pengajuan baru.",
    });
  if (
    !wallet.kybVerified ||
    !wallet.bankVerified ||
    wallet.disputed ||
    input.bankLast4 !== state.kyb.verifiedBank.last4
  )
    return denied(state, {
      bank: "KYB, rekening aktif, dan status sengketa perlu memenuhi syarat. Rekening usulan belum digunakan.",
    });
  if (
    !Number.isSafeInteger(input.amountIdr) ||
    input.amountIdr <= 0 ||
    input.amountIdr > vendorAvailable(wallet)
  )
    return denied(state, {
      amount: "Nominal harus berupa rupiah utuh dan tidak melebihi saldo tersedia.",
    });
  if (!input.acknowledged || !input.operationId)
    return denied(state, { acknowledged: "Konfirmasikan rincian sebelum mengajukan." });
  if (input.outcome === "failure")
    return denied(state, {
      request:
        "Simulasi gagal sebelum pengajuan. Saldo tetap utuh; ulangi dengan ID operasi yang sama.",
    });
  const request: VendorPayoutRequest = {
    id: `WD-${105 + wallet.requests.length}`,
    operationId: input.operationId,
    amountIdr: input.amountIdr,
    bankLast4: input.bankLast4,
    status: input.outcome === "unknown" ? "unknown" : "accepted",
  };
  const next = commitWallet(
    state,
    { ...wallet, requests: [...wallet.requests, request] },
    context,
    "payout.requested",
    input.operationId,
  );
  return {
    ok: true,
    state: next,
    message:
      request.status === "unknown"
        ? "Respons belum pasti. Dana ditahan satu kali; periksa status permohonan yang sama."
        : `${request.id} diterima dan dana ditahan satu kali. Belum dijadwalkan atau ditransfer.`,
  };
}
export function reconcileVendorPayout(
  state: WalletWorkspace,
  operationId: string,
  context: VendorContext,
  status: "accepted" | "scheduled" | "completed" = "accepted",
): VendorResult {
  const guard = guardVendor(state, context, "payoutRequest", state.version);
  if (guard) return guard;
  const wallet = state.wallet ?? createVendorWallet();
  const request = wallet.requests.find((item) => item.operationId === operationId);
  if (!request) return denied(state, { request: "Permohonan tidak ditemukan untuk pemilik ini." });
  const rank = { unknown: 0, accepted: 1, scheduled: 2, completed: 3 };
  if (rank[status] <= rank[request.status])
    return { ok: true, state, message: "Status sudah sama atau lebih baru. Saldo tidak berubah." };
  const next = commitWallet(
    state,
    {
      ...wallet,
      requests: wallet.requests.map((item) =>
        item.operationId === operationId ? { ...item, status } : item,
      ),
    },
    context,
    `payout.${status}`,
    operationId,
  );
  return {
    ok: true,
    state: next,
    message: "Status permohonan yang sama diperbarui. Tidak ada pemotongan kedua.",
  };
}
