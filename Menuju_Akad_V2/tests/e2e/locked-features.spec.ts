import { test, expect } from "@playwright/test";
import { customerSession, seedCustomerPayment } from "../helpers/customer-session";

test("Free features stay visible under accessible locks without fetching paid resources", async ({
  context,
  page,
  baseURL,
}) => {
  await customerSession(context, baseURL!, "feature-lock-free");
  const paidRequests: string[] = [];
  page.on("request", (request) => {
    if (/\/api\/workspace\/resources\/(moodboard|studio-drafts)/.test(request.url()))
      paidRequests.push(request.url());
  });
  for (const [url, title] of [
    ["/planner/moodboard", "Moodboard"],
    ["/planner/invitations/studio", "Studio visual"],
    ["/planner/wedding-kit", "Ekspor PDF"],
  ]) {
    await page.goto(url!);
    const lock = page.getByRole("region", { name: `${title} terkunci` });
    await expect(lock).toBeVisible();
    await expect(lock.getByRole("link", { name: "Lihat paket" })).toHaveAttribute(
      "href",
      "/account/plans",
    );
    await expect(page.locator('[data-feature-content][inert][aria-hidden="true"]')).toBeVisible();
    await page.setViewportSize({ width: 360, height: 800 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  expect(paidRequests).toEqual([]);
  expect((await context.request.get(`${baseURL}/api/workspace/export`)).status()).toBe(403);
  await page.goto("/account");
  await expect(page.getByRole("region", { name: "Custom domain terkunci" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Prioritas bantuan terkunci" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Kirim permintaan bantuan", exact: true }),
  ).toBeVisible();
  await page.goto("/planner/invitations");
  await expect(page.getByRole("region", { name: "Multi-undangan terkunci" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Template Premium terkunci" })).toBeVisible();
});
test("Premium opens its features and keeps Lifetime domain locked", async ({
  context,
  page,
  baseURL,
}) => {
  const owner = await customerSession(context, baseURL!, "feature-lock-premium");
  seedCustomerPayment(owner, "premium", true);
  await page.goto("/planner/moodboard");
  await expect(page.getByRole("button", { name: "Tambah inspirasi" })).toBeVisible();
  await expect(page.locator("[data-feature-content][inert]")).toHaveCount(0);
  await page.goto("/account");
  await expect(page.getByRole("region", { name: "Custom domain terkunci" })).toBeVisible();
});
