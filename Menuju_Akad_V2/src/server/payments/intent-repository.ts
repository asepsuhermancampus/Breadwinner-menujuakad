import "server-only";
import { type PaidPlanId } from "@/features/plans/domain/catalog";
import { checkoutPrice, type ReserveOptions } from "./checkout-price";
import { insertIntent } from "./intent-insert";
import type { PaymentDatabase } from "./db";
import type { CheckoutIntent, CheckoutPrincipal, PaymentEnvironment } from "./intent-types";
import { PaymentError } from "./errors";
import { grantSettledInvoice } from "@/server/subscriptions/grant-repository";

export class IntentRepository {
  constructor(
    private readonly db: PaymentDatabase,
    private readonly environment: PaymentEnvironment,
  ) {}

  get(id: string): CheckoutIntent | null {
    const row = this.db
      .storage()
      .prepare(
        `SELECT c.*, i.amount,i.original_amount,i.discount_amount,i.upgrade_credit_amount,i.cancelled_at
      FROM checkout_intents c JOIN invoices i ON i.order_id=c.order_id WHERE c.id=? AND c.environment=?`,
      )
      .get(id, this.environment);
    return row
      ? {
          id: String(row["id"]),
          guestHash: row["guest_hash"] as string | null,
          owner: row["owner"] as string | null,
          environment: this.environment,
          planId: row["plan_id"] as PaidPlanId,
          orderId: String(row["order_id"]),
          amount: Number(row["amount"]),
          originalAmount: Number(row["original_amount"]),
          discountAmount: Number(row["discount_amount"]),
          upgradeCredit: Number(row["upgrade_credit_amount"]),
          cancelledAt: (row["cancelled_at"] as string | null) ?? null,
          creditSourceId: (row["credit_source_id"] as string | null) ?? null,
          creditValidUntil: (row["credit_valid_until"] as string | null) ?? null,
          revealedAt: (row["revealed_at"] as string | null) ?? null,
          renewal: row["renewal"] === 1,
          createdAt: Number(row["created_at"]),
        }
      : null;
  }

  active(principal: CheckoutPrincipal): CheckoutIntent | null {
    const identity = principal.kind === "owner" ? principal.owner : `guest:${principal.hash}`;
    const row = this.db
      .storage()
      .prepare(
        `SELECT intent_id FROM invoices WHERE owner=? AND environment=?
      AND purpose='subscription' AND status IN ('creating','pending','unknown') AND cancelled_at IS NULL LIMIT 1`,
      )
      .get(identity, this.environment);
    return row ? this.get(String(row["intent_id"])) : null;
  }

  hasPurchased(owner: string): boolean {
    return Boolean(
      this.db
        .storage()
        .prepare(`SELECT 1 FROM subscription_grants WHERE owner=? LIMIT 1`)
        .get(owner),
    );
  }

