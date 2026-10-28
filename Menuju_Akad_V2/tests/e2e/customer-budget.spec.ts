import { expect, test, type Page } from "@playwright/test";

const key = "menuju-akad:guest-trial:v2";
const description =
  "Dana untuk uang muka gedung. " + "Penjelasan lengkap keluarga dan vendor. ".repeat(12);

async function openBudgets(page: Page) {
  await page.getByRole("tab", { name: "Anggaran", exact: true }).click();
}
async function prepareSavings(page: Page) {
  await page.getByRole("tab", { name: "Tabungan", exact: true }).click();
  const claim = page.getByRole("button", { name: "Saya pasangan pria", exact: true });
  if (await claim.isVisible()) await claim.click();
  await page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "Pasangan pria", exact: true }) })
    .getByRole("button", { name: "Tambah", exact: true })
    .click();
  const form = page.getByRole("dialog", { name: "Catat perubahan tabungan", exact: true });
  await form.getByLabel("Nominal (Rp)", { exact: true }).fill("50000000");
  await form.getByRole("button", { name: "Simpan perubahan", exact: true }).click();
  await expect(form).toBeHidden();
  await openBudgets(page);
}
async function allocate(page: Page) {
  await page
    .getByRole("button", { name: "Gunakan tabungan untuk Gedung resepsi", exact: true })
    .click();
  const funding = page.getByRole("dialog", {
    name: "Gunakan tabungan untuk anggaran",
    exact: true,
  });
  await funding
    .getByRole("button", { name: "Gunakan dana & tandai tercapai", exact: true })
    .click();
  await expect(funding).toBeHidden();
}

async function create(page: Page, collected = false) {
  await page.goto("/planner/finance", { waitUntil: "domcontentloaded" });
  if (collected) await prepareSavings(page);
  await openBudgets(page);
  await page.getByRole("button", { name: "Catat anggaran", exact: true }).click();
  const form = page.getByRole("dialog", { name: "Anggaran baru", exact: true });
  await form.getByLabel("Nama anggaran", { exact: true }).fill("Gedung resepsi");
  await form.getByLabel("Target (Rp)", { exact: true }).fill("25000000");
  await form.getByLabel("Tujuan anggaran", { exact: true }).fill("DP gedung");
  await form.getByLabel("Tenggat", { exact: true }).fill("2027-03-01");
  await form.getByLabel("Prioritas", { exact: true }).selectOption("Tinggi");
  await form.getByLabel("Deskripsi anggaran", { exact: true }).fill(description);
  await form.getByRole("button", { name: "Simpan", exact: true }).click();
  await expect(form).toBeHidden();
  if (collected) {
    await allocate(page);
    await page
      .getByRole("group", { name: "Filter status anggaran" })
      .getByRole("button", { name: /^Tercapai/ })
      .click();
  }
}

async function rows(page: Page) {
  return page.evaluate(
    (storageKey) => JSON.parse(localStorage.getItem(storageKey)!).resources.finance,
    key,
  );
}

