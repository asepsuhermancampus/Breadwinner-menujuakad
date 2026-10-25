import { test, expect } from "@playwright/test";
import { customerSession, seedCustomerPayment } from "../helpers/customer-session";
test("logout clears account data in another open tab", async ({ context, page, baseURL }) => {
  await customerSession(context, baseURL!, "dashboard-two-tabs");
  await page.goto("/planner/kua");
  await page.getByLabel("Nama dokumen").fill("Data akun privat dua tab");
  await page.getByRole("button", { name: "Tambah", exact: true }).click();
  await expect(page.getByLabel("Nama dokumen")).toHaveValue("");
  const other = await context.newPage();
  await other.goto("/planner/kua");
  await expect(other.getByText("Data akun privat dua tab", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Keluar", exact: true }).click();
  await expect(other.getByText("Mode percobaan", { exact: true })).toBeVisible();
  await expect(other.getByText("Data akun privat dua tab", { exact: true })).toHaveCount(0);
});
test("paid moodboard preserves a rejected draft and shows no falsely saved inspiration", async ({
  context,
  page,
  baseURL,
}) => {
  const owner = await customerSession(context, baseURL!, "dashboard-moodboard-rejection");
  seedCustomerPayment(owner, "premium", true);
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Nanti saja" }).click();
  await page.goto("/planner/moodboard");
  await page.route("**/api/workspace/resources/moodboard?*", async (route) => {
    if (route.request().method() === "PUT")
      await route.fulfill({ status: 500, json: { error: "Gagal menyimpan uji" } });
    else await route.continue();
  });
  await page.getByRole("button", { name: "Tambah inspirasi" }).click();
  await page.getByLabel("Judul inspirasi").fill("Draf moodboard ditolak");
  await page.getByRole("button", { name: "Simpan ke moodboard" }).click();
  await expect(page.getByLabel("Judul inspirasi")).toHaveValue("Draf moodboard ditolak");
  await expect(page.getByRole("dialog").getByRole("alert")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Draf moodboard ditolak" })).toHaveCount(0);
});
test("Free account exceeds ten mutations, has correct nav and signs out into isolated guest trial", async ({
  context,
  page,
  baseURL,
}) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Masuk", exact: true }).first()).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Coba dashboard gratis", exact: true }).first(),
  ).toHaveAttribute("href", "/dashboard");
  await page.goto("/planner/kua");
  await page.getByLabel("Nama dokumen").fill("Dokumen trial terpisah");
  await page.getByRole("button", { name: "Tambah", exact: true }).click();
  await expect(page.getByText("0 dari 5 checklist aktif", { exact: true })).toBeVisible();
  await customerSession(context, baseURL!, "dashboard-free");
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Dashboard", exact: true })).toBeVisible();
  await expect(
    page.locator("header").first().getByRole("link", { name: "Masuk", exact: true }),
  ).toHaveCount(0);
  await page.goto("/planner/kua");
  await expect(page.getByText("Dokumen trial terpisah", { exact: true })).toHaveCount(0);
  for (let n = 0; n < 11; n++) {
    await page.getByLabel("Nama dokumen").fill(`Dokumen akun ${n}`);
    await page.getByRole("button", { name: "Tambah", exact: true }).click();
    await expect(page.getByLabel("Nama dokumen")).toHaveValue("");
  }
  await page.reload();
  await expect(page.getByText("Dokumen akun 10", { exact: true })).toBeVisible();
  await expect(page.getByText("Mode percobaan", { exact: true })).toHaveCount(0);
  await page.goto("/account/plans");
  await expect(page.getByTestId("plan-premium")).toBeVisible();
  await page.getByRole("button", { name: "Keluar", exact: true }).click();
  await page.waitForURL("**/dashboard");
  await expect(page.getByText("Mode percobaan", { exact: true })).toBeVisible();
  await page.goto("/planner/kua");
  await expect(page.getByText("Dokumen trial terpisah", { exact: true })).toBeVisible();
  await expect(page.getByText("Dokumen akun 10", { exact: true })).toHaveCount(0);
});
for (const plan of ["premium", "lifetime"] as const)
  test(`${plan} shows actual tier and keeps trial absent`, async ({ context, page, baseURL }) => {
    const owner = await customerSession(context, baseURL!, `dashboard-${plan}`);
    seedCustomerPayment(owner, plan, true);
    await page.goto("/dashboard");
    await page.getByRole("button", { name: "Nanti saja" }).click();
    await expect(
      page.getByRole("link", { name: plan === "premium" ? "Premium" : "Lifetime", exact: true }),
    ).toBeVisible();
    await expect(page.getByText("Mode percobaan", { exact: true })).toHaveCount(0);
    await page.goto("/planner/moodboard");
    await expect(page.getByRole("button", { name: "Tambah inspirasi" })).toBeVisible();
  });
