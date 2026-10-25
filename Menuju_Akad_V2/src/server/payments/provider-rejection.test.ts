import { expect, it, vi } from "vitest";
import { createKlikQRISClient } from "./client";
vi.mock("server-only", () => ({}));
it("explains the merchant amount limit without reflecting provider secrets", async () => {
  const client = createKlikQRISClient(
    "https://klikqris.com/api",
    "key",
    "merchant",
    vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          status: false,
          message: "secret-key",
          errors: { amount: ["Nominal transaksi maksimal adalah Rp 300.000."] },
        }),
        { status: 422 },
      ),
    ),
  );
  await expect(
    client.createQRIS({
      order_id: "ORDER",
      amount: 379050,
      merchant_id: "merchant",
      keterangan: "Lifetime",
    }),
  ).rejects.toMatchObject({
    httpStatus: 422,
    message:
      "KlikQRIS membatasi nominal transaksi ini hingga Rp300.000. Hubungi pengelola untuk penyesuaian limit merchant. Tagihan belum dibuat.",
  });
});
it("keeps status lookup failures separate from rejected creation", async () => {
  const client = createKlikQRISClient(
    "https://klikqris.com/api",
    "key",
    "merchant",
    vi
      .fn()
      .mockResolvedValue(
        new Response(
          JSON.stringify({ errors: { amount: ["Nominal transaksi maksimal adalah Rp 300.000."] } }),
          { status: 422 },
        ),
      ),
  );
  await expect(client.getStatus("ORDER")).rejects.toMatchObject({
    httpStatus: 502,
    message: "Gateway KlikQRIS mengembalikan kode gagal",
  });
});
