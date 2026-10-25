import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, expect, it, vi } from "vitest";
import { PaymentDatabase } from "./db";
import { PaymentService } from "./service";
import { deferred, mockClient, providerData } from "./test-fixtures";

vi.mock("server-only", () => ({}));
const directories: string[] = [];
const databases: PaymentDatabase[] = [];
function open(file: string) {
  const db = new PaymentDatabase(file);
  databases.push(db);
  return db;
}
function databasePath() {
  const directory = mkdtempSync(path.join(tmpdir(), "menuju-akad-payments-"));
  directories.push(directory);
  return path.join(directory, "payments.sqlite");
}
afterEach(() => {
  databases.splice(0).forEach((db) => db.close());
  directories.splice(0).forEach((directory) => rmSync(directory, { recursive: true }));
});

it("persists invoice and original signature across close and reopen", async () => {
  const file = databasePath();
  const firstDb = new PaymentDatabase(file);
  const first = new PaymentService(firstDb, mockClient(), "production", "merchant");
  const invoice = await first.create("owner");
  firstDb.close();
  const secondDb = open(file);
  const second = new PaymentService(secondDb, mockClient(), "production", "merchant");
  expect(second.current("owner")).toEqual(invoice);
  expect(secondDb.getByOrderId(invoice.orderId)?.signature).toBe("original-gateway-signature");
});

it("reserves one active invoice across independent database connections", async () => {
  const file = databasePath();
  const gate = deferred<void>();
  const client = mockClient({
    createQRIS: vi.fn(async ({ order_id }) => {
      await gate.promise;
      return providerData(order_id);
    }),
  });
  const first = new PaymentService(open(file), client, "production", "merchant");
  const second = new PaymentService(open(file), client, "production", "merchant");
  const creating = first.create("owner");
  const existing = await second.create("owner");
  gate.resolve();
  expect((await creating).orderId).toBe(existing.orderId);
  expect(client.createQRIS).toHaveBeenCalledTimes(1);
});
