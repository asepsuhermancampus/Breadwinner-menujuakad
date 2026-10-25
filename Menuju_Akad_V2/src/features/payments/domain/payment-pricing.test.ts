import { expect, it } from "vitest";
import { calculatePaymentPrice, isWithinOriginalPrice } from "./payment-pricing";

it("discounts the example Rp29,000 by 5% before adding the actual unique amount", () => {
  const price = calculatePaymentPrice(29000, true);
  expect(price).toEqual({ originalAmount: 29000, discountAmount: 1450, amount: 27550 });
  expect(isWithinOriginalPrice(price.amount, price.originalAmount, 27643)).toBe(true);
  expect(isWithinOriginalPrice(price.amount, price.originalAmount, 29000)).toBe(true);
  expect(isWithinOriginalPrice(price.amount, price.originalAmount, 29001)).toBe(false);
});
it("rounds discounts down to whole rupiah without exceeding 5%", () => {
  expect(calculatePaymentPrice(29019, true)).toEqual({
    originalAmount: 29019,
    discountAmount: 1450,
    amount: 27569,
  });
  expect(calculatePaymentPrice(29000, false)).toEqual({
    originalAmount: 29000,
    discountAmount: 0,
    amount: 29000,
  });
});
it.each([0, -1, 12.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])(
  "rejects invalid original prices %s",
  (amount) => {
    expect(() => calculatePaymentPrice(amount, true)).toThrow();
  },
);
it.each([null, 27499, 29001, 27550.5, NaN, Infinity])(
  "does not offer a QR for an invalid final total %s",
  (total) => {
    expect(isWithinOriginalPrice(27550, 29000, total)).toBe(false);
  },
);
