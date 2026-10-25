import { afterEach, expect, it, vi } from "vitest";
import { PaymentDatabase } from "./db";
import { PlanCheckoutService } from "./plan-checkout-service";
import { mockClient, providerData } from "./test-fixtures";
vi.mock("server-only", () => ({}));
const databases: PaymentDatabase[] = [];
afterEach(() => databases.splice(0).forEach((db) => db.close()));
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
        expired_at: new Date(Date.now() + 3600000).toISOString(),
      });
    }),
    getStatus: vi.fn(async (id) =>
      providerData(id, { amount: amounts.get(id)!, total_amount: amounts.get(id)! + 51 }),
    ),
  });
  return { db, client, service: new PlanCheckoutService(db, client, "production", "merchant") };
}
const principal = { kind: "owner", owner: "owner" } as const;
it("cancels only owned unpaid invoices, hides QR, frees reservation and still accepts late settlement", async () => {
  const { db, service } = setup();
  const first = await service.reserve(principal, "premium", true);
  await expect(
    service.cancel({ kind: "owner", owner: "other" }, first.intentId),
  ).rejects.toMatchObject({ httpStatus: 404 });
  await service.cancel(principal, first.intentId);
  expect(service.invoice("owner", first.intentId)).toMatchObject({
    cancelledAt: expect.any(String),
    qrImage: null,
  });
  expect(service.intents.active(principal)).toBeNull();
  const row = db.getByOrderId(service.intents.get(first.intentId)!.orderId)!;
  db.updateFromStatusCheck(row.order_id, {
    status: "paid",
    totalAmount: row.total_amount!,
    signature: row.signature,
    qrImage: row.qr_image,
    expiresAt: row.expires_at,
    paidAt: new Date().toISOString(),
  });
  expect(service.invoice("owner", first.intentId).accessReady).toBe(true);
});
it("switches both directions only with current intent confirmation and rejects stale confirmation", async () => {
  const { service } = setup();
  const first = await service.reserve(principal, "premium", true);
  await expect(service.reserve(principal, "lifetime", true)).rejects.toMatchObject({
    httpStatus: 409,
  });
  const next = await service.reserve(principal, "lifetime", true, {
    replaceIntentId: first.intentId,
  });
  expect(next.planId).toBe("lifetime");
  await expect(
    service.reserve(principal, "premium", true, { replaceIntentId: first.intentId }),
  ).rejects.toMatchObject({ httpStatus: 409 });
  const back = await service.reserve(principal, "premium", true, {
    replaceIntentId: next.intentId,
  });
  expect(back.planId).toBe("premium");
});
it("refuses cancellation or replacement when gateway confirms payment", async () => {
  const { service, client } = setup();
  const first = await service.reserve(principal, "premium", true);
  vi.mocked(client.getStatus).mockResolvedValue(
    providerData(service.intents.get(first.intentId)!.orderId, {
      amount: first.amount,
      total_amount: first.totalAmount!,
      status: "paid",
    }),
  );
  await expect(service.cancel(principal, first.intentId)).rejects.toMatchObject({
    httpStatus: 409,
  });
  expect(service.invoice("owner", first.intentId).accessReady).toBe(true);
});
it("can cancel a blocked quote whose unique code exceeds the catalog ceiling", async () => {
  const { service } = setup();
  await expect(service.reserve(principal, "premium", false)).rejects.toMatchObject({
    httpStatus: 409,
  });
  const intent = service.intents.active(principal)!;
  await expect(service.cancel(principal, intent.id)).resolves.toMatchObject({
    cancelledAt: expect.any(String),
  });
});
