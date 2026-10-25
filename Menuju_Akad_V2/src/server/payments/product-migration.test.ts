import { afterEach, expect, it, vi } from "vitest";
import { DatabaseSync } from "node:sqlite";
import { PaymentDatabase } from "./db";
import { initializePaymentSchema } from "./db-migration";
import { IntentRepository } from "./intent-repository";
vi.mock("server-only", () => ({}));
const databases: PaymentDatabase[] = [];
afterEach(() => databases.splice(0).forEach((db) => db.close()));

it("migrates existing priced invoices into test purpose and preserves signatures", () => {
  const db = new DatabaseSync(":memory:");
  db.exec(`CREATE TABLE invoices (id INTEGER PRIMARY KEY, order_id TEXT UNIQUE, owner TEXT,
    environment TEXT, amount INTEGER, original_amount INTEGER, discount_amount INTEGER,
    total_amount INTEGER, status TEXT, signature TEXT, qr_image TEXT, expires_at TEXT,
    paid_at TEXT,last_checked_at INTEGER,created_at INTEGER,updated_at INTEGER);
    INSERT INTO invoices VALUES(1,'old','owner','production',4750,5000,250,4801,'pending','sig',null,null,null,0,1,1);`);
  initializePaymentSchema(db);
  expect(db.prepare("SELECT purpose,signature,amount FROM invoices").get()).toMatchObject({
    purpose: "integration_test",
    signature: "sig",
    amount: 4750,
  });
  expect(db.prepare("SELECT count(*) AS n FROM subscription_grants").get()?.["n"]).toBe(0);
  initializePaymentSchema(db);
  expect(db.prepare("SELECT count(*) AS n FROM invoices").get()?.["n"]).toBe(1);
  db.close();
});

it("isolates active test and product orders and deduplicates product reservations", () => {
  const db = new PaymentDatabase();
  databases.push(db);
  db.reserveInvoice("owner", "production", "old", 5000);
  const repo = new IntentRepository(db, "production");
  const first = repo.reserve({ kind: "owner", owner: "owner" }, "premium", true);
  expect(first.isNew).toBe(true);
  expect(first.intent.amount).toBe(141550);
  expect(repo.reserve({ kind: "owner", owner: "owner" }, "premium", true).intent.id).toBe(
    first.intent.id,
  );
  expect(() => repo.reserve({ kind: "owner", owner: "owner" }, "lifetime", true)).toThrow();
  expect(db.getActiveInvoice("owner", "production")?.order_id).toBe("old");
});

it("requires guest proof to bind, then permanently binds to one owner", () => {
  const db = new PaymentDatabase();
  databases.push(db);
  const repo = new IntentRepository(db, "production");
  const { intent } = repo.reserve({ kind: "guest", hash: "guest-hash" }, "premium", true);
  expect(() => repo.bind(intent.id, "wrong", "owner")).toThrow();
  expect(repo.bind(intent.id, "guest-hash", "owner").owner).toBe("owner");
  expect(() => repo.bind(intent.id, "guest-hash", "other")).toThrow();
});
