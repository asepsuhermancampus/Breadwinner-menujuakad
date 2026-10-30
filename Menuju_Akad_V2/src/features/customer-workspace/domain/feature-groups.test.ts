import { expect, it } from "vitest";
import { customerFeatureGroup, customerNavigationActive } from "./feature-groups";
import { customerNavigation } from "../components/customer-navigation";

it("keeps every grouped destination reachable as tabs with the correct parent active", () => {
  const groups = customerNavigation.flatMap((group) => group.items).filter((item) => item.children);
  expect(groups).toHaveLength(4);
  for (const group of groups) {
    for (const child of group.children!) {
      expect(customerFeatureGroup(child.href)?.href).toBe(group.href);
      expect(customerNavigationActive(group.href, child.href)).toBe(true);
    }
  }
});
it("exposes seserahan and moodboard as separate customer destinations", () => {
  const items = customerNavigation.flatMap((group) => group.items);
  expect(items.find((item) => item.href === "/planner/seserahan")?.label).toBe("Seserahan");
  expect(items.find((item) => item.href === "/planner/moodboard")?.label).toBe(
    "Inspirasi & moodboard",
  );
  expect(customerNavigationActive("/planner/seserahan", "/planner/moodboard")).toBe(false);
});
it("offers the vendor catalog and saved vendors directly in customer navigation", () => {
  const vendor = customerNavigation
    .flatMap((group) => group.items)
    .find((item) => item.href === "/marketplace");
  expect(vendor?.label).toBe("Cari vendor");
  expect(vendor?.children?.some((item) => item.href === "/marketplace/favorites")).toBe(true);
  expect(customerNavigationActive("/marketplace", "/marketplace/favorites")).toBe(true);
});
it("matches vendor details without stealing orders or unrelated sidebar selections", () => {
  expect(customerFeatureGroup("/marketplace/vendor/test")?.href).toBe("/marketplace");
  expect(customerNavigationActive("/marketplace", "/marketplace/bundles")).toBe(false);
  expect(customerNavigationActive("/planner/tasks", "/planner/tasks")).toBe(true);
  expect(customerFeatureGroup("/account")).toBeUndefined();
});
