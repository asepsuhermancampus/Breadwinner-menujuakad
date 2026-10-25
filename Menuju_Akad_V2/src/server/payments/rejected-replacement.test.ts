import { expect, it, vi } from "vitest";
import { PaymentDatabase } from "./db";
import { createKlikQRISClient } from "./client";
import { PlanCheckoutService } from "./plan-checkout-service";
import { mockClient, providerData } from "./test-fixtures";
vi.mock("server-only", () => ({}));
it("keeps the previous discount claim usable when replacement creation is definitively rejected", async () => {
  const db = new PaymentDatabase();
  try {
    const amounts = new Map<string, number>();
    const rejected = createKlikQRISClient(
      "https://klikqris.com/api",
      "key",
      "merchant",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            status: false,
            errors: { amount: ["Nominal transaksi maksimal adalah Rp 300.000."] },
          }),
          { status: 422 },
        ),
      ),
    );
    const client = mockClient({
      createQRIS: vi.fn(async (p) => {
        if (p.amount > 300000) return rejected.createQRIS(p);
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
    const service = new PlanCheckoutService(db, client, "production", "merchant"),
      owner = { kind: "owner", owner: "owner" } as const;
    const premium = await service.reserve(owner, "premium", true);
    await expect(
      service.reserve(owner, "lifetime", true, { replaceIntentId: premium.intentId }),
    ).rejects.toMatchObject({ httpStatus: 422 });
    expect(service.intents.active(owner)?.id).toBe(premium.intentId);
    expect((await service.quote(owner, premium.intentId)).cancelledAt).toBeNull();
    expect(service.invoice("owner", premium.intentId).qrImage).toBeTruthy();
    expect(
      db
        .storage()
        .prepare(
          "SELECT count(*) n FROM invoices WHERE plan_id='lifetime' AND cancelled_at IS NULL",
        )
        .get()?.["n"],
    ).toBe(0);
  } finally {
    db.close();
  }
});
