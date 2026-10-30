import { expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { ResourceService } from "./resource-service";
import { GuestRsvpService } from "./guest-rsvp";
import { updateFeatureAvailability } from "./feature-availability";
vi.mock("server-only", () => ({}));

it("keeps public RSVP available when guest management is restricted", () => {
  const db = new PaymentDatabase();
  try {
    const resources = new ResourceService(new WorkspaceService(db.storage()));
    const token = "guest-management-restriction-token";
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
    updateFeatureAvailability(db.storage(), "admin", "guests", "owner", false, "Uji", 0);
    expect(() => resources.readResource("a", "guests")).toThrow(/tersedia/i);
    expect(() => resources.writeResource("a", "guests", 1, [])).toThrow(/tersedia/i);
    const rsvp = new GuestRsvpService(db.storage());
    expect(rsvp.read(token)).not.toBeNull();
    rsvp.respond(token, "ATTENDING", 1);
    updateFeatureAvailability(db.storage(), "admin", "guests", "owner", true, "Pulihkan", 1);
    expect(resources.readResource("a", "guests").data[0]).toMatchObject({
      rsvpStatus: "ATTENDING",
      attendingCount: 1,
    });
  } finally {
    db.close();
  }
});
