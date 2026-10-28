import { afterEach, expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { MembershipService } from "./membership-service";
import { saveMemberProfile } from "./member-profile";
import { FinanceService } from "./finance-service";
vi.mock("server-only", () => ({}));
const db = new PaymentDatabase();
const workspaces = new WorkspaceService(db.storage());
const membership = new MembershipService(workspaces);
afterEach(() =>
  db
    .storage()
    .exec(
      "DELETE FROM workspace_members; DELETE FROM workspace_invites; DELETE FROM workspace_finance; DELETE FROM workspace_profile_photos; DELETE FROM customer_workspaces",
    ),
);
it("locks legacy partner details and permits invitation before profile completion", () => {
  const w = workspaces.saveProfile("a", {
    fullName: "Owner",
    partnerName: "Legacy",
    partnerNickname: "Old",
  });
  expect(w.profile.partnerName).toBeNull();
  expect(w.partnerAccess?.state).toBe("locked");
  const invite = membership.invitePartner("a");
  expect(membership.previewInvite("b", invite.token).side).toBeNull();
  membership.acceptPartnerInvite("b", invite.token, { fullName: "Partner", nickname: "Pa" });
  expect(workspaces.requireWorkspace("b").id).toBe(w.id);
  expect(workspaces.requireWorkspace("b").ownerSide).toBeNull();
});
it("joins with recipient profile, assigns sides, prevents cross-slot updates and masks revocation", () => {
  const w = workspaces.getOrCreateWorkspace("a");
  saveMemberProfile(workspaces, "a", w.id, { fullName: "Owner", nickname: "Ow", side: "bride" });
  db.storage()
    .prepare("INSERT INTO workspace_profile_photos VALUES(?,'partner',?,'legacy')")
    .run(w.id, Buffer.from("old"));
  const invite = membership.invitePartner("a");
  expect(membership.previewInvite("b", invite.token).side).toBe("groom");
  expect(() =>
    membership.acceptPartnerInvite("b", invite.token, { fullName: "", nickname: "B" }),
  ).toThrow();
  membership.acceptPartnerInvite("b", invite.token, { fullName: "Partner", nickname: "Pa" });
  expect(workspaces.requireWorkspace("b").id).toBe(w.id);
  expect(workspaces.requireWorkspace("b", w.id).profile.partnerPhotoUrl).toBeNull();
  expect(workspaces.requireWorkspace("b", w.id).profile.partnerName).toBe("Partner");
  expect(() =>
    saveMemberProfile(workspaces, "b", w.id, {
      fullName: "Hack",
      nickname: "H",
      partnerName: "Hack",
    }),
  ).toThrow();
  expect(
    saveMemberProfile(workspaces, "b", w.id, { fullName: "Partner", nickname: "Pa", side: "groom" })
      .ownerSide,
  ).toBe("bride");
  const finance = new FinanceService(workspaces);
  const snapshot = finance.read("b", w.id);
  expect(snapshot.actorSide).toBe("groom");
  expect(() =>
    finance.execute(
      { id: "b", name: "Partner" },
      {
        revision: snapshot.revision,
        requestId: "forged",
        command: {
          type: "entry",
          side: "bride",
          direction: "add",
          amount: 5,
          source: "Salary",
          notes: "",
        },
      },
      w.id,
    ),
  ).toThrow();
  membership.revokePartner("a");
  expect(workspaces.getOrCreateWorkspace("a").profile.partnerName).toBeNull();
  expect(() => membership.previewInvite("c", invite.token)).toThrow();
});
it("expires invites, rejects owner acceptance, replaces links, and rolls back failed onboarding", () => {
  const w = workspaces.getOrCreateWorkspace("a");
  saveMemberProfile(workspaces, "a", w.id, { fullName: "Owner", nickname: "Ow", side: "groom" });
  const first = membership.invitePartner("a");
  expect(() => membership.previewInvite("a", first.token)).toThrow();
  const second = membership.invitePartner("a");
  expect(() => membership.previewInvite("b", first.token)).toThrow();
  expect(workspaces.getOrCreateWorkspace("a").partnerAccess?.state).toBe("invited");
  db.storage().exec(
    "CREATE TRIGGER reject_member BEFORE INSERT ON workspace_members WHEN NEW.role='partner' BEGIN SELECT RAISE(ABORT,'membership failed'); END",
  );
  expect(() =>
    membership.acceptPartnerInvite("b", second.token, { fullName: "Partner", nickname: "Pa" }),
  ).toThrow("membership failed");
  expect(
    db.storage().prepare("SELECT partner_name FROM customer_workspaces WHERE id=?").get(w.id)?.[
      "partner_name"
    ],
  ).toBeNull();
  expect(membership.previewInvite("b", second.token).side).toBe("bride");
  db.storage().exec("DROP TRIGGER reject_member");
  db.storage()
    .prepare("UPDATE workspace_invites SET expires_at=?")
    .run(Date.now() - 1);
  expect(() => membership.previewInvite("b", second.token)).toThrow();
  expect(workspaces.getOrCreateWorkspace("a").partnerAccess?.state).toBe("locked");
});
