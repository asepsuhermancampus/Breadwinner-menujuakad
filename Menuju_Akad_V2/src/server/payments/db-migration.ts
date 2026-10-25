import "server-only";
import type { DatabaseSync } from "node:sqlite";
import { SCHEMA } from "./db-schema";
import { initializeProductSchema } from "./product-schema";
import { migrateCreditSchema } from "./upgrade-migration";

export function initializePaymentSchema(db: DatabaseSync): void {
  db.exec(
    "PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; PRAGMA foreign_keys=OFF; BEGIN IMMEDIATE",
  );
  try {
    migrateCreditSchema(db);
    db.exec(SCHEMA);
    initializeProductSchema(db);
    if (db.prepare("PRAGMA foreign_key_check").all().length)
      throw new Error("Payment migration violates foreign keys");
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  } finally {
    db.exec("PRAGMA foreign_keys=ON");
  }
}
