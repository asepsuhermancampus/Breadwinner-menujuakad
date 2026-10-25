import "server-only";
import type { DatabaseSync } from "node:sqlite";
import { INVOICE_TABLE } from "./db-schema";
// Called with foreign keys disabled, inside the schema transaction. Child rows keep their IDs.
export function migrateCreditSchema(db: DatabaseSync) {
  const columns = db.prepare("PRAGMA table_info(invoices)").all();
  if (!columns.length || columns.some((c) => c["name"] === "upgrade_credit_amount")) return;
  db.exec(INVOICE_TABLE.replace("invoices (", "invoices_next ("));
  const next = db.prepare("PRAGMA table_info(invoices_next)").all();
  for (const column of columns) {
    if (!next.some((c) => c["name"] === column["name"])) {
      const name = String(column["name"]);
      if (!/^[a-z_]+$/.test(name)) throw new Error("Unexpected invoice column");
      db.exec(`ALTER TABLE invoices_next ADD COLUMN ${name} ${column["type"]}`);
    }
  }
  const names = columns.map((c) => String(c["name"]));
  const destinations = [...names];
  const sources = [...names];
  if (!names.includes("original_amount")) {
    destinations.push("original_amount", "discount_amount");
    sources.push("amount", "0");
  }
  db.exec(`INSERT INTO invoices_next (${destinations.join(",")}) SELECT ${sources.join(",")} FROM invoices;
    DROP TABLE invoices; ALTER TABLE invoices_next RENAME TO invoices;`);
}
