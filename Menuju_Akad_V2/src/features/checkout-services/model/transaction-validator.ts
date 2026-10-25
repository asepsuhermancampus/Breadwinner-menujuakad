import type { ReceiptItem, TransactionSnapshot } from "./transaction-types";

function isSafeMoney(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

export function validateTransactionSnapshot(
  data: unknown,
  expectedOrderId: string,
): TransactionSnapshot | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;

  if (typeof d["orderId"] !== "string" || d["orderId"] !== expectedOrderId) {
    return null;
  }
  if (typeof d["quoteId"] !== "string" || d["quoteId"].trim().length === 0) {
    return null;
  }

  const scheme = d["scheme"];
  if (scheme !== "dp" && scheme !== "full") return null;

  const gateway = d["gateway"];
  if (gateway !== "klikqris" && gateway !== "midtrans") return null;

  const total = d["totalAmountIdr"];
  const paid = d["paidAmountIdr"];
  const remaining = d["remainingAmountIdr"];

  if (!isSafeMoney(total) || total <= 0) return null;
  if (!isSafeMoney(paid) || !isSafeMoney(remaining)) return null;
  if (paid + remaining !== total) return null;

  if (scheme === "full") {
    if (paid !== total || remaining !== 0) return null;
  } else {
    if (paid !== Math.round(total * 0.3) || remaining !== total - paid) {
      return null;
    }
  }

  const status = d["status"];
  if (status !== "waiting" && status !== "verified" && status !== "failed") {
    return null;
  }

  if (typeof d["invoiceNumber"] !== "string" || d["invoiceNumber"].trim().length === 0) {
    return null;
  }
  if (typeof d["receiptNumber"] !== "string" || d["receiptNumber"].trim().length === 0) {
    return null;
  }

  if (!Array.isArray(d["items"]) || d["items"].length === 0) return null;

  const validatedItems: ReceiptItem[] = [];
  let itemTotalSum = 0;
  let itemPaidSum = 0;

  for (const item of d["items"]) {
    if (!item || typeof item !== "object") return null;
    const it = item as Record<string, unknown>;
    const id = it["id"];
    const label = it["label"];
    const itemTotal = it["totalPriceIdr"];
    const itemPaid = it["paidAmountIdr"];

    if (typeof id !== "string" || id.trim().length === 0) return null;
    if (typeof label !== "string" || label.trim().length === 0) return null;
    if (!isSafeMoney(itemTotal) || !isSafeMoney(itemPaid)) return null;
    if (itemPaid > itemTotal) return null;

    itemTotalSum += itemTotal;
    itemPaidSum += itemPaid;
    validatedItems.push({ id, label, totalPriceIdr: itemTotal, paidAmountIdr: itemPaid });
  }

  if (itemTotalSum !== total || itemPaidSum !== paid) {
    return null;
  }

  return {
    orderId: expectedOrderId,
    quoteId: d["quoteId"],
    scheme,
    gateway,
    totalAmountIdr: total,
    paidAmountIdr: paid,
    remainingAmountIdr: remaining,
    status,
    invoiceNumber: d["invoiceNumber"],
    receiptNumber: d["receiptNumber"],
    items: validatedItems,
    createdAt: typeof d["createdAt"] === "string" ? d["createdAt"] : new Date().toISOString(),
  };
}
