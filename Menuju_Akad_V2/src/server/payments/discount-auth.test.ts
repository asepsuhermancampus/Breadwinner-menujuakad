import { beforeEach, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
const mocks = vi.hoisted(() => ({ principal: vi.fn(), reserve: vi.fn() }));
vi.mock("@/server/payments/guest-reservation", () => ({ checkoutPrincipal: mocks.principal }));
vi.mock("@/server/payments/runtime", () => ({
  getPlanCheckoutService: () => ({ reserve: mocks.reserve }),
}));
vi.mock("@/server/auth", () => ({ auth: vi.fn() }));
import { POST } from "@/app/api/payments/plans/route";
beforeEach(() => {
  vi.clearAllMocks();
  mocks.principal.mockResolvedValue({ kind: "guest", hash: "guest" });
  mocks.reserve.mockResolvedValue({ id: "fake" });
});
it("requires real authentication before a discount reservation", async () => {
  const res = await POST(
    new Request("http://localhost:3201/api/payments/plans", {
      method: "POST",
      headers: { origin: "http://localhost:3201", "content-type": "application/json" },
      body: JSON.stringify({ planId: "premium", claimDiscount: true }),
    }),
  );
  expect(res.status).toBe(401);
  expect(mocks.reserve).not.toHaveBeenCalled();
});
it("still rejects a hostile cross origin", async () => {
  const res = await POST(
    new Request("http://localhost:3201/api/payments/plans", {
      method: "POST",
      headers: { origin: "https://hostile.invalid", "content-type": "application/json" },
      body: JSON.stringify({ planId: "premium", claimDiscount: true }),
    }),
  );
  expect(res.status).toBe(403);
  expect(mocks.reserve).not.toHaveBeenCalled();
});
