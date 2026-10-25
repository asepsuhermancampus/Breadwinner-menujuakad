import { test, expect } from "@playwright/test";
import { customerSession, seedCustomerPayment } from "../helpers/customer-session";
test("Lifetime opens real features and persists account tasks", async ({
  context,
  page,
  baseURL,
}) => {
  const owner = await customerSession(context, baseURL!, "plan-lifetime");
  seedCustomerPayment(owner, "lifetime", true);
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Nanti saja" }).click();
  await expect(page.getByRole("link", { name: "Lifetime", exact: true })).toBeVisible();
  await page.goto("/planner/tasks");
  const saved = page.waitForResponse(
    (res) =>
      res.url().includes("/api/workspace/resources/tasks") &&
      res.request().method() === "PUT" &&
      res.status() === 200,
  );
  await page.getByRole("button", { name: "Tambah tugas" }).click();
  await saved;
  await page.reload();
  await expect(page.getByText("Tugas baru tanpa judul", { exact: true }).first()).toBeVisible();
  await page.goto("/account");
  await expect(page.getByRole("button", { name: "Simpan domain", exact: true })).toBeVisible();
  const response = await context.request.get(`${baseURL}/api/workspace/export`);
  expect(response.status()).toBe(200);
  expect(await response.text()).toContain("Tugas baru tanpa judul");
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test("Free cannot forge feature access or read another account invoice", async ({
  context,
  baseURL,
}) => {
  const owner = await customerSession(context, baseURL!, "plan-isolation"),
    payment = seedCustomerPayment(owner, "premium");
  const origin = new URL(baseURL!).origin;
  const denied = await context.request.put(`${baseURL}/api/workspace/resources/moodboard`, {
    headers: { Origin: origin },
    data: { revision: 0, data: [] },
  });
  expect(denied.status()).toBe(403);
  await customerSession(context, baseURL!, "plan-other-account");
  const response = await context.request.get(
    `${baseURL}/api/payments/plans/${payment.id}?checkout=1`,
  );
  expect(response.status()).toBe(404);
});

test("customer Studio persists drafts and keeps published snapshots separate", async ({
  context,
  page,
  baseURL,
}) => {
  const owner = await customerSession(context, baseURL!, "studio-customer");
  seedCustomerPayment(owner, "premium", true);
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Nanti saja" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.goto("/planner/invitations/studio");
  await page.getByRole("button", { name: "Form", exact: true }).click();
  await page.getByLabel("Nama mempelai pria").fill("Budi");
  await page.getByLabel("Nama mempelai wanita").fill("Sari");
  await page.getByLabel("Judul pasangan").fill("Budi & Sari");
  await page.getByLabel("Tanggal acara", { exact: true }).fill("2030-06-20");
  await page.getByLabel("Lokasi", { exact: true }).fill("Gedung Kebahagiaan");
  await page.getByLabel("Pin venue sudah ditinjau").check();
  await page.getByLabel("Batas RSVP").fill("2030-06-19");
  await expect(page.getByText("✓ Draf tersimpan pada akun", { exact: true })).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Form", exact: true }).click();
  await expect(page.getByLabel("Nama mempelai pria")).toHaveValue("Budi");
  await page.getByRole("button", { name: "Review & publikasi" }).click();
  await page
    .getByRole("checkbox", {
      name: "Saya sudah memeriksa konten yang akan ditampilkan kepada tamu.",
    })
    .check();
  await page.getByRole("button", { name: "Terbitkan undangan", exact: true }).click();
  const link = page.getByRole("link", { name: "Buka undangan publik" });
  await expect(link).toBeVisible();
  const publicUrl = (await link.getAttribute("href"))!;
  const publicPage = await context.request.get(`${baseURL}${publicUrl}`);
  expect(publicPage.status()).toBe(200);
  expect(await publicPage.text()).toContain("Gedung Kebahagiaan");
  await page.getByRole("button", { name: "Tutup dialog" }).click();
  await page.getByLabel("Lokasi", { exact: true }).fill("Draf rahasia belum diterbitkan");
  await expect(page.getByText("✓ Draf tersimpan pada akun", { exact: true })).toBeVisible();
  expect(await (await context.request.get(`${baseURL}${publicUrl}`)).text()).not.toContain(
    "Draf rahasia",
  );
});
