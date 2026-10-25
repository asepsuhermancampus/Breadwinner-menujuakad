import { afterEach, expect, it, vi } from "vitest";
import { PaymentDatabase } from "./db";
import { PlanCheckoutService } from "./plan-checkout-service";
import { mockClient, providerData, deferred } from "./test-fixtures";
vi.mock("server-only", () => ({}));
const databases: PaymentDatabase[] = [];
afterEach(() => databases.splice(0).forEach((db) => db.close()));
function setup(unique = 51) {
  const db = new PaymentDatabase();
  databases.push(db);
  const prices = new Map<string, number>();
  const client = mockClient({
    createQRIS: vi.fn(async (p) => {
      prices.set(p.order_id, p.amount);
      return providerData(p.order_id, { amount: p.amount, total_amount: p.amount + unique });
    }),
    getStatus: vi.fn(async (id) =>
      providerData(id, { amount: prices.get(id)!, total_amount: prices.get(id)! + unique }),
    ),
  });
  return { db, client, service: new PlanCheckoutService(db, client, "production", "merchant") };
}
it("reconciles expired pending reservations before changing tier", async () => {
  const { db, client, service } = setup();
  const principal = { kind: "owner", owner: "expired-owner" } as const;
  const first = await service.reserve(principal, "premium", true);
  const intent = service.intents.get(first.intentId)!;
  db.storage()
    .prepare("UPDATE invoices SET expires_at=? WHERE order_id=?")
    .run(new Date(Date.now() - 1000).toISOString(), intent.orderId);
  vi.mocked(client.getStatus).mockResolvedValueOnce(
    providerData(intent.orderId, {
      amount: first.amount,
      total_amount: first.totalAmount!,
      status: "expired",
    }),
  );
  const next = await service.reserve(principal, "lifetime", true);
  expect(next.planId).toBe("lifetime");
  expect(next.intentId).not.toBe(first.intentId);
});
it("bounds anonymous reservations even when callers reset the guest cookie", () => {
  const { service } = setup();
  for (let n = 0; n < 20; n++)
    service.intents.reserve({ kind: "guest", hash: `reset-${n}` }, "premium", true);
  expect(() =>
    service.intents.reserve({ kind: "guest", hash: "new-cookie" }, "premium", true),
  ).toThrow(/reservasi/);
});
it("quotes official amounts without QR, signature, or owner and reuses invoice", async () => {
  const { service, client } = setup();
  const owner = { kind: "owner", owner: "a" } as const;
  const quote = await service.reserve(owner, "premium", true);
  expect(quote).toMatchObject({
    originalAmount: 149000,
    amount: 141550,
    uniqueAmount: 51,
    totalAmount: 141601,
    eligibility: "verified",
  });
  expect(JSON.stringify(quote)).not.toMatch(/qrImage|signature|owner|data:image/);
  expect((await service.reserve(owner, "premium", true)).intentId).toBe(quote.intentId);
  expect(client.createQRIS).toHaveBeenCalledTimes(1);
  expect(() => service.invoice("b", quote.intentId)).toThrow();
  expect(service.invoice("a", quote.intentId).qrImage).toBeTruthy();
});
it.each(["premium", "lifetime"] as const)(
  "quotes %s for guests without exposing checkout",
  async (plan) => {
    const { service } = setup();
    const q = await service.reserve({ kind: "guest", hash: "g" }, plan, true);
    expect(q.eligibility).toBe("requires-login");
    expect(() => service.invoice("a", q.intentId)).toThrow();
    await expect(service.quote({ kind: "guest", hash: "wrong" }, q.intentId)).rejects.toMatchObject(
      { httpStatus: 404 },
    );
  },
);
it.each([
  { code: 7450, ok: true },
  { code: 7451, ok: false },
])("enforces total ceiling %j", async ({ code, ok }) => {
  const { service } = setup(code);
  const result = service.reserve({ kind: "owner", owner: "a" }, "premium", true);
  if (ok) expect((await result).totalAmount).toBe(149000);
  else await expect(result).rejects.toMatchObject({ httpStatus: 409 });
});
it("recovers unknown create using same order without creating again", async () => {
  const { service, client } = setup();
  vi.mocked(client.createQRIS).mockImplementationOnce(async (p) => {
    vi.mocked(client.getStatus).mockResolvedValue(
      providerData(p.order_id, { amount: p.amount, total_amount: p.amount + 51 }),
    );
    throw new Error("timeout after provider created");
  });
  const principal = { kind: "owner", owner: "a" } as const;
  await expect(service.reserve(principal, "premium", true)).rejects.toThrow();
  const recovered = await service.reserve(principal, "premium", true);
  expect(recovered.totalAmount).toBe(141601);
  expect(client.createQRIS).toHaveBeenCalledTimes(1);
});
it("concurrent claims only create one invoice", async () => {
  const { service, client } = setup();
  const wait = deferred<ReturnType<typeof providerData>>();
  vi.mocked(client.createQRIS).mockImplementationOnce(() => wait.promise);
  const principal = { kind: "owner", owner: "a" } as const;
  const first = service.reserve(principal, "premium", true);
  await expect(service.reserve(principal, "premium", true)).resolves.toMatchObject({
    status: "creating",
  });
  const input = vi.mocked(client.createQRIS).mock.calls[0]![0];
  wait.resolve(
    providerData(input.order_id, { amount: input.amount, total_amount: input.amount + 51 }),
  );
  await first;
  expect(client.createQRIS).toHaveBeenCalledTimes(1);
});
