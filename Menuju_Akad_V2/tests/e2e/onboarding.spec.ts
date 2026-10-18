import { expect, test } from "@playwright/test";

test("onboarding keeps edits across next, back, and browser reload", async ({ page }) => {
  await page.goto("/onboarding/profile");
  await expect(page.locator("#groom-name")).toHaveValue("Andi Ramadhan");
  await page.locator("#groom-nickname").fill("Andi tersimpan");
  await page.getByRole("button", { name: "Lanjut: rencana acara", exact: true }).click();
  await expect(page).toHaveURL(/\/onboarding\/events$/);
  await page.getByRole("button", { name: "Kembali", exact: true }).click();
  await expect(page).toHaveURL(/\/onboarding\/profile$/);
  await expect(page.locator("#groom-nickname")).toHaveValue("Andi tersimpan");
  await page.reload();
  await expect(page.locator("#groom-nickname")).toHaveValue("Andi tersimpan");
  await expect(page.locator("#groom-father")).toHaveValue("Bapak H. Budi Santoso");
  await expect(page.locator("#bride-mother")).toHaveValue("Ibu Hj. Ratna Dewi");
});

test("required profile validation focuses the field and preserves the draft", async ({ page }) => {
  await page.goto("/onboarding/profile");
  await page.locator("#groom-name").fill("");
  await page.getByRole("button", { name: "Lanjut: rencana acara", exact: true }).click();
  await expect(page).toHaveURL(/\/onboarding\/profile$/);
  await expect(page.locator("#groom-name")).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#groom-name")).toBeFocused();
  await expect(page.locator("#bride-name")).toHaveValue("Risa Pratiwi");
});

test("switching event context keeps IDs, dates, and integer budgets independent", async ({
  page,
}) => {
  await page.goto("/onboarding/events");
  await expect(page.locator("#wedding-date")).toHaveValue("2027-02-14");
  await expect(page.locator("#engagement-date")).toHaveValue("2026-11-22");
  await page.getByRole("button", { name: "Lamaran", exact: true }).click();
  await page.locator("#engagement-budget").fill("31000000");
  await page.getByRole("button", { name: "Pernikahan", exact: true }).click();
  await expect(page.locator("#wedding-budget")).toHaveValue("150000000");
  await page.locator("#wedding-budget").fill("160000000");
  await page.getByRole("button", { name: "Lamaran", exact: true }).click();
  await expect(page.locator("#engagement-budget")).toHaveValue("31000000");
  await page.getByRole("button", { name: "Lanjut: undang pasangan", exact: true }).click();
  await expect(page).toHaveURL(/\/onboarding\/partner$/);
  await expect
    .poll(() =>
      page.evaluate(() => {
        const stored = localStorage.getItem("ma-v2-workspace");
        return stored ? (JSON.parse(stored) as unknown) : null;
      }),
    )
    .toMatchObject({
      events: {
        engagement: { id: "event-engagement", date: "2026-11-22", budgetIdr: 31_000_000 },
        wedding: { id: "event-wedding", date: "2027-02-14", budgetIdr: 160_000_000 },
      },
    });
});

test("a dirty address dialog offers save, discard, or continued editing", async ({ page }) => {
  await page.goto("/onboarding/events");
  await page.getByRole("button", { name: "Ubah alamat ↗", exact: true }).click();
  await page.getByLabel("Alamat lengkap", { exact: true }).fill("Alamat draf yang diubah");
  await page
    .getByRole("dialog", { name: "Alamat acara pernikahan" })
    .getByRole("button", { name: "Tutup dialog", exact: true })
    .click();
  const confirm = page.getByRole("dialog", { name: "Alamat belum disimpan" });
  await expect(confirm).toBeVisible();
  await confirm.getByRole("button", { name: "Lanjut edit", exact: true }).click();
  await expect(page.getByLabel("Alamat lengkap", { exact: true })).toHaveValue(
    "Alamat draf yang diubah",
  );
  await page.getByRole("button", { name: "Simpan alamat", exact: true }).click();
  await expect(page.getByText("Alamat draf yang diubah", { exact: true })).toBeVisible();
});

test("a stale draft keeps its warning and local input until an explicit reload", async ({
  page,
}) => {
  await page.goto("/onboarding/profile");
  await expect(page.locator("#groom-name")).toBeEnabled();
  await page.evaluate(() => sessionStorage.setItem("ma-v2-scenario", "conflict"));
  await page.locator("#groom-nickname").fill("Draf konflik");
  await expect(page.getByText(/Versi ruang berubah. Tinjau sebelum menyimpan/)).toBeVisible();
  await page.locator("#groom-nickname").fill("Tetap disimpan lokal");
  await expect(page.getByText(/Versi ruang berubah. Tinjau sebelum menyimpan/)).toBeVisible();
  await page.evaluate(() => sessionStorage.removeItem("ma-v2-scenario"));
  await page.getByRole("button", { name: "Muat versi terbaru", exact: true }).click();
  await page
    .getByRole("dialog", { name: "Muat draf terbaru?" })
    .getByRole("button", { name: "Lanjut edit", exact: true })
    .click();
  await expect(page.locator("#groom-nickname")).toHaveValue("Tetap disimpan lokal");
  await page.getByRole("button", { name: "Muat versi terbaru", exact: true }).click();
  await page
    .getByRole("dialog", { name: "Muat draf terbaru?" })
    .getByRole("button", { name: "Muat draf terbaru", exact: true })
    .click();
  await expect(page.locator("#groom-nickname")).toHaveValue("Andi");
});

test("offline save failures preserve the input and recover on retry", async ({ page, context }) => {
  await page.goto("/onboarding/profile");
  await expect(page.locator("#groom-name")).toBeEnabled();
  await context.setOffline(true);
  await page.locator("#groom-nickname").fill("Tersimpan setelah online");
  await expect(page.getByText(/Kamu sedang offline. Draf tetap tersedia/)).toBeVisible();
  await expect(page.locator("#groom-nickname")).toHaveValue("Tersimpan setelah online");
  await context.setOffline(false);
  await page.getByRole("button", { name: "Coba simpan lagi", exact: true }).click();
  await expect(page.getByText("✓ Draf tersimpan di perangkat ini", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.locator("#groom-nickname")).toHaveValue("Tersimpan setelah online");
});
