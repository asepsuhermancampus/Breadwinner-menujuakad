import { expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { ResourceService } from "./resource-service";
import { readPublishedInvitation } from "./public-invitation";
vi.mock("server-only", () => ({}));
it("cannot replace another workspace's published invitation by copying its ID", () => {
  const database = new PaymentDatabase(),
    db = database.storage();
  try {
    const service = new WorkspaceService(db),
      resources = new ResourceService(service);
    const victim = service.getOrCreateWorkspace("victim"),
      attacker = service.getOrCreateWorkspace("attacker");
    const invitation = { id: "same-id", title: "Attacker", template: "basic", published: true };
    resources.writeResource("attacker", "invitations", 0, [invitation]);
    resources.writeResource("victim", "invitations", 0, [{ ...invitation, title: "Victim" }]);
    expect(readPublishedInvitation(db, victim.id, invitation.id)?.title).toBe("Victim");
    expect(readPublishedInvitation(db, attacker.id, invitation.id)?.title).toBe("Attacker");
    expect(readPublishedInvitation(db, "missing-workspace", invitation.id)).toBeNull();
  } finally {
    database.close();
  }
});
