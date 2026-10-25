import { test, expect } from "@playwright/test";

test("claim updates paid card price without navigation or QR", async ({ page }) => {
  await page.route("**/api/payments/plans**", async (route) => {
    if (route.request().method() === "GET")
      return route.fulfill({ json: { quote: null, authenticated: true } });
    const body = route.request().postDataJSON() as { planId: string };
    const originalAmount = body.planId === "premium" ? 149000 : 399000;
    const amount = originalAmount * 0.95;
    return route.fulfill({
      json: {
        quote: {
          intentId: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
          planId: body.planId,
          originalAmount,
          discountAmount: originalAmount - amount,
          amount,
          uniqueAmount: 51,
          totalAmount: amount + 51,
          status: "pending",
          expiresAt: "2030-01-01",
          eligibility: "requires-login",
        },
      },
    });
  });
  await page.goto("/#paket");
  const premium = page.getByTestId("plan-premium"),
    free = page.getByTestId("plan-free");
  await expect(free.getByRole("button", { name: /klaim/i })).toHaveCount(0);
  await premium.getByRole("button", { name: /klaim diskon/i }).click();
  await expect(premium.getByTestId("plan-total")).toHaveText(/141[.\s]601/);
  await expect(page).toHaveURL(/\/#paket$/);
  await expect(page.getByAltText("Kode QRIS Pembayaran")).toHaveCount(0);
  const lifetime = page.getByTestId("plan-lifetime");
  await lifetime.getByRole("button", { name: /klaim diskon/i }).click();
  const change = page.getByRole("dialog", { name: "Perubahan klaim diskon paket" });
  await expect(change).toBeVisible();
  await change.getByRole("button", { name: "Tetap di paket sebelumnya" }).click();
  await expect(premium.getByTestId("plan-total")).toHaveText(/141[.\s]601/);
  await lifetime.getByRole("button", { name: /klaim diskon/i }).click();
  await change.getByRole("button", { name: "Konfirmasi perubahan" }).click();
  await expect(lifetime.getByTestId("plan-total")).toHaveText(/379[.\s]101/);
  await expect(premium.getByTestId("plan-total")).toHaveText(/149[.\s]000/);
  await premium.getByRole("button", { name: /klaim diskon/i }).click();
  await change.getByRole("button", { name: "Konfirmasi perubahan" }).click();
  await expect(premium.getByTestId("plan-total")).toHaveText(/141[.\s]601/);
  const premiumButton = premium.locator("button").last();
  await premiumButton.hover();
  await premiumButton.evaluate(async (el) => {
    await Promise.all(el.getAnimations().map((animation) => animation.finished));
  });
  const hoverColor = await premiumButton.evaluate((el) => getComputedStyle(el).backgroundColor);
  for (const button of [free.getByRole("link").last(), lifetime.locator("button").last()]) {
    await button.hover();
    await expect
      .poll(() => button.evaluate((el) => getComputedStyle(el).backgroundColor))
      .toBe(hoverColor);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
