import { test, expect } from "@playwright/test";

test.describe("Planner & Guest Audit E2E", () => {
  test("A15: per-event checklist map retains toggled state across event switches", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    const weddingTab = page.getByRole("tab", { name: "Akad & Resepsi" });
    const engagementTab = page.getByRole("tab", { name: "Mode Lamaran" });
    await expect(weddingTab).toHaveAttribute("aria-selected", "true");

    const firstCheckbox = page
      .locator("section[aria-labelledby='focus-title'] input[type='checkbox']")
      .first();
    const initiallyChecked = await firstCheckbox.isChecked();
    await firstCheckbox.click();
    await expect(firstCheckbox).toBeChecked({ checked: !initiallyChecked });

    await engagementTab.click();
    await expect(engagementTab).toHaveAttribute("aria-selected", "true");

    await weddingTab.click();
    await expect(weddingTab).toHaveAttribute("aria-selected", "true");

    const firstCheckboxAfter = page
      .locator("section[aria-labelledby='focus-title'] input[type='checkbox']")
      .first();
    await expect(firstCheckboxAfter).toBeChecked({ checked: !initiallyChecked });
  });

  test("B01: calendar supports 7-day weekly view with navigation and monthly fallback/event detail", async ({
    page,
  }) => {
    await page.goto("/planner/calendar");

    const monthTab = page.getByRole("tab", { name: "Bulan" });
    const weekTab = page.getByRole("tab", { name: "Minggu" });
    await expect(monthTab).toHaveAttribute("aria-selected", "true");

    const dayCells = page.locator("[class*='dayCell']");
    await expect(dayCells).toHaveCount(35);

    const eventBadge = page.locator("[class*='eventBadge']").first();
    await expect(eventBadge).toBeVisible();
    await eventBadge.click();
    const detailRegion = page.getByRole("region", { name: "Detail janji temu terpilih" });
    await expect(detailRegion).toBeVisible();
    await expect(detailRegion).toContainText("WIB");
    await page.getByRole("button", { name: "Tutup rincian ✕" }).click();
    await expect(detailRegion).not.toBeVisible();

    await weekTab.click();
    await expect(weekTab).toHaveAttribute("aria-selected", "true");
    await expect(dayCells).toHaveCount(7);

    const prevBtn = page.getByRole("button", { name: "Minggu sebelumnya" });
    const nextBtn = page.getByRole("button", { name: "Minggu berikutnya" });
    await expect(prevBtn).toBeVisible();
    await expect(nextBtn).toBeVisible();

    await expect(page.getByText("19 - 25 Okt 2026")).toBeVisible();

    await prevBtn.click();
    await expect(page.getByText("12 - 18 Okt 2026")).toBeVisible();
    await expect(dayCells).toHaveCount(7);

    await prevBtn.click();
    await prevBtn.click();
    await expect(prevBtn).toBeDisabled();

    await nextBtn.click();
    await nextBtn.click();
    await nextBtn.click();
    await expect(page.getByText("19 - 25 Okt 2026")).toBeVisible();
    await expect(dayCells).toHaveCount(7);

    await nextBtn.click();
    await expect(nextBtn).toBeDisabled();

    await monthTab.click();
    await expect(monthTab).toHaveAttribute("aria-selected", "true");
    await expect(dayCells).toHaveCount(35);
  });

  test("B03: followup search filters by name and category on guests tab", async ({ page }) => {
    await page.goto("/planner/guests");

    const followUpBtn = page.getByRole("button", { name: "Tindak Lanjut" });
    await followUpBtn.click();

    const searchInput = page.getByPlaceholder("Cari nama atau kelompok tamu…");
    await expect(searchInput).toBeVisible();

    await searchInput.fill("Hendra");
    await expect(page.getByText("Hendra & Partner")).toBeVisible();
    await expect(page.getByText("Tono Wijaya")).not.toBeVisible();

    await searchInput.fill("Kolega");
    await expect(page.getByText("Tono Wijaya")).toBeVisible();
    await expect(page.getByText("Hendra & Partner")).not.toBeVisible();

    await searchInput.fill("");
    await expect(page.getByText("Hendra & Partner")).toBeVisible();
  });
});
