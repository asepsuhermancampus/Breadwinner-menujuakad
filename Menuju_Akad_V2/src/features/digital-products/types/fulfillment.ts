export type PaymentStatus = "pending" | "verified" | "delivery_failed";

export type DigitalOrderItem = {
  orderId: string;
  productName: string;
  amount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  statusBadge: string;
  statusTitle: string;
  statusExplanation: string;
  entitlementId?: string;
  deliveryMethod: "whatsapp" | "email";
  accessUrl?: string;
  receiptNumber: string;
  isExpired?: boolean;
};
