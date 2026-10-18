import { expect, it } from "vitest";
import { hasMicrositeAccess } from "./microsite-access";

it("rejects unknown, expired and substring tokens before personal content is returned", () => {
  expect(hasMicrositeAccess("token-budi-a7c6")).toBe(true);
  for (const token of ["", "demo", "expired", "revoked", "someone-a7c6-other"]) {
    expect(hasMicrositeAccess(token)).toBe(false);
  }
});
