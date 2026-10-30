import { expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { updateFeatureAvailability } from "./feature-availability";
import { rolloutDependencyWarnings } from "./feature-rollout-dependencies";
vi.mock("server-only", () => ({}));
it("warns when a targeted catering release can be reached while finance is restricted", () => {
  const database = new PaymentDatabase();
  const db = database.storage();
  new WorkspaceService(db);
  updateFeatureAvailability(db, "root", "finance", "owner", false, "Uji", 0);
  const policy = { audiences: ["owner"], plans: ["free"], workspaces: [] } as const;
  expect(rolloutDependencyWarnings(db, "catering", policy)).toContainEqual(
    expect.stringMatching(/keuangan/i),
  );
  expect(rolloutDependencyWarnings(db, "tasks", policy)).toEqual([]);
  database.close();
});
it("warns when guest targeting removes catering guest references", () => {
  const database = new PaymentDatabase();
  const db = database.storage();
  new WorkspaceService(db);
  const policy = { audiences: ["partner"], plans: ["free"], workspaces: [] } as const;
  expect(rolloutDependencyWarnings(db, "guests", policy)).toContainEqual(
    expect.stringMatching(/tamu.*katering/i),
  );
  database.close();
});
