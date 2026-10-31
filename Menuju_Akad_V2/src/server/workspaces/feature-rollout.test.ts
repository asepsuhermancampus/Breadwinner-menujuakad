import { expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import {
  saveRolloutDraft,
  publishRollout,
  rolloutAllowed,
  rollbackRollout,
  readRollout,
} from "./feature-rollout";
vi.mock("server-only", () => ({}));

it("publishes a draft for selected workspace, package and role without changing other features", () => {
  const database = new PaymentDatabase();
  const db = database.storage();
  new WorkspaceService(db);
  const policy = { audiences: ["owner"], plans: ["premium"], workspaces: ["w1"] } as const;
  saveRolloutDraft(db, "root", "tasks", policy, "Percobaan", 0);
  expect(rolloutAllowed(db, "tasks", { audience: "owner", plan: "free", workspaceId: "w2" })).toBe(
    true,
  );
  publishRollout(db, "root", "tasks", 1, null);
  expect(
    rolloutAllowed(db, "tasks", { audience: "owner", plan: "premium", workspaceId: "w1" }),
  ).toBe(true);
  expect(
    rolloutAllowed(db, "tasks", { audience: "partner", plan: "premium", workspaceId: "w1" }),
  ).toBe(false);
  expect(rolloutAllowed(db, "tasks", { audience: "owner", plan: "free", workspaceId: "w1" })).toBe(
    false,
  );
  expect(
    rolloutAllowed(db, "tasks", { audience: "owner", plan: "premium", workspaceId: "w2" }),
  ).toBe(false);
  expect(
    rolloutAllowed(db, "calendar", { audience: "guest", plan: "free", workspaceId: null }),
  ).toBe(true);
  database.close();
});

it("schedules, rejects stale updates, and rolls back without leaving a future publication behind", () => {
  const database = new PaymentDatabase();
  const db = database.storage();
  new WorkspaceService(db);
  const policy = { audiences: ["owner"], plans: ["free"], workspaces: [] } as const;
  saveRolloutDraft(db, "root", "tasks", policy, "Percobaan", 0);
  publishRollout(db, "root", "tasks", 1, null);
  expect(() => saveRolloutDraft(db, "root", "tasks", policy, "Terlambat", 0)).toThrow(/berubah/i);
  saveRolloutDraft(db, "root", "tasks", { ...policy, audiences: ["partner"] }, "Jadwal", 2);
  publishRollout(db, "root", "tasks", 3, "2099-01-01T00:00:00.000Z");
  expect(rolloutAllowed(db, "tasks", { audience: "owner", plan: "free", workspaceId: "x" })).toBe(
    true,
  );
  expect(
    rolloutAllowed(
      db,
      "tasks",
      { audience: "partner", plan: "free", workspaceId: "x" },
      new Date("2100-01-01"),
    ),
  ).toBe(true);
  expect(
    rolloutAllowed(
      db,
      "tasks",
      { audience: "owner", plan: "free", workspaceId: "x" },
      new Date("2100-01-01"),
    ),
  ).toBe(false);
  rollbackRollout(db, "root", "tasks", 2, "Kembalikan", 4);
  expect(readRollout(db, "tasks").revision).toBe(5);
  expect(
    rolloutAllowed(
      db,
      "tasks",
      { audience: "owner", plan: "free", workspaceId: "x" },
      new Date("2100-01-01"),
    ),
  ).toBe(true);
  database.close();
});

it("enforces the published target on resource reads and writes for the actual workspace", async () => {
  const database = new PaymentDatabase();
  const db = database.storage();
  const workspaces = new WorkspaceService(db);
  const workspace = workspaces.getOrCreateWorkspace("owner");
  db.prepare("INSERT INTO workspace_members(workspace_id,account,role) VALUES(?,?,'partner')").run(
    workspace.id,
    "partner",
  );
  const { ResourceService } = await import("./resource-service");
  const resources = new ResourceService(workspaces);
  resources.writeResource("owner", "tasks", 0, [], workspace.id);
  saveRolloutDraft(
    db,
    "root",
    "tasks",
    { audiences: ["owner"], plans: ["free"], workspaces: [workspace.id] },
    "Uji",
    0,
  );
  publishRollout(db, "root", "tasks", 1, null);
  expect(resources.readResource("owner", "tasks", workspace.id).data).toEqual([]);
  expect(() => resources.readResource("partner", "tasks", workspace.id)).toThrow(/tersedia/i);
  expect(() => resources.writeResource("partner", "tasks", 1, [], workspace.id)).toThrow(
    /tersedia/i,
  );
  database.close();
});

it("can roll back to the original unrestricted targeting and cancels a scheduled release", () => {
  const database = new PaymentDatabase();
  const db = database.storage();
  new WorkspaceService(db);
  saveRolloutDraft(
    db,
    "root",
    "tasks",
    { audiences: ["owner"], plans: ["free"], workspaces: [] },
    "Awal",
    0,
  );
  publishRollout(db, "root", "tasks", 1, "2099-01-01T00:00:00.000Z");
  rollbackRollout(db, "root", "tasks", 0, "Pulihkan awal", 2);
  expect(
    rolloutAllowed(
      db,
      "tasks",
      { audience: "partner", plan: "premium", workspaceId: "x" },
      new Date("2100-01-01"),
    ),
  ).toBe(true);
  database.close();
});
