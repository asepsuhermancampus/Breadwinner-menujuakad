import { expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { ResourceService } from "./resource-service";
import { updateFeatureAvailability } from "./feature-availability";
vi.mock("server-only", () => ({}));

it("restricts saved vendors without deleting them", () => {
  const database = new PaymentDatabase();
  try {
    const workspaces = new WorkspaceService(database.storage());
    const workspace = workspaces.getOrCreateWorkspace("owner");
    const resources = new ResourceService(workspaces);
    resources.writeResource("owner", "vendor-favorites", 0, [{ id: "vendor-one" }], workspace.id);
    updateFeatureAvailability(database.storage(), "root", "vendors", "owner", false, "Uji", 0);
    expect(() => resources.readResource("owner", "vendor-favorites", workspace.id)).toThrow(
      /tersedia/i,
    );
    expect(() => resources.writeResource("owner", "vendor-favorites", 1, [], workspace.id)).toThrow(
      /tersedia/i,
    );
    updateFeatureAvailability(database.storage(), "root", "vendors", "owner", true, "Pulihkan", 1);
    expect(resources.readResource("owner", "vendor-favorites", workspace.id).data).toEqual([
      { id: "vendor-one" },
    ]);
  } finally {
    database.close();
  }
});
