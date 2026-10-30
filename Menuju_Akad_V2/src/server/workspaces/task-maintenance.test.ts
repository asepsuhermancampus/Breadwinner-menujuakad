import { expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { ResourceService } from "./resource-service";
import { readTaskMaintenance, updateTaskMaintenance } from "./task-maintenance";
vi.mock("server-only", () => ({}));

it("blocks task writes during maintenance while preserving reads and records each change", () => {
  const db = new PaymentDatabase().storage();
  const service = new WorkspaceService(db);
  const resources = new ResourceService(service);
  const task = {
    id: "one",
    title: "Siapkan dokumen",
    pic: "Bersama",
    priority: "Normal",
    dueDate: "2026-11-01",
    status: "Menunggu",
    event: "wedding",
  };
  resources.writeResource("owner", "tasks", 0, [task]);
  expect(readTaskMaintenance(db)).toEqual({ status: "active", version: 0 });
  updateTaskMaintenance(db, "admin-1", "maintenance", "Pembaruan tugas", 0);
  expect(readTaskMaintenance(db)).toEqual({ status: "maintenance", version: 1 });
  expect(() => resources.writeResource("owner", "tasks", 1, [])).toThrow(/pemeliharaan/i);
  expect(resources.readResource("owner", "tasks").data).toEqual([task]);
  expect(() => updateTaskMaintenance(db, "admin-2", "active", "Selesai", 0)).toThrow(/berubah/i);
  updateTaskMaintenance(db, "admin-1", "active", "Selesai", 1);
  expect(resources.writeResource("owner", "tasks", 1, []).revision).toBe(2);
  expect(
    db
      .prepare(
        "SELECT actor, old_status, new_status, reason FROM task_maintenance_audit ORDER BY version",
      )
      .all(),
  ).toEqual([
    expect.objectContaining({
      actor: "admin-1",
      old_status: "active",
      new_status: "maintenance",
      reason: "Pembaruan tugas",
    }),
    expect.objectContaining({
      actor: "admin-1",
      old_status: "maintenance",
      new_status: "active",
      reason: "Selesai",
    }),
  ]);
});
