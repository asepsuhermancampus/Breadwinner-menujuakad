import { expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("@/server/auth", () => ({ auth: async () => ({ user: { email: "buyer@example.com" } }) }));
const create = vi.fn().mockResolvedValue({ orderId: "MOCK", amount: 4750 });
const discountOffer = vi.fn(() => ({
  eligible: true,
  originalAmount: 5000,
  discountAmount: 250,
  amount: 4750,
  percent: 5,
}));
vi.mock("./runtime", () => ({
  isPaymentReady: () => true,
  getPaymentService: () => ({ create, current: () => null, discountOffer }),
}));
import { GET, POST } from "@/app/api/payments/klikqris/route";

it("exposes a server-priced offer and forwards only an explicit claim with the authenticated owner", async () => {
  const result = await GET(new Request("http://localhost:3201/api/payments/klikqris"));
  expect((await result.json()).discountOffer).toMatchObject({
    eligible: true,
    percent: 5,
    amount: 4750,
  });
  const response = await POST(
    new Request("http://localhost:3201/api/payments/klikqris", {
      method: "POST",
      headers: { Origin: "http://localhost:3201" },
      body: JSON.stringify({
        claimNewUserDiscount: true,
        amount: 1,
        discountPercent: 100,
        owner: "attacker",
      }),
    }),
  );
  expect(response.status).toBe(200);
  expect(create).toHaveBeenCalledWith(expect.stringMatching(/^[a-f0-9]{64}$/), true);
});

it("rejects non-boolean claims before calling the payment service", async () => {
  create.mockClear();
  const response = await POST(
    new Request("http://localhost:3201/api/payments/klikqris", {
      method: "POST",
      headers: { Origin: "http://localhost:3201" },
      body: '{"claimNewUserDiscount":"true"}',
    }),
  );
  expect(response.status).toBe(400);
  expect(create).not.toHaveBeenCalled();
});
