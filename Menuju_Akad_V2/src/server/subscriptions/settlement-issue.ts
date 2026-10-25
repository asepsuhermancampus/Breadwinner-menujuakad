import "server-only";
import type { DatabaseSync } from "node:sqlite";
import type { DbInvoice } from "@/server/payments/db-schema";
import { initializeWorkspaceSchema } from "@/server/workspaces/schema";
export function recordSettlementIssue(db: DatabaseSync, invoice: DbInvoice) {
  const reason =
    "Pembayaran tambahan terverifikasi setelah paket lain aktif. Perlu peninjauan bantuan; akses tambahan tidak diaktifkan otomatis.";
  const now = new Date().toISOString();
  db.prepare(
    "INSERT OR IGNORE INTO payment_settlement_issues(order_id,owner,reason,created_at) VALUES(?,?,?,?)",
  ).run(invoice.order_id, invoice.owner, reason, now);
  initializeWorkspaceSchema(db);
  db.prepare(
    "INSERT OR IGNORE INTO customer_support(id,owner,message,priority,created_at) VALUES(?,?,?,'priority',?)",
  ).run(
    `payment-review:${invoice.order_id}`,
    invoice.owner,
    `${reason} ID pesanan: ${invoice.order_id}. Total: Rp${invoice.total_amount}.`,
    now,
  );
}
