import { test, expect } from "@playwright/test";
test("an invitation update from another tab preserves an unsaved draft and rejects overwrite", async ({
  context,
  page,
}) => {
  await page.goto("/planner/invitations");
  await page.getByRole("button", { name: "Tambah undangan", exact: true }).click();
  await page.getByLabel("Judul undangan").fill("Draf pertama belum disimpan");
  const other = await context.newPage();
  await other.goto("/planner/invitations");
  await other.getByLabel("Judul undangan").fill("Judul dari tab kedua");
  await other.getByRole("button", { name: "Simpan undangan" }).click();
  await expect(page.getByText("Sisa 3 dari 5 percobaan per fitur", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Judul undangan")).toHaveValue("Draf pertama belum disimpan");
  await page.getByRole("button", { name: "Simpan undangan" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Undangan berubah" })).toBeVisible();
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem("menuju-akad:guest-trial:v2")!).used),
  ).toMatchObject({ invitations: 2 });
});
test("stale task drafts cannot overwrite a change committed in another tab", async ({
  context,
  page,
}) => {
  await page.goto("/planner/tasks");
  await page.getByRole("button", { name: "Tambah tugas", exact: true }).click();
  await page.getByLabel("Nama tugas").fill("Draf tab pertama");
  const other = await context.newPage();
  await other.goto("/planner/tasks");
  const status = other.getByRole("checkbox", { name: "Tandai Tugas baru tanpa judul" });
  await status.click();
  await expect(status).toBeChecked();
  await expect(page.getByText("Sisa 3 dari 5 percobaan per fitur", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Simpan perubahan", exact: true }).click();
  await expect(page.getByLabel("Nama tugas")).toHaveValue("Draf tab pertama");
  await expect(page.getByRole("alert").first()).toContainText("berubah");
  const snapshot = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("menuju-akad:guest-trial:v2")!),
  );
  expect(snapshot.used).toMatchObject({ tasks: 2 });
  expect(snapshot.resources.tasks[0].status).toBe("Selesai");
});
test("KUA templates enforce five active checks across tabs and support edit", async ({
  page,
  context,
}) => {
  await page.goto("/planner/kua");
  const checks = page.getByRole("checkbox");
  await expect.poll(() => checks.count()).toBeGreaterThan(5);
  for (let i = 0; i < 5; i++) {
    await checks.nth(i).click();
    await expect(checks.nth(i)).toBeChecked();
  }
  const other = await context.newPage();
  await other.goto("/planner/kua");
  await other.getByRole("checkbox").nth(5).click();
  await expect(other.getByRole("dialog", { name: "Masuk untuk melanjutkan" })).toBeVisible();
  await other.getByRole("button", { name: "Tutup dialog" }).click();
  await other.getByRole("checkbox").nth(0).click();
  await expect(other.getByRole("checkbox").nth(0)).not.toBeChecked();
  await other.getByRole("checkbox").nth(5).click();
  await expect(other.getByRole("checkbox").nth(5)).toBeChecked();
  await page.reload();
  await expect(page.getByRole("checkbox").nth(5)).toBeChecked();
  await page.getByRole("button", { name: "Edit", exact: true }).first().click();
  await page
    .locator("form")
    .filter({ has: page.getByRole("button", { name: "Simpan dokumen" }) })
    .getByLabel("Nama dokumen")
    .fill("Dokumen disesuaikan");
  await page.getByRole("button", { name: "Simpan dokumen" }).click();
  await expect(
    page.getByRole("checkbox", { name: "Selesai Dokumen disesuaikan", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("checkbox", { name: "Selesai Dokumen disesuaikan", exact: true }),
  ).toBeVisible();
});

test("storage failure preserves the form draft without claiming a successful save", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error("Storage penuh");
    };
  });
  await page.goto("/planner/kua");
  await page.getByLabel("Nama dokumen").fill("Draf yang belum tersimpan");
  await page.getByRole("button", { name: "Tambah", exact: true }).click();
  await expect(page.getByLabel("Nama dokumen")).toHaveValue("Draf yang belum tersimpan");
  await expect(page.getByText("0 dari 5 checklist aktif", { exact: true })).toBeVisible();
  await expect(page.getByRole("alert").first()).toContainText("Storage penuh");
  await expect(page.getByText("Draf yang belum tersimpan", { exact: true })).toHaveCount(0);
});
test("task and guest forms have independent trial and guest external actions stay blocked", async ({
  page,
}) => {
  await page.goto("/planner/tasks");
  await page.getByRole("button", { name: "Tambah tugas", exact: true }).click();
  await expect(page.getByText("Sisa 4 dari 5 percobaan per fitur", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Tutup panel" }).click();
  await page.goto("/planner/guests");
  await page
    .getByRole("button", { name: /Tambah.*Tamu|Tambah.*Undangan/i })
    .first()
    .click();
  await page.getByPlaceholder("Contoh: Budi Santoso & Partner").fill("Tamu trial sendiri");
  await page
    .getByRole("button", { name: /Simpan/i })
    .last()
    .click();
  await expect(page.getByText("Sisa 4 dari 5 percobaan per fitur", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("Tamu trial sendiri", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Pengiriman WA", exact: true }).click();
  await expect(
    page.getByText("Masuk untuk menggunakan pengiriman pesan.", { exact: true }),
  ).toBeVisible();
});
test("five changes per feature persist locally and the sixth requires login", async ({ page }) => {
  const writes: string[] = [];
  page.on("request", (req) => {
    if (req.url().includes("/api/workspace") && req.method() !== "GET") writes.push(req.url());
  });
  await page.goto("/planner/finance");
  for (let i = 0; i < 5; i++) {
    await page.getByRole("button", { name: "+ Catat anggaran", exact: true }).click();
    await page.getByLabel("Nama anggaran").fill("Budget " + i);
    await page.getByLabel("Nominal (Rp)").fill("5000");
    await page.getByRole("button", { name: "Simpan", exact: true }).click();
    await expect(page.getByLabel("Nama anggaran")).toHaveCount(0);
    await expect(page.getByRole("cell", { name: "Budget " + i, exact: true })).toBeVisible();
  }
  await page.reload();
  await expect(page.getByText("Sisa 0 dari 5 percobaan per fitur", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "+ Catat anggaran", exact: true }).click();
  await page.getByLabel("Nama anggaran").fill("Sixth draft");
  await page.getByLabel("Nominal (Rp)").fill("100");
  await page.getByRole("button", { name: "Simpan", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Masuk untuk melanjutkan" })).toBeVisible();
  await page.getByRole("button", { name: "Tutup dialog" }).click();
  await expect(page.getByLabel("Nama anggaran")).toHaveValue("Sixth draft");
  await page.goto("/planner/tasks");
  await page.getByRole("button", { name: "Tambah tugas", exact: true }).click();
  await expect(page.getByText("Sisa 4 dari 5 percobaan per fitur", { exact: true })).toBeVisible();
  expect(writes).toEqual([]);
});

test("guest invitations count saves rather than typing and paid editors are available locally", async ({
  page,
}) => {
  await page.goto("/planner/invitations");
  await page.getByRole("button", { name: "Tambah undangan", exact: true }).click();
  await expect(page.getByText("Sisa 4 dari 5 percobaan per fitur", { exact: true })).toBeVisible();
  await page.getByLabel("Judul undangan").fill("Pernikahan kami");
  await page.getByLabel("Nama pertama").fill("Budi");
  await page.getByLabel("Nama pasangan").fill("Sari");
  await expect(page.getByText("Sisa 4 dari 5 percobaan per fitur", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Simpan undangan" }).click();
  await expect(page.getByText("Sisa 3 dari 5 percobaan per fitur", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Judul undangan")).toHaveValue("Pernikahan kami");
  await page.goto("/planner/moodboard");
  await expect(page.getByText("Moodboard terkunci")).toHaveCount(0);
  await page.goto("/planner/wedding-kit");
  await expect(page.getByRole("button", { name: "Buka dokumen cetak" })).toBeVisible();
  await page.goto("/planner/invitations/studio");
  await expect(page.getByRole("button", { name: "Simpan draf trial" })).toBeVisible();
  await page.goto("/dashboard");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Buka navigasi" }).click();
  await expect(page.getByRole("navigation", { name: "Navigasi dashboard" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
