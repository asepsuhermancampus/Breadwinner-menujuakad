import nextEnv from "@next/env";
import { encode } from "next-auth/jwt";
import { expect, test } from "@playwright/test";

nextEnv.loadEnvConfig(process.cwd());
test.beforeEach(async ({ context, baseURL }) => {
  const secret = process.env.AUTH_SECRET;
  test.skip(!secret, "Authenticated QRIS browser checks require the local Auth.js secret.");
  if (!secret || !baseURL) return;
  const token = await encode({
    token: {
      sub: "qris-browser-test",
      email: "qris-browser-test@menuju-akad.invalid",
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

test("failed initial lookup blocks creating a payment until retry succeeds", async ({ page }) => {
  let available = false;
  let creates = 0;
  await page.route("**/api/payments/klikqris", async (route) => {
    if (route.request().method() === "POST") creates++;
    await route.fulfill({
      status: available ? 200 : 503,
      contentType: "application/json",
      body: JSON.stringify(available ? { invoice: null } : { error: "Status belum tersedia." }),
    });
  });
  await page.goto("/checkout/qris");
  const create = page.getByRole("button", { name: /Buat tagihan QRIS/i });
  await expect(create).toBeDisabled();
  available = true;
  await page.getByRole("button", { name: "Coba Muat Ulang" }).click();
  await expect(create).toBeEnabled();
  expect(creates).toBe(0);
});

test("uncertain creation restores the reservation without another POST or fabricated total", async ({
  page,
}) => {
  let creates = 0;
  let invoice: Record<string, unknown> | null = null;
  await page.route("**/api/payments/klikqris", async (route) => {
    if (route.request().method() === "POST") {
      creates++;
      invoice = {
        orderId: "MA-BROWSER-UNKNOWN",
        amount: 5000,
        totalAmount: null,
        status: "unknown",
        qrImage: null,
        expiresAt: null,
        paidAt: null,
        environment: "production",
      };
      await route.fulfill({
        status: 502,
        contentType: "application/json",
        body: JSON.stringify({ error: "Gateway tidak menjawab." }),
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ invoice }),
      });
    }
  });
  await page.goto("/checkout/qris");
  const create = page.getByRole("button", { name: /Buat tagihan QRIS/i });
  await expect(create).toBeEnabled();
  await create.click();
  await expect(page.getByText("MA-BROWSER-UNKNOWN", { exact: true })).toBeVisible();
  await expect(page.getByText("Menunggu nominal resmi")).toBeVisible();
  await expect(page.getByRole("img", { name: /QRIS/i })).toHaveCount(0);
  expect(creates).toBe(1);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

for (const totalAmount of [5000, 5093]) {
  test(`offers a QR only for the exact amount: provider total ${totalAmount}`, async ({ page }) => {
    await page.route("**/api/payments/klikqris", (route) =>
      route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          invoice: {
            orderId: "MA-BROWSER-AMOUNT",
            amount: 5000,
            totalAmount,
            status: "pending",
            qrImage:
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a8WQAAAAASUVORK5CYII=",
            expiresAt: null,
            paidAt: null,
            environment: "production",
          },
        }),
      }),
    );
    await page.goto("/checkout/qris");
    await expect(page.getByText("MA-BROWSER-AMOUNT", { exact: true })).toBeVisible();
    await expect(page.getByRole("img", { name: "Kode QRIS Pembayaran" })).toHaveCount(
      totalAmount === 5000 ? 1 : 0,
    );
    if (totalAmount !== 5000) {
      await expect(page.getByText(/Pembayaran dihentikan karena total/)).toBeVisible();
      await page.setViewportSize({ width: 390, height: 844 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
  });
}

test("suppresses overlapping status requests and stops polling after confirmed payment", async ({
  page,
}) => {
  const invoice = {
    orderId: "MA-BROWSER-POLL",
    amount: 5000,
    totalAmount: 5000,
    status: "pending",
    qrImage: null,
    expiresAt: null,
    paidAt: null,
    environment: "production",
  };
  let polls = 0;
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/payments/klikqris", (route) =>
    route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ invoice }),
    }),
  );
  await page.route("**/api/payments/klikqris/MA-BROWSER-POLL*", async (route) => {
    polls++;
    await gate;
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({ invoice: { ...invoice, status: "paid" } }),
    });
  });
  await page.clock.install();
  await page.goto("/checkout/qris");
  await page.clock.runFor(20);
  await expect(page.getByText("MA-BROWSER-POLL", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Cek Status", exact: true }).click();
  await expect.poll(() => polls).toBe(1);
  await page.clock.runFor(10_000);
  expect(polls).toBe(1);
  release();
  await expect(page.getByText("Pembayaran Berhasil Diterima")).toBeVisible();
  await page.clock.runFor(15_000);
  expect(polls).toBe(1);
  await expect(page.getByRole("img", { name: "Kode QRIS Pembayaran" })).toHaveCount(0);
});
