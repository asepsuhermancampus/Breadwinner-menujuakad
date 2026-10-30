import { expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { readDashboardCards, updateDashboardCard } from "./dashboard-cards";
vi.mock("server-only", () => ({}));

it("controls each card independently by audience and keeps an audit trail", () => {
  const db = new PaymentDatabase().storage();
  new WorkspaceService(db);
  expect(readDashboardCards(db, "guest").map((item) => item.visible)).toEqual([
    true,
    true,
    true,
    true,
    true,
    true,
  ]);
  updateDashboardCard(db, "admin", "tasks", "guest", false, "Uji tampilan", 0);
  expect(readDashboardCards(db, "guest").find((item) => item.card === "tasks")).toMatchObject({
    visible: false,
    version: 1,
  });
  expect(readDashboardCards(db, "owner").find((item) => item.card === "tasks")).toMatchObject({
    visible: true,
    version: 0,
  });
  expect(() => updateDashboardCard(db, "admin", "tasks", "guest", true, "Selesai", 0)).toThrow(
    /berubah/i,
  );
  expect(db.prepare("SELECT card,audience,actor,reason FROM dashboard_card_audit").all()).toEqual([
    expect.objectContaining({
      card: "tasks",
      audience: "guest",
      actor: "admin",
      reason: "Uji tampilan",
    }),
  ]);
});

it("supports hiding the dashboard planning links without changing the metric cards", () => {
  const db = new PaymentDatabase().storage();
  new WorkspaceService(db);
  updateDashboardCard(db, "admin", "quick-links", "owner", false, "Uji", 0);
  expect(readDashboardCards(db, "owner").find((item) => item.card === "quick-links")?.visible).toBe(
    false,
  );
  expect(readDashboardCards(db, "owner").find((item) => item.card === "tasks")?.visible).toBe(true);
});
