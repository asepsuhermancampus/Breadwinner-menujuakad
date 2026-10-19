import type {
  BankRevisionDraft,
  VendorContext,
  VendorResult,
  VendorWorkspace,
} from "../types/vendor";
import { commitVendor, denied, guardVendor, replayVendorOperation } from "./vendor-guards";
import { normalizeAccountNumber, privateEvidence, validateBankRevision } from "./vendor-validation";

export function submitVendorKyb(
  state: VendorWorkspace,
  draft: BankRevisionDraft,
  context: VendorContext,
  expectedVersion: number,
): VendorResult {
  const access = guardVendor(state, context, "kybSubmit");
  if (access) return access;
  const replay = replayVendorOperation(state, draft.operationId, "kyb.submitted", state.vendorId);
  if (replay) return replay;
  const blocked = guardVendor(state, context, "kybSubmit", expectedVersion);
  if (blocked) return blocked;
  const errors = validateBankRevision(draft);
  if (state.kyb.status === "pending") errors.status = "Revisi rekening sudah menunggu verifikasi.";
  if (Object.keys(errors).length || !draft.document) return denied(state, errors);
  const at = context.now?.() ?? new Date().toISOString();
  const bankName = draft.bankName.trim();
  const last4 = normalizeAccountNumber(draft.accountNumber).slice(-4);
  const kyb: VendorWorkspace["kyb"] = {
    ...state.kyb,
    version: state.kyb.version + 1,
    status: "pending",
    proposedBank: {
      bankName,
      accountName: draft.accountName.trim(),
      last4,
      status: "pending",
      evidence: privateEvidence(draft.document, draft.operationId),
      submittedAt: at,
    },
  };
  const next = commitVendor(
    state,
    { ...context, now: () => at },
    "kyb.submitted",
    state.vendorId,
    `Ajukan bukti kepemilikan rekening ${bankName} ••${last4} untuk verifikasi.`,
    { kyb },
    draft.operationId,
  );
  return {
    ok: true,
    state: next,
    message: `Revisi diajukan pada simulasi dan menunggu verifikasi. ${state.kyb.verifiedBank.bankName} ••${state.kyb.verifiedBank.last4} tetap rekening terverifikasi; ${bankName} belum eligible payout.`,
  };
}
