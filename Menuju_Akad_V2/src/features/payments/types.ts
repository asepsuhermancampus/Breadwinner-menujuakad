export type InvoiceStatus = "creating" | "pending" | "unknown" | "paid" | "expired";

export interface InvoiceView {
  orderId: string;
  amount: number;
  originalAmount?: number;
  discountAmount?: number;
  totalAmount: number | null;
  status: InvoiceStatus;
  qrImage: string | null;
  expiresAt: string | null;
  paidAt: string | null;
  environment: "production" | "sandbox";
  checkedAt?: string | null;
  accessReady?: boolean;
  cancelledAt?: string | null;
  upgradeCredit?: number;
  settlementIssue?: string;
}

export interface DiscountOffer {
  eligible: boolean;
  percent: number;
  originalAmount: number;
  discountAmount: number;
  amount: number;
}

export interface PaymentSnapshot {
  invoice: InvoiceView | null;
  discountOffer?: DiscountOffer;
}
