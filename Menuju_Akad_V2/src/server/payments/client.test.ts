import { describe, expect, it, vi } from "vitest";
import { createKlikQRISClient } from "./client";
import { PaymentError } from "./errors";

vi.mock("server-only", () => ({}));

describe("payments/client", () => {
  it("uses the documented qris_url when the inline QR image is unavailable", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: true,
        data: {
          order_id: "ORDER",
          amount: "5000.00",
          total_amount: "5016.00",
          status: "PENDING",
          signature: "signature",
          qris_image: "data:image/png;base64,invalid",
          qris_url: "https://klikqris.com/storage/qris_api/order.png",
        },
      }),
    });
    const client = createKlikQRISClient("https://klikqris.com/api", "key", "merchant", mockFetch);
    expect((await client.getStatus("ORDER")).qris_image).toBe(
      "https://klikqris.com/storage/qris_api/order.png",
    );
  });

  it("maps malformed provider amounts to a gateway error without exposing raw data", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: true,
        data: { order_id: "ORDER", amount: "5000.50", total_amount: "5016.00", status: "PENDING" },
      }),
    });
    const client = createKlikQRISClient("https://klikqris.com/api", "key", "merchant", mockFetch);
    await expect(client.getStatus("ORDER")).rejects.toMatchObject({ httpStatus: 502 });
  });

  it("dispatches create request with expected headers, fixed amount, and body payload", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: true,
        data: {
          order_id: "MA-ORDER-1",
          amount: "5000.00",
          total_amount: "5016.00",
          status: "PENDING",
          qris_image: "data:image/png;base64,sample",
          expired_at: "2026-10-20 16:00:00",
          paid_at: null,
          signature: "sig-abc-123",
        },
      }),
    });

    const client = createKlikQRISClient(
      "https://klikqris.com/api",
      "test-api-key",
      "m-100",
      mockFetch as unknown as typeof fetch,
    );
    const result = await client.createQRIS({
      order_id: "MA-ORDER-1",
      amount: 5000,
      merchant_id: "m-100",
      keterangan: "Uji integrasi QRIS Menuju Akad",
      callback_url: "https://menujuakad.com/webhook",
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://klikqris.com/api/qris/create");
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>)["x-api-key"]).toBe("test-api-key");
    expect((init.headers as Record<string, string>)["id_merchant"]).toBe("m-100");
    expect(init.redirect).toBe("error");
    expect(JSON.parse(String(init.body))).toEqual({
      order_id: "MA-ORDER-1",
      amount: 5000,
      id_merchant: "m-100",
      keterangan: "Uji integrasi QRIS Menuju Akad",
      callback_url: "https://menujuakad.com/webhook",
    });

    expect(result.order_id).toBe("MA-ORDER-1");
    expect(result.amount).toBe(5000);
    expect(result.total_amount).toBe(5016);
    expect(result.status).toBe("pending");
  });

  it("fails with PaymentError on network failures, non-200 responses, and malformed bodies", async () => {
    const timeoutFetch = vi.fn().mockRejectedValue(new Error("Network timeout"));
    const client1 = createKlikQRISClient(
      "https://klikqris.com/api",
      "key",
      "m-1",
      timeoutFetch as unknown as typeof fetch,
    );
    await expect(client1.getStatus("ORD-1")).rejects.toThrow(PaymentError);

    const badJsonFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: false, data: null }),
    });
    const client2 = createKlikQRISClient(
      "https://klikqris.com/api",
      "key",
      "m-1",
      badJsonFetch as unknown as typeof fetch,
    );
    await expect(client2.getStatus("ORD-1")).rejects.toThrow(PaymentError);
  });
});
