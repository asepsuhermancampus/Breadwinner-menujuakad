import nextEnv from "@next/env";
import { encode } from "next-auth/jwt";
import { expect, test } from "@playwright/test";

nextEnv.loadEnvConfig(process.cwd());
test.beforeEach(async ({ context, baseURL }) => {
  const secret = process.env.AUTH_SECRET;
  test.skip(!secret, "Local Auth.js secret is required.");
  if (!secret || !baseURL) return;
  const token = await encode({
    token: {
      sub: "discount-test",
      email: "discount-test@menuju-akad.invalid",
      emailVerified: true,
    },
    secret,
    salt: "authjs.session-token",
    maxAge: 600,
  });
  await context.addCookies([
    { name: "authjs.session-token", value: token, url: baseURL, httpOnly: true },
  ]);
});
const discountOffer = {
  eligible: true,
  percent: 5,
  originalAmount: 5000,
  discountAmount: 250,
  amount: 4750,
};
const png =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a8WQAAAAASUVORK5CYII=";

for (const total of [4843, 5000, 5001]) {
  test(`claims once, restores the same prices and enforces original ceiling at total ${total}`, async ({
    page,
  }) => {
    let creates = 0;
    let invoice: Record<string, unknown> | null = null;
    await page.route("**/api/payments/klikqris", async (route) => {
      if (route.request().method() === "POST") {
        expect(route.request().postDataJSON()).toEqual({ claimNewUserDiscount: true });
        creates++;
        invoice = {
          orderId: "MA-DISCOUNT-BROWSER",
          amount: 4750,
          originalAmount: 5000,
          discountAmount: 250,
          totalAmount: total,
          status: "pending",
          qrImage: png,
          expiresAt: null,
          paidAt: null,
          environment: "production",
        };
      }
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ invoice, discountOffer }),
      });
    });
    await page.goto("/checkout/qris");
    const claim = page.getByRole("button", { name: "Klaim diskon pengguna baru", exact: true });
    await expect(claim).toBeEnabled();
    await claim.click();
    await expect(page.getByText("MA-DISCOUNT-BROWSER", { exact: true })).toBeVisible();
    await expect(claim).toHaveCount(0);
    await expect(page.getByText("Kode unik:", { exact: true })).toBeVisible();
    await expect(page.getByRole("img", { name: "Kode QRIS Pembayaran" })).toHaveCount(
      total <= 5000 ? 1 : 0,
    );
    if (total > 5000)
      await expect(
        page.getByText(/Total akhir termasuk kode unik tidak boleh melebihi/),
      ).toBeVisible();
    await page.reload();
    await expect(page.getByText("MA-DISCOUNT-BROWSER", { exact: true })).toBeVisible();
    await expect(page.getByText(/−Rp\s*250/)).toBeVisible();
    expect(creates).toBe(1);
    await page.setViewportSize({ width: 390, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
}

test("does not offer a new-user claim to an ineligible account", async ({ page }) => {
  await page.route("**/api/payments/klikqris", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ invoice: null, discountOffer: { ...discountOffer, eligible: false } }),
    }),
  );
  await page.goto("/checkout/qris");
  await expect(page.getByText("Belum ada tagihan aktif.")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Klaim diskon pengguna baru", exact: true }),
  ).toHaveCount(0);
});
