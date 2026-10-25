import { afterEach, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { ResourceService } from "./resource-service";
import { GuestRsvpService } from "./guest-rsvp";
const dbs: PaymentDatabase[] = [];
afterEach(() => dbs.splice(0).forEach((d) => d.close()));
it("real invitation tokens require publication, enforce quota and persist RSVP", () => {
  const db = new PaymentDatabase();
  dbs.push(db);
  const w = new WorkspaceService(db.storage()),
    resources = new ResourceService(w),
    service = new GuestRsvpService(db.storage());
  resources.writeResource("a", "guests", 0, [
    {
      id: "g",
      name: "Guest",
      group: "Teman",
      quota: 2,
      rsvpStatus: "PENDING",
      attendingCount: 0,
      waConsent: false,
      personalToken: "actual-random-personal-token",
    },
  ]);
  expect(service.read("actual-random-personal-token")).toBeNull();
  resources.writeResource("a", "invitations", 0, [
    { id: "i", title: "Wedding", template: "basic", published: true, venue: "Real venue" },
  ]);
  expect(service.read("actual-random-personal-token")?.venue).toBe("Real venue");
  expect(() => service.respond("actual-random-personal-token", "ATTENDING", 3)).toThrow();
  service.respond("actual-random-personal-token", "ATTENDING", 2);
  expect(resources.readResource("a", "guests").data[0]).toMatchObject({
    rsvpStatus: "ATTENDING",
    attendingCount: 2,
  });
  expect(service.read("demo")).toBeNull();
});
it("withdrawn Studio snapshot cannot reveal venue or accept RSVP", () => {
  const db = new PaymentDatabase();
  dbs.push(db);
  const w = new WorkspaceService(db.storage());
  const workspace = w.requireWorkspace("a");
  db.storage()
    .prepare("INSERT INTO workspace_resources(workspace_id,kind,data,revision) VALUES(?,?,?,0)")
    .run(
      workspace.id,
      "guests",
      JSON.stringify([
        {
          id: "g",
          name: "Private",
          quota: 2,
          personalToken: "long-private-token-123456",
          rsvpStatus: "PENDING",
          attendingCount: 0,
        },
      ]),
    );
  db.storage()
    .prepare("INSERT INTO workspace_resources(workspace_id,kind,data,revision) VALUES(?,?,?,0)")
    .run(
      workspace.id,
      "studio-drafts",
      JSON.stringify([
        {
          document: { publication: "unpublished" },
          activeDocument: { publication: "published", content: { venue: "Private venue" } },
        },
      ]),
    );
  const service = new GuestRsvpService(db.storage());
  expect(service.read("long-private-token-123456")).toBeNull();
  expect(() => service.respond("long-private-token-123456", "ATTENDING", 1)).toThrow();
});
