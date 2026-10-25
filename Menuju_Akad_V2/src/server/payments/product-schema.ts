import "server-only";
import type { DatabaseSync } from "node:sqlite";

export function initializeProductSchema(db: DatabaseSync) {
  const columns = db.prepare("PRAGMA table_info(invoices)").all();
  const additions = {
    purpose:
      "TEXT NOT NULL DEFAULT 'integration_test' CHECK(purpose IN ('integration_test','subscription'))",
    plan_id: "TEXT CHECK(plan_id IS NULL OR plan_id IN ('premium','lifetime'))",
    catalog_revision: "TEXT",
    duration_months: "INTEGER",
    intent_id: "TEXT",
  };
  for (const [name, sql] of Object.entries(additions)) {
    if (!columns.some((column) => column["name"] === name))
      db.exec(`ALTER TABLE invoices ADD COLUMN ${name} ${sql}`);
  }
  db.exec(`DROP INDEX IF EXISTS idx_invoices_active_owner;
    CREATE UNIQUE INDEX idx_invoices_active_owner ON invoices(owner,environment,purpose)
      WHERE status IN ('creating','pending','unknown') AND cancelled_at IS NULL;
    CREATE TABLE IF NOT EXISTS checkout_intents (
      id TEXT PRIMARY KEY, guest_hash TEXT, owner TEXT, environment TEXT NOT NULL,
      plan_id TEXT NOT NULL CHECK(plan_id IN ('premium','lifetime')),
      order_id TEXT NOT NULL UNIQUE REFERENCES invoices(order_id), created_at INTEGER NOT NULL,
      CHECK(guest_hash IS NOT NULL OR owner IS NOT NULL));
    CREATE INDEX IF NOT EXISTS idx_intent_guest ON checkout_intents(guest_hash,environment);
    CREATE TABLE IF NOT EXISTS subscription_grants (
      id TEXT PRIMARY KEY, order_id TEXT NOT NULL UNIQUE REFERENCES invoices(order_id),
      owner TEXT NOT NULL, plan_id TEXT NOT NULL, granted_at TEXT NOT NULL, expires_at TEXT,
      capabilities TEXT NOT NULL);
    CREATE INDEX IF NOT EXISTS idx_grants_owner ON subscription_grants(owner);
    CREATE TABLE IF NOT EXISTS subscription_notices (
      grant_id TEXT PRIMARY KEY REFERENCES subscription_grants(id), owner TEXT NOT NULL,
      capabilities TEXT NOT NULL, state TEXT NOT NULL DEFAULT 'new', step INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS payment_settlement_issues (
      order_id TEXT PRIMARY KEY REFERENCES invoices(order_id), owner TEXT NOT NULL, reason TEXT NOT NULL, created_at TEXT NOT NULL);
  `);
  const intentColumns = db.prepare("PRAGMA table_info(checkout_intents)").all();
  for (const [name, type] of Object.entries({
    credit_source_id: "TEXT",
    credit_valid_until: "TEXT",
    revealed_at: "TEXT",
    renewal: "INTEGER NOT NULL DEFAULT 0",
  }))
    if (!intentColumns.some((c) => c["name"] === name))
      db.exec(`ALTER TABLE checkout_intents ADD COLUMN ${name} ${type}`);
}
