import { expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import {
  initializeAdminMembership,
  listAdminMemberships,
  revokeAdminPartner,
  cancelAdminInvite,
} from "./admin-membership";
import { MembershipService } from "./membership-service";
vi.mock("server-only", () => ({}));

it("revokes only the expected partner atomically and retains workspace data", () => {
  const database = new PaymentDatabase();
  const db = database.storage();
  const workspaces = new WorkspaceService(db);
  initializeAdminMembership(db);
  const workspace = workspaces.getOrCreateWorkspace("owner");
  db.prepare("INSERT INTO workspace_members VALUES(?,?,'partner')").run(workspace.id, "partner");
  db.prepare("INSERT INTO workspace_resources VALUES(?,?,?,?)").run(workspace.id, "tasks", "[]", 1);
  expect(listAdminMemberships(db, "partner")).toMatchObject([
    { id: workspace.id, role: "partner" },
  ]);
  expect(() =>
    revokeAdminPartner(db, "root", workspace.id, "partner", "reason", workspace.revision + 1),
  ).toThrow(/berubah/i);
  expect(() =>
    revokeAdminPartner(db, "root", workspace.id, "owner", "reason", workspace.revision),
  ).toThrow(/berubah/i);
  db.exec(
    "CREATE TRIGGER reject_audit BEFORE INSERT ON workspace_membership_audit BEGIN SELECT RAISE(ABORT, 'audit failed'); END",
  );
  expect(() =>
    revokeAdminPartner(db, "root", workspace.id, "partner", "reason", workspace.revision),
  ).toThrow(/audit failed/);
  expect(workspaces.requireWorkspace("partner", workspace.id).role).toBe("partner");
  db.exec("DROP TRIGGER reject_audit");
  expect(() =>
    revokeAdminPartner(db, "root", workspace.id, "wrong", "reason", workspace.revision),
  ).toThrow(/berubah/i);
  expect(workspaces.requireWorkspace("partner", workspace.id).role).toBe("partner");
  revokeAdminPartner(
    db,
    "root",
    workspace.id,
    "partner",
    "  Permintaan pemilik  ",
    workspace.revision,
  );
  expect(() => workspaces.requireWorkspace("partner", workspace.id)).toThrow();
  expect(workspaces.requireWorkspace("owner", workspace.id).role).toBe("owner");
  expect(
    db.prepare("SELECT data FROM workspace_resources WHERE workspace_id=?").get(workspace.id)?.data,
  ).toBe("[]");
  expect(
    db.prepare("SELECT actor,target,reason FROM workspace_membership_audit").get(),
  ).toMatchObject({ actor: "root", target: "partner", reason: "Permintaan pemilik" });
  expect(() =>
    revokeAdminPartner(db, "root", workspace.id, "partner", "again", workspace.revision),
  ).toThrow(/berubah/i);
  database.close();
});

it("cancels only the matching pending invite, records the action and preserves later invites", () => {
  const database = new PaymentDatabase();
  const db = database.storage();
  const workspaces = new WorkspaceService(db);
  const membership = new MembershipService(workspaces);
  const workspace = workspaces.getOrCreateWorkspace("owner");
  const first = membership.invitePartner("owner", workspace.id);
  const invite = listAdminMemberships(db, "owner")[0]!.invite!;
  const second = membership.invitePartner("owner", workspace.id);
  expect(() => cancelAdminInvite(db, "root", workspace.id, invite, "reason")).toThrow(/berubah/i);
  expect(membership.previewInvite("partner", second.token)).toBeDefined();
  const latest = listAdminMemberships(db, "owner")[0]!.invite!;
  db.exec(
    "CREATE TRIGGER reject_invite_audit BEFORE INSERT ON workspace_membership_audit BEGIN SELECT RAISE(ABORT, 'audit failed'); END",
  );
  expect(() => cancelAdminInvite(db, "root", workspace.id, latest, "reason")).toThrow(
    /audit failed/,
  );
  expect(membership.previewInvite("partner", second.token)).toBeDefined();
  db.exec("DROP TRIGGER reject_invite_audit");
  cancelAdminInvite(db, "root", workspace.id, latest, "  Permintaan pemilik ");
  expect(() => membership.previewInvite("partner", second.token)).toThrow();
  expect(() => membership.previewInvite("partner", first.token)).toThrow();
  expect(db.prepare("SELECT action,reason FROM workspace_membership_audit").get()).toMatchObject({
    action: "cancel_invite",
    reason: "Permintaan pemilik",
  });
  database.close();
});

it("restricts invitation and revocation to the owner and denies outsiders", () => {
  const database = new PaymentDatabase();
  const workspaces = new WorkspaceService(database.storage());
  const service = new MembershipService(workspaces);
  const w = workspaces.getOrCreateWorkspace("owner");
  const invite = service.invitePartner("owner", w.id);
  service.acceptPartnerInvite("partner", invite.token, { fullName: "Partner", nickname: "Pa" });
  expect(() => service.invitePartner("partner", w.id)).toThrow(/pemilik/i);
  expect(() => service.revokePartner("partner", w.id)).toThrow(/pemilik/i);
  expect(() => service.revokePartner("outsider", w.id)).toThrow(/workspace/i);
  expect(workspaces.requireWorkspace("partner", w.id).role).toBe("partner");
  database.close();
});
