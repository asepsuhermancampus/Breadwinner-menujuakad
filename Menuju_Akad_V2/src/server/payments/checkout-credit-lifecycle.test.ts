import { afterEach, expect, it, vi } from "vitest";
import { PaymentDatabase } from "./db";
import { PlanCheckoutService } from "./plan-checkout-service";
import { mockClient, providerData } from "./test-fixtures";
vi.mock("server-only", () => ({}));
const databases: PaymentDatabase[] = [];
afterEach(() => {
  databases.splice(0).forEach((db) => db.close());
  vi.useRealTimers();
});
const owner = { kind: "owner", owner: "owner" } as const;
function setup() {
  const db = new PaymentDatabase();
  databases.push(db);
  const amounts = new Map<string, number>();
  const client = mockClient({
    createQRIS: vi.fn(async (p) => {
      amounts.set(p.order_id, p.amount);
      return providerData(p.order_id, {
        amount: p.amount,
        total_amount: p.amount + 51,
        expired_at: "2030-01-01T00:00:00Z",
      });
    }),
    getStatus: vi.fn(async (id) =>
      providerData(id, {
        amount: amounts.get(id)!,
        total_amount: amounts.get(id)! + 51,
        expired_at: "2030-01-01T00:00:00Z",
      }),
    ),
  });
  const service = new PlanCheckoutService(db, client, "production", "merchant");
  function pay(id: string) {
    const intent = service.intents.get(id)!,
      row = db.getByOrderId(intent.orderId)!;
    db.updateFromStatusCheck(row.order_id, {
      status: "paid",
      totalAmount: row.total_amount!,
      signature: row.signature,
      qrImage: row.qr_image,
      expiresAt: row.expires_at,
      paidAt: new Date().toISOString(),
    });
  }
  return { db, client, service, pay };
}
it("hides an already-revealed replacement after old canceled payment arrives and queues double payments", async () => {
  const { db, service, pay } = setup();
  const first = await service.reserve(owner, "premium", true);
  const second = await service.reserve(owner, "lifetime", true, {
    replaceIntentId: first.intentId,
  });
  await service.quote(owner, second.intentId);
  expect(service.intents.get(second.intentId)!.revealedAt).toBeNull();
  expect(service.invoice(owner.owner, second.intentId).qrImage).toBeTruthy();
  pay(first.intentId);
  expect((await service.quote(owner, second.intentId)).cancelledAt).toBeTruthy();
  expect(service.invoice(owner.owner, second.intentId)).toMatchObject({
    cancelledAt: expect.any(String),
    qrImage: null,
  });
  pay(second.intentId);
  pay(second.intentId);
  const invoice = service.invoice(owner.owner, second.intentId);
  expect(invoice).toMatchObject({
    status: "paid",
    accessReady: false,
    settlementIssue: expect.stringContaining("peninjauan"),
  });
  expect(db.storage().prepare("SELECT * FROM payment_settlement_issues").all()).toHaveLength(1);
  expect(
    db.storage().prepare("SELECT * FROM customer_support WHERE owner='owner'").all(),
  ).toHaveLength(1);
});
it("credits actual paid premium and keeps a real revealed QR snapshot past the calendar deadline", async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-01-31T00:00:00Z"));
  const { service, pay } = setup();
  const premium = await service.reserve(owner, "premium", true);
  pay(premium.intentId);
  const upgrade = await service.reserve(owner, "lifetime", false);
  expect(upgrade).toMatchObject({
    amount: 257450,
    upgradeCredit: 141550,
    discountAmount: 0,
    totalAmount: 257501,
  });
  expect(service.invoice(owner.owner, upgrade.intentId).qrImage).toBeTruthy();
  vi.setSystemTime(new Date("2026-03-31T00:00:00.001Z"));
  expect(service.invoice(owner.owner, upgrade.intentId).amount).toBe(257450);
  pay(upgrade.intentId);
  expect(service.invoice(owner.owner, upgrade.intentId).accessReady).toBe(true);
});
it("never marks an unknown QR as revealed and rechecks credit when recovery crosses deadline", async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-01-31T00:00:00Z"));
  const { service, pay, client, db } = setup();
  const premium = await service.reserve(owner, "premium", true);
  pay(premium.intentId);
  vi.mocked(client.createQRIS).mockImplementationOnce(async (p) =>
    providerData(p.order_id, { amount: p.amount, total_amount: p.amount + 51, qris_image: null }),
  );
  const upgrade = await service.reserve(owner, "lifetime", false);
  expect(service.invoice(owner.owner, upgrade.intentId).qrImage).toBeNull();
  expect(service.intents.get(upgrade.intentId)!.revealedAt).toBeNull();
  vi.setSystemTime(new Date("2026-03-31T00:00:00.001Z"));
  db.storage()
    .prepare(
      "UPDATE invoices SET status='pending',qr_image='data:image/png;base64,AAAA' WHERE intent_id=?",
    )
    .run(upgrade.intentId);
  expect(() => service.invoice(owner.owner, upgrade.intentId)).toThrow(/Harga atau kelayakan/);
});
it("renewal is explicit, extends from expiry, and new buyer discount stays unavailable", async () => {
  const { service, client, pay } = setup();
  const first = await service.reserve(owner, "premium", true);
  pay(first.intentId);
  const expiry = service.offer(owner)!.subscription.expiresAt!;
  await expect(service.reserve(owner, "premium", false)).rejects.toMatchObject({ httpStatus: 409 });
  await expect(service.reserve(owner, "lifetime", true)).rejects.toMatchObject({ httpStatus: 409 });
  vi.mocked(client.createQRIS).mockImplementationOnce(async (p) =>
    providerData(p.order_id, { amount: p.amount, total_amount: p.amount }),
  );
  const renewal = await service.reserve(owner, "premium", false, { renewal: true });
  pay(renewal.intentId);
  expect(service.offer(owner)!.subscription.expiresAt! > expiry).toBe(true);
  expect(service.offer(owner)!.upgradeCredit).toBe(141550);
});
it("attributes both paid guest claims and queues the second rather than rejecting ownership", async () => {
  const { service, pay, db } = setup();
  const guest = { kind: "guest", hash: "guest-proof" } as const;
  const first = await service.reserve(guest, "premium", true);
  const second = await service.reserve(guest, "lifetime", true, {
    replaceIntentId: first.intentId,
  });
  pay(first.intentId);
  pay(second.intentId);
  service.adopt(first.intentId, guest.hash, owner.owner);
  service.adopt(second.intentId, guest.hash, owner.owner);
  expect(service.intents.get(second.intentId)!.owner).toBe(owner.owner);
  expect(service.invoice(owner.owner, second.intentId)).toMatchObject({
    status: "paid",
    settlementIssue: expect.any(String),
  });
  expect(
    db.storage().prepare("SELECT * FROM subscription_grants WHERE owner='owner'").all(),
  ).toHaveLength(1);
});
