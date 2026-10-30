import { expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { createSupportRequest } from "./support-service";
import { updateFeatureAvailability } from "./feature-availability";
vi.mock("server-only", () => ({}));

it("restricts new support requests per workspace role while retaining existing requests", () => {
  const database = new PaymentDatabase();
  try {
    const workspaces = new WorkspaceService(database.storage());
    const workspace = workspaces.getOrCreateWorkspace("owner");
    createSupportRequest(workspaces, "owner", "Pesan bantuan yang tersimpan", workspace.id);
    updateFeatureAvailability(database.storage(), "admin", "support", "owner", false, "Uji", 0);
    expect(() => createSupportRequest(workspaces, "owner", "Pesan kedua", workspace.id)).toThrow(
      /tersedia/i,
    );
    expect(
      database.storage().prepare("SELECT COUNT(*) AS count FROM customer_support").get(),
    ).toEqual(expect.objectContaining({ count: 1 }));
    updateFeatureAvailability(database.storage(), "admin", "support", "owner", true, "Pulihkan", 1);
    expect(
      createSupportRequest(workspaces, "owner", "Pesan kembali", workspace.id).id,
    ).toBeTruthy();
  } finally {
    database.close();
  }
});
