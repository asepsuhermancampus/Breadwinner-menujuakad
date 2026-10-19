import { describe, expect, it } from "vitest";
import { createVendorContext, createVendorWorkspace, submitVendorKyb } from "./vendor-operations";
import type { BankRevisionDraft, UploadMetadata } from "../types/vendor";

function revision(patch: Partial<BankRevisionDraft> = {}): BankRevisionDraft {
  return {
    bankName: "Mandiri",
    accountName: "Kalyana Photography & Cinema",
    accountNumber: "1234567896402",
    confirmAccountName: "Kalyana Photography & Cinema",
    confirmAccountNumber: "1234567896402",
    document: { name: "rekening.pdf", type: "application/pdf", size: 1024 },
    acknowledged: true,
    operationId: "bank-revision-one",
    ...patch,
  };
}

function submit(patch: Partial<BankRevisionDraft> = {}) {
  const state = createVendorWorkspace();
  return submitVendorKyb(state, revision(patch), createVendorContext(state), state.version);
}

describe("private KYB bank revision", () => {
  it("keeps the verified bank active and stores only a private metadata proposal", () => {
    const state = createVendorWorkspace();
    const before = structuredClone(state);
    const at = "2026-10-30T09:00:00+07:00";
    const document = {
      name: "rekening.pdf",
      type: "application/pdf",
      size: 1024,
      content: "private-file-bytes",
      url: "data:application/pdf;base64,secret",
    };
    const draft = revision({ document });
    const result = submitVendorKyb(
      state,
      draft,
      { ...createVendorContext(state), now: () => at },
      state.version,
    );
    expect(result.ok).toBe(true);
    expect(result.state.kyb.verifiedBank).toEqual(before.kyb.verifiedBank);
    expect(result.state.kyb).toMatchObject({ status: "pending", version: state.kyb.version + 1 });
    expect(result.state.kyb.proposedBank).toMatchObject({
      bankName: "Mandiri",
      accountName: "Kalyana Photography & Cinema",
      last4: "6402",
      status: "pending",
      submittedAt: at,
      evidence: {
        access: "private",
        extension: "pdf",
        mimeType: "application/pdf",
        sizeBytes: 1024,
      },
    });
    expect(Object.keys(result.state.kyb.proposedBank.evidence!).sort()).toEqual(
      ["id", "label", "extension", "mimeType", "sizeBytes", "access"].sort(),
    );
    const serialized = JSON.stringify(result.state);
    for (const secret of [draft.accountNumber, "private-file-bytes", document.url]) {
      expect(serialized).not.toContain(secret);
    }
    expect(result.state.audit).toEqual([
      expect.objectContaining({
        action: "kyb.submitted",
        actorId: state.ownerId,
        vendorId: state.vendorId,
        previousVersion: state.version,
        version: state.version + 1,
        at,
      }),
    ]);
    expect(state).toEqual(before);
  });

  it.each([
    ["pdf", "application/pdf"],
    ["jpg", "image/jpeg"],
    ["jpeg", "image/jpeg"],
    ["png", "image/png"],
  ])("accepts a matching %s file at the inclusive 10 MiB limit", (extension, type) => {
    const result = submit({
      document: { name: `rekening.${extension}`, type, size: 10 * 1024 * 1024 },
    });
    expect(result.ok).toBe(true);
    expect(result.state.kyb.proposedBank.evidence).toMatchObject({
      access: "private",
      extension,
      mimeType: type,
      sizeBytes: 10 * 1024 * 1024,
    });
  });

  it.each([
    { name: "rekening.exe", type: "application/pdf", size: 100 },
    { name: "rekening.pdf.exe", type: "application/pdf", size: 100 },
    { name: "rekening.pdf", type: "image/png", size: 100 },
    { name: "rekening.png", type: "application/pdf", size: 100 },
    { name: "rekening.pdf", type: "application/octet-stream", size: 100 },
    { name: "rekening.pdf", type: "application/pdf", size: 10 * 1024 * 1024 + 1 },
    { name: "rekening.pdf", type: "application/pdf", size: 0 },
    { name: "rekening.pdf", type: "application/pdf", size: -1 },
  ] satisfies UploadMetadata[])(
    "rejects invalid evidence metadata without mutation: %j",
    (document) => {
      const state = createVendorWorkspace();
      const before = structuredClone(state);
      const result = submitVendorKyb(
        state,
        revision({ document }),
        createVendorContext(state),
        state.version,
      );
      expect(result).toMatchObject({ ok: false, state: before });
      expect(state).toEqual(before);
    },
  );

  it.each([
    { bankName: " " },
    { accountName: " " },
    { accountNumber: "invalid" },
    { confirmAccountName: "Other name" },
    { confirmAccountNumber: "0000000000000" },
    { document: null },
    { acknowledged: false },
    { operationId: " " },
  ] satisfies Partial<BankRevisionDraft>[])(
    "requires complete matching confirmed input: %j",
    (patch) => {
      expect(submit(patch).ok).toBe(false);
    },
  );

  it.each(["pending", "error"] as const)(
    "blocks submission while the upload is %s",
    (uploadState) => {
      const state = createVendorWorkspace();
      const result = submitVendorKyb(
        state,
        revision(),
        { ...createVendorContext(state), uploadState },
        state.version,
      );
      expect(result).toMatchObject({ ok: false, state });
    },
  );

  it("replays the submitted revision with no extra audit even when the latest version changes", () => {
    const state = createVendorWorkspace();
    const draft = revision();
    const first = submitVendorKyb(state, draft, createVendorContext(state), state.version);
    expect(first.ok).toBe(true);
    const replay = submitVendorKyb(
      first.state,
      draft,
      {
        ...createVendorContext(first.state),
        latestVersion: first.state.version + 2,
      },
      state.version,
    );
    expect(replay.ok).toBe(true);
    expect(replay.state).toEqual(first.state);
    expect(replay.state.audit).toHaveLength(1);
    expect(replay.state.kyb.verifiedBank).toEqual(state.kyb.verifiedBank);
  });
});
