import { expect, test } from "@playwright/test";

test.describe("Landing Page — Satu Langkah Bersama", () => {
  test("menampilkan seluruh 10 seksi kanonikal landing page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Menuju Akad/);

    // 0. Navigasi
    await expect(
      page.getByRole("banner").getByRole("link", { name: /menuju akad/i }),
    ).toBeVisible();
    await expect(page.getByRole("banner").getByRole("link", { name: "Masuk" })).toHaveAttribute(
      "href",
      "/login",
    );

    // 1. Hero
    await expect(page.getByRole("heading", { name: /Rencana besar/i })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Mulai gratis", exact: true }).first(),
    ).toHaveAttribute("href", "/auth/register");

    // 2. Nilai utama
    await expect(page.getByText("Satu ruang untuk berdua")).toBeVisible();
    await expect(page.getByText("Rencana yang terasa ringan")).toBeVisible();
    await expect(page.getByText("Undangan yang personal")).toBeVisible();

    // 3. 01 Planner preview
    await expect(page.getByText("01 / Ruang untuk Merencanakan")).toBeVisible();
    await expect(page.getByText("Selamat pagi, Andi & Risa.")).toBeVisible();

    // 4. 02 Workflow / Cara kerja
    await expect(page.getByText("02 / Satu Langkah, Lalu Berikutnya")).toBeVisible();
    await expect(page.getByText("Buka ruang kalian")).toBeVisible();

    // 5. 03 Undangan
    await expect(page.getByText("03 / Dari Kalian, Untuk Mereka")).toBeVisible();
    await expect(page.getByText("Editorial Light")).toBeVisible();
    await expect(page.getByText("Cypress Modern")).toBeVisible();
    await expect(page.getByText("Botanical Taupe")).toBeVisible();

    // 6. 04 Paket
    await expect(page.getByText("04 / Mulai Dari Yang Kalian Butuhkan")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Free", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Premium", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Lifetime", exact: true })).toBeVisible();

    // 7. 05 FAQ interactive toggle
    await expect(page.getByText("Apakah bisa mulai secara gratis?")).toBeVisible();
    const secondFaq = page.getByRole("button", {
      name: "Bagaimana merencanakan bersama pasangan?",
    });
    await expect(secondFaq).toBeVisible();
    await secondFaq.click();
    await expect(
      page.getByText("Buat workspace pasangan, lalu ajak pasangan bergabung."),
    ).toBeVisible();

    // 8. Ajakan akhir / CTA
    await expect(page.getByText("Hari bahagia dimulai")).toBeVisible();

    // 9. Footer
    await expect(page.getByText("© 2026 Menuju Akad")).toBeVisible();
  });

  test("reflow responsif pada mobile 375px tanpa overflow", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Rencana besar/i })).toBeVisible();
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
});
