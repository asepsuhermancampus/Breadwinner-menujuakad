import "server-only";
import type { InvoiceView } from "@/features/payments/types";
import type { ProviderPaymentData } from "./client";
import type { DbInvoice, InvoiceUpdate } from "./db-schema";
import { PaymentError } from "./errors";
import { isValidQrImage, parseIDRAmount, safeCompareSignatures } from "./validator";
import { isWithinOriginalPrice } from "@/features/payments/domain/payment-pricing";

export function toInvoiceView(row: DbInvoice): InvoiceView {
  return {
    orderId: row.order_id,
    amount: row.amount,
    originalAmount: row.original_amount,
    discountAmount: row.discount_amount,
    upgradeCredit: row.upgrade_credit_amount,
    cancelledAt: row.cancelled_at,
    totalAmount: row.total_amount,
    status: row.status,
    qrImage:
      !row.cancelled_at && isWithinOriginalPrice(row.amount, row.original_amount, row.total_amount)
        ? row.qr_image
        : null,
    expiresAt: row.expires_at,
    paidAt: row.paid_at,
    environment: row.environment,
    checkedAt: row.last_checked_at ? new Date(row.last_checked_at).toISOString() : null,
  };
}

export function validateProviderMatch(invoice: DbInvoice, data: ProviderPaymentData): void {
  if (
    data.order_id !== invoice.order_id ||
    data.amount !== invoice.amount ||
    !Number.isSafeInteger(data.total_amount) ||
    data.total_amount < invoice.amount ||
    (invoice.total_amount !== null && data.total_amount !== invoice.total_amount)
  ) {
    throw new PaymentError("Data tagihan dari penyedia tidak sesuai", 502);
  }
  if (
    !data.signature?.trim() ||
    data.signature.length > 1024 ||
    (invoice.signature !== null && !safeCompareSignatures(invoice.signature, data.signature))
  ) {
    throw new PaymentError("Tanda tangan tagihan penyedia tidak sesuai", 502);
  }
}

export function providerUpdate(invoice: DbInvoice, data: ProviderPaymentData): InvoiceUpdate {
  const qrImage = isValidQrImage(data.qris_image) ? data.qris_image : invoice.qr_image;
  return {
    status: data.status === "pending" && !qrImage ? "unknown" : data.status,
    totalAmount: data.total_amount,
    signature: data.signature,
    qrImage,
    expiresAt: data.expired_at ?? invoice.expires_at,
    paidAt: data.status === "paid" ? (data.paid_at ?? invoice.paid_at) : invoice.paid_at,
  };
}

export function validateWebhook(invoice: DbInvoice, body: Record<string, unknown>): void {
  const status = typeof body["status"] === "string" ? body["status"].trim().toUpperCase() : "";
  if (!["PAID", "SUCCESS", "EXPIRED"].includes(status)) {
    throw new PaymentError("Status webhook tidak valid", 400);
  }
  const signature = typeof body["signature"] === "string" ? body["signature"] : "";
  if (
    !invoice.signature ||
    signature.length > 1024 ||
    !safeCompareSignatures(invoice.signature, signature)
  ) {
    throw new PaymentError("Tanda tangan webhook tidak cocok", 400);
  }
  if (
    parseIDRAmount(body["amount"]) !== invoice.amount ||
    parseIDRAmount(body["total_amount"]) !== invoice.total_amount
  ) {
    throw new PaymentError("Nominal webhook tidak sesuai", 400);
  }
}
