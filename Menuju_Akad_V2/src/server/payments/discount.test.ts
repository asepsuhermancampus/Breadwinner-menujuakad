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
function setup(unique = 93) {
  let amount = 0;
  const client = mockClient({
    createQRIS: vi.fn(async (params) => {
      amount = params.amount;
      return providerData(params.order_id, { amount, total_amount: amount + unique });
    }),
    getStatus: vi.fn(async (id) => providerData(id, { amount, total_amount: amount + unique })),
  });
  return { client, service: new PaymentService(db, client, "production", "merchant") };
}

it("claims 5% before creation and offers the official QR when the final total stays below the original price", async () => {
  const { client, service } = setup();
  const invoice = await service.create("new-owner", true);
  expect(client.createQRIS).toHaveBeenCalledWith(expect.objectContaining({ amount: 4750 }));
  expect(invoice).toMatchObject({
    originalAmount: 5000,
    discountAmount: 250,
    amount: 4750,
    totalAmount: 4843,
    qrImage: PNG,
  });
  expect(service.current("new-owner")).toEqual(invoice);
  expect((await service.refresh("new-owner", invoice.orderId)).qrImage).toBe(PNG);
});

it("returns the existing discounted reservation on repeated claims without stacking", async () => {
  const { client, service } = setup();
  const first = await service.create("owner", true);
  expect(await service.create("owner", true)).toEqual(first);
  expect(client.createQRIS).toHaveBeenCalledTimes(1);
});

it.each([
  { unique: 250, offered: true },
  { unique: 251, offered: false },
])("enforces the original price ceiling including boundary %j", async ({ unique, offered }) => {
  const { service } = setup(unique);
  const invoice = await service.create("owner", true);
  expect(Boolean(invoice.qrImage)).toBe(offered);
  expect(invoice.totalAmount).toBe(4750 + unique);
});

it("refuses a new-user discount after a verified successful payment", async () => {
  const { client, service } = setup();
  const first = await service.create("owner");
  vi.mocked(client.getStatus).mockResolvedValue(
    providerData(first.orderId, { total_amount: 5093, status: "paid" }),
  );
  await service.refresh("owner", first.orderId);
  await expect(service.create("owner", true)).rejects.toMatchObject({ httpStatus: 409 });
  expect(client.createQRIS).toHaveBeenCalledTimes(1);
});

it("never rewrites the price of an existing invoice when a discount is requested later", async () => {
  const { client, service } = setup();
  const original = await service.create("owner");
  await expect(service.create("owner", true)).rejects.toMatchObject({ httpStatus: 409 });
  expect(service.current("owner")).toEqual(original);
  expect(client.createQRIS).toHaveBeenCalledTimes(1);
});
