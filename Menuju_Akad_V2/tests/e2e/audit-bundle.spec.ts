import { expect, test } from "@playwright/test";

test.describe("Audit A06: Vendor package selection carried to bundler", () => {
  test("Carries Akad Intimate 7.5m selection into /marketplace/bundles with SSR stability and preserves quantity updates", async ({
    page,
  }) => {
    await page.goto("/marketplace/vendor/lensa-teduh");
    await expect(page.getByRole("heading", { name: "Lensa Teduh Photo" })).toBeVisible();

    const addBtn = page.getByRole("button", { name: /Tambahkan ke Racik Paket/i });
    await expect(addBtn).toContainText("15.000.000");

    await page.getByText("Akad Intimate").click();
    await expect(addBtn).toContainText("7.500.000");

    await addBtn.click();
    await expect(page.getByText(/ditambahkan ke racikan paket/i)).toBeVisible();

    await page.goto("/marketplace/bundles");
    await expect(page.getByRole("heading", { name: /PKT-SIM-204/i })).toBeVisible();
    await expect(page.getByText("Akad Intimate")).toBeVisible();
    await expect(page.getByText("Rp 27.500.000").first()).toBeVisible();
    await expect(page.getByText("Rp 8.250.000").first()).toBeVisible();

    await page.reload();
    await expect(page.getByText("Akad Intimate")).toBeVisible();
    await expect(page.getByText("Rp 27.500.000").first()).toBeVisible();

    const plusBtn = page.getByRole("button", { name: "Tambah kuantitas" }).first();
    await plusBtn.click();
    await expect(page.getByText("Rp 35.500.000").first()).toBeVisible();

    const deleteBtn = page.getByRole("button", { name: "Hapus" }).last();
    await deleteBtn.click();
    await expect(page.getByText("Rp 23.500.000").first()).toBeVisible();
  });

  test("Recovers gracefully from corrupted sessionStorage shape without crash", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem(
        "menuju_akad_bundle_selection",
        JSON.stringify({ invalid: true }),
      );
    });
    await page.goto("/marketplace/bundles");
    await expect(page.getByRole("heading", { name: /PKT-SIM-204/i })).toBeVisible();
    await expect(page.getByText("Rp 35.000.000").first()).toBeVisible();
  });
});
