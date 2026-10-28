import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { MembershipService } from "./membership-service";
import { saveMemberProfile } from "./member-profile";
import { FinanceService } from "./finance-service";
import { ResourceService } from "./resource-service";
vi.mock("server-only", () => ({}));
let db: PaymentDatabase, service: WorkspaceService, id: string;
beforeEach(() => {
  db = new PaymentDatabase();
  service = new WorkspaceService(db.storage());
  id = service.getOrCreateWorkspace("owner").id;
});
afterEach(() => db.close());
function join() {
  const membership = new MembershipService(service);
  membership.acceptPartnerInvite("child", membership.invitePartner("owner").token, {
    fullName: "Child",
    nickname: "C",
  });
}
it("allows the invited partner to select a position and edit both connected profiles", () => {
  join();
  const saved = saveMemberProfile(service, "child", id, {
    fullName: "Child Updated",
    nickname: "Ci",
    side: "bride",
    companion: { fullName: "Owner Updated", nickname: "Ow" },
  });
  expect(saved.ownerSide).toBe("groom");
  expect(saved.profile).toMatchObject({
    fullName: "Owner Updated",
    nickname: "Ow",
    partnerName: "Child Updated",
    partnerNickname: "Ci",
  });
  expect(
    saveMemberProfile(service, "owner", id, {
      fullName: "Owner Updated",
      nickname: "Ow",
      side: "groom",
    }).ownerSide,
  ).toBe("groom");
});
it("keeps funds, allocation history and manual savings permissions with their owners when correcting positions", () => {
  join();
  saveMemberProfile(service, "owner", id, { fullName: "Owner", nickname: "O", side: "groom" });
  const finance = new FinanceService(service);
  new ResourceService(service).writeResource(
    "owner",
    "finance",
    0,
    [{ id: "budget", title: "Gedung", amount: 100 }],
    id,
  );
  const snapshot = finance.read("child", id);
  finance.execute(
    { id: "child", name: "Child" },
    {
      revision: snapshot.revision,
      requestId: "deposit",
      command: {
        type: "entry",
        side: "bride",
        direction: "add",
        amount: 500,
        source: "Gaji",
        notes: "",
      },
    },
    id,
  );
  const deposited = finance.read("child", id);
  finance.execute(
    { id: "owner", name: "Owner" },
    {
      revision: deposited.revision,
      requestId: "allocate",
      command: { type: "allocate", budgetId: "budget", side: "bride" },
    },
    id,
  );
  saveMemberProfile(service, "child", id, { fullName: "Child", nickname: "C", side: "groom" });
  const corrected = finance.read("child", id);
  expect(corrected.actorSide).toBe("groom");
  expect(corrected.balances).toEqual({ groom: 400, bride: 0, total: 400 });
  expect(corrected.allocations[0]).toMatchObject({
    budgetId: "budget",
    side: "groom",
    amount: 100,
  });
  expect(corrected.entries[0]).toMatchObject({ side: "groom", actorId: "child", amount: 500 });
  expect(() =>
    finance.execute(
      { id: "child", name: "Child" },
      {
        revision: corrected.revision,
        requestId: "forged",
        command: {
          type: "entry",
          side: "bride",
          direction: "subtract",
          amount: 1,
          source: "",
          notes: "",
        },
      },
      id,
    ),
  ).toThrow();
  const released = finance.execute(
    { id: "child", name: "Child" },
    {
      revision: corrected.revision,
      requestId: "release",
      command: { type: "release", budgetId: "budget" },
    },
    id,
  );
  expect(released.balances).toEqual({ groom: 500, bride: 0, total: 500 });
});
it("keeps an unconnected profile locked and rejects revoked members", () => {
  expect(() =>
    saveMemberProfile(service, "owner", id, {
      fullName: "Owner",
      nickname: "O",
      companion: { fullName: "Other", nickname: "P" },
    }),
  ).toThrow();
  join();
  new MembershipService(service).revokePartner("owner", id);
  expect(() =>
    saveMemberProfile(service, "child", id, { fullName: "Child", nickname: "C", side: "groom" }),
  ).toThrow();
});
