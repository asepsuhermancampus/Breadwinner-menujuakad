import { expect, test } from "@playwright/test";

test.describe("A05 — Checkout Services Full vs DP & Receipt Isolation", () => {
  test("full payment 35m persists through status, receipt, and reload", async ({ page }) => {
    await page.goto("/checkout/services");

    // Step 1: Details
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: /Lanjut ke Peninjauan/i }).click();

    // Step 2: Contract
    await page.getByRole("button", { name: /Terapkan Pengganti/i }).click();
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: /Setujui Kontrak/i }).click();

    // Step 3: Select Bayar Penuh (100%)
    await page.getByText("Bayar Penuh (100%)").click();
    await expect(page.getByText("Rp 35.000.000").first()).toBeVisible();
    await page.getByRole("button", { name: /Bayar Sekarang/i }).click();

    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    // Step 4: Status view reflects full payment
    await expect(page.getByText("Status Transaksi yang Tidak Menebak")).toBeVisible();
    await expect(page.getByText(/Pelunasan penuh berhasil dicatat/i)).toBeVisible();
    await expect(page.getByText("Rp 35.000.000").first()).toBeVisible();

    // Navigate to receipt
    await page.getByRole("link", { name: /Buka Invoice & Receipt/i }).click();
    await expect(page.getByText(/BUKTI PELUNASAN KONTRAK/i)).toBeVisible();
    await expect(page.getByText("Pelunasan Terverifikasi")).toBeVisible();
    await expect(page.getByText("Total Diterima (Bayar Penuh)")).toBeVisible();
    await expect(page.getByText(/Status Pelunasan Kontrak \(Sisa Rp 0\)/i)).toBeVisible();
    await expect(page.getByText(/Tidak Ada Tagihan Termin Tersisa/i)).toBeVisible();
    await expect(page.getByText(/Provider:\s*KlikQRIS/i)).toBeVisible();

    // Persists after page reload without hydration crash
    await page.reload();
    await expect(page.getByText(/BUKTI PELUNASAN KONTRAK/i)).toBeVisible();
    await expect(page.getByText("Total Diterima (Bayar Penuh)")).toBeVisible();
    const hydrationErrors = consoleErrors.filter((msg) =>
      /hydration|hydrating|mismatch|did not match/i.test(msg),
    );
    expect(hydrationErrors).toEqual([]);
  });

  test("DP 30% payment defaults properly to 10.5m with installment schedule", async ({ page }) => {
    await page.goto("/checkout/services");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: /Lanjut ke Peninjauan/i }).click();
    await page.getByRole("button", { name: /Terapkan Pengganti/i }).click();
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: /Setujui Kontrak/i }).click();

    // Leave DP 30% selected
    await page.getByRole("button", { name: /Bayar Sekarang/i }).click();
    await expect(page.getByText(/DP berhasil dicatat/i)).toBeVisible();
    await expect(page.getByText("Rp 10.500.000").first()).toBeVisible();

    // Receipt reflects DP
    await page.goto("/orders/ORD-SIM-204");
    await expect(page.getByText(/BUKTI PEMBAYARAN UANG MUKA \(DP 30%\)/i)).toBeVisible();
    await expect(page.getByText("Total Diterima (DP 30%)")).toBeVisible();
    await expect(page.getByText("Termin 2 · 40%")).toBeVisible();
  });

  test("corrupted session storage safely falls back without crash", async ({ page }) => {
    await page.goto("/orders/ORD-SIM-204");
    // Inject empty JSON object into session storage
    await page.evaluate(() => {
      sessionStorage.setItem("menuju_akad_tx_ORD-SIM-204", "{}");
    });
    await page.reload();

    // Must not crash, should safely display valid fallback receipt
    await expect(page.getByRole("heading", { name: /INV-SIM-204-01/i })).toBeVisible();
    await expect(page.getByText("RCPT-SIM-204-01")).toBeVisible();
    await expect(page.getByText("Aru MUA · Akad")).toBeVisible();
  });

  test("order isolation prevents data leakage across different order IDs", async ({ page }) => {
    await page.goto("/orders/ORD-SIM-204");
    // Seed foreign order data into sessionStorage
    await page.evaluate(() => {
      sessionStorage.setItem(
        "menuju_akad_tx_ORD-OTHER-888",
        JSON.stringify({
          orderId: "ORD-OTHER-888",
          quoteId: "Q-888",
          scheme: "full",
          gateway: "klikqris",
          totalAmountIdr: 99000000,
          paidAmountIdr: 99000000,
          remainingAmountIdr: 0,
          status: "verified",
          invoiceNumber: "INV-OTHER-01",
          receiptNumber: "RCPT-OTHER-01",
          items: [
            { id: "x", label: "Other Item", totalPriceIdr: 99000000, paidAmountIdr: 99000000 },
          ],
        }),
      );
    });

    // Visiting ORD-SIM-204 must NOT read ORD-OTHER-888 data
    await page.goto("/orders/ORD-SIM-204");
    await expect(page.getByText("INV-SIM-204-01")).toBeVisible();
    await expect(page.getByText("Other Item")).not.toBeVisible();
  });
});
