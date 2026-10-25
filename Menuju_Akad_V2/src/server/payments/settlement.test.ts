import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { PaymentDatabase } from "./db";
import { PaymentService } from "./service";
import { mockClient, providerData, PNG } from "./test-fixtures";

vi.mock("server-only", () => ({}));
let db: PaymentDatabase;
beforeEach(() => {
  db = new PaymentDatabase();
});
afterEach(() => db.close());

it("withholds QR codes with a unique surcharge while retaining the provider total for reconciliation", async () => {
  const service = new PaymentService(db, mockClient(), "production", "merchant");
  const invoice = await service.create("owner");
  expect(invoice).toMatchObject({ amount: 5000, totalAmount: 5016, qrImage: null });
  expect(service.current("owner")?.qrImage).toBeNull();
  expect((await service.refresh("owner", invoice.orderId)).qrImage).toBeNull();
  expect(db.getByOrderId(invoice.orderId)?.qr_image).toBe(PNG);
});

it("offers the provider QR when the total exactly equals the requested amount", async () => {
  const client = mockClient({
    createQRIS: vi.fn(async ({ order_id }) => providerData(order_id, { total_amount: 5000 })),
  });
  const service = new PaymentService(db, client, "production", "merchant");
  expect(await service.create("owner")).toMatchObject({
    amount: 5000,
    totalAmount: 5000,
    qrImage: PNG,
  });
});

it("queries the gateway before settling a create response that claims payment", async () => {
  const client = mockClient({
    createQRIS: vi.fn(async ({ order_id }) => providerData(order_id, { status: "paid" })),
  });
  const service = new PaymentService(db, client, "production", "merchant");
  expect((await service.create("owner")).status).toBe("pending");
  expect(client.getStatus).toHaveBeenCalledTimes(1);
});

it("retains signature and total without settling if paid-create verification fails", async () => {
  const client = mockClient({
    createQRIS: vi.fn(async ({ order_id }) => providerData(order_id, { status: "paid" })),
    getStatus: vi.fn().mockRejectedValue(new Error("offline")),
  });
  const service = new PaymentService(db, client, "production", "merchant");
  await expect(service.create("owner")).rejects.toMatchObject({ httpStatus: 502 });
  const invoice = service.current("owner")!;
  expect(invoice.status).toBe("unknown");
  expect(db.getByOrderId(invoice.orderId)).toMatchObject({
    signature: "original-gateway-signature",
    total_amount: 5016,
    paid_at: null,
  });
});

it.each([
  { total_amount: 6000 },
  { signature: "different-signature" },
  { order_id: "different-order" },
])("rejects mismatched settlement verification %j", async (patch) => {
  const client = mockClient({
    createQRIS: vi.fn(async ({ order_id }) => providerData(order_id, { status: "paid" })),
    getStatus: vi.fn(async (id) => providerData(id, { status: "paid", ...patch })),
  });
  const service = new PaymentService(db, client, "production", "merchant");
  await expect(service.create("owner")).rejects.toMatchObject({ httpStatus: 502 });
  expect(service.current("owner")?.status).toBe("unknown");
});

it("settles paid-create only when the independent query matches", async () => {
  const client = mockClient({
    createQRIS: vi.fn(async ({ order_id }) => providerData(order_id, { status: "paid" })),
    getStatus: vi.fn(async (id) =>
      providerData(id, { status: "paid", paid_at: "2026-10-20 17:00:00" }),
    ),
  });
  const service = new PaymentService(db, client, "production", "merchant");
  expect(await service.create("owner")).toMatchObject({
    status: "paid",
    paidAt: "2026-10-20 17:00:00",
  });
  expect(client.getStatus).toHaveBeenCalledTimes(1);
});