test("new target metadata and edits survive reload; full description is available", async ({
  page,
}) => {
  await create(page);
  const [original] = await rows(page);
  expect(original).toMatchObject({
    title: "Gedung resepsi",
    amount: 25000000,
    purpose: "DP gedung",
    priority: "Tinggi",
    dueDate: "2027-03-01",
    completed: false,
    notes: description,
  });
  expect(Number.isFinite(Date.parse(original.createdAt))).toBe(true);
  await page.reload({ waitUntil: "domcontentloaded" });
  await openBudgets(page);
  await page.getByRole("button", { name: "Lihat deskripsi Gedung resepsi", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Deskripsi kebutuhan" })).toContainText(
    description,
  );
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Edit Gedung resepsi", exact: true }).click();
  const form = page.getByRole("dialog", { name: "Edit anggaran", exact: true });
  await expect(form.getByLabel("Tujuan anggaran", { exact: true })).toHaveValue("DP gedung");
  await form.getByLabel("Target (Rp)", { exact: true }).fill("28000000");
  await form.getByLabel("Tenggat", { exact: true }).fill("");
  await form.getByRole("button", { name: "Simpan", exact: true }).click();
  await expect(form).toBeHidden();
  await page.reload({ waitUntil: "domcontentloaded" });
  await openBudgets(page);
  await expect(
    page.getByRole("button", { name: "Edit Gedung resepsi", exact: true }),
  ).toBeVisible();
  const [edited] = await rows(page);
  expect(edited.amount).toBe(28000000);
  expect(edited.createdAt).toBe(original.createdAt);
  expect(edited).not.toHaveProperty("dueDate");
});

test("budget allocation moves between filters and can be reversed", async ({ page }) => {
  await create(page);
  await prepareSavings(page);
  await allocate(page);
  await expect(page.getByRole("button", { name: "Edit Gedung resepsi", exact: true })).toHaveCount(
    0,
  );
  await page
    .getByRole("group", { name: "Filter status anggaran" })
    .getByRole("button", { name: /^Tercapai/ })
    .click();
  const status = page.getByRole("button", {
    name: "Batalkan alokasi untuk Gedung resepsi",
    exact: true,
  });
  await expect(status).toHaveAttribute("aria-pressed", "true");
  await status.click();
  await page
    .getByRole("dialog", { name: "Batalkan alokasi anggaran?", exact: true })
    .getByRole("button", { name: "Batalkan alokasi", exact: true })
    .click();
  await page
    .getByRole("group", { name: "Filter status anggaran" })
    .getByRole("button", { name: /^Belum tercapai/ })
    .click();
  await expect(
    page.getByRole("button", { name: "Edit Gedung resepsi", exact: true }),
  ).toBeVisible();
  await page.reload({ waitUntil: "domcontentloaded" });
  await openBudgets(page);
  await expect(
    page.getByRole("button", { name: "Gunakan tabungan untuk Gedung resepsi", exact: true }),
  ).toBeVisible();
  expect((await rows(page))[0].completed).toBe(false);
});

test("duplicate remains a draft until saved and delete requires confirmation", async ({ page }) => {
  await create(page, true);
  const [original] = await rows(page);
  await page.getByRole("button", { name: "Duplikat Gedung resepsi", exact: true }).click();
  const form = page.getByRole("dialog", { name: "Duplikat anggaran", exact: true });
  await expect(form.getByLabel("Nama anggaran", { exact: true })).toHaveValue(
    "Salinan Gedung resepsi",
  );
  await expect(form.getByLabel("Dana sudah terkumpul", { exact: true })).toHaveCount(0);
  expect(await rows(page)).toHaveLength(1);
  await form.getByRole("button", { name: "Batal", exact: true }).click();
  expect(await rows(page)).toHaveLength(1);
  await page.getByRole("button", { name: "Duplikat Gedung resepsi", exact: true }).click();
  await form.getByRole("button", { name: "Simpan", exact: true }).click();
  await expect(form).toBeHidden();
  const [source, copy] = await rows(page);
  expect(source).toEqual(original);
  expect(copy.id).not.toBe(source.id);
  expect(copy.createdAt).not.toBe(source.createdAt);
  expect(copy.completed).toBe(false);
  await page.getByRole("button", { name: "Hapus Salinan Gedung resepsi", exact: true }).click();
  const confirmation = page.getByRole("dialog", { name: "Hapus anggaran?", exact: true });
  await confirmation.getByRole("button", { name: "Batal", exact: true }).click();
  expect(await rows(page)).toHaveLength(2);
  await page.getByRole("button", { name: "Hapus Salinan Gedung resepsi", exact: true }).click();
  await confirmation.getByRole("button", { name: "Hapus anggaran", exact: true }).click();
  await expect(confirmation).toBeHidden();
  expect(await rows(page)).toEqual([original]);
});

test("filters support old rows and mobile cards without horizontal overflow", async ({ page }) => {
  await page.goto("/planner/finance", { waitUntil: "domcontentloaded" });
  await openBudgets(page);
  await page.getByRole("button", { name: "Catat anggaran", exact: true }).waitFor();
  await page.evaluate(
    (storageKey) =>
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          version: 2,
          revision: 0,
          used: {},
          resources: {
            finance: [
              { id: "legacy", title: "Anggaran lama", amount: 500000, notes: "Deskripsi lama" },
              {
                id: "late",
                title: "Katering",
                amount: 1000000,
                purpose: "DP",
                priority: "Tinggi",
                dueDate: "2020-01-01",
              },
              { id: "ready", title: "Busana", amount: 300000, completed: true },
            ],
          },
        }),
      ),
    key,
  );
  await page.reload({ waitUntil: "domcontentloaded" });
  await openBudgets(page);
  await page.getByLabel("Prioritas", { exact: true }).selectOption("Tinggi");
  await page.getByLabel("Tenggat", { exact: true }).selectOption("Lewat tenggat");
  await page.getByLabel("Cari anggaran", { exact: true }).fill("DP");
  await expect(page.getByRole("button", { name: "Edit Katering", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Edit Anggaran lama", exact: true })).toHaveCount(
    0,
  );
  await page.setViewportSize({ width: 375, height: 900 });
  await page.screenshot({ path: ".review-tmp/budget-mobile.png", fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByLabel("Prioritas", { exact: true }).selectOption("Normal");
  await page.getByLabel("Tenggat", { exact: true }).selectOption("Tanpa tenggat");
  await page.getByLabel("Cari anggaran", { exact: true }).fill("lama");
  await expect(page.getByRole("button", { name: "Edit Anggaran lama", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Edit Anggaran lama", exact: true }).click();
  const form = page.getByRole("dialog", { name: "Edit anggaran", exact: true });
  await expect(form.getByLabel("Deskripsi anggaran", { exact: true })).toHaveValue(
    "Deskripsi lama",
  );
});

test("failed storage preserves the budget draft and does not create a row", async ({ page }) => {
  await page.goto("/planner/finance", { waitUntil: "domcontentloaded" });
  await openBudgets(page);
  await page.getByRole("button", { name: "Catat anggaran", exact: true }).click();
  const form = page.getByRole("dialog", { name: "Anggaran baru", exact: true });
  await form.getByLabel("Nama anggaran", { exact: true }).fill("Draf belum tersimpan");
  await form.getByLabel("Target (Rp)", { exact: true }).fill("100000");
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new Error("Storage penuh untuk uji");
    };
  });
  await form.getByRole("button", { name: "Simpan", exact: true }).click();
  await expect(form.getByRole("alert")).toContainText("belum tersimpan");
  await expect(form.getByLabel("Nama anggaran", { exact: true })).toHaveValue(
    "Draf belum tersimpan",
  );
  await expect(form).toBeVisible();
  expect(await page.evaluate((storageKey) => localStorage.getItem(storageKey), key)).toBeNull();
});
