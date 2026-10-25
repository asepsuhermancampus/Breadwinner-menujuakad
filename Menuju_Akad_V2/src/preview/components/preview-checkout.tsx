"use client";

import { CheckoutServicesScreen } from "@/features/checkout-services/components/checkout-services-screen";
import { InvoiceReceiptView } from "@/features/checkout-services/components/invoice-receipt-view";

export function PreviewCheckoutServices() {
  return <CheckoutServicesScreen />;
}

export function PreviewOrderReceipt({ orderToken }: { orderToken?: string | undefined } = {}) {
  return <InvoiceReceiptView orderId={orderToken} />;
}
