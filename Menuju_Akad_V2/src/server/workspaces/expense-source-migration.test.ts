import { expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
vi.mock("server-only", () => ({}));

it.each(["seserahan", "catering"])(
  "neutralizes old %s restrictions exactly once with audit",
  (feature) => {
    const database = new PaymentDatabase();
    try {
      const db = database.storage();
      db.exec(
        "CREATE TABLE feature_availability(feature TEXT NOT NULL,audience TEXT NOT NULL,available INTEGER NOT NULL,version INTEGER NOT NULL,PRIMARY KEY(feature,audience))",
      );
      db.prepare("INSERT INTO feature_availability VALUES(?,'owner',0,3)").run(feature);
      new WorkspaceService(db);
      expect(
        db
          .prepare("SELECT available,version FROM feature_availability WHERE feature=?")
          .get(feature),
      ).toEqual(expect.objectContaining({ available: 1, version: 4 }));
      expect(
        db.prepare("SELECT actor FROM feature_availability_audit WHERE feature=?").get(feature),
      ).toEqual(expect.objectContaining({ actor: "system" }));
      new WorkspaceService(db);
      expect(
        db
          .prepare("SELECT COUNT(*) AS count FROM feature_availability_audit WHERE feature=?")
          .get(feature),
      ).toEqual(expect.objectContaining({ count: 1 }));
    } finally {
      database.close();
    }
  },
);
