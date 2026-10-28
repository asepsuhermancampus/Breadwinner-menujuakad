import { expect, it } from "vitest";
import { customerFeatureGroup, customerNavigationActive } from "./feature-groups";
import { customerNavigation } from "../components/customer-navigation";

it("keeps every grouped destination reachable as tabs with the correct parent active", () => {
  const groups = customerNavigation.flatMap((group) => group.items).filter((item) => item.children);
  expect(groups).toHaveLength(5);
  for (const group of groups) {
    for (const child of group.children!) {
      expect(customerFeatureGroup(child.href)?.href).toBe(group.href);
      expect(customerNavigationActive(group.href, child.href)).toBe(true);
    }
  }
});
it("matches vendor details without stealing orders or unrelated sidebar selections", () => {
  expect(customerFeatureGroup("/marketplace/vendor/test")?.href).toBe("/marketplace");
  expect(customerNavigationActive("/marketplace", "/marketplace/bundles")).toBe(false);
  expect(customerNavigationActive("/planner/tasks", "/planner/tasks")).toBe(true);
  expect(customerFeatureGroup("/account")).toBeUndefined();
});
