import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/server/auth", () => ({ auth: vi.fn() }));

const mockService = {
  webhook: vi.fn(),
};
const mockIsPaymentReady = vi.fn(() => true);

vi.mock("@/server/payments/runtime", () => ({
  getPaymentService: () => mockService,
  isPaymentReady: () => mockIsPaymentReady(),
}));

import { POST } from "@/app/api/payments/klikqris/webhook/route";
import { PaymentError } from "./errors";

describe("POST /api/payments/klikqris/webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsPaymentReady.mockReturnValue(true);
  });

  it("processes valid webhook without requiring authentication and returns 200", async () => {
    mockService.webhook.mockResolvedValue(undefined);
    const payload = { order_id: "ORD-123", status: "PAID" };
    const req = new Request("http://localhost:3201/api/payments/klikqris/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("private, no-store");
    const json = await res.json();
    expect(json).toEqual({ received: true });
    expect(mockService.webhook).toHaveBeenCalledWith(payload);
  });

  it("rejects malformed JSON payload with 400", async () => {
    const req = new Request("http://localhost:3201/api/payments/klikqris/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{ not-valid-json ",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(mockService.webhook).not.toHaveBeenCalled();
  });

  it("rejects an invalid signature without acknowledging receipt", async () => {
    mockService.webhook.mockRejectedValueOnce(
      new PaymentError("Tanda tangan webhook tidak cocok", 400),
    );
    const res = await POST(
      new Request("http://localhost:3201/api/payments/klikqris/webhook", {
        method: "POST",
        body: JSON.stringify({ order_id: "ORDER", signature: "forged" }),
      }),
    );
    expect(res.status).toBe(400);
    expect(await res.json()).not.toHaveProperty("received");
  });

  it("rejects oversized payload (> 32KB) with 413", async () => {
    const largeData = "x".repeat(33 * 1024);
    const req = new Request("http://localhost:3201/api/payments/klikqris/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ large: largeData }),
    });
    const res = await POST(req);
    expect(res.status).toBe(413);
    expect(mockService.webhook).not.toHaveBeenCalled();
  });

  it("returns 503 when payment service is not configured", async () => {
    mockIsPaymentReady.mockReturnValue(false);
    const req = new Request("http://localhost:3201/api/payments/klikqris/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ test: true }),
    });
    const res = await POST(req);
    expect(res.status).toBe(503);
    expect(mockService.webhook).not.toHaveBeenCalled();
  });
});
