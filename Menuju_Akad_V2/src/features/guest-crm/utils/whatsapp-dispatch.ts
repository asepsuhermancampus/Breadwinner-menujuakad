import type { WaRecipientSnapshot } from "../types/guest";

export type WaDispatchState = {
  quota: number;
  hasDispatchedBatch: boolean;
};

export type WaDispatchResult =
  | { success: true; remainingQuota: number; dispatchedCount: number }
  | { success: false; error: string };

export function getWaRecipientSnapshot(hasDispatchedBatch: boolean): WaRecipientSnapshot {
  return hasDispatchedBatch
    ? {
        totalSelected: 14,
        eligibleCount: 0,
        excludedCount: 14,
        excludedReasons: [
          "12 undangan sudah pernah terkirim sebelumnya",
          "1 tamu belum memberikan izin komunikasi WhatsApp",
          "1 nomor telepon belum valid",
        ],
      }
    : {
        totalSelected: 14,
        eligibleCount: 10,
        excludedCount: 4,
        excludedReasons: [
          "2 undangan sudah pernah terkirim sebelumnya",
          "1 tamu belum memberikan izin komunikasi WhatsApp",
          "1 nomor telepon belum valid",
        ],
      };
}

export function executeWaDispatch(
  state: WaDispatchState,
  snapshot: WaRecipientSnapshot,
): WaDispatchResult {
  if (state.hasDispatchedBatch) {
    return {
      success: false,
      error: "Daftar penerima sudah pernah dikirim (stale selection).",
    };
  }
  if (typeof state.quota !== "number" || !Number.isFinite(state.quota) || state.quota < 0) {
    return {
      success: false,
      error: "Data kuota tidak valid.",
    };
  }
  if (snapshot.eligibleCount <= 0) {
    return {
      success: false,
      error: "Tidak ada penerima yang memenuhi syarat.",
    };
  }
  if (state.quota < snapshot.eligibleCount) {
    return {
      success: false,
      error: `Kuota tidak mencukupi (tersedia: ${state.quota}, dibutuhkan: ${snapshot.eligibleCount}).`,
    };
  }

  state.hasDispatchedBatch = true;
  state.quota -= snapshot.eligibleCount;

  return {
    success: true,
    remainingQuota: state.quota,
    dispatchedCount: snapshot.eligibleCount,
  };
}
