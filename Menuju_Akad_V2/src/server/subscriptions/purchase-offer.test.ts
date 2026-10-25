import { afterEach, expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { grantSettledInvoice } from "./grant-repository";
import { purchaseOffer } from "./purchase-offer";
vi.mock("server-only", () => ({}));
const databases: PaymentDatabase[] = [];
function setup() {
  const db = new PaymentDatabase();
  databases.push(db);
  return db;
}
afterEach(() => databases.splice(0).forEach((db) => db.close()));
function premium(db: PaymentDatabase, id: string, when: string, amount = 141550) {
  const row = db.reserveInvoice("owner", "production", id, amount, 149000).invoice;
  const total = Math.min(149000, amount + 51);
  db.storage()
    .prepare(
      "UPDATE invoices SET purpose='subscription',plan_id='premium',duration_months=6,status='paid',total_amount=? WHERE order_id=?",
    )
    .run(total, id);
  grantSettledInvoice(
    db.storage(),
    {
      ...row,
      purpose: "subscription",
      plan_id: "premium",
      duration_months: 6,
      status: "paid",
      total_amount: total,
    },
    new Date(when),
  );
}
it("credits actual paid package amount excluding unique code and ends after two calendar months", () => {
  const db = setup();
  premium(db, "first", "2026-01-31T10:00:00.000Z");
  expect(purchaseOffer(db.storage(), "owner", new Date("2026-03-31T10:00:00.000Z"))).toMatchObject({
    subscription: { planId: "premium" },
    upgradeCredit: 141550,
    upgradeValidUntil: "2026-03-31T10:00:00.000Z",
    lifetimeAmount: 257450,
    newBuyer: false,
  });
  expect(
    purchaseOffer(db.storage(), "owner", new Date("2026-03-31T10:00:00.001Z")).upgradeCredit,
  ).toBe(0);
});
it("renewal extends expiry but never resets the promotion or stacks credit", () => {
  const db = setup();
  premium(db, "first", "2026-01-01T00:00:00.000Z");
  premium(db, "renewal", "2026-02-01T00:00:00.000Z", 149000);
  const offer = purchaseOffer(db.storage(), "owner", new Date("2026-03-02T00:00:00.000Z"));
  expect(offer).toMatchObject({
    upgradeCredit: 0,
    upgradeValidUntil: "2026-03-01T00:00:00.000Z",
    subscription: { expiresAt: "2027-01-01T00:00:00.000Z" },
  });
});
it("shows reminder within 15 days only and grants neither Free nor expired Premium credit", () => {
  const db = setup();
  expect(purchaseOffer(db.storage(), "owner")).toMatchObject({
    upgradeCredit: 0,
    newBuyer: true,
    reminderDays: null,
  });
  premium(db, "first", "2026-01-01T00:00:00.000Z");
  expect(
    purchaseOffer(db.storage(), "owner", new Date("2026-06-15T23:59:59.999Z")).reminderDays,
  ).toBeNull();
  expect(
    purchaseOffer(db.storage(), "owner", new Date("2026-06-16T00:00:00.000Z")).reminderDays,
  ).toBe(15);
  expect(purchaseOffer(db.storage(), "owner", new Date("2026-07-01T00:00:00.000Z"))).toMatchObject({
    upgradeCredit: 0,
    reminderDays: null,
    newBuyer: false,
  });
});
