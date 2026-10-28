import { expect, test } from "@playwright/test";
import { customerSession } from "../helpers/customer-session";
import type {
  FinanceCommand,
  FinanceSnapshot,
} from "../../src/features/planner-finance/types/finance-ledger";
test("account catering links to categorized budgets and respects allocation before repricing", async ({
  page,
  context,
  baseURL,
}) => {
  await customerSession(context, baseURL!, "catering-budget-link");
  const read = async () => {
    const response = await context.request.get("/api/workspace/finance");
    expect(response.ok()).toBe(true);
    return (await response.json()) as FinanceSnapshot;
  };
  const command = async (command: FinanceCommand) => {
    const current = await read();
    const response = await context.request.post("/api/workspace/finance", {
      headers: { Origin: baseURL! },
      data: { revision: current.revision, requestId: crypto.randomUUID(), command },
    });
    expect(response.ok(), await response.text()).toBe(true);
  };
  await page.goto("/planner/catering");
  await expect(page.getByRole("button", { name: "+ Menu katering", exact: true })).toHaveCount(0);
  await page.getByRole("tab", { name: "Menu katering tersimpan", exact: true }).click();
  await page.getByRole("button", { name: "+ Menu katering", exact: true }).click();
  let dialog = page.getByRole("dialog", { name: "Tambah menu katering", exact: true });
  await dialog.getByRole("tab", { name: "Paket vendor", exact: true }).click();
  await dialog.getByLabel("Nama paket", { exact: true }).fill("Paket katering terhubung");
  await dialog.getByLabel("Jumlah tamu paket", { exact: true }).fill("20");
  await dialog.getByLabel("Total harga paket (Rp)", { exact: true }).fill("500000");
  await dialog.getByLabel("Nama vendor (opsional)", { exact: true }).fill("Dapur Uji");
  await dialog
    .getByLabel("Daftar menu dalam paket", { exact: true })
    .fill("Nasi, ayam, sayur dan buah");
  await dialog.getByRole("button", { name: "Simpan", exact: true }).click();
  await expect(dialog).toBeHidden();
  const names = page.getByRole("region", { name: "Pilihan menu katering", exact: true });
  expect(await names.innerText()).not.toMatch(/Rp\s/);
  const detail = page.getByRole("region", { name: "Detail menu katering", exact: true });
  await expect(detail).toContainText("Nasi, ayam, sayur dan buah");
  const budget = (await read()).budgets[0]!;
  expect(budget).toMatchObject({
    amount: 500000,
    category: "Katering",
    source: { kind: "catering" },
  });
  await command({ type: "claim", side: "groom" });
  await command({
    type: "entry",
    side: "groom",
    direction: "add",
    amount: 1000000,
    source: "Gaji",
    notes: "",
  });
  await detail.getByRole("link", { name: "Buka anggaran katering" }).click();
  await expect(page.getByRole("tab", { name: "Anggaran", exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.getByRole("button", { name: "Filter Kategori", exact: true }).click();
  await expect(page.getByRole("radio", { name: "Katering", exact: true })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Gunakan tabungan untuk Paket katering terhubung", exact: true })
    .first()
    .click();
  dialog = page.getByRole("dialog", { name: "Gunakan tabungan untuk anggaran", exact: true });
  await dialog.getByRole("button", { name: "Gunakan dana & tandai tercapai", exact: true }).click();
  await expect(dialog).toBeHidden();
  expect((await read()).balances.groom).toBe(500000);
  await page.goto("/planner/catering");
  await page.getByRole("tab", { name: "Menu katering tersimpan", exact: true }).click();
  await expect(detail).toContainText("Tercapai");
  await detail
    .getByRole("button", { name: "Edit menu Paket katering terhubung", exact: true })
    .click();
  dialog = page.getByRole("dialog", { name: "Edit menu katering", exact: true });
  await dialog.getByLabel("Total harga paket (Rp)", { exact: true }).fill("600000");
  const rejected = page.waitForResponse(
    (response) =>
      response.url().includes("/api/workspace/resources/catering") &&
      response.request().method() === "PUT",
  );
  await dialog.getByRole("button", { name: "Simpan", exact: true }).click();
  expect((await rejected).status()).toBe(409);
  expect((await read()).budgets[0]?.amount).toBe(500000);
  await page.keyboard.press("Escape");
  await command({ type: "release", budgetId: budget.id });
  await expect(detail).toContainText("Belum tercapai");
  await detail
    .getByRole("button", { name: "Edit menu Paket katering terhubung", exact: true })
    .click();
  dialog = page.getByRole("dialog", { name: "Edit menu katering", exact: true });
  await dialog.getByLabel("Total harga paket (Rp)", { exact: true }).fill("600000");
  await dialog.getByRole("button", { name: "Simpan", exact: true }).click();
  await expect(dialog).toBeHidden();
  expect((await read()).budgets[0]).toMatchObject({
    id: budget.id,
    amount: 600000,
    completed: false,
  });
  expect((await read()).balances.groom).toBe(1000000);
  await page.setViewportSize({ width: 375, height: 1100 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
