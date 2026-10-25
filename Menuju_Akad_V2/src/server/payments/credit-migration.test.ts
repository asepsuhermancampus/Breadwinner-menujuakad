import { afterEach, expect, it, vi } from "vitest";
import { DatabaseSync } from "node:sqlite";
import { initializePaymentSchema } from "./db-migration";
import { INVOICE_TABLE } from "./db-schema";
vi.mock("server-only", () => ({}));
const databases: DatabaseSync[] = [];
afterEach(() => databases.splice(0).forEach((db) => db.close()));
it("preserves old invoice children and enforces credit arithmetic after migration and reopen", () => {
  const db = new DatabaseSync(":memory:");
  databases.push(db);
  const old = INVOICE_TABLE.replace(/    upgrade_credit_amount[^\n]+\n/, "")
    .replace("    cancelled_at TEXT,\n", "")
    .replace(" - upgrade_credit_amount", "");
  db.exec(old);
  db.exec(`INSERT INTO invoices(order_id,owner,environment,original_amount,discount_amount,amount,status,last_checked_at,created_at,updated_at) VALUES('old','owner','production',149000,7450,141550,'paid',0,1,1);
 CREATE TABLE child(order_id TEXT REFERENCES invoices(order_id)); INSERT INTO child VALUES('old'); PRAGMA foreign_keys=ON;`);
  initializePaymentSchema(db);
  initializePaymentSchema(db);
  expect(
    db
      .prepare(
        "SELECT amount,upgrade_credit_amount,cancelled_at FROM invoices WHERE order_id='old'",
      )
      .get(),
  ).toMatchObject({ amount: 141550, upgrade_credit_amount: 0, cancelled_at: null });
  expect(db.prepare("SELECT * FROM child").all()).toHaveLength(1);
  expect(db.prepare("PRAGMA foreign_key_check").all()).toEqual([]);
  expect(() => db.exec("UPDATE invoices SET amount=1 WHERE order_id='old'")).toThrow();
  db.exec(
    "UPDATE invoices SET original_amount=399000,discount_amount=0,upgrade_credit_amount=141550,amount=257450 WHERE order_id='old'",
  );
  expect(db.prepare("SELECT amount FROM invoices").get()?.["amount"]).toBe(257450);
  expect(db.prepare("PRAGMA foreign_keys").get()?.["foreign_keys"]).toBe(1);
});