  reserve(
    principal: CheckoutPrincipal,
    planId: PaidPlanId,
    claimDiscount: boolean,
    options: ReserveOptions = {},
  ) {
    const sql = this.db.storage();
    sql.exec("BEGIN IMMEDIATE");
    try {
      const price = checkoutPrice(sql, principal, planId, claimDiscount, options);
      let existing = this.active(principal);
      if (options.replaceIntentId) {
        if (existing?.id !== options.replaceIntentId)
          throw new PaymentError(
            "Klaim berubah. Muat ulang pilihan paket sebelum mengonfirmasi.",
            409,
          );
        this.markCancelled(existing.id);
        existing = null;
      }
      if (existing) {
        if (existing.planId !== planId || existing.discountAmount !== price.discountAmount)
          throw new PaymentError(
            "Masih ada pesanan paket aktif. Lanjutkan pesanan tersebut dahulu.",
            409,
          );
        sql.exec("COMMIT");
        return { intent: existing, isNew: false };
      }
      if (principal.kind === "owner" && claimDiscount && this.hasPurchased(principal.owner))
        throw new PaymentError("Diskon pengguna baru hanya untuk pembelian paket pertama.", 409);
      const identity = principal.kind === "owner" ? principal.owner : `guest:${principal.hash}`;
      if (principal.kind === "guest") {
        const budget = sql
          .prepare(
            "SELECT SUM(created_at>?) AS minute, COUNT(*) AS hour FROM invoices WHERE owner LIKE 'guest:%' AND purpose='subscription' AND environment=? AND created_at>?",
          )
          .get(Date.now() - 60000, this.environment, Date.now() - 3600000);
        if (Number(budget?.["minute"]) >= 20 || Number(budget?.["hour"]) >= 100)
          throw new PaymentError(
            "Batas reservasi pengunjung tercapai. Masuk dengan Google atau coba lagi nanti.",
            429,
          );
      }
      const recent = sql
        .prepare(
          "SELECT count(*) AS n FROM invoices WHERE owner=? AND purpose='subscription' AND created_at>?",
        )
        .get(identity, Date.now() - 3600000);
      if (Number(recent?.["n"]) >= 5)
        throw new PaymentError("Terlalu banyak reservasi. Coba lagi nanti.", 429);
      const id = insertIntent(this.db, this.environment, principal, planId, price, options);
      const intent = this.get(id)!;
      sql.exec("COMMIT");
      return { intent, isNew: true };
    } catch (error) {
      sql.exec("ROLLBACK");
      throw error;
    }
  }

  markCancelled(id: string) {
    const intent = this.get(id);
    if (!intent) throw new PaymentError("Pesanan tidak ditemukan", 404);
    const row = this.db.getByOrderId(intent.orderId)!;
    if (row.status === "paid")
      throw new PaymentError("Pembayaran sudah diterima; pesanan tidak dapat dibatalkan.", 409);
    this.db
      .storage()
      .prepare(
        "UPDATE invoices SET cancelled_at=COALESCE(cancelled_at,?),updated_at=? WHERE order_id=? AND status!='paid'",
      )
      .run(new Date().toISOString(), Date.now(), intent.orderId);
  }

  bind(id: string, guestHash: string, owner: string): CheckoutIntent {
    const sql = this.db.storage();
    sql.exec("BEGIN IMMEDIATE");
    try {
      const intent = this.get(id);
      if (
        !intent ||
        (intent.owner !== null && intent.owner !== owner) ||
        (intent.owner === null && intent.guestHash !== guestHash)
      )
        throw new PaymentError("Pesanan tidak ditemukan", 404);
      if (intent.owner === owner) {
        sql.exec("COMMIT");
        return intent;
      }
      const unpaid = this.db.getByOrderId(intent.orderId)?.status !== "paid";
      if (unpaid && !intent.cancelledAt && intent.discountAmount > 0 && this.hasPurchased(owner))
        throw new PaymentError("Akun tidak memenuhi syarat diskon pengguna baru.", 409);
      if (!intent.cancelledAt && this.db.getByOrderId(intent.orderId)?.status !== "paid")
        checkoutPrice(sql, { kind: "owner", owner }, intent.planId, intent.discountAmount > 0, {
          renewal: intent.renewal,
        });
      if (unpaid && !intent.cancelledAt && this.active({ kind: "owner", owner }))
        throw new PaymentError("Akun sudah memiliki pesanan aktif.", 409);
      sql
        .prepare("UPDATE checkout_intents SET owner=?,guest_hash=NULL WHERE id=? AND owner IS NULL")
        .run(owner, id);
      sql.prepare("UPDATE invoices SET owner=? WHERE order_id=?").run(owner, intent.orderId);
      grantSettledInvoice(sql, this.db.getByOrderId(intent.orderId)!);
      sql.exec("COMMIT");
      return this.get(id)!;
    } catch (error) {
      sql.exec("ROLLBACK");
      throw error;
    }
  }
}
