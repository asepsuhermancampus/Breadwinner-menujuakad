import { afterEach, expect, it, vi } from "vitest";
import { PaymentDatabase } from "./db";
import { PaymentService } from "./service";
import { PlanCheckoutService } from "./plan-checkout-service";
import { mockClient, providerData } from "./test-fixtures";
import { readEntitlement } from "@/server/subscriptions/entitlement-query";
vi.mock("server-only", () => ({}));
const databases: PaymentDatabase[] = [];
afterEach(() => {
  databases.splice(0).forEach((db) => db.close());
  vi.useRealTimers();
});
function setup(environment: "production" | "sandbox" = "production") {
  const db = new PaymentDatabase();
  databases.push(db);
  const rows = new Map<string, ReturnType<typeof providerData>>();
  const client = mockClient({
    createQRIS: vi.fn(async (p) => {
      const row = providerData(p.order_id, { amount: p.amount, total_amount: p.amount + 51 });
      rows.set(p.order_id, row);
      return row;
    }),
    getStatus: vi.fn(async (id) => rows.get(id)!),
  });
  return {
    db,
    rows,
    plans: new PlanCheckoutService(db, client, environment, "merchant"),
    payments: new PaymentService(db, client, environment, "merchant"),
  };
}
it("settles polling and repeated callbacks once and grants six months", async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-08-31T12:00:00Z"));
  const { db, rows, plans, payments } = setup();
  const q = await plans.reserve({ kind: "owner", owner: "a" }, "premium", true);
  const invoice = plans.invoice("a", q.intentId),
    row = rows.get(invoice.orderId)!;
  rows.set(invoice.orderId, { ...row, status: "paid" });
  await payments.refresh("a", invoice.orderId);
  await payments.webhook({
    order_id: invoice.orderId,
    status: "PAID",
    amount: row.amount,
    total_amount: row.total_amount,
    signature: row.signature,
  });
  const snapshot = readEntitlement(db.storage(), "a", new Date());
  expect(snapshot).toMatchObject({ planId: "premium", expiresAt: "2027-02-28T12:00:00.000Z" });
  expect(snapshot.capabilities).toContain("pdf");
  expect(db.storage().prepare("SELECT count(*) AS n FROM subscription_grants").get()?.["n"]).toBe(
    1,
  );
  expect(db.storage().prepare("SELECT count(*) AS n FROM subscription_notices").get()?.["n"]).toBe(
    1,
  );
});
it("sandbox never grants production access", async () => {
  const { db, rows, plans, payments } = setup("sandbox");
  const q = await plans.reserve({ kind: "owner", owner: "a" }, "premium", true);
  const i = plans.invoice("a", q.intentId);
  rows.set(i.orderId, { ...rows.get(i.orderId)!, status: "paid" });
  await payments.refresh("a", i.orderId);
  expect(readEntitlement(db.storage(), "a", new Date()).planId).toBe("free");
});
it("guest paid invoice only grants after secure adoption", async () => {
  const { db, rows, plans, payments } = setup();
  const q = await plans.reserve({ kind: "guest", hash: "g" }, "lifetime", true);
  const intent = plans.intents.get(q.intentId)!,
    row = rows.get(intent.orderId)!;
  rows.set(intent.orderId, { ...row, status: "paid" });
  await payments.webhook({
    order_id: intent.orderId,
    status: "PAID",
    amount: row.amount,
    total_amount: row.total_amount,
    signature: row.signature,
  });
  expect(readEntitlement(db.storage(), "a", new Date()).planId).toBe("free");
  plans.adopt(q.intentId, "g", "a");
  expect(readEntitlement(db.storage(), "a", new Date()).planId).toBe("lifetime");
});
