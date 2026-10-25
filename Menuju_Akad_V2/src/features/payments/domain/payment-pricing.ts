export const NEW_USER_DISCOUNT_PERCENT = 5;
export const QRIS_TEST_PRICE = 5000;

export function calculatePaymentPrice(originalAmount: number, claimDiscount: boolean) {
  if (!Number.isSafeInteger(originalAmount) || originalAmount <= 0) {
    throw new Error("Harga harus berupa rupiah bulat positif.");
  }
  // Divide first to avoid multiplying large integer amounts past Number.MAX_SAFE_INTEGER.
  const discountAmount = claimDiscount ? Math.floor(originalAmount / 20) : 0;
  return { originalAmount, discountAmount, amount: originalAmount - discountAmount };
}

export function isWithinOriginalPrice(
  amount: number,
  originalAmount: number,
  total: number | null,
) {
  return (
    total !== null && Number.isSafeInteger(total) && total >= amount && total <= originalAmount
  );
}
