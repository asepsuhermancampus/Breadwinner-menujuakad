import { afterEach, expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { ResourceService } from "./resource-service";
vi.mock("server-only", () => ({}));
const db = new PaymentDatabase();
afterEach(() =>
  db
    .storage()
    .exec(
      "DELETE FROM workspace_resources; DELETE FROM workspace_members; DELETE FROM customer_workspaces",
    ),
);
it("persists calculation inputs per workspace, rejects invalid values and stale saves", () => {
  const service = new WorkspaceService(db.storage());
  const resources = new ResourceService(service);
  const settings = {
    id: "catering-settings",
    invitations: 40,
    multiplier: 2,
    bufferPercent: 10,
    buffetPercent: 60,
    stallDishesCount: 4,
    useGuests: false,
  };
  resources.writeResource("owner", "catering-settings", 0, [settings]);
  expect(
    new ResourceService(new WorkspaceService(db.storage())).readResource(
      "owner",
      "catering-settings",
    ).data,
  ).toEqual([settings]);
  expect(resources.readResource("other", "catering-settings").data).toEqual([]);
  expect(() =>
    resources.writeResource("owner", "catering-settings", 0, [{ ...settings, invitations: 80 }]),
  ).toThrow();
  expect(() =>
    resources.writeResource("owner", "catering-settings", 1, [{ ...settings, bufferPercent: 101 }]),
  ).toThrow();
  expect(resources.readResource("owner", "catering-settings").data).toEqual([settings]);
});
