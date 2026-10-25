import { expect, test } from "@playwright/test";

test.describe("A05 — Unverified Payment Status & Receipt Isolation", () => {
  test("waiting status displays unpaid invoice view and no settled receipt claims", async ({
    page,
  }) => {
    const waitingSnapshot = {
      orderId: "ORD-SIM-204",
      quoteId: "Q-204/v9",
      scheme: "dp",
      gateway: "klikqris",
      totalAmountIdr: 35000000,
      paidAmountIdr: 10500000,
      remainingAmountIdr: 24500000,
      status: "waiting",
      invoiceNumber: "INV-SIM-204-01",
      receiptNumber: "RCPT-SIM-204-01",
      items: [
        { id: "item-1", label: "Aru MUA · Akad", totalPriceIdr: 8000000, paidAmountIdr: 2400000 },
        {
          id: "item-2",
          label: "Lensa Teduh · Foto",
          totalPriceIdr: 15000000,
          paidAmountIdr: 4500000,
        },
        {
          id: "item-3",
          label: "Rona Dekor · Cypress",
          totalPriceIdr: 12000000,
          paidAmountIdr: 3600000,
        },
      ],
      createdAt: "2026-10-25T10:50:00Z",
    };

    await page.addInitScript((snapshot) => {
      sessionStorage.setItem("menuju_akad_tx_ORD-SIM-204", JSON.stringify(snapshot));
    }, waitingSnapshot);

    await page.goto("/orders/ORD-SIM-204");

    // Unpaid invoice indicators
    await expect(page.getByText("Menunggu Verifikasi").first()).toBeVisible();
    await expect(page.getByText("Menunggu Konfirmasi Pembayaran")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Invoice: INV-SIM-204-01" })).toBeVisible();
    await expect(page.getByText("ORD-SIM-204", { exact: true })).toBeVisible();
    await expect(page.getByText("Rp 10.500.000").first()).toBeVisible();

    // Absence of settled / verified receipt claims
    await expect(page.getByText(/BUKTI PELUNASAN/i)).not.toBeVisible();
    await expect(page.getByText(/BUKTI PEMBAYARAN UANG MUKA/i)).not.toBeVisible();
    await expect(page.getByText(/\(SETTLED\)/i)).not.toBeVisible();
    await expect(page.getByText(/Ditahan aman di escrow/i)).not.toBeVisible();
    await expect(page.getByText(/Total Diterima/i)).not.toBeVisible();
    await expect(page.getByText(/Seluruh nilai kontrak telah dibayar penuh/i)).not.toBeVisible();
    await expect(page.getByText(/Tidak Ada Tagihan Termin Tersisa/i)).not.toBeVisible();
    await expect(page.getByText(/Lunas Masuk Rekening Escrow/i)).not.toBeVisible();
  });

  test("failed status displays failed invoice view and no settled receipt claims", async ({
    page,
  }) => {
    const failedSnapshot = {
      orderId: "ORD-SIM-204",
      quoteId: "Q-204/v9",
      scheme: "dp",
      gateway: "klikqris",
      totalAmountIdr: 35000000,
      paidAmountIdr: 10500000,
      remainingAmountIdr: 24500000,
      status: "failed",
      invoiceNumber: "INV-SIM-204-01",
      receiptNumber: "RCPT-SIM-204-01",
      items: [
        { id: "item-1", label: "Aru MUA · Akad", totalPriceIdr: 8000000, paidAmountIdr: 2400000 },
        {
          id: "item-2",
          label: "Lensa Teduh · Foto",
          totalPriceIdr: 15000000,
          paidAmountIdr: 4500000,
        },
        {
          id: "item-3",
          label: "Rona Dekor · Cypress",
          totalPriceIdr: 12000000,
          paidAmountIdr: 3600000,
        },
      ],
      createdAt: "2026-10-25T10:50:00Z",
    };

    await page.addInitScript((snapshot) => {
      sessionStorage.setItem("menuju_akad_tx_ORD-SIM-204", JSON.stringify(snapshot));
    }, failedSnapshot);

    await page.goto("/orders/ORD-SIM-204");

    // Failed invoice indicators
    await expect(page.getByText("Pembayaran Gagal").first()).toBeVisible();
    await expect(page.getByText("Pembayaran Gagal / Kedaluwarsa")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Invoice: INV-SIM-204-01" })).toBeVisible();
    await expect(page.getByText("ORD-SIM-204", { exact: true })).toBeVisible();
    await expect(page.getByText("Rp 10.500.000").first()).toBeVisible();

    // Absence of settled / verified receipt claims
    await expect(page.getByText(/BUKTI PELUNASAN/i)).not.toBeVisible();
    await expect(page.getByText(/BUKTI PEMBAYARAN UANG MUKA/i)).not.toBeVisible();
    await expect(page.getByText(/\(SETTLED\)/i)).not.toBeVisible();
    await expect(page.getByText(/Ditahan aman di escrow/i)).not.toBeVisible();
    await expect(page.getByText(/Total Diterima/i)).not.toBeVisible();
    await expect(page.getByText(/Seluruh nilai kontrak telah dibayar penuh/i)).not.toBeVisible();
    await expect(page.getByText(/Tidak Ada Tagihan Termin Tersisa/i)).not.toBeVisible();
    await expect(page.getByText(/Lunas Masuk Rekening Escrow/i)).not.toBeVisible();
  });
});
