import "server-only";
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import type { InvoiceStatus } from "@/features/payments/types";
import { UPDATE_INVOICE, mapRow, type DbInvoice, type InvoiceUpdate } from "./db-schema";
import { initializePaymentSchema } from "./db-migration";
import { PaymentError } from "./errors";
import { grantSettledInvoice } from "@/server/subscriptions/grant-repository";

export type { DbInvoice } from "./db-schema";

export class PaymentDatabase {
  private readonly db: DatabaseSync;

  constructor(filePath = ":memory:") {
    if (filePath !== ":memory:") fs.mkdirSync(path.dirname(filePath), { recursive: true });
    this.db = new DatabaseSync(filePath);
    this.db.exec("PRAGMA foreign_keys=ON");
    try {
      initializePaymentSchema(this.db);
    } catch (error) {
      this.db.close();
      throw error;
    }
  }

  reserveInvoice(
    owner: string,
    env: string,
    orderId: string,
    amount: number,
    originalAmount = amount,
  ) {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const existing = this.getActiveInvoice(owner, env);
      if (existing) {
        if (originalAmount > amount && existing.discount_amount === 0) {
          throw new PaymentError(
            "Tagihan aktif sudah diterbitkan. Tunggu kedaluwarsa sebelum klaim diskon.",
            409,
          );
        }
        this.db.exec("COMMIT");
        return { isNew: false, invoice: existing };
      }
      if (originalAmount > amount && this.hasPaidInvoice(owner, env)) {
        throw new PaymentError("Diskon pengguna baru hanya berlaku untuk pembayaran pertama.", 409);
      }
      const now = Date.now();
      this.db
        .prepare(
          `INSERT INTO invoices
        (order_id,owner,environment,amount,original_amount,discount_amount,status,last_checked_at,created_at,updated_at)
        VALUES (?,?,?,?,?,?,'creating',0,?,?)`,
        )
        .run(orderId, owner, env, amount, originalAmount, originalAmount - amount, now, now);
      const invoice = this.requireInvoice(orderId);
      this.db.exec("COMMIT");
      return { isNew: true, invoice };
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }

  hasPaidInvoice(owner: string, env: string): boolean {
    return Boolean(
      this.db
        .prepare("SELECT 1 FROM invoices WHERE owner=? AND environment=? AND status='paid' LIMIT 1")
        .get(owner, env),
    );
  }

  getActiveInvoice(owner: string, env: string): DbInvoice | null {
    const row = this.db
      .prepare(
        `SELECT * FROM invoices WHERE owner=? AND environment=?
      AND purpose='integration_test' AND status IN ('creating','pending','unknown') ORDER BY id DESC LIMIT 1`,
      )
      .get(owner, env);
    return row ? mapRow(row) : null;
  }

  getByOrderId(orderId: string): DbInvoice | null {
    const row = this.db.prepare("SELECT * FROM invoices WHERE order_id=?").get(orderId);
    return row ? mapRow(row) : null;
  }

  getLatestByOwner(owner: string, env: string): DbInvoice | null {
    const row = this.db
      .prepare(
        `SELECT * FROM invoices WHERE owner=? AND environment=?
      AND purpose='integration_test' ORDER BY id DESC LIMIT 1`,
      )
      .get(owner, env);
    return row ? mapRow(row) : null;
  }

  updateAfterCreate(orderId: string, data: InvoiceUpdate): DbInvoice {
    return this.update(orderId, data, "status IN ('creating','unknown')");
  }

  updateFromStatusCheck(orderId: string, data: InvoiceUpdate): DbInvoice {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const invoice = this.update(
        orderId,
        data,
        "(status NOT IN ('paid','expired') OR $status='paid')",
      );
      grantSettledInvoice(this.db, invoice);
      this.db.exec("COMMIT");
      return invoice;
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }

  updateStatus(orderId: string, status: InvoiceStatus): void {
    this.db
      .prepare("UPDATE invoices SET status=?,updated_at=? WHERE order_id=? AND status='creating'")
      .run(status, Date.now(), orderId);
  }

  updateLastChecked(orderId: string, timestamp: number): void {
    this.db
      .prepare("UPDATE invoices SET last_checked_at=?,updated_at=? WHERE order_id=?")
      .run(timestamp, Date.now(), orderId);
  }

  private update(orderId: string, d: InvoiceUpdate, guard: string): DbInvoice {
    this.db.prepare(`${UPDATE_INVOICE} AND ${guard}`).run({
      $status: d.status,
      $total: d.totalAmount,
      $signature: d.signature,
      $qr: d.qrImage,
      $expires: d.expiresAt,
      $paid: d.paidAt,
      $checked: d.lastCheckedAt ?? null,
      $now: Date.now(),
      $order: orderId,
    });
    return this.requireInvoice(orderId);
  }

  private requireInvoice(orderId: string): DbInvoice {
    const invoice = this.getByOrderId(orderId);
    if (!invoice) throw new Error("Invoice tidak ditemukan");
    return invoice;
  }

  close(): void {
    this.db.close();
  }

  storage(): DatabaseSync {
    return this.db;
  }
}
