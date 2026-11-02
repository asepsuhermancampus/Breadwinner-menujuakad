import { expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/server/auth", () => ({ auth: async () => null }));

import { PaymentDatabase } from "./db";
import { GET, PATCH } from "@/app/api/superadmin/pricing/route";

const state = vi.hoisted(() => ({
  session: null as { id: string; email: string } | null,
  db: null as PaymentDatabase | null,
}));

vi.mock("@/server/reviews/access", () => ({
  getSuperadminSession: async () => state.session,
}));

vi.mock("@/server/payments/runtime", () => ({
  getPaymentDatabase: () => state.db!,
}));

const request = (
  origin = "http://localhost",
  body: unknown = { planId: "premium", amount: 179000, reason: "Uji promo", version: 0 },
) =>
  new Request("http://localhost/api/superadmin/pricing", {
    method: "PATCH",
    headers: { origin, "content-type": "application/json" },
    body: JSON.stringify(body),
  });

it("protects pricing management and accepts validated superadmin changes", async () => {
  state.db = new PaymentDatabase();
  state.session = null;

  // Unauthenticated GET & PATCH
  expect((await GET()).status).toBe(401);
  expect((await PATCH(request())).status).toBe(401);

  // Authenticated as superadmin
  state.session = { id: "super-1", email: "super@menujuakad.id" };

  // GET succeeds with pricing and empty audit
  const getRes = await GET();
  expect(getRes.status).toBe(200);
  const getData = (await getRes.json()) as { pricing: { planId: string }[] };
  expect(getData.pricing).toHaveLength(3);

  // Reject invalid origin
  expect((await PATCH(request("https://evil.example"))).status).toBe(403);

  // Reject invalid amount
  expect(
    (
      await PATCH(
        request("http://localhost", {
          planId: "premium",
          amount: 500,
          reason: "Too low",
          version: 0,
        }),
      )
    ).status,
  ).toBe(400);

  // Valid update succeeds
  const updateRes = await PATCH(request());
  expect(updateRes.status).toBe(200);
  const updateData = (await updateRes.json()) as {
    success: boolean;
    pricing: { planId: string; amount: number }[];
  };
  expect(updateData.success).toBe(true);
  const updatedPrem = updateData.pricing.find((p) => p.planId === "premium");
  expect(updatedPrem?.amount).toBe(179000);

  // Subsequent update with version 0 fails with 409 Conflict
  expect((await PATCH(request())).status).toBe(409);
});
