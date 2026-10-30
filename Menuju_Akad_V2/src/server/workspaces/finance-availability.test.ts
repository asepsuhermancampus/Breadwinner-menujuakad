import { expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { FinanceService } from "./finance-service";
import { ResourceService } from "./resource-service";
import { updateFeatureAvailability } from "./feature-availability";
vi.mock("server-only", () => ({}));

it("neutralizes legacy finance restrictions once and preserves an audit record", () => {
  const database = new PaymentDatabase();
  try {
    const db = database.storage();
    db.exec(
      "CREATE TABLE feature_availability(feature TEXT NOT NULL, audience TEXT NOT NULL, available INTEGER NOT NULL, version INTEGER NOT NULL, PRIMARY KEY(feature,audience))",
    );
    db.prepare("INSERT INTO feature_availability VALUES('finance','owner',0,4)").run();
    new WorkspaceService(db);
    expect(
      db
        .prepare("SELECT available,version FROM feature_availability WHERE feature='finance'")
        .get(),
    ).toEqual(expect.objectContaining({ available: 1, version: 5 }));
    expect(
      db
        .prepare("SELECT actor,reason FROM feature_availability_audit WHERE feature='finance'")
        .get(),
    ).toEqual(expect.objectContaining({ actor: "system" }));
    new WorkspaceService(db);
    expect(
      db
        .prepare("SELECT COUNT(*) AS count FROM feature_availability_audit WHERE feature='finance'")
        .get(),
    ).toEqual(expect.objectContaining({ count: 1 }));
  } finally {
    database.close();
  }
});

it("restricts finance for the selected member without deleting the ledger", () => {
  const database = new PaymentDatabase();
  try {
    const workspaces = new WorkspaceService(database.storage());
    const workspace = workspaces.getOrCreateWorkspace("owner");
    const service = new FinanceService(workspaces);
    const resources = new ResourceService(workspaces);
    resources.writeResource(
      "owner",
      "finance",
      0,
      [{ id: "b", title: "Gedung", amount: 100 }],
      workspace.id,
    );
    const before = service.read("owner", workspace.id);
    updateFeatureAvailability(database.storage(), "root", "finance", "owner", false, "Uji", 0);
    expect(() => service.read("owner", workspace.id)).toThrow(/tersedia/i);
    expect(() =>
      service.execute(
        { id: "owner", name: "Owner" },
        {
          revision: before.revision,
          requestId: "claim",
          command: { type: "claim", side: "groom" },
        },
        workspace.id,
      ),
    ).toThrow(/tersedia/i);
    expect(() => resources.readResource("owner", "finance", workspace.id)).toThrow(/tersedia/i);
    expect(() => resources.writeResource("owner", "seserahan", 0, [], workspace.id)).toThrow(
      /tersedia/i,
    );
    expect(() => resources.writeResource("owner", "catering", 0, [], workspace.id)).toThrow(
      /tersedia/i,
    );
    updateFeatureAvailability(database.storage(), "root", "finance", "owner", true, "Pulihkan", 1);
    expect(service.read("owner", workspace.id)).toEqual(before);
  } finally {
    database.close();
  }
});
