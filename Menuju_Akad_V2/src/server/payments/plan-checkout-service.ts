import { planInvoice } from "./plan-invoice";
import "server-only";
import type { PaidPlanId } from "@/features/plans/domain/catalog";
import type { PlanQuote } from "@/features/payments/checkout-types";
import type { PaymentDatabase } from "./db";
import type { KlikQRISClient } from "./client";
import { IntentRepository } from "./intent-repository";
import type { CheckoutPrincipal, PaymentEnvironment, CheckoutIntent } from "./intent-types";
import { PaymentError } from "./errors";
import { ProviderAmountRejection } from "./provider-rejection";
import { rejectCreation } from "./reject-creation";
import { validateProviderMatch, providerUpdate } from "./invoice-validation";
import { isWithinOriginalPrice } from "@/features/payments/domain/payment-pricing";
import { type ReserveOptions } from "./checkout-price";
import { purchaseOffer } from "@/server/subscriptions/purchase-offer";
export class PlanCheckoutService {
  readonly intents: IntentRepository;
  constructor(
    private readonly db: PaymentDatabase,
    private readonly client: KlikQRISClient,
    environment: PaymentEnvironment,
    private readonly merchantId: string,
    private readonly callbackUrl?: string,
  ) {
    this.intents = new IntentRepository(db, environment);
  }
  async reserve(
    principal: CheckoutPrincipal,
    planId: PaidPlanId,
    claimDiscount: boolean,
    options: ReserveOptions = {},
  ): Promise<PlanQuote> {
    const active = this.intents.active(principal);
    if (options.replaceIntentId) {
      if (active?.id !== options.replaceIntentId)
        throw new PaymentError("Klaim berubah. Muat ulang pilihan paket.", 409);
      await this.verifyUnpaid(active);
    } else if (active) await this.recover(active);
    const { intent, isNew } = this.intents.reserve(principal, planId, claimDiscount, options);
    if (isNew) {
      const row = this.db.getByOrderId(intent.orderId)!;
      try {
        const result = await this.client.createQRIS({
          order_id: intent.orderId,
          amount: intent.amount,
          merchant_id: this.merchantId,
          keterangan: `Paket ${planId} Menuju Akad`,
          ...(this.callbackUrl ? { callback_url: this.callbackUrl } : {}),
        });
        validateProviderMatch(row, result);
        this.db.updateAfterCreate(intent.orderId, {
          ...providerUpdate(row, result),
          ...(result.status === "paid" ? { status: "unknown", paidAt: null } : {}),
        });
        if (result.status === "paid") await this.reconcile(intent);
      } catch (error) {
        if (error instanceof ProviderAmountRejection) {
          rejectCreation(this.db, intent, options.replaceIntentId ? active : null);
          throw error;
        }
        this.db.updateStatus(intent.orderId, "unknown");
        if (error instanceof PaymentError) throw error;
        throw new PaymentError(
          "Pembuatan tagihan belum terkonfirmasi. Klik klaim kembali untuk memulihkan pesanan yang sama.",
          502,
        );
      }
    } else {
      const row = this.db.getByOrderId(intent.orderId)!;
      if (
        row.status === "unknown" ||
        (row.status === "creating" && Date.now() - row.created_at > 15000)
      )
        await this.reconcile(intent);
    }
    return this.view(intent);
  }

  async quote(principal: CheckoutPrincipal, id: string): Promise<PlanQuote> {
    const intent = this.requireIntent(principal, id);
    await this.recover(intent);
    if (principal.kind === "owner") planInvoice(this.db, intent, principal.owner, false);
    return this.view(intent, true);
  }

  private async recover(intent: CheckoutIntent) {
    if (intent.cancelledAt) return;
    const row = this.db.getByOrderId(intent.orderId)!;
    if (
      (row.status === "pending" && row.expires_at && Date.parse(row.expires_at) <= Date.now()) ||
      row.status === "unknown" ||
      (row.status === "creating" && Date.now() - row.created_at > 15000)
    )
      await this.reconcile(intent);
  }

  offer(principal: CheckoutPrincipal | null) {
    return principal?.kind === "owner" ? purchaseOffer(this.db.storage(), principal.owner) : null;
  }

  async cancel(principal: CheckoutPrincipal, id: string) {
    const intent = this.requireIntent(principal, id);
    if (!intent.cancelledAt) await this.verifyUnpaid(intent);
    this.intents.markCancelled(id);
    return this.view(this.intents.get(id)!);
  }

  private async verifyUnpaid(intent: CheckoutIntent) {
    const row = this.db.getByOrderId(intent.orderId)!;
    if (row.status === "creating" && Date.now() - row.created_at < 15000)
      throw new PaymentError(
        "Pesanan sedang dibuat. Tunggu sebelum membatalkan atau berpindah.",
        409,
      );
    if (row.status !== "paid") await this.reconcile(intent);
    if (this.db.getByOrderId(intent.orderId)!.status === "paid")
      throw new PaymentError("Pembayaran sudah diterima; pesanan tidak dapat dibatalkan.", 409);
  }

  adopt(id: string, guestHash: string, owner: string) {
    return this.intents.bind(id, guestHash, owner);
  }

  invoice(owner: string, id: string) {
    return planInvoice(this.db, this.requireIntent({ kind: "owner", owner }, id), owner);
  }

  private requireIntent(principal: CheckoutPrincipal, id: string): CheckoutIntent {
    const intent = this.intents.get(id);
    if (
      !intent ||
      (principal.kind === "owner"
        ? intent.owner !== principal.owner
        : intent.owner !== null || intent.guestHash !== principal.hash)
    )
      throw new PaymentError("Pesanan tidak ditemukan", 404);
    return intent;
  }

  private async reconcile(intent: CheckoutIntent) {
    const row = this.db.getByOrderId(intent.orderId)!;
    const result = await this.client.getStatus(intent.orderId);
    validateProviderMatch(row, result);
    this.db.updateFromStatusCheck(intent.orderId, providerUpdate(row, result));
  }

  private view(intent: CheckoutIntent, allowBlocked = false): PlanQuote {
    const row = this.db.getByOrderId(intent.orderId)!;
    if (
      !allowBlocked &&
      !row.cancelled_at &&
      row.total_amount !== null &&
      !isWithinOriginalPrice(row.amount, row.original_amount, row.total_amount)
    )
      throw new PaymentError("Total resmi melebihi harga awal. Pembayaran tidak dilanjutkan.", 409);
    return {
      intentId: intent.id,
      planId: intent.planId,
      originalAmount: intent.originalAmount,
      discountAmount: intent.discountAmount,
      amount: intent.amount,
      totalAmount: row.total_amount,
      uniqueAmount: row.total_amount === null ? null : row.total_amount - row.amount,
      status: row.status,
      expiresAt: row.expires_at,
      eligibility: intent.owner ? "verified" : "requires-login",
      cancelledAt: row.cancelled_at,
      upgradeCredit: intent.upgradeCredit,
      upgradeValidUntil: intent.creditValidUntil,
      ...(row.total_amount !== null &&
      !isWithinOriginalPrice(row.amount, row.original_amount, row.total_amount)
        ? { blockedReason: "Total resmi melebihi harga paket. Kelola atau batalkan pesanan ini." }
        : {}),
    };
  }
}
