import { DatabaseSync } from "node:sqlite";
import { expect, it, vi } from "vitest";
import { initializePaymentSchema } from "./db-migration";
vi.mock("server-only", () => ({}));

it("migrates the old fixed-price table without altering signatures, totals, paid history or active reservations", () => {
  const db = new DatabaseSync(":memory:");
  try {
    db.exec(`CREATE TABLE invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,order_id TEXT UNIQUE,owner TEXT,environment TEXT,
      amount INTEGER CHECK(amount=5000),total_amount INTEGER,status TEXT,signature TEXT,
      qr_image TEXT,expires_at TEXT,paid_at TEXT,last_checked_at INTEGER,created_at INTEGER,updated_at INTEGER);
      CREATE UNIQUE INDEX idx_invoices_active_owner ON invoices(owner,environment) WHERE status IN ('creating','pending','unknown');
      INSERT INTO invoices VALUES(1,'OLD-PAID','buyer','production',5000,5093,'paid','saved-signature',NULL,NULL,'paid-time',0,1,2);
      INSERT INTO invoices VALUES(2,'OLD-PENDING','new-buyer','production',5000,5094,'pending','pending-signature','saved-QR',NULL,NULL,0,3,4);`);
    initializePaymentSchema(db);
    initializePaymentSchema(db);
    expect(db.prepare("SELECT * FROM invoices WHERE id=1").get()).toMatchObject({
      original_amount: 5000,
      discount_amount: 0,
      amount: 5000,
      total_amount: 5093,
      status: "paid",
      signature: "saved-signature",
      paid_at: "paid-time",
    });
    expect(db.prepare("SELECT * FROM invoices WHERE id=2").get()).toMatchObject({
      status: "pending",
      qr_image: "saved-QR",
      signature: "pending-signature",
    });
    expect(() =>
      db.exec(`INSERT INTO invoices(order_id,owner,environment,original_amount,amount,status,last_checked_at,created_at,updated_at)
      VALUES('DUPLICATE','new-buyer','production',5000,5000,'creating',0,0,0)`),
    ).toThrow();
    db.exec(`INSERT INTO invoices(order_id,owner,environment,original_amount,discount_amount,amount,status,last_checked_at,created_at,updated_at)
      VALUES('DISCOUNTED','other-buyer','production',5000,250,4750,'pending',0,0,0)`);
    expect(
      db.prepare("SELECT amount FROM invoices WHERE order_id='DISCOUNTED'").get()?.["amount"],
    ).toBe(4750);
  } finally {
    db.close();
  }
});
