import { expect, it } from "vitest";
import { safeReturnTo } from "./return-to";
it("preserves known trial feature paths after login without allowing arbitrary URLs", () => {
  for (const value of [
    "/planner/tasks",
    "/planner/kua",
    "/planner/guests",
    "/planner/finance",
    "/planner/invitations",
    "/account/plans",
  ])
    expect(safeReturnTo(value)).toBe(value);
  for (const value of [
    "/planner/../evil",
    "/planner/tasks?redirect=https://evil.com",
    "/planner/tasks#external",
  ])
    expect(safeReturnTo(value)).toBe("/account");
});
it("preserves only known local checkout destinations", () => {
  const destination = "/checkout/qris?intent=aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";
  expect(safeReturnTo(destination)).toBe(destination);
  expect(safeReturnTo("/dashboard")).toBe("/dashboard");
  for (const value of [
    "//evil.com",
    "https://evil.com",
    "/\\evil.com",
    "/%2f%2fevil",
    "/checkout/qris?intent=../x",
    "/account?next=https://evil.com",
  ])
    expect(safeReturnTo(value)).toBe("/account");
});
