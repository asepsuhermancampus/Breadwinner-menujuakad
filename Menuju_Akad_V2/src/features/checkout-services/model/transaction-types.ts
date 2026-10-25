import type { PaymentStatusType } from "../types/checkout";

export type PaymentScheme = "dp" | "full";

export type ReceiptItem = {
  id: string;
  label: string;
  totalPriceIdr: number;
  paidAmountIdr: number;
};

export type TransactionSnapshot = {
  orderId: string;
  quoteId: string;
  scheme: PaymentScheme;
  gateway: string;
  totalAmountIdr: number;
  paidAmountIdr: number;
  remainingAmountIdr: number;
  status: PaymentStatusType;
  invoiceNumber: string;
  receiptNumber: string;
  items: ReceiptItem[];
  createdAt: string;
};
