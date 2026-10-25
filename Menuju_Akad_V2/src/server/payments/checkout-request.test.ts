import { expect, it, vi } from "vitest";
import { readPlanRequest } from "./checkout-request";
vi.mock("server-only", () => ({}));
const request = (data: unknown) =>
  new Request("https://app.test", { method: "POST", body: JSON.stringify(data) });
it("accepts only tier and a boolean claim, not client pricing", async () => {
  await expect(
    readPlanRequest(request({ planId: "premium", claimDiscount: true })),
  ).resolves.toEqual({ planId: "premium", claimDiscount: true });
  for (const data of [
    { planId: "free", claimDiscount: true },
    { planId: "premium", claimDiscount: true, amount: 1 },
    { planId: "premium", claimDiscount: "true" },
    { planId: "lifetime", claimDiscount: false, upgradeCredit: 149000 },
    { planId: "premium", claimDiscount: false, renewal: "yes" },
    { planId: "premium", claimDiscount: true, replaceIntentId: "wrong" },
  ])
    await expect(readPlanRequest(request(data))).rejects.toMatchObject({ httpStatus: 400 });
  await expect(readPlanRequest(request({ junk: "x".repeat(1100) }))).rejects.toMatchObject({
    httpStatus: 413,
  });
});
