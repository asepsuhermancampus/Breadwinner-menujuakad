import { vi } from "vitest";
import type { KlikQRISClient, ProviderPaymentData } from "./client";

export const PNG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a8WQAAAAASUVORK5CYII=";

export function providerData(
  orderId: string,
  patch: Partial<ProviderPaymentData> = {},
): ProviderPaymentData {
  return {
    order_id: orderId,
    amount: 5000,
    total_amount: 5016,
    status: "pending",
    qris_image: PNG,
    expired_at: "2026-10-20 18:00:00",
    paid_at: null,
    signature: "original-gateway-signature",
    ...patch,
  };
}

export function mockClient(overrides: Partial<KlikQRISClient> = {}): KlikQRISClient {
  return {
    createQRIS: vi.fn(async ({ order_id }) => providerData(order_id)),
    getStatus: vi.fn(async (orderId) => providerData(orderId)),
    ...overrides,
  };
}

export function deferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}
