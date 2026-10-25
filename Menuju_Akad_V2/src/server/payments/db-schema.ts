import "server-only";
import type { InvoiceStatus } from "@/features/payments/types";

export interface DbInvoice {
  id: number;
  order_id: string;
  owner: string;
  environment: "production" | "sandbox";
  amount: number;
  original_amount: number;
  discount_amount: number;
  upgrade_credit_amount: number;
  cancelled_at: string | null;
  total_amount: number | null;
  status: InvoiceStatus;
  signature: string | null;
  qr_image: string | null;
  expires_at: string | null;
  paid_at: string | null;
  last_checked_at: number;
  created_at: number;
  updated_at: number;
  purpose: "integration_test" | "subscription";
  plan_id: "premium" | "lifetime" | null;
  catalog_revision: string | null;
  duration_months: number | null;
  intent_id: string | null;
}

export interface InvoiceUpdate {
  status: InvoiceStatus;
  totalAmount: number;
  signature: string | null;
  qrImage: string | null;
  expiresAt: string | null;
  paidAt: string | null;
  lastCheckedAt?: number;
}

export const INVOICE_TABLE = `
  CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL UNIQUE,
    owner TEXT NOT NULL,
    environment TEXT NOT NULL CHECK(environment IN ('production','sandbox')),
    original_amount INTEGER NOT NULL CHECK(original_amount > 0),
    discount_amount INTEGER NOT NULL DEFAULT 0 CHECK(discount_amount >= 0 AND discount_amount <= original_amount / 20),
    upgrade_credit_amount INTEGER NOT NULL DEFAULT 0 CHECK(upgrade_credit_amount >= 0 AND upgrade_credit_amount < original_amount),
    cancelled_at TEXT,
    amount INTEGER NOT NULL CHECK(amount > 0 AND amount = original_amount - discount_amount - upgrade_credit_amount),
    total_amount INTEGER,
    status TEXT NOT NULL CHECK(status IN ('creating','unknown','pending','paid','expired')),
    signature TEXT, qr_image TEXT, expires_at TEXT, paid_at TEXT,
    last_checked_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
`;
export const SCHEMA =
  INVOICE_TABLE +
  `
  CREATE INDEX IF NOT EXISTS idx_invoices_owner_env ON invoices(owner,environment,id DESC);
  CREATE UNIQUE INDEX IF NOT EXISTS idx_invoices_active_owner
    ON invoices(owner,environment) WHERE status IN ('creating','pending','unknown');
`;

export const UPDATE_INVOICE = `UPDATE invoices SET
  status=$status, total_amount=COALESCE(total_amount,$total),
  signature=COALESCE(signature,$signature), qr_image=COALESCE($qr,qr_image),
  expires_at=COALESCE($expires,expires_at), paid_at=COALESCE($paid,paid_at),
  last_checked_at=COALESCE($checked,last_checked_at), updated_at=$now
  WHERE order_id=$order`;

export function mapRow(row: Record<string, unknown>): DbInvoice {
  return {
    id: Number(row["id"]),
    order_id: String(row["order_id"]),
    owner: String(row["owner"]),
    environment: row["environment"] as DbInvoice["environment"],
    amount: Number(row["amount"]),
    original_amount: Number(row["original_amount"]),
    discount_amount: Number(row["discount_amount"]),
    upgrade_credit_amount: Number(row["upgrade_credit_amount"] ?? 0),
    cancelled_at: (row["cancelled_at"] as string | null) ?? null,
    total_amount: row["total_amount"] === null ? null : Number(row["total_amount"]),
    status: row["status"] as InvoiceStatus,
    signature: row["signature"] === null ? null : String(row["signature"]),
    qr_image: row["qr_image"] === null ? null : String(row["qr_image"]),
    expires_at: row["expires_at"] === null ? null : String(row["expires_at"]),
    paid_at: row["paid_at"] === null ? null : String(row["paid_at"]),
    last_checked_at: Number(row["last_checked_at"]),
    created_at: Number(row["created_at"]),
    updated_at: Number(row["updated_at"]),
    purpose: row["purpose"] === "subscription" ? "subscription" : "integration_test",
    plan_id: (row["plan_id"] as DbInvoice["plan_id"]) ?? null,
    catalog_revision: (row["catalog_revision"] as string | null) ?? null,
    duration_months: (row["duration_months"] as number | null) ?? null,
    intent_id: (row["intent_id"] as string | null) ?? null,
  };
}
