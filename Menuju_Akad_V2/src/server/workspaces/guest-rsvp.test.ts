import { afterEach, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { ResourceService } from "./resource-service";
import { GuestRsvpService } from "./guest-rsvp";
import { updatePlanningMaintenance } from "./planning-maintenance";
import { updateFeatureAvailability } from "./feature-availability";
import { readPublishedInvitation } from "./public-invitation";
const dbs: PaymentDatabase[] = [];
afterEach(() => dbs.splice(0).forEach((d) => d.close()));
it("keeps public RSVP available while blocking workspace guest edits during maintenance", () => {
  const db = new PaymentDatabase();
  dbs.push(db);
  const resources = new ResourceService(new WorkspaceService(db.storage()));
  const guest = {
    id: "g",
    name: "Guest",
    group: "Teman",
    quota: 2,
    rsvpStatus: "PENDING",
    attendingCount: 0,
    waConsent: false,
    personalToken: "actual-random-personal-token",
  };
  resources.writeResource("a", "guests", 0, [guest]);
  resources.writeResource("a", "invitations", 0, [
    { id: "i", title: "Wedding", template: "basic", published: true },
  ]);
  updatePlanningMaintenance(db.storage(), "admin", "guests", "maintenance", "Perbaikan", 0);
  expect(() => resources.writeResource("a", "guests", 1, [])).toThrow(/pemeliharaan/i);
  new GuestRsvpService(db.storage()).respond(guest.personalToken, "ATTENDING", 1);
  expect(resources.readResource("a", "guests").data[0]).toMatchObject({
    rsvpStatus: "ATTENDING",
    attendingCount: 1,
  });
});
it("keeps published invitations and RSVP available during invitation editor maintenance", () => {
  const db = new PaymentDatabase();
  dbs.push(db);
  const resources = new ResourceService(new WorkspaceService(db.storage()));
  const token = "public-invitation-token-123";
  resources.writeResource("a", "guests", 0, [
    {
      id: "g",
      name: "Guest",
      group: "Teman",
      quota: 2,
      rsvpStatus: "PENDING",
      attendingCount: 0,
      waConsent: false,
      personalToken: token,
    },
  ]);
  resources.writeResource("a", "invitations", 0, [
    { id: "i", title: "Wedding", template: "basic", published: true },
  ]);
  updatePlanningMaintenance(db.storage(), "admin", "invitations", "maintenance", "Perbaikan", 0);
  expect(() => resources.writeResource("a", "invitations", 1, [])).toThrow(/pemeliharaan/i);
  expect(new GuestRsvpService(db.storage()).read(token)).not.toBeNull();
  new GuestRsvpService(db.storage()).respond(token, "ATTENDING", 1);
  expect(resources.readResource("a", "guests").data[0]).toMatchObject({ rsvpStatus: "ATTENDING" });
});
it("keeps published invitations and RSVP available when the editor is unavailable to an owner", () => {
  const db = new PaymentDatabase();
  dbs.push(db);
  const resources = new ResourceService(new WorkspaceService(db.storage()));
  const token = "public-invitation-role-token-123";
  resources.writeResource("a", "guests", 0, [
    {
      id: "g",
      name: "Guest",
      group: "Teman",
      quota: 2,
      rsvpStatus: "PENDING",
      attendingCount: 0,
      waConsent: false,
      personalToken: token,
    },
  ]);
  resources.writeResource("a", "invitations", 0, [
    { id: "i", title: "Wedding", template: "basic", published: true },
  ]);
  updateFeatureAvailability(db.storage(), "admin", "invitations", "owner", false, "Uji", 0);
  expect(() => resources.readResource("a", "invitations")).toThrow(/tersedia/i);
  expect(() => resources.writeResource("a", "invitations", 1, [])).toThrow(/tersedia/i);
  const workspace = new WorkspaceService(db.storage()).getOrCreateWorkspace("a");
  expect(readPublishedInvitation(db.storage(), workspace.id, "i")?.title).toBe("Wedding");
  expect(new GuestRsvpService(db.storage()).read(token)).not.toBeNull();
  new GuestRsvpService(db.storage()).respond(token, "ATTENDING", 1);
  expect(resources.readResource("a", "guests").data[0]).toMatchObject({ rsvpStatus: "ATTENDING" });
});
it("keeps published Studio RSVP available when Studio editing is restricted", () => {
  const db = new PaymentDatabase();
  dbs.push(db);
  const workspaces = new WorkspaceService(db.storage());
  const workspace = workspaces.getOrCreateWorkspace("a");
  const resources = new ResourceService(workspaces);
  const token = "studio-public-role-token-123";
  resources.writeResource("a", "guests", 0, [
    {
      id: "g",
      name: "Guest",
      group: "Teman",
      quota: 2,
      rsvpStatus: "PENDING",
      attendingCount: 0,
      waConsent: false,
      personalToken: token,
    },
  ]);
  db.storage()
    .prepare("INSERT INTO workspace_resources(workspace_id,kind,data,revision) VALUES(?,?,?,0)")
    .run(
      workspace.id,
      "studio-drafts",
      JSON.stringify([
        {
          id: "p",
          document: { publication: "published" },
          activeDocument: { publication: "published", content: { venue: "Lokasi publik" } },
        },
      ]),
    );
  updateFeatureAvailability(db.storage(), "admin", "studio-drafts", "owner", false, "Uji", 0);
  expect(() => resources.readResource("a", "studio-drafts")).toThrow(/tersedia/i);
  expect(new GuestRsvpService(db.storage()).read(token)?.venue).toBe("Lokasi publik");
  new GuestRsvpService(db.storage()).respond(token, "ATTENDING", 1);
  expect(resources.readResource("a", "guests").data[0]).toMatchObject({ rsvpStatus: "ATTENDING" });
});
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
