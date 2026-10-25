import { describe, expect, it } from "vitest";
import {
  executeWaDispatch,
  getWaRecipientSnapshot,
  type WaDispatchState,
} from "./whatsapp-dispatch";

describe("whatsapp-dispatch utils", () => {
  it("provides snapshots distinguishing initial and already dispatched batches", () => {
    const fresh = getWaRecipientSnapshot(false);
    expect(fresh.eligibleCount).toBe(10);
    expect(fresh.excludedCount).toBe(4);

    const dispatched = getWaRecipientSnapshot(true);
    expect(dispatched.eligibleCount).toBe(0);
    expect(dispatched.excludedCount).toBe(14);
  });

  it("executes valid dispatch atomically and decrements quota", () => {
    const state: WaDispatchState = { quota: 100, hasDispatchedBatch: false };
    const snapshot = getWaRecipientSnapshot(false);

    const result = executeWaDispatch(state, snapshot);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.remainingQuota).toBe(90);
      expect(result.dispatchedCount).toBe(10);
    }
    expect(state.hasDispatchedBatch).toBe(true);
    expect(state.quota).toBe(90);
  });

  it("blocks duplicate synchronous dispatch calls atomically without double-decrementing quota", () => {
    const state: WaDispatchState = { quota: 100, hasDispatchedBatch: false };
    const snapshot = getWaRecipientSnapshot(false);

    const first = executeWaDispatch(state, snapshot);
    expect(first.success).toBe(true);

    const duplicate = executeWaDispatch(state, snapshot);
    expect(duplicate.success).toBe(false);
    if (!duplicate.success) {
      expect(duplicate.error).toContain("stale selection");
    }
    expect(state.quota).toBe(90);
  });

  it("rejects dispatch when quota is insufficient", () => {
    const state: WaDispatchState = { quota: 5, hasDispatchedBatch: false };
    const snapshot = getWaRecipientSnapshot(false);

    const result = executeWaDispatch(state, snapshot);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Kuota tidak mencukupi");
    }
    expect(state.hasDispatchedBatch).toBe(false);
    expect(state.quota).toBe(5);
  });

  it("rejects dispatch when eligibleCount is zero", () => {
    const state: WaDispatchState = { quota: 100, hasDispatchedBatch: false };
    const snapshot = getWaRecipientSnapshot(true);

    const result = executeWaDispatch(state, snapshot);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Tidak ada penerima yang memenuhi syarat.");
    }
    expect(state.quota).toBe(100);
  });
});
