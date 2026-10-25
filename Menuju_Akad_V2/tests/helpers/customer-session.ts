import nextEnv from "@next/env";
import { encode } from "next-auth/jwt";
import { createHash, randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import type { BrowserContext } from "@playwright/test";
import { capabilitiesFor } from "../../src/features/plans/domain/capabilities";
nextEnv.loadEnvConfig(process.cwd());
export async function customerSession(context: BrowserContext, baseURL: string, label: string) {
  if (!process.env.E2E_CUSTOMER_DB?.includes("menuju-akad-customer-e2e-"))
    throw new Error("Isolated customer E2E database required before creating a test session");
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("Test Auth.js secret required");
  const email = `${label}@menuju-akad.invalid`;
  const token = await encode({
    token: { sub: label, email, emailVerified: true },
    secret,
    salt: "authjs.session-token",
    maxAge: 600,
  });
  await context.addCookies([
    { name: "authjs.session-token", value: token, url: baseURL, httpOnly: true },
  ]);
  const response = await context.request.get(`${baseURL}/api/workspace`);
  if (!response.ok()) throw new Error(`Test workspace failed: ${response.status()}`);
  return createHash("sha256").update(email).digest("hex");
}
export function customerDatabase() {
  const database = process.env.E2E_CUSTOMER_DB;
  if (!database || !database.includes("menuju-akad-customer-e2e-"))
    throw new Error("Isolated customer E2E database required");
  const db = new DatabaseSync(database);
  db.exec("PRAGMA busy_timeout=5000;PRAGMA foreign_keys=ON");
  return db;
}
export function seedCustomerPayment(owner: string, plan: "premium" | "lifetime", paid = false) {
  const db = customerDatabase(),
    id = randomUUID(),
    orderId = `E2E-${randomUUID()}`,
    now = Date.now();
  const original = plan === "premium" ? 149000 : 399000,
    amount = original * 0.95;
  const qr =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a8WQAAAAASUVORK5CYII=";
  db.prepare(
    `INSERT INTO invoices(order_id,owner,environment,original_amount,discount_amount,amount,total_amount,status,
    signature,qr_image,expires_at,paid_at,last_checked_at,created_at,updated_at,purpose,plan_id,catalog_revision,duration_months,intent_id)
    VALUES(?,?,'production',?,?,?,?,?,'e2e-signature',?,?,?,0,?,?,'subscription',?,'2026-10-21',?,?)`,
  ).run(
    orderId,
    owner,
    original,
    original - amount,
    amount,
    amount + 51,
    paid ? "paid" : "pending",
    qr,
    new Date(now + 3600000).toISOString(),
    paid ? new Date(now).toISOString() : null,
    now,
    now,
    plan,
    plan === "premium" ? 6 : null,
    id,
  );
  db.prepare(
    "INSERT INTO checkout_intents(id,owner,environment,plan_id,order_id,created_at) VALUES(?,?,'production',?,?,?)",
  ).run(id, owner, plan, orderId, now);
  db.close();
  if (paid) markCustomerPaid(orderId);
  return { id, orderId, amount, original, total: amount + 51 };
}
export function markCustomerPaid(orderId: string) {
  const db = customerDatabase(),
    row = db.prepare("SELECT owner,plan_id FROM invoices WHERE order_id=?").get(orderId)!;
  const plan = row["plan_id"] as "premium" | "lifetime",
    owner = String(row["owner"]),
    grantId = randomUUID(),
    now = new Date();
  const capabilities = capabilitiesFor(plan),
    added = capabilities.filter((c) => !capabilitiesFor("free").includes(c));
  db.exec("BEGIN IMMEDIATE");
  try {
    db.prepare("UPDATE invoices SET status='paid',paid_at=? WHERE order_id=?").run(
      now.toISOString(),
      orderId,
    );
    if (!db.prepare("SELECT 1 FROM subscription_grants WHERE order_id=?").get(orderId)) {
      db.prepare("INSERT INTO subscription_grants VALUES(?,?,?,?,?,?,?)").run(
        grantId,
        orderId,
        owner,
        plan,
        now.toISOString(),
        plan === "lifetime" ? null : new Date(now.getTime() + 183 * 86400000).toISOString(),
        JSON.stringify(capabilities),
      );
      db.prepare("INSERT INTO subscription_notices(grant_id,owner,capabilities) VALUES(?,?,?)").run(
        grantId,
        owner,
        JSON.stringify(added),
      );
    }
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  } finally {
    db.close();
  }
}
