import { afterEach, expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { ResourceService } from "./resource-service";
vi.mock("server-only", () => ({}));
const dbs: PaymentDatabase[] = [];
afterEach(() => dbs.splice(0).forEach((db) => db.close()));
function setup() {
  const db = new PaymentDatabase();
  dbs.push(db);
  return { db, resources: new ResourceService(new WorkspaceService(db.storage())) };
}
it("enforces quotas, ownership and revision on the server", () => {
  const { resources } = setup();
  const guests = Array.from({ length: 100 }, (_, n) => ({
    id: `${n}`,
    name: `Guest ${n}`,
    group: "Teman",
    quota: 1,
    rsvpStatus: "PENDING",
    attendingCount: 0,
    waConsent: false,
    personalToken: `token-${n}`,
  }));
  expect(resources.writeResource("a", "guests", 0, guests).revision).toBe(1);
  expect(() =>
    resources.writeResource("a", "guests", 1, [...guests, { ...guests[0], id: "101" }]),
  ).toThrow();
  expect(resources.readResource("b", "guests").data).toEqual([]);
  expect(() => resources.writeResource("a", "guests", 0, [])).toThrow();
  expect(() => resources.writeResource("a", "moodboard", 0, [])).toThrow();
  expect(() =>
    resources.writeResource("a", "invitations", 0, [
      { id: "1", title: "test", template: "premium" },
    ]),
  ).toThrow();
});
