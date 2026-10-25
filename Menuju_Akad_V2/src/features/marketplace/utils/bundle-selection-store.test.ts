import { describe, expect, it } from "vitest";
import {
  applySelectionToBundle,
  DEFAULT_BUNDLE_ITEMS,
  isValidSelection,
} from "./bundle-selection-store";
import type { BundleItem, VendorPackageSelection } from "../types/marketplace";

describe("bundle-selection-store utils", () => {
  it("validates valid selection objects strictly", () => {
    const valid: VendorPackageSelection = {
      packageId: "p1",
      vendorId: "v-lensa",
      vendorName: "Lensa Teduh Photo",
      packageName: "Akad Intimate",
      priceIdr: 7500000,
    };
    expect(isValidSelection(valid)).toBe(true);
    expect(isValidSelection({})).toBe(false);
    expect(isValidSelection({ ...valid, priceIdr: -100 })).toBe(false);
    expect(isValidSelection({ ...valid, packageId: "" })).toBe(false);
    expect(isValidSelection(null)).toBe(false);
  });

  it("replaces existing vendor package and preserves packageId", () => {
    const selection: VendorPackageSelection = {
      packageId: "p1",
      vendorId: "v-lensa",
      vendorName: "Lensa Teduh Photo",
      packageName: "Akad Intimate",
      priceIdr: 7500000,
    };
    const updated = applySelectionToBundle(DEFAULT_BUNDLE_ITEMS, selection);
    const lensaItem = updated.find((i) => i.vendorId === "v-lensa");
    expect(lensaItem).toBeDefined();
    expect(lensaItem?.packageId).toBe("p1");
    expect(lensaItem?.serviceName).toBe("Akad Intimate");
    expect(lensaItem?.unitPriceIdr).toBe(7500000);
    expect(lensaItem?.quantity).toBe(1);
    expect(updated.length).toBe(DEFAULT_BUNDLE_ITEMS.length);
  });

  it("appends item with packageId when vendor is not present in bundle", () => {
    const selection: VendorPackageSelection = {
      packageId: "p-katering-1",
      vendorId: "v-katering-baru",
      vendorName: "Katering Berkah",
      packageName: "Buffet Gold",
      priceIdr: 25000000,
    };
    const updated = applySelectionToBundle(DEFAULT_BUNDLE_ITEMS, selection);
    expect(updated.length).toBe(DEFAULT_BUNDLE_ITEMS.length + 1);
    const katering = updated.find((i) => i.vendorId === "v-katering-baru");
    expect(katering?.packageId).toBe("p-katering-1");
    expect(katering?.unitPriceIdr).toBe(25000000);
  });

  it("returns base items unmodified when selection is null", () => {
    const items: BundleItem[] = [
      {
        id: "1",
        vendorId: "v-test",
        vendorName: "Test",
        serviceName: "Svc",
        unitPriceIdr: 1000,
        quantity: 1,
        status: "available",
      },
    ];
    expect(applySelectionToBundle(items, null)).toBe(items);
  });
});
