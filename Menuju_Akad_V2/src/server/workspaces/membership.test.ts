import { expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { MembershipService } from "./membership-service";
vi.mock("server-only", () => ({}));
it("limits workspace to two verified members and rejects replay and revoked invites", () => {
  const db = new PaymentDatabase(),
    workspaces = new WorkspaceService(db.storage());
  const service = new MembershipService(workspaces),
    owner = workspaces.getOrCreateWorkspace("a");
  const invite = service.invitePartner("a");
  expect(service.acceptPartnerInvite("b", invite.token).workspaceId).toBe(owner.id);
  expect(workspaces.requireWorkspace("b", owner.id).id).toBe(owner.id);
  expect(service.listMemberships("b").some((w) => w.id === owner.id)).toBe(true);
  expect(() => service.acceptPartnerInvite("c", invite.token)).toThrow();
  expect(() => service.invitePartner("a")).toThrow();
  service.revokePartner("a");
  expect(() => workspaces.requireWorkspace("b", owner.id)).toThrow();
  expect(service.listMemberships("b").some((w) => w.id === owner.id)).toBe(false);
  db.close();
});
