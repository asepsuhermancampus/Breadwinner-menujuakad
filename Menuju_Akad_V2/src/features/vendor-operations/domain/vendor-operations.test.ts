import { describe, expect, it } from "vitest";
import {
  createVendorContext,
  createVendorWorkspace,
  decideVendorOrder,
  saveVendorCatalog,
  submitVendorKyb,
} from "./vendor-operations";
import type {
  BankRevisionDraft,
  DecisionInput,
  VendorContext,
  VendorWorkspace,
} from "../types/vendor";

const bankDraft: BankRevisionDraft = {
  bankName: "Mandiri",
  accountName: "Kalyana Photography & Cinema",
  accountNumber: "1234567896402",
  confirmAccountName: "Kalyana Photography & Cinema",
  confirmAccountNumber: "1234567896402",
  document: { name: "rekening.pdf", type: "application/pdf", size: 1024 },
  acknowledged: true,
  operationId: "kyb-one",
};

function decision(state: VendorWorkspace, patch: Partial<DecisionInput> = {}): DecisionInput {
  return {
    orderId: state.orders[0]!.id,
    action: "accept",
    expectedVersion: state.version,
    expectedOrderVersion: state.orders[0]!.version,
    reason: "",
    acknowledged: true,
    operationId: "decision-one",
    ...patch,
  };
}

const commands = {
  catalog: (state: VendorWorkspace, context: VendorContext) =>
    saveVendorCatalog(state, structuredClone(state.catalog), context, state.version),
  kyb: (state: VendorWorkspace, context: VendorContext) =>
    submitVendorKyb(state, bankDraft, context, state.version),
  order: (state: VendorWorkspace, context: VendorContext) =>
    decideVendorOrder(state, decision(state), context),
};

describe("vendor workspace transactions", () => {
  it("creates isolated deterministic fixtures in the hidden sandbox", () => {
    const state = createVendorWorkspace();
    const second = createVendorWorkspace();
    const context = createVendorContext(state);
    expect(second).toEqual(state);
    second.catalog.packages[0]!.name = "Changed";
    expect(state.catalog.packages[0]!.name).not.toBe("Changed");
    expect(context).toMatchObject({ sandbox: true, availability: "hidden" });
    expect(Number.isNaN(Date.parse(context.now!()))).toBe(false);
    expect(commands.catalog(state, context).ok).toBe(true);
  });

  it("changes catalog immutably without changing the existing contract snapshot", () => {
    const state = createVendorWorkspace();
    const before = structuredClone(state);
    const draft = structuredClone(state.catalog);
    const item = draft.packages.find((entry) => entry.id === state.orders[0]!.packageId)!;
    item.name = "Paket baru";
    item.priceIdr = 20_000_000;
    item.deliverables = ["Lingkup baru"];
    const result = saveVendorCatalog(state, draft, createVendorContext(state), state.version);
    expect(result.ok).toBe(true);
    expect(result.state.version).toBe(state.version + 1);
    expect(result.state.catalog).toEqual(draft);
    expect(result.state.orders).toEqual(before.orders);
    expect(state).toEqual(before);
    draft.packages[0]!.name = "Mutasi setelah simpan";
    expect(result.state.catalog.packages[0]!.name).not.toBe(draft.packages[0]!.name);
  });

  for (const [name, run] of Object.entries(commands)) {
    it.each([
      { role: "support" },
      { role: "finance" },
      { actorId: "other-owner" },
      { vendorId: "other-vendor" },
      { online: false },
      { sessionValid: false },
      { sandbox: false, availability: "hidden" },
      { latestVersion: 99 },
    ] satisfies Partial<VendorContext>[])(`${name} blocks an invalid context: %j`, (patch) => {
      const state = createVendorWorkspace();
      const before = structuredClone(state);
      const result = run(state, { ...createVendorContext(state), ...patch });
      expect(result.ok).toBe(false);
      expect(result.state).toEqual(before);
      expect(state).toEqual(before);
    });

    it(`${name} rechecks its own permission`, () => {
      const state = createVendorWorkspace();
      const context = createVendorContext(state);
      const permission = {
        catalog: "catalogWrite",
        kyb: "kybSubmit",
        order: "orderDecide",
      } as const;
      context.permissions[permission[name as keyof typeof permission]] = false;
      expect(run(state, context)).toMatchObject({ ok: false, state });
    });
  }

  it("requires both workspace and item versions to match before deciding", () => {
    const state = createVendorWorkspace();
    const context = createVendorContext(state);
    for (const patch of [{ expectedVersion: 0 }, { expectedOrderVersion: 0 }]) {
      const result = decideVendorOrder(state, decision(state, patch), context);
      expect(result).toMatchObject({ ok: false, state });
    }
    expect(saveVendorCatalog(state, state.catalog, context, 0).ok).toBe(false);
    expect(submitVendorKyb(state, bankDraft, context, 0).ok).toBe(false);
  });

  it("requires acknowledgement and a rejection reason without consuming the operation", () => {
    const state = createVendorWorkspace();
    for (const patch of [{ acknowledged: false }, { action: "reject", reason: "  " }] as const) {
      const result = decideVendorOrder(state, decision(state, patch), createVendorContext(state));
      expect(result).toMatchObject({ ok: false, state });
      expect(result.state.operations).toEqual({});
    }
  });

  it("blocks only acceptance when the event slot is unavailable", () => {
    const state = createVendorWorkspace();
    const context = { ...createVendorContext(state), slotAvailable: false };
    expect(decideVendorOrder(state, decision(state), context).ok).toBe(false);
    const result = decideVendorOrder(
      state,
      decision(state, { action: "reject", reason: "Tanggal penuh" }),
      context,
    );
    expect(result.ok).toBe(true);
    expect(result.state.orders[0]!.status).toBe("rejected");
    expect(result.state.orders[0]!.decision?.reason).toBe("Tanggal penuh");
  });

  it("replays the same operation despite later versions without duplicating audit", () => {
    const state = createVendorWorkspace();
    const input = decision(state);
    const first = decideVendorOrder(state, input, createVendorContext(state));
    expect(first.ok).toBe(true);
    const context = { ...createVendorContext(first.state), latestVersion: 99 };
    const replay = decideVendorOrder(first.state, input, context);
    expect(replay.ok).toBe(true);
    expect(replay.state).toEqual(first.state);
    expect(replay.state.audit).toHaveLength(1);
    const reused = decideVendorOrder(
      first.state,
      decision(first.state, {
        orderId: first.state.orders[1]!.id,
        expectedOrderVersion: first.state.orders[1]!.version,
      }),
      createVendorContext(first.state),
    );
    expect(reused).toMatchObject({ ok: false, state: first.state });
  });

  it("records the injected actor and timestamp while preserving the original order", () => {
    const state = createVendorWorkspace();
    const before = structuredClone(state);
    const at = "2026-10-30T11:00:00+07:00";
    const result = decideVendorOrder(state, decision(state), {
      ...createVendorContext(state),
      now: () => at,
    });
    expect(result.ok).toBe(true);
    expect(result.state.orders[0]).toMatchObject({
      status: "accepted",
      version: state.orders[0]!.version + 1,
    });
    expect(result.state.orders[0]!.decision).toMatchObject({
      action: "accept",
      actorId: state.ownerId,
      at,
    });
    expect(result.state.audit).toEqual([
      expect.objectContaining({
        action: "order.accepted",
        objectId: state.orders[0]!.id,
        actorId: state.ownerId,
        vendorId: state.vendorId,
        previousVersion: state.version,
        version: state.version + 1,
        at,
      }),
    ]);
    expect(state).toEqual(before);
  });
});
