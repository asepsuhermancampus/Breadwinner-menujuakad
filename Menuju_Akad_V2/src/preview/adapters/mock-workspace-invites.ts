import { WorkspaceFault, type WorkspaceAdapter } from "@/features/planner-workspaces/contracts";
import { assertCanRedeem, inviteState } from "@/features/planner-workspaces/utils/invite-policy";
import type { Clock } from "./mock-runtime";
import type { WorkspaceStore } from "./mock-workspace-store";

type InviteMethods = Pick<
  WorkspaceAdapter,
  "createInvite" | "getInvite" | "revokeInvite" | "redeemInvite"
>;

export function mockWorkspaceInvites(
  workspaceId: string,
  store: WorkspaceStore,
  clock: Clock,
  wait: () => Promise<void>,
): InviteMethods {
  function getScopedInvite(token: string) {
    const draft = store.scoped(workspaceId);
    if (!draft.invite || draft.invite.token !== token) {
      throw new WorkspaceFault("invalid", "Tautan tidak tersedia pada pratinjau lokal ini.");
    }
    return { draft, invite: draft.invite };
  }
  return {
    async createInvite(targetId) {
      await wait();
      const draft = store.scoped(targetId);
      if (draft.members.filter((member) => member.workspaceId === workspaceId).length >= 2) {
        throw new WorkspaceFault("duplicate-member", "Ruang sudah memiliki dua anggota.");
      }
      if (draft.invite && inviteState(draft.invite, clock.now()) === "pending") {
        return structuredClone(draft.invite);
      }
      const bytes = crypto.getRandomValues(new Uint8Array(32));
      const token = btoa(String.fromCharCode(...bytes))
        .replaceAll("+", "-")
        .replaceAll("/", "_")
        .replaceAll("=", "");
      const invite = {
        token,
        workspaceId,
        ownerId: draft.actorId,
        expiresAt: clock.now() + 86_400_000,
        status: "pending" as const,
        redeemedBy: null,
      };
      store.persist({ ...draft, invite });
      return invite;
    },
    async getInvite(token) {
      await wait();
      return structuredClone(getScopedInvite(token).invite);
    },
    async revokeInvite(token) {
      await wait();
      const { draft, invite } = getScopedInvite(token);
      if (invite.status === "used") throw new WorkspaceFault("used", "Tautan sudah dipakai.");
      if (invite.status === "revoked") return structuredClone(invite);
      const revoked = { ...invite, status: "revoked" as const };
      store.persist({ ...draft, invite: revoked });
      return revoked;
    },
    async redeemInvite(token, actorId) {
      await wait();
      const { draft, invite } = getScopedInvite(token);
      if (!actorId.trim()) throw new WorkspaceFault("invalid", "Akun pasangan tidak valid.");
      assertCanRedeem(invite, actorId, draft.members, clock.now());
      const used = { ...invite, status: "used" as const, redeemedBy: actorId };
      store.persist({
        ...draft,
        invite: used,
        members: [...draft.members, { actorId, workspaceId, role: "partner" }],
      });
      return used;
    },
  };
}
