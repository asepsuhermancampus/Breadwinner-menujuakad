import { expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { ResourceService } from "./resource-service";
it("prevents cross-workspace token collisions and impossible attendance", () => {
  const db = new PaymentDatabase();
  try {
    const s = new ResourceService(new WorkspaceService(db.storage()));
    const guest = {
      id: "g",
      name: "Guest",
      group: "Teman",
      quota: 1,
      rsvpStatus: "PENDING",
      attendingCount: 0,
      waConsent: false,
      personalToken: "actual-unique-token-1234567890",
    };
    s.writeResource("a", "guests", 0, [guest]);
    expect(() => s.writeResource("b", "guests", 0, [guest])).toThrow();
    expect(() => s.writeResource("a", "guests", 1, [{ ...guest, checkedInCount: 2 }])).toThrow();
  } finally {
    db.close();
  }
});
