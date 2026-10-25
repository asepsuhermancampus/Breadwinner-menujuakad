import "server-only";
import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import { z } from "zod";
import { PaymentError } from "@/server/payments/errors";
import type { CatalogVendor, CatalogOrder } from "@/features/marketplace/types/customer-catalog";
const schema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(160),
  category: z.string().trim().min(1).max(80),
  description: z.string().max(2000),
  price: z.number().int().min(0).max(1e12),
});
export class MarketplaceCatalog {
  constructor(private db: DatabaseSync) {
    db.exec(
      "CREATE TABLE IF NOT EXISTS service_vendors(id TEXT PRIMARY KEY,data TEXT NOT NULL); CREATE TABLE IF NOT EXISTS service_quote_requests(id TEXT PRIMARY KEY,owner TEXT NOT NULL,data TEXT NOT NULL)",
    );
  }
  list(): CatalogVendor[] {
    return this.db
      .prepare("SELECT data FROM service_vendors ORDER BY id")
      .all()
      .map((r) => JSON.parse(String(r.data)) as CatalogVendor);
  }
  save(input: unknown): CatalogVendor {
    const p = schema.safeParse(input);
    if (!p.success) throw new PaymentError("Data vendor tidak valid.", 400);
    const v = { ...p.data, id: p.data.id ?? randomUUID() };
    this.db
      .prepare(
        "INSERT INTO service_vendors(id,data)VALUES(?,?) ON CONFLICT(id)DO UPDATE SET data=excluded.data",
      )
      .run(v.id, JSON.stringify(v));
    return v;
  }
  remove(id: string) {
    this.db.prepare("DELETE FROM service_vendors WHERE id=?").run(id);
  }
  request(owner: string, ids: string[], message: string, contactEmail = ""): CatalogOrder {
    if (
      !Array.isArray(ids) ||
      ids.length === 0 ||
      ids.length > 20 ||
      ids.some((id) => typeof id !== "string") ||
      new Set(ids).size !== ids.length ||
      typeof message !== "string" ||
      message.length > 2000
    )
      throw new PaymentError("Pilihan vendor tidak valid.", 400);
    const vendors = this.list(),
      items = ids.map((id) => vendors.find((v) => v.id === id));
    if (items.some((v) => !v))
      throw new PaymentError("Vendor sudah tidak tersedia. Periksa pilihan kembali.", 409);
    const selected = items as CatalogVendor[],
      data: CatalogOrder = {
        id: randomUUID(),
        items: selected,
        total: selected.reduce((n, v) => n + v.price, 0),
        message,
        status: "requested",
        contactEmail,
        createdAt: new Date().toISOString(),
      };
    this.db
      .prepare("INSERT INTO service_quote_requests(id,owner,data)VALUES(?,?,?)")
      .run(data.id, owner, JSON.stringify(data));
    return data;
  }
  requests(): CatalogOrder[] {
    return this.db
      .prepare("SELECT data FROM service_quote_requests ORDER BY rowid DESC LIMIT 200")
      .all()
      .map((r) => JSON.parse(String(r.data)) as CatalogOrder);
  }
  updateRequest(id: string, status: string) {
    if (!["requested", "contacted", "cancelled"].includes(status))
      throw new PaymentError("Status tidak valid.", 400);
    const result = this.db
      .prepare("UPDATE service_quote_requests SET data=json_set(data,'$.status',?) WHERE id=?")
      .run(status, id);
    if (result.changes !== 1) throw new PaymentError("Permintaan tidak ditemukan.", 404);
  }
  order(owner: string, id: string): CatalogOrder | null {
    const row = this.db
      .prepare("SELECT data FROM service_quote_requests WHERE id=? AND owner=?")
      .get(id, owner);
    return row ? (JSON.parse(String(row.data)) as CatalogOrder) : null;
  }
}
