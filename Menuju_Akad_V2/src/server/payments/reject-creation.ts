import type { PaymentDatabase } from "./db";
import type { CheckoutIntent } from "./intent-types";

// Only a definitive create rejection may release this reservation. A timeout or
// failed status lookup remains unknown because the customer might still pay it.
export function rejectCreation(
  db: PaymentDatabase,
  intent: CheckoutIntent,
  previous?: CheckoutIntent | null,
) {
  const sql = db.storage();
  sql.exec("BEGIN IMMEDIATE");
  try {
    const row = db.getByOrderId(intent.orderId)!;
    if (row.status === "creating" && row.total_amount === null) {
      sql
        .prepare(
          "UPDATE invoices SET cancelled_at=?,updated_at=? WHERE order_id=? AND status='creating'",
        )
        .run(new Date().toISOString(), Date.now(), intent.orderId);
      if (
        previous &&
        previous.owner === intent.owner &&
        previous.guestHash === intent.guestHash &&
        !previous.cancelledAt
      ) {
        const old = db.getByOrderId(previous.orderId);
        const active = sql
          .prepare(
            "SELECT 1 FROM invoices WHERE owner=? AND environment=? AND purpose='subscription' AND cancelled_at IS NULL AND status IN ('creating','pending','unknown')",
          )
          .get(row.owner, row.environment);
        if (
          !active &&
          old?.status === "pending" &&
          old.expires_at &&
          Date.parse(old.expires_at) > Date.now()
        ) {
          sql
            .prepare(
              "UPDATE invoices SET cancelled_at=NULL,updated_at=? WHERE order_id=? AND status='pending'",
            )
            .run(Date.now(), previous.orderId);
        }
      }
    }
    sql.exec("COMMIT");
  } catch (error) {
    sql.exec("ROLLBACK");
    throw error;
  }
}
