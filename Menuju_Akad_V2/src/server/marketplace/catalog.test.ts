import { expect, it, vi } from "vitest";
import { DatabaseSync } from "node:sqlite";
vi.mock("server-only", () => ({}));
import { MarketplaceCatalog } from "./catalog";
it("stores real vendor records and private requests without fixture vendors", () => {
  const db = new DatabaseSync(":memory:");
  try {
    const s = new MarketplaceCatalog(db);
    expect(s.list()).toEqual([]);
    const vendor = s.save({
      name: "Vendor sendiri",
      category: "Dekorasi",
      description: "Deskripsi asli",
      price: 100000,
    });
    expect(s.list()).toHaveLength(1);
    const order = s.request("owner", [vendor.id], "Tanggal menyesuaikan");
    expect(s.order("owner", order.id)?.total).toBe(100000);
    expect(s.order("other", order.id)).toBeNull();
    expect(s.requests()).toHaveLength(1);
    s.updateRequest(order.id, "contacted");
    expect(s.order("owner", order.id)?.status).toBe("contacted");
    expect(() => s.request("owner", ["unknown"], "")).toThrow();
    s.remove(vendor.id);
    expect(s.list()).toEqual([]);
    expect(s.order("owner", order.id)?.items[0]?.name).toBe("Vendor sendiri");
  } finally {
    db.close();
  }
});
