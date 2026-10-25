import { expect, test } from "@playwright/test";
import { DatabaseSync } from "node:sqlite";

test("real private submission, superadmin publication, hiding and logout", async ({
  page,
  browser,
}) => {
  const name = `Laras ${Date.now()}`;
  const comment = "Saya ingin navigasi daftar tamu lebih mudah ditemukan dari ponsel.";
  await page.goto("/#ulasan");
  await expect(page.getByRole("heading", { name: "Setiap cerita, berarti." })).toBeVisible();
  await page.getByRole("button", { name: "Tulis ulasan" }).click();
  const form = page.getByRole("dialog");
  await form.getByLabel("Nama yang ditampilkan").fill(name);
  await form.getByRole("radio", { name: "2 bintang", exact: true }).check();
  await form.getByLabel("Ceritakan pengalaman Anda").fill(comment);
  await form.getByRole("button", { name: "Kirim ulasan" }).click();
  await expect(form.getByText(/Ulasan Anda sudah diterima/)).toBeVisible();
  const before = await (await page.request.get("/api/reviews")).json();
  expect(before.items.some((item: { name: string }) => item.name === name)).toBe(false);
  expect((await page.request.get("/api/superadmin/reviews")).status()).toBe(401);

  const context = await browser.newContext({
    ...(test.info().project.use.baseURL ? { baseURL: test.info().project.use.baseURL! } : {}),
  });
  const admin = await context.newPage();
  await admin.goto("/superadmin/reviews");
  await expect(admin).toHaveURL(/\/login/);
  await admin.getByLabel("Email").fill("superadmin@menujuakad.test");
  await admin.getByLabel("Password", { exact: true }).fill("AkadReview!2026");
  await admin.getByRole("button", { name: "Masuk" }).click();
  await expect(admin).toHaveURL(/superadmin\/reviews/);
  for (const width of [360, 768, 1440]) {
    await admin.setViewportSize({ width, height: 900 });
    expect(await admin.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  await admin.getByLabel("Cari ulasan").fill(name);
  const card = admin.getByRole("article").filter({ hasText: name });
  await expect(card).toContainText(comment);
  await expect(card.getByText("Menunggu", { exact: true })).toBeVisible();
  await card.getByRole("button", { name: "Tampilkan di landing" }).click();
  await expect(card.getByText("Ditampilkan", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.locator("#ulasan").getByText(name, { exact: true })).toBeVisible();
  await admin.reload();
  await admin.getByLabel("Cari ulasan").fill(name);
  await card.getByRole("button", { name: "Sembunyikan" }).click();
  await expect(card.getByText("Disembunyikan", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.locator("#ulasan").getByText(name, { exact: true })).toHaveCount(0);
  await admin.getByRole("button", { name: "Keluar" }).click();
  await expect(admin).toHaveURL(/\/login/);
  expect((await context.request.get("/api/superadmin/reviews")).status()).toBe(401);
  await context.close();
});

test("responsive landing and accessible keyboard stars with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [360, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#ulasan");
    await expect(page.locator("#ulasan").getByRole("article").first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  await page.setViewportSize({ width: 360, height: 800 });
  await page.getByRole("button", { name: "Tulis ulasan" }).click();
  const dialog = page.getByRole("dialog");
  const first = dialog.getByRole("radio", { name: "1 bintang", exact: true });
  await first.focus();
  await page.keyboard.press("ArrowRight");
  await expect(dialog.getByRole("radio", { name: "2 bintang", exact: true })).toBeChecked();
  await dialog.getByLabel("Nama yang ditampilkan").fill("Nama panjang untuk pengujian");
  await dialog.getByLabel("Ceritakan pengalaman Anda").fill("Komentar panjang ".repeat(90));
  expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Tulis ulasan" })).toBeFocused();
});

test("rejects incorrect login without exposing inbox", async ({ page }) => {
  await page.goto("/superadmin/login");
  await page.getByLabel("Email").fill("superadmin@menujuakad.test");
  await page.getByLabel("Password", { exact: true }).fill("incorrect-password");
  await page.getByRole("button", { name: "Masuk" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Email atau password tidak sesuai" }),
  ).toBeVisible();
  await expect(page.getByLabel("Email")).toHaveValue("superadmin@menujuakad.test");
  expect((await page.request.get("/api/superadmin/reviews")).status()).toBe(401);
});

test("every selected review remains reachable beyond the first public page", async ({ page }) => {
  test.skip(
    Boolean(process.env["E2E_REVIEWS_URL"]),
    "Fixture insertion requires the isolated review database.",
  );
  // Open the real endpoint first so the isolated schema and initial records exist.
  expect((await page.request.get("/api/reviews")).ok()).toBe(true);
  const db = new DatabaseSync(process.env["E2E_REVIEWS_DB"]!);
  const prefix = `pagination-${Date.now()}-`;
  try {
    const insert = db.prepare(`INSERT INTO website_reviews
      (id,name,rating,comment,status,created_at,updated_at) VALUES (?,?,5,?,'published',?,?)`);
    for (let index = 0; index < 25; index++) {
      const date = new Date(Date.now() + index * 1000).toISOString();
      insert.run(
        `${prefix}${index}`,
        `Pembaca ${index}`,
        "Persiapan menjadi lebih teratur dan mudah diikuti.",
        date,
        date,
      );
    }
    const total = (await (await page.request.get("/api/reviews")).json()).total;
    expect(total).toBeGreaterThan(25);
    await page.goto("/#ulasan");
    const cards = page.locator("#ulasan article");
    await expect(cards).toHaveCount(12);
    await page.getByRole("button", { name: "Baca cerita lainnya" }).click();
    await expect(cards).toHaveCount(24);
    await page.getByRole("button", { name: "Baca cerita lainnya" }).click();
    await expect(cards).toHaveCount(total);
    await expect(page.getByRole("button", { name: "Baca cerita lainnya" })).toHaveCount(0);
  } finally {
    db.prepare("DELETE FROM website_reviews WHERE substr(id,1,?)=?").run(prefix.length, prefix);
    db.close();
  }
});
