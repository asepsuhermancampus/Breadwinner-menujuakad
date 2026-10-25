import { afterEach, describe, expect, it, vi } from "vitest";
import { PaymentDatabase } from "./db";
import { PaymentService } from "./service";
import { providerData, mockClient, deferred } from "./test-fixtures";

vi.mock("server-only", () => ({}));
const databases: PaymentDatabase[] = [];
function setup(client = mockClient()) {
  const db = new PaymentDatabase();
  databases.push(db);
  return { db, client, service: new PaymentService(db, client, "production", "merchant") };
}
afterEach(() => databases.splice(0).forEach((db) => db.close()));

describe("payment invoice lifecycle", () => {
  it("reserves before awaiting the gateway and shares concurrent creation", async () => {
    const gate = deferred<void>();
    const client = mockClient({
      createQRIS: vi.fn(async ({ order_id }) => {
        await gate.promise;
        return providerData(order_id);
      }),
    });
    const { service } = setup(client);
    const first = service.create("owner");
    const second = await service.create("owner");
    expect(second.status).toBe("creating");
    expect(client.createQRIS).toHaveBeenCalledTimes(1);
    gate.resolve();
    expect((await first).orderId).toBe(second.orderId);
  });

  it("keeps uncertain creation reserved and recovers the same order by status query", async () => {
    const client = mockClient({ createQRIS: vi.fn().mockRejectedValue(new Error("timeout")) });
    const { service } = setup(client);
    await expect(service.create("owner")).rejects.toMatchObject({ httpStatus: 502 });
    const reserved = service.current("owner");
    expect(reserved?.status).toBe("unknown");
    expect((await service.create("owner")).orderId).toBe(reserved?.orderId);
    const restored = await service.refresh("owner", reserved!.orderId);
    expect(restored).toMatchObject({
      orderId: reserved!.orderId,
      status: "pending",
      totalAmount: 5016,
    });
    expect(client.createQRIS).toHaveBeenCalledTimes(1);
    expect(client.getStatus).toHaveBeenCalledWith(reserved!.orderId);
  });

  it.each([
    { order_id: "different-order" },
    { amount: 6000 },
    { total_amount: 4999 },
    { signature: null },
    { signature: "  " },
    { qris_image: "data:image/png;base64,invalid" },
  ])("rejects mismatched or unusable create response %j", async (patch) => {
    const client = mockClient({
      createQRIS: vi.fn(async ({ order_id }) => providerData(order_id, patch)),
    });
    const { service } = setup(client);
    await expect(service.create("owner")).rejects.toMatchObject({ httpStatus: 502 });
    expect(service.current("owner")?.status).toBe("unknown");
  });

  it("isolates invoices by owner and environment without revealing other orders", async () => {
    const { service, db, client } = setup();
    const invoice = await service.create("owner");
    expect(service.current("other")).toBeNull();
    await expect(service.refresh("other", invoice.orderId)).rejects.toMatchObject({
      httpStatus: 404,
    });
    const sandbox = new PaymentService(db, client, "sandbox", "merchant");
    expect(sandbox.current("owner")).toBeNull();
    await expect(sandbox.refresh("owner", invoice.orderId)).rejects.toMatchObject({
      httpStatus: 404,
    });
  });

  it("keeps credentials, owner hash and callback signature out of browser DTOs", async () => {
    const { service } = setup();
    const view = await service.create("private-owner");
    expect(view.amount).toBe(5000);
    for (const key of ["signature", "owner", "apiKey", "merchantId"])
      expect(view).not.toHaveProperty(key);
  });
});
