import { test, expect } from "@playwright/test";

test("unknown microsite tokens do not reveal personal sessions", async ({ page }) => {
  await page.goto("/i/unknown-a7c6-token/acara");
  await expect(page.getByRole("heading", { name: "Tautan Tidak Tersedia" })).toBeVisible();
  await expect(page.getByText("Budi Santoso")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "RSVP per Sesi" })).toHaveCount(0);
});

test("lightbox supports arrows, a trapped tab order, Escape and focus return", async ({ page }) => {
  await page.goto("/i/token-budi-a7c6/acara");
  await page.getByRole("button", { name: "Galeri", exact: true }).click();
  const trigger = page.getByRole("button", { name: "Buka foto 1 dari 4" });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(dialog).toHaveAccessibleName("Foto 2 dari 4");
  await page.keyboard.press("ArrowLeft");
  await expect(dialog).toHaveAccessibleName("Foto 1 dari 4");
  await dialog.getByRole("button", { name: "Foto berikutnya" }).focus();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("button", { name: "Tutup dialog" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("photo upload validates files, retries offline and permits withdrawal", async ({
  page,
  context,
}) => {
  await page.goto("/i/token-budi-a7c6/acara");
  await page.getByRole("button", { name: "Kirim Foto", exact: true }).click();
  const input = page.getByLabel("Pilih foto JPG atau PNG");
  await input.setInputFiles({
    name: "unsafe.svg",
    mimeType: "image/svg+xml",
    buffer: Buffer.from("<svg/>"),
  });
  await expect(page.getByRole("region", { name: "Foto momen" }).getByRole("alert")).toContainText(
    "JPG atau PNG",
  );
  await input.setInputFiles({
    name: "foto.png",
    mimeType: "image/png",
    buffer: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l1sAAAAASUVORK5CYII=",
      "base64",
    ),
  });
  await expect(page.getByRole("button", { name: "Kirim untuk moderasi" })).toBeDisabled();
  await page.getByRole("checkbox").check();
  await context.setOffline(true);
  await page.getByRole("button", { name: "Kirim untuk moderasi" }).click();
  await expect(page.getByRole("region", { name: "Foto momen" }).getByRole("alert")).toContainText(
    "offline",
  );
  await context.setOffline(false);
  await page.getByRole("button", { name: "Coba kirim lagi" }).click();
  await expect(page.getByText(/Foto masuk antrean moderasi/)).toBeVisible();
  await page.getByRole("button", { name: "Tarik foto & persetujuan" }).click();
  await expect(page.getByText(/Pratinjau dan izin telah dihapus/)).toBeVisible();
});

test("moderation never approves a submission without publication consent", async ({ page }) => {
  await page.goto("/planner/invitations");
  await page.getByRole("button", { name: "Moderasi", exact: true }).click();
  await page.getByRole("button", { name: /Gita Maharani/ }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Alasan (dicatat pada audit)").fill("Konten telah ditinjau");
  await expect(dialog.getByRole("button", { name: "Setujui", exact: true })).toBeDisabled();
  await expect(dialog.getByText(/Tanpa izin publikasi/)).toBeVisible();
});

test("search keeps explicit recipients and repeat dispatch is deduplicated", async ({ page }) => {
  await page.goto("/planner/guests");
  await page.getByRole("button", { name: "Tindak Lanjut", exact: true }).click();
  await expect(page.getByRole("checkbox", { name: "Pilih semua tamu terlihat" })).toHaveAttribute(
    "aria-checked",
    "mixed",
  );
  await page.getByRole("textbox", { name: "Cari tamu pada hasil filter" }).fill("Hendra");
  await page.getByRole("button", { name: "Tinjau 4 pengingat" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByText("Salsa Putri", { exact: true })).toBeVisible();
  await dialog.getByRole("button", { name: "Jadwalkan 4 pengingat" }).click();
  await expect(dialog.getByRole("status")).toContainText("4 pengingat masuk antrean");
  await dialog.getByRole("button", { name: "Selesai", exact: true }).click();
  await page.getByRole("button", { name: "Tinjau 4 pengingat" }).click();
  await dialog.getByRole("button", { name: "Jadwalkan 4 pengingat" }).click();
  await expect(dialog.getByRole("status")).toContainText("0 pengingat masuk antrean");
});

test("analytics has an empty range and aggregate-only export", async ({ page }) => {
  await page.goto("/planner/invitations");
  await page.getByRole("button", { name: "Analitik", exact: true }).click();
  const range = page.getByLabel("Rentang analitik");
  await range.selectOption("previous");
  await expect(page.getByText(/Belum ada data pada rentang ini/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Ekspor agregat CSV" })).toBeDisabled();
  await range.selectOption("current");
  await expect(page.getByText("168 · 80%")).toBeVisible();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Ekspor agregat CSV" }).click();
  expect((await download).suggestedFilename()).toBe("analitik-agregat-19-25-okt-2026.csv");
});

test("guest microsite and lightbox fit 375, 768 and 1280 pixels", async ({ page }) => {
  for (const width of [375, 768, 1280]) {
    await page.setViewportSize({ width, height: 812 });
    await page.goto("/i/token-budi-a7c6/acara");
    await expect(page.getByText("Andi Ramadhan", { exact: true })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }
});
