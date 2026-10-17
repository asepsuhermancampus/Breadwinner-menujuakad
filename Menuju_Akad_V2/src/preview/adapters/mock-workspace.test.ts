import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { OnboardingDraft, WorkspaceAdapter } from "@/features/planner-workspaces/contracts";
import { workspaceFixture } from "../fixtures/workspace";
import { createMockWorkspace } from "./mock-workspace";

function memoryStorage(): Storage {
  const values = new Map<string, string>();
  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    key: (index) => [...values.keys()][index] ?? null,
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
    removeItem: (key) => {
      values.delete(key);
    },
  };
}

describe("local workspace adapter", () => {
  let adapter: WorkspaceAdapter;
  let now: number;
  beforeEach(() => {
    now = Date.parse("2026-10-25T00:00:00+07:00");
    vi.stubGlobal("localStorage", memoryStorage());
    vi.stubGlobal("sessionStorage", memoryStorage());
    adapter = createMockWorkspace(
      structuredClone(workspaceFixture),
      { now: () => now },
      async () => {},
    );
  });
  afterEach(() => vi.unstubAllGlobals());

  async function load(): Promise<OnboardingDraft> {
    const draft = await adapter.loadDraft(workspaceFixture.workspaceId);
    if (!draft) throw new Error("Expected persisted draft");
    return draft;
  }

  it("persists drafts and keeps separate event data across adapter reloads", async () => {
    const draft = await load();
    draft.profile.groom.nickname = "Andi baru";
    draft.events.engagement.budgetIdr = 30_000_000;
    const saved = await adapter.saveDraft(draft, draft.version);
    const reopened = createMockWorkspace(workspaceFixture, { now: () => now }, async () => {});
    expect(await reopened.loadDraft(draft.workspaceId)).toEqual(saved);
    expect(saved.events.wedding).toEqual(workspaceFixture.events.wedding);
    expect(saved.version).toBe(draft.version + 1);
  });

  it("rejects stale saves and caller-controlled version jumps", async () => {
    const draft = await load();
    await adapter.saveDraft(draft, draft.version);
    await expect(adapter.saveDraft(draft, draft.version)).rejects.toMatchObject({ code: "stale" });
    const current = await load();
    await expect(
      adapter.saveDraft({ ...current, version: 999 }, current.version),
    ).rejects.toMatchObject({ code: "stale" });
  });

  it("preserves membership, invite ownership and event identities on draft writes", async () => {
    const draft = await load();
    draft.members = [{ actorId: "attacker", workspaceId: draft.workspaceId, role: "owner" }];
    draft.actorId = "attacker";
    const saved = await adapter.saveDraft(draft, draft.version);
    expect(saved.actorId).toBe(workspaceFixture.actorId);
    expect(saved.members).toEqual(workspaceFixture.members);
    const changed = structuredClone(saved);
    changed.events.engagement.id = changed.events.wedding.id;
    await expect(adapter.saveDraft(changed, changed.version)).rejects.toMatchObject({
      code: "invalid",
    });
  });

  it("rejects a different workspace and stored cross-workspace capabilities", async () => {
    await expect(adapter.loadDraft("other")).rejects.toMatchObject({ code: "forbidden" });
    const invite = await adapter.createInvite(workspaceFixture.workspaceId);
    const corrupt = await load();
    corrupt.invite = { ...invite, workspaceId: "other" };
    localStorage.setItem("ma-v2-workspace", JSON.stringify(corrupt));
    await expect(adapter.getInvite(invite.token)).rejects.toMatchObject({ code: "wrong-owner" });
    localStorage.setItem("ma-v2-workspace", JSON.stringify({ ...corrupt, workspaceId: "other" }));
    await expect(adapter.loadDraft(workspaceFixture.workspaceId)).rejects.toMatchObject({
      code: "forbidden",
    });
  });

  it("creates a retry-safe opaque invite, rejects owner redemption and expires by injected clock", async () => {
    const invite = await adapter.createInvite(workspaceFixture.workspaceId);
    expect(invite.token).toMatch(/^[A-Za-z0-9_-]{40,}$/);
    expect(await adapter.createInvite(workspaceFixture.workspaceId)).toEqual(invite);
    await expect(
      adapter.redeemInvite(invite.token, workspaceFixture.actorId),
    ).rejects.toMatchObject({ code: "wrong-owner" });
    now = invite.expiresAt;
    await expect(adapter.redeemInvite(invite.token, "actor-andi")).rejects.toMatchObject({
      code: "expired",
    });
    expect((await load()).members).toHaveLength(1);
  });

  it("revokes invites, rotates expired links and rejects replay without duplicate membership", async () => {
    const first = await adapter.createInvite(workspaceFixture.workspaceId);
    await adapter.revokeInvite(first.token);
    await expect(adapter.redeemInvite(first.token, "actor-andi")).rejects.toMatchObject({
      code: "revoked",
    });
    const fresh = await adapter.createInvite(workspaceFixture.workspaceId);
    expect(fresh.token).not.toBe(first.token);
    await expect(adapter.getInvite(first.token)).rejects.toMatchObject({ code: "invalid" });
    await adapter.redeemInvite(fresh.token, "actor-andi");
    await expect(adapter.redeemInvite(fresh.token, "actor-andi")).rejects.toMatchObject({
      code: "used",
    });
    await expect(adapter.revokeInvite(fresh.token)).rejects.toMatchObject({ code: "used" });
    expect((await load()).members).toHaveLength(2);
  });

  it("rotates an expired capability and admits only one concurrent partner", async () => {
    const first = await adapter.createInvite(workspaceFixture.workspaceId);
    now = first.expiresAt;
    const fresh = await adapter.createInvite(workspaceFixture.workspaceId);
    expect(fresh.token).not.toBe(first.token);
    expect(fresh.expiresAt).toBe(now + 86_400_000);
    const attempts = await Promise.allSettled([
      adapter.redeemInvite(fresh.token, "partner-one"),
      adapter.redeemInvite(fresh.token, "partner-two"),
    ]);
    expect(attempts.filter((attempt) => attempt.status === "fulfilled")).toHaveLength(1);
    expect((await load()).members).toHaveLength(2);
  });

  it("keeps the previous photo when reading a replacement fails", async () => {
    const draft = await load();
    draft.profile.groom.photoUrl = "data:image/png;base64,cHJldmlvdXM=";
    await adapter.saveDraft(draft, draft.version);
    vi.stubGlobal(
      "FileReader",
      class {
        result = null;
        onerror: (() => void) | null = null;
        readAsDataURL() {
          this.onerror?.();
        }
      },
    );
    await expect(
      adapter.uploadPhoto(new File(["replacement"], "photo.png", { type: "image/png" })),
    ).rejects.toMatchObject({ code: "upload" });
    expect((await load()).profile.groom.photoUrl).toBe(draft.profile.groom.photoUrl);
  });

  it("observes a real browser offline signal without losing saved data", async () => {
    const draft = await load();
    vi.stubGlobal("navigator", { onLine: false });
    await expect(adapter.saveDraft(draft, draft.version)).rejects.toMatchObject({
      code: "offline",
    });
    vi.stubGlobal("navigator", { onLine: true });
    expect(await load()).toEqual(draft);
  });

  it.each(["offline", "revoked", "conflict"])(
    "blocks %s operations without mutation",
    async (scenario) => {
      const initial = await load();
      sessionStorage.setItem("ma-v2-scenario", scenario);
      await expect(adapter.saveDraft(initial, initial.version)).rejects.toThrow();
      sessionStorage.clear();
      expect(await load()).toEqual(initial);
    },
  );
});
