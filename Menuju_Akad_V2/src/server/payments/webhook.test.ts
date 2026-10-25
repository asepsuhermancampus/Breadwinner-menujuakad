import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PaymentDatabase } from "./db";
import { PaymentService } from "./service";
import { deferred, mockClient, providerData } from "./test-fixtures";

vi.mock("server-only", () => ({}));
let db: PaymentDatabase;
beforeEach(() => {
  db = new PaymentDatabase();
});
afterEach(() => db.close());
async function setup() {
  const client = mockClient();
  const service = new PaymentService(db, client, "production", "merchant");
  const invoice = await service.create("owner");
  const payload = {
    order_id: invoice.orderId,
    status: "PAID",
    amount: 5000,
    total_amount: 5016,
    signature: "original-gateway-signature",
  };
  return { client, service, invoice, payload };
}

describe("verified, idempotent payment callbacks", () => {
  it.each([
    { signature: "forged-signature" },
    { amount: 9000 },
    { total_amount: 5017 },
    { status: "PENDING" },
    { status: "UNKNOWN" },
  ])("rejects invalid callback %j before querying provider", async (patch) => {
    const { service, client, payload } = await setup();
    await expect(service.webhook({ ...payload, ...patch })).rejects.toBeDefined();
    expect(client.getStatus).not.toHaveBeenCalled();
    expect(service.current("owner")?.status).toBe("pending");
  });

  it("does not accept a paid claim while the gateway still reports pending", async () => {
    const { service, payload } = await setup();
    await expect(service.webhook(payload)).rejects.toMatchObject({ httpStatus: 503 });
    expect(service.current("owner")).toMatchObject({ status: "pending", paidAt: null });
  });

  it("verifies once, accepts valid replays and rejects forged paid replays", async () => {
    const { client, service, payload } = await setup();
    vi.mocked(client.getStatus).mockResolvedValue(
      providerData(payload.order_id, { status: "paid" }),
    );
    await service.webhook(payload);
    await service.webhook(payload);
    expect(service.current("owner")).toMatchObject({ status: "paid", paidAt: null });
    expect(client.getStatus).toHaveBeenCalledTimes(1);
    for (const patch of [{ signature: "forged" }, { amount: 1 }, { total_amount: 1 }]) {
      await expect(service.webhook({ ...payload, ...patch })).rejects.toBeDefined();
    }
  });

  it("keeps paid when a stale pending refresh arrives after the verified callback", async () => {
    const { service, client, payload } = await setup();
    const stale = deferred<ReturnType<typeof providerData>>();
    vi.mocked(client.getStatus)
      .mockImplementationOnce(() => stale.promise)
      .mockResolvedValueOnce(providerData(payload.order_id, { status: "paid" }));
    const refresh = service.refresh("owner", payload.order_id);
    await service.webhook(payload);
    stale.resolve(providerData(payload.order_id));
    expect((await refresh).status).toBe("paid");
    expect(service.current("owner")?.status).toBe("paid");
  });

  it("rejects mismatched provider orders and totals even with an authentic callback", async () => {
    const { service, client, payload } = await setup();
    vi.mocked(client.getStatus).mockResolvedValue(
      providerData("different-order", { status: "paid" }),
    );
    await expect(service.webhook(payload)).rejects.toMatchObject({ httpStatus: 502 });
    vi.mocked(client.getStatus).mockResolvedValue(
      providerData(payload.order_id, { status: "paid", total_amount: 6000 }),
    );
    await expect(service.webhook(payload)).rejects.toMatchObject({ httpStatus: 502 });
    expect(service.current("owner")?.status).toBe("pending");
  });

  it("allows verified settlement after expiry without inventing a payment timestamp", async () => {
    const { service, client, payload } = await setup();
    vi.mocked(client.getStatus).mockResolvedValue(
      providerData(payload.order_id, { status: "expired" }),
    );
    await service.webhook({ ...payload, status: "EXPIRED" });
    expect(service.current("owner")?.status).toBe("expired");
    vi.mocked(client.getStatus).mockResolvedValue(
      providerData(payload.order_id, { status: "paid" }),
    );
    await service.webhook(payload);
    expect(service.current("owner")).toMatchObject({ status: "paid", paidAt: null });
  });
});
