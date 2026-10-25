import { expect, test } from "@playwright/test";

test.describe("Audit Regression · Finance & Ledger", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/planner/finance");
    await expect(page.getByRole("heading", { name: "Dana jelas, rencana tenang." })).toBeVisible();
  });

  test("A01: koreksi mutasi identik bersifat idempoten (BCA 11jt, Jago 13.5jt)", async ({
    page,
  }) => {
    await page.getByRole("tab", { name: "Rekening & mutasi" }).click();
    for (let i = 0; i < 2; i++) {
      await page.getByRole("button", { name: "Koreksi Catatan MT-009" }).click();
      await page.getByRole("button", { name: "Konfirmasi Koreksi", exact: true }).click();
    }
    const bca = page.locator(".rounded-card").filter({ hasText: "••4821" });
    const jago = page.locator(".rounded-card").filter({ hasText: "••7734" });
    await expect(bca).toContainText("11.000.000");
    await expect(jago).toContainText("13.500.000");
    await expect(bca).not.toContainText("12.000.000");
    await expect(jago).not.toContainText("12.500.000");
  });

  test("A02: pengeluaran overdraw 20jt dari 10jt ditolak dan saldo tetap utuh", async ({
    page,
  }) => {
    await page.getByRole("tab", { name: "Pengeluaran", exact: true }).click();
    await page.getByRole("button", { name: "Catat pengeluaran", exact: true }).first().click();
    const dialog = page.getByRole("dialog", { name: "Catat Pengeluaran Baru" });
    await dialog.getByLabel(/Nominal/i).fill("20000000");
    await dialog.getByRole("combobox").last().selectOption("acc-bca");
    await dialog.getByRole("button", { name: "Simpan Catatan Pengeluaran" }).click();

    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(/tidak mencukupi/i)).toBeVisible();
    await dialog
      .getByRole("button", { name: /Batal|Tutup/i })
      .first()
      .click();

    await page.getByRole("tab", { name: "Rekening & mutasi" }).click();
    const bca = page.locator(".rounded-card").filter({ hasText: "••4821" });
    await expect(bca).toContainText("10.000.000");
    await expect(bca).not.toContainText("Rp 0");
  });

  test("A03 & A04: impor CSV dengan pemilihan rekening mendebit 1.5jt dan ID baris unik", async ({
    page,
  }) => {
    await page.getByRole("tab", { name: "Laporan", exact: true }).click();
    await page.getByRole("button", { name: "Impor CSV", exact: true }).click();
    const wizard = page.getByRole("dialog");
    const accountSelect = wizard
      .locator("div")
      .filter({ hasText: "Rekening Pembebanan:" })
      .locator("select");
    await accountSelect.selectOption("acc-bca");
    await wizard.getByRole("button", { name: /Konfirmasi Impor/i }).click();

    await page.getByRole("tab", { name: "Pengeluaran", exact: true }).click();
    await page.getByRole("cell", { name: "Transport survei", exact: true }).waitFor();
    const idLocators = page.locator("table:visible tbody tr td:first-child > span:first-child");
    const ids = await idLocators.allTextContents();
    const firstThree = ids.slice(0, 3);
    expect(firstThree).toHaveLength(3);
    expect(new Set(firstThree).size).toBe(3);

    await page.getByRole("tab", { name: "Rekening & mutasi" }).click();
    const bca = page.locator(".rounded-card").filter({ hasText: "••4821" });
    await expect(bca).toContainText("8.500.000");
  });

  test("A16: biaya pribadi eksternal tidak mengubah Biaya Dari Dana Acara", async ({ page }) => {
    await page.getByRole("tab", { name: "Tabungan", exact: true }).click();
    const metric = page.getByText("Biaya Dari Dana Acara", { exact: true }).locator("..");
    await expect(metric).toContainText("57.500.000");

    await page.getByRole("tab", { name: "Pengeluaran", exact: true }).click();
    await page.getByRole("button", { name: "Catat pengeluaran", exact: true }).first().click();
    const dialog = page.getByRole("dialog", { name: "Catat Pengeluaran Baru" });
    await dialog.getByLabel(/Nominal/i).fill("1000000");
    await dialog.getByRole("button", { name: /Pribadi/i }).click();
    await dialog.getByRole("button", { name: "Simpan Catatan Pengeluaran" }).click();

    await page.getByRole("tab", { name: "Tabungan", exact: true }).click();
    await expect(metric).toContainText("57.500.000");
    await expect(metric).not.toContainText("58.500.000");
  });

  test("B05: dialog mutasi internal mempertahankan narasi total kas dan saldo dinamis", async ({
    page,
  }) => {
    await page.getByRole("tab", { name: "Rekening & mutasi" }).click();
    await page.getByRole("button", { name: "Koreksi Catatan MT-009" }).click();
    await page.getByRole("button", { name: "Konfirmasi Koreksi", exact: true }).click();

    await page.getByRole("button", { name: "Catat mutasi internal" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByText("Catat Mutasi, Bukan Kirim Uang")).toBeVisible();
    await expect(dialog.getByText(/Total (dana acara|kas) tetap/i)).toBeVisible();
    await expect(dialog).toContainText("11.000.000");
    await expect(dialog).toContainText("13.500.000");
    await expect(dialog).toContainText("55.000.000");

    await dialog.getByLabel(/Nominal/i).fill("1000000");
    await expect(dialog).toContainText("10.000.000");
    await expect(dialog).toContainText("14.500.000");

    await dialog.getByRole("button", { name: /Catat|Simpan|Konfirmasi/i }).click();
    await expect(dialog).not.toBeVisible();

    await expect(page.getByText("Sisa Dana Acara", { exact: true }).locator("..")).toContainText(
      "55.000.000",
    );
    const bca = page.locator(".rounded-card").filter({ hasText: "••4821" });
    const jago = page.locator(".rounded-card").filter({ hasText: "••7734" });
    await expect(bca).toContainText("10.000.000");
    await expect(jago).toContainText("14.500.000");
  });

  test("B06: timeline aktivitas pada laporan tersusun kronologis stabil", async ({ page }) => {
    await page.getByRole("tab", { name: "Laporan" }).click();
    await expect(
      page.getByRole("heading", { name: "Lihat alurnya. Pahami posisinya." }),
    ).toBeVisible();

    const monthMap: Record<string, number> = {
      jan: 0,
      feb: 1,
      mar: 2,
      apr: 3,
      mei: 4,
      jun: 5,
      jul: 6,
      agu: 7,
      sep: 8,
      okt: 9,
      nov: 10,
      des: 11,
    };
    const parseTestDate = (str: string) => {
      const parts = str.trim().split(/\s+/);
      const day = parseInt(parts[0] ?? "", 10);
      const mStr = (parts[1] ?? "").toLowerCase().slice(0, 3);
      const month = monthMap[mStr];
      const year = parseInt(parts[2] ?? "", 10);
      if (month === undefined || Number.isNaN(day) || Number.isNaN(year) || day < 1 || day > 31) {
        throw new Error(`Invalid date format: ${str}`);
      }
      const time = new Date(year, month, day).getTime();
      if (Number.isNaN(time)) {
        throw new Error(`Invalid timestamp for date: ${str}`);
      }
      return time;
    };

    const reportCard = page
      .locator("div")
      .filter({ has: page.getByRole("heading", { name: /Arus Dana & Mutasi Tercatat/i }) });
    const dateCells = reportCard.locator("table:visible tbody tr td:first-child");
    const dates = await dateCells.allTextContents();
    expect(dates).toHaveLength(14);

    const timestamps = dates.map(parseTestDate);
    for (let i = 1; i < timestamps.length; i++) {
      expect(timestamps[i]!).toBeGreaterThanOrEqual(timestamps[i - 1]!);
    }
  });
});
