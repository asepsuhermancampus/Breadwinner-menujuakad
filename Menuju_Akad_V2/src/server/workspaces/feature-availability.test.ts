import { expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { ResourceService } from "./resource-service";
import { readFeatureAvailability, updateFeatureAvailability } from "./feature-availability";
vi.mock("server-only", () => ({}));

it("defaults to available and changes only the selected audience with an audit trail", () => {
  const db = new PaymentDatabase().storage();
  new WorkspaceService(db);
  expect(readFeatureAvailability(db, "tasks", "guest")).toEqual({ available: true, version: 0 });
  updateFeatureAvailability(db, "root", "tasks", "guest", false, "Rilis terbatas", 0);
  expect(readFeatureAvailability(db, "tasks", "guest")).toEqual({ available: false, version: 1 });
  expect(readFeatureAvailability(db, "tasks", "owner")).toEqual({ available: true, version: 0 });
  expect(
    db.prepare("SELECT actor,feature,audience,reason FROM feature_availability_audit").all(),
  ).toEqual([
    expect.objectContaining({
      actor: "root",
      feature: "tasks",
      audience: "guest",
      reason: "Rilis terbatas",
    }),
  ]);
  expect(() =>
    updateFeatureAvailability(db, "root", "tasks", "guest", true, "Kembalikan", 0),
  ).toThrow(/berubah/i);
  updateFeatureAvailability(db, "root", "tasks", "guest", true, "Kembalikan", 1);
  expect(readFeatureAvailability(db, "tasks", "guest")).toEqual({ available: true, version: 2 });
});

it("rejects unknown features, audiences, and empty reasons", () => {
  const db = new PaymentDatabase().storage();
  new WorkspaceService(db);
  expect(() =>
    updateFeatureAvailability(db, "root", "unknown" as never, "guest", false, "Alasan", 0),
  ).toThrow();
  expect(() =>
    updateFeatureAvailability(db, "root", "tasks", "unknown" as never, false, "Alasan", 0),
  ).toThrow();
  expect(() => updateFeatureAvailability(db, "root", "tasks", "guest", false, "  ", 0)).toThrow();
});

it("enforces task access for the actual workspace member and preserves the data", () => {
  const db = new PaymentDatabase().storage();
  const workspaces = new WorkspaceService(db);
  const workspace = workspaces.getOrCreateWorkspace("owner");
  db.prepare("INSERT INTO workspace_members(workspace_id,account,role) VALUES(?,?,'partner')").run(
    workspace.id,
    "partner",
  );
  const resources = new ResourceService(workspaces);
  resources.writeResource("owner", "tasks", 0, [], workspace.id);
  updateFeatureAvailability(db, "root", "tasks", "partner", false, "Uji peran", 0);
  expect(() => resources.readResource("partner", "tasks", workspace.id)).toThrow(/tersedia/i);
  expect(() => resources.writeResource("partner", "tasks", 1, [], workspace.id)).toThrow(
    /tersedia/i,
  );
  expect(resources.readResource("owner", "tasks", workspace.id).revision).toBe(1);
  updateFeatureAvailability(db, "root", "tasks", "partner", true, "Pulihkan", 1);
  expect(resources.readResource("partner", "tasks", workspace.id)).toEqual({
    revision: 1,
    data: [],
  });
});

it("enforces emergency planning independently of tasks", () => {
  const db = new PaymentDatabase().storage();
  const workspaces = new WorkspaceService(db);
  const resources = new ResourceService(workspaces);
  const workspace = workspaces.getOrCreateWorkspace("owner");
  resources.writeResource("owner", "emergency", 0, [], workspace.id);
  updateFeatureAvailability(db, "root", "emergency", "owner", false, "Uji", 0);
  expect(() => resources.readResource("owner", "emergency", workspace.id)).toThrow(/tersedia/i);
  expect(() => resources.writeResource("owner", "emergency", 1, [], workspace.id)).toThrow(
    /tersedia/i,
  );
  expect(resources.readResource("owner", "tasks", workspace.id).data).toEqual([]);
  updateFeatureAvailability(db, "root", "emergency", "owner", true, "Pulihkan", 1);
  expect(resources.readResource("owner", "emergency", workspace.id).revision).toBe(1);
});

it("enforces calendar access independently of tasks", () => {
  const db = new PaymentDatabase().storage();
  const workspaces = new WorkspaceService(db);
  const resources = new ResourceService(workspaces);
  const workspace = workspaces.getOrCreateWorkspace("owner");
  resources.writeResource("owner", "calendar", 0, [], workspace.id);
  updateFeatureAvailability(db, "root", "calendar", "owner", false, "Uji kalender", 0);
  expect(() => resources.readResource("owner", "calendar", workspace.id)).toThrow(/tersedia/i);
  expect(() => resources.writeResource("owner", "calendar", 1, [], workspace.id)).toThrow(
    /tersedia/i,
  );
  expect(resources.readResource("owner", "tasks", workspace.id).data).toEqual([]);
  updateFeatureAvailability(db, "root", "calendar", "owner", true, "Pulihkan", 1);
  expect(resources.readResource("owner", "calendar", workspace.id).revision).toBe(1);
});

it("enforces moodboard access without affecting other resources", () => {
  const db = new PaymentDatabase().storage();
  const workspaces = new WorkspaceService(db);
  const resources = new ResourceService(workspaces);
  const workspace = workspaces.getOrCreateWorkspace("owner");
  updateFeatureAvailability(db, "root", "moodboard", "owner", false, "Uji", 0);
  expect(() => resources.readResource("owner", "moodboard", workspace.id)).toThrow(/tersedia/i);
  expect(() => resources.writeResource("owner", "moodboard", 0, [], workspace.id)).toThrow(
    /tersedia/i,
  );
  expect(resources.readResource("owner", "tasks", workspace.id).data).toEqual([]);
});

it("enforces document access without deleting the saved checklist", () => {
  const db = new PaymentDatabase().storage();
  const workspaces = new WorkspaceService(db);
  const resources = new ResourceService(workspaces);
  const workspace = workspaces.getOrCreateWorkspace("owner");
  const before = resources.readResource("owner", "documents", workspace.id);
  updateFeatureAvailability(db, "root", "documents", "owner", false, "Uji", 0);
  expect(() => resources.readResource("owner", "documents", workspace.id)).toThrow(/tersedia/i);
  expect(() =>
    resources.writeResource("owner", "documents", before.revision, [], workspace.id),
  ).toThrow(/tersedia/i);
  updateFeatureAvailability(db, "root", "documents", "owner", true, "Pulihkan", 1);
  expect(resources.readResource("owner", "documents", workspace.id)).toEqual(before);
});

it("enforces rundown access independently of calendar and emergency", () => {
  const db = new PaymentDatabase().storage();
  const workspaces = new WorkspaceService(db);
  const resources = new ResourceService(workspaces);
  const workspace = workspaces.getOrCreateWorkspace("owner");
  resources.writeResource("owner", "rundown", 0, [], workspace.id);
  updateFeatureAvailability(db, "root", "rundown", "owner", false, "Uji", 0);
  expect(() => resources.readResource("owner", "rundown", workspace.id)).toThrow(/tersedia/i);
  expect(() => resources.writeResource("owner", "rundown", 1, [], workspace.id)).toThrow(
    /tersedia/i,
  );
  expect(resources.readResource("owner", "calendar", workspace.id).data).toEqual([]);
  expect(resources.readResource("owner", "emergency", workspace.id).data).toEqual([]);
  updateFeatureAvailability(db, "root", "rundown", "owner", true, "Pulihkan", 1);
  expect(resources.readResource("owner", "rundown", workspace.id).revision).toBe(1);
});
it("supports restricted and restored seserahan", () => {
  const db = new PaymentDatabase().storage();
  new WorkspaceService(db);
  updateFeatureAvailability(db, "root", "seserahan", "owner", false, "Uji", 0);
  expect(readFeatureAvailability(db, "seserahan", "owner").available).toBe(false);
  updateFeatureAvailability(db, "root", "seserahan", "owner", true, "Pulihkan", 1);
  expect(readFeatureAvailability(db, "seserahan", "owner").available).toBe(true);
});
it("does not activate unaudited old guest restrictions when guest management becomes controllable", () => {
  const db = new PaymentDatabase().storage();
  db.exec(
    "CREATE TABLE feature_availability(feature TEXT NOT NULL, audience TEXT NOT NULL, available INTEGER NOT NULL, version INTEGER NOT NULL, PRIMARY KEY(feature,audience))",
  );
  db.prepare(
    "INSERT INTO feature_availability(feature,audience,available,version) VALUES('guests','owner',0,3)",
  ).run();
  new WorkspaceService(db);
  expect(readFeatureAvailability(db, "guests", "owner")).toEqual({ available: true, version: 4 });
  updateFeatureAvailability(db, "root", "guests", "owner", false, "Rilis", 4);
  expect(readFeatureAvailability(db, "guests", "owner")).toEqual({ available: false, version: 5 });
  new WorkspaceService(db);
  expect(readFeatureAvailability(db, "guests", "owner").available).toBe(false);
});

it("restricts guest management only for the selected workspace role", () => {
  const db = new PaymentDatabase().storage();
  const workspaces = new WorkspaceService(db);
  const workspace = workspaces.getOrCreateWorkspace("owner");
  db.prepare("INSERT INTO workspace_members(workspace_id,account,role) VALUES(?,?,'partner')").run(
    workspace.id,
    "partner",
  );
  const resources = new ResourceService(workspaces);
  resources.writeResource("owner", "guests", 0, [], workspace.id);
  updateFeatureAvailability(db, "root", "guests", "partner", false, "Uji pasangan", 0);
  expect(() => resources.readResource("partner", "guests", workspace.id)).toThrow(/tersedia/i);
  expect(() => resources.writeResource("partner", "guests", 1, [], workspace.id)).toThrow(
    /tersedia/i,
  );
  expect(resources.readResource("owner", "guests", workspace.id).revision).toBe(1);
  updateFeatureAvailability(db, "root", "guests", "partner", true, "Pulihkan", 1);
  expect(resources.readResource("partner", "guests", workspace.id).revision).toBe(1);
});
