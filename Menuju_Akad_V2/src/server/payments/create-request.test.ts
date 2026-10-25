import { expect, it, vi } from "vitest";
import { readDiscountClaim } from "./create-request";
vi.mock("server-only", () => ({}));
const request = (body?: string) =>
  new Request("http://localhost/api/payments/klikqris", {
    method: "POST",
    ...(body ? { body } : {}),
  });
it("accepts only an explicit boolean discount claim and ignores client supplied prices", async () => {
  expect(await readDiscountClaim(request())).toBe(false);
  expect(
    await readDiscountClaim(
      request('{"claimNewUserDiscount":true,"amount":1,"discountPercent":100}'),
    ),
  ).toBe(true);
  expect(await readDiscountClaim(request('{"amount":1}'))).toBe(false);
});
it.each(['{"claimNewUserDiscount":"true"}', "[]", "null", "{"])(
  "rejects malformed claims %s",
  async (body) => {
    await expect(readDiscountClaim(request(body))).rejects.toMatchObject({ httpStatus: 400 });
  },
);
it("bounds streamed JSON input even without a content-length header", async () => {
  await expect(readDiscountClaim(request("x".repeat(1025)))).rejects.toMatchObject({
    httpStatus: 413,
  });
});
