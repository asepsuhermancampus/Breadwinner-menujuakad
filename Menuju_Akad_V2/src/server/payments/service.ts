import "server-only";
import { randomUUID } from "node:crypto";
import type { InvoiceView } from "@/features/payments/types";
import { PaymentError } from "./errors";
import type { PaymentDatabase } from "./db";
import type { KlikQRISClient } from "./client";
import { isValidQrImage } from "./validator";
import {
  calculatePaymentPrice,
  QRIS_TEST_PRICE,
  NEW_USER_DISCOUNT_PERCENT,
} from "@/features/payments/domain/payment-pricing";
import {
  toInvoiceView,
  validateProviderMatch,
  providerUpdate,
  validateWebhook,
} from "./invoice-validation";

export class PaymentService {
  constructor(
    private readonly db: PaymentDatabase,
    private readonly client: KlikQRISClient,
    private readonly environment: "production" | "sandbox",
    private readonly merchantId: string,
    private readonly callbackUrl?: string,
  ) {}

  async create(owner: string, claimDiscount = false): Promise<InvoiceView> {
    const cleanOwner = owner.trim();
    if (!cleanOwner) throw new PaymentError("Pemilik pembayaran tidak valid", 400);
    const orderId = `MA-${Date.now()}-${randomUUID().slice(0, 8)}`;
    const price = calculatePaymentPrice(QRIS_TEST_PRICE, claimDiscount);
    const { isNew, invoice } = this.db.reserveInvoice(
      cleanOwner,
      this.environment,
      orderId,
      price.amount,
      price.originalAmount,
    );
    if (!isNew) return toInvoiceView(invoice);
    try {
      const result = await this.client.createQRIS({
        order_id: orderId,
        amount: invoice.amount,
        merchant_id: this.merchantId,
        keterangan: "Uji integrasi QRIS Menuju Akad",
        ...(this.callbackUrl ? { callback_url: this.callbackUrl } : {}),
      });
      validateProviderMatch(invoice, result);
      if (result.status === "pending" && !isValidQrImage(result.qris_image)) {
        throw new PaymentError("Kode QRIS belum tersedia; periksa status tagihan ini", 502);
      }
      if (result.status === "paid") {
        const reserved = this.db.updateAfterCreate(orderId, {
          ...providerUpdate(invoice, result),
          status: "unknown",
          paidAt: null,
        });
        const verified = await this.client.getStatus(orderId);
        validateProviderMatch(reserved, verified);
        return toInvoiceView(
          this.db.updateFromStatusCheck(orderId, providerUpdate(reserved, verified)),
        );
      }
      return toInvoiceView(this.db.updateAfterCreate(orderId, providerUpdate(invoice, result)));
    } catch (error) {
      this.db.updateStatus(orderId, "unknown");
      if (error instanceof PaymentError) throw error;
      throw new PaymentError("Belum dapat memastikan pembuatan QRIS. Periksa status tagihan.", 502);
    }
  }

  discountOffer(owner: string) {
    return {
      ...calculatePaymentPrice(QRIS_TEST_PRICE, true),
      percent: NEW_USER_DISCOUNT_PERCENT,
      eligible: Boolean(owner.trim()) && !this.db.hasPaidInvoice(owner.trim(), this.environment),
    };
  }

  current(owner: string): InvoiceView | null {
    const row = owner.trim() ? this.db.getLatestByOwner(owner.trim(), this.environment) : null;
    return row ? toInvoiceView(row) : null;
  }

  async refresh(owner: string, orderId: string, options = { manual: false }): Promise<InvoiceView> {
    const invoice = this.db.getByOrderId(orderId);
    if (!invoice || invoice.owner !== owner.trim() || invoice.environment !== this.environment) {
      throw new PaymentError("Invoice tidak ditemukan", 404);
    }
    if (
      invoice.status === "paid" ||
      (invoice.status === "expired" && !options.manual) ||
      Date.now() - invoice.last_checked_at < 3000
    )
      return toInvoiceView(invoice);
    const now = Date.now();
    this.db.updateLastChecked(orderId, now);
    const result = await this.client.getStatus(orderId);
    validateProviderMatch(invoice, result);
    return toInvoiceView(
      this.db.updateFromStatusCheck(orderId, {
        ...providerUpdate(invoice, result),
        lastCheckedAt: now,
      }),
    );
  }

  async webhook(payload: unknown): Promise<void> {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw new PaymentError("Payload webhook harus berupa objek", 400);
    }
    const body = payload as Record<string, unknown>;
    const orderId = typeof body["order_id"] === "string" ? body["order_id"].trim() : "";
    if (!/^[A-Za-z0-9_-]{1,100}$/.test(orderId))
      throw new PaymentError("ID webhook tidak valid", 400);
    const invoice = this.db.getByOrderId(orderId);
    if (!invoice || invoice.environment !== this.environment) {
      throw new PaymentError("Invoice webhook tidak ditemukan", 404);
    }
    validateWebhook(invoice, body);
    if (invoice.status === "paid") return;
    const result = await this.client.getStatus(orderId);
    validateProviderMatch(invoice, result);
    // An authentic callback is a notification; only the gateway query settles the invoice.
    if (result.status === "pending") {
      throw new PaymentError("Status penyedia belum terkonfirmasi; ulangi webhook", 503);
    }
    this.db.updateFromStatusCheck(orderId, {
      ...providerUpdate(invoice, result),
      lastCheckedAt: Date.now(),
    });
  }
}
