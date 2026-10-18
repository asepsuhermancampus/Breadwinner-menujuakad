"use client";

import { CheckoutServicesScreen } from "@/features/checkout-services/components/checkout-services-screen";
import { InvoiceReceiptView } from "@/features/checkout-services/components/invoice-receipt-view";

export function PreviewCheckoutServices() {
  return <CheckoutServicesScreen />;
}

export function PreviewOrderReceipt({ orderToken: _orderToken }: { orderToken?: string } = {}) {
  return <InvoiceReceiptView />;
}
