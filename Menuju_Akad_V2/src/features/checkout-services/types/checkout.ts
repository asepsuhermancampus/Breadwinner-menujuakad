export type CheckoutItem = {
  id: string;
  vendorName: string;
  serviceName: string;
  totalPriceIdr: number;
  dpAmountIdr: number;
  status: "approved" | "rejected" | "pending";
  rejectionReason?: string;
  replacementVendor?: {
    name: string;
    serviceName: string;
    priceIdr: number;
    dpAmountIdr: number;
  };
};

export type ContractSnapshot = {
  contractId: string;
  version: string;
  clientNames: string;
  eventDateText: string;
  venueText: string;
  items: CheckoutItem[];
  totalValueIdr: number;
  dpAmountIdr: number;
  installments: Array<{
    termNumber: number;
    percentage: number;
    dueDateText: string;
    amountIdr: number;
  }>;
};

export type PaymentMethodType = "klikqris" | "midtrans" | "manual_preview";

export type PaymentStatusType = "waiting" | "verified" | "failed";

export type DisputeData = {
  itemId: string;
  reason: string;
  amountClaimedIdr: number;
  deadlineText: string;
  fileName?: string;
};
