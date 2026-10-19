import type {
  FinanceContext,
  FinanceIntent,
  FinancePermission,
  FinanceResult,
  FinanceState,
} from "../types/admin-finance";
import { redactFinanceText } from "./finance-redaction";

export const failure = (state: FinanceState, message: string): FinanceResult => ({
  ok: false,
  state,
  message,
});
export const success = (state: FinanceState, message: string): FinanceResult => ({
  ok: true,
  state,
  message,
});
export function financeGuard(
  context: FinanceContext,
  permission: FinancePermission,
): string | null {
  if (!context.online) return "Offline. Simpan pemeriksaan Anda dan coba saat koneksi pulih.";
  if (!context.sessionValid) return "Sesi berakhir. Tindakan belum diterapkan.";
  if (context.role === "support" || !context.permissions[permission])
    return "Izin tindakan keuangan tidak tersedia atau telah dicabut.";
  return null;
}
export function intentGuard(input: FinanceIntent): string | null {
  if (!input.operationId.trim()) return "Identitas permintaan wajib tersedia.";
  if (!input.reason.trim()) return "Alasan tindakan wajib diisi.";
  if (!input.acknowledged) return "Tinjau dampak dan centang konfirmasi terlebih dahulu.";
  return null;
}
export function replay(
  state: FinanceState,
  operationId: string,
  fingerprint: string,
): FinanceResult | null {
  const previous = state.operations[operationId];
  if (!previous) return null;
  return previous.fingerprint === fingerprint
    ? success(state, "Permintaan yang sama sudah dicatat. Tidak ada tindakan atau jurnal kedua.")
    : failure(state, "Kunci permintaan sudah digunakan untuk isi yang berbeda.");
}
export function commit(
  state: FinanceState,
  next: FinanceState,
  context: FinanceContext,
  input: FinanceIntent,
  action: string,
  objectId: string,
  fingerprint: string,
  result: string,
  diff?: string,
): FinanceResult {
  const entry = {
    id: `AUD-${state.audit.length + 1}`,
    at: new Date(context.now()).toISOString(),
    actor: context.actorId,
    objectId,
    action,
    result,
    reason: redactFinanceText(input.reason.trim()),
    beforeVersion: input.expectedVersion,
    version: input.expectedVersion + 1,
    ...(diff ? { diff } : {}),
  };
  return success(
    {
      ...next,
      operations: { ...state.operations, [input.operationId]: { fingerprint, result } },
      audit: [...state.audit, entry],
    },
    result,
  );
}
