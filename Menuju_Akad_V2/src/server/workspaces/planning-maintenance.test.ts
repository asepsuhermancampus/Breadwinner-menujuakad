import { expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { ResourceService } from "./resource-service";
import { readPlanningMaintenance, updatePlanningMaintenance } from "./planning-maintenance";
vi.mock("server-only", () => ({}));

it("isolates maintenance per feature, preserves data, blocks writes and records changes", () => {
  const db = new PaymentDatabase().storage();
  const resources = new ResourceService(new WorkspaceService(db));
  const event = {
    id: "one",
    title: "Temui vendor",
    date: "2026-12-01",
    startTime: "09:00",
    endTime: "10:00",
  };
  resources.writeResource("owner", "calendar", 0, [event]);
  expect(readPlanningMaintenance(db, "calendar")).toEqual({ status: "active", version: 0 });
  updatePlanningMaintenance(db, "admin", "calendar", "maintenance", "Perbaikan", 0);
  expect(() => resources.writeResource("owner", "calendar", 1, [])).toThrow(/pemeliharaan/i);
  expect(resources.readResource("owner", "calendar").data).toEqual([event]);
  expect(readPlanningMaintenance(db, "rundown").status).toBe("active");
  expect(resources.writeResource("owner", "emergency", 0, []).revision).toBe(1);
  expect(() => updatePlanningMaintenance(db, "admin", "calendar", "active", "Selesai", 0)).toThrow(
    /berubah/i,
  );
  expect(db.prepare("SELECT feature,actor,reason FROM planning_maintenance_audit").all()).toEqual([
    expect.objectContaining({ feature: "calendar", actor: "admin", reason: "Perbaikan" }),
  ]);
  updatePlanningMaintenance(db, "admin", "calendar", "active", "Selesai", 1);
  expect(resources.writeResource("owner", "calendar", 1, []).revision).toBe(2);
});

it.each([
  "rundown",
  "emergency",
  "documents",
  "moodboard",
  "catering",
  "seserahan",
  "guests",
  "invitations",
  "studio-drafts",
] as const)("blocks %s writes while its own maintenance is active", (kind) => {
  const db = new PaymentDatabase().storage();
  const resources = new ResourceService(new WorkspaceService(db));
  const before = resources.readResource("owner", kind).data;
  updatePlanningMaintenance(db, "admin", kind, "maintenance", "Perbaikan", 0);
  expect(() => resources.writeResource("owner", kind, 0, [])).toThrow(/pemeliharaan/i);
  expect(resources.readResource("owner", kind).data).toEqual(before);
  expect(resources.writeResource("owner", "tasks", 0, []).revision).toBe(1);
});

it("blocks catering settings changes during catering maintenance", () => {
  const db = new PaymentDatabase().storage();
  const resources = new ResourceService(new WorkspaceService(db));
  updatePlanningMaintenance(db, "admin", "catering", "maintenance", "Perbaikan", 0);
  expect(() => resources.writeResource("owner", "catering-settings", 0, [])).toThrow(
    /pemeliharaan/i,
  );
});
