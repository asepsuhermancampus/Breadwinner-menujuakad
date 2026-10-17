import { expect, test, type Page } from "@playwright/test";

async function createInvite(page: Page) {
  await page.goto("/preview-ui/onboarding/partner");
  await page.getByRole("button", { name: "Buat tautan undangan", exact: true }).click();
  const link = page.locator('a[href^="/preview-ui/join/"]');
  await expect(link).toBeVisible();
  const path = await link.getAttribute("href");
  if (!path) throw new Error("Expected a local partner invite link");
  expect(path).toMatch(/^\/preview-ui\/join\/[A-Za-z0-9_-]{43}$/);
  return path;
}

test("pairing uses a local QR and permits one redemption without duplicate membership", async ({
  page,
}) => {
  const path = await createInvite(page);
  await expect(page.getByAltText("QR tautan simulasi pasangan pada perangkat ini")).toBeVisible();
  await expect(page.locator('a[href*="wa.me"], a[href*="whatsapp.com"]')).toHaveCount(0);
  await page.goto(path);
  await page.getByRole("button", { name: "Terima undangan simulasi", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Kalian sudah terhubung", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Lihat ruang kita", exact: true }).click();
  await expect(page).toHaveURL(/\/onboarding\/success$/);
  await expect(
    page.getByRole("heading", { name: "Kalian sudah terhubung", exact: true }),
  ).toBeVisible();
  await page.goto(path);
  await expect(page.getByText(/Tautan sudah digunakan/)).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Terima undangan simulasi", exact: true }),
  ).toHaveCount(0);
  await expect
    .poll(() =>
      page.evaluate(() => {
        const stored = localStorage.getItem("ma-v2-workspace");
        return stored ? (JSON.parse(stored) as unknown) : null;
      }),
    )
    .toMatchObject({
      members: [
        { actorId: "actor-risa", workspaceId: "workspace-couple", role: "owner" },
        { actorId: "actor-andi", workspaceId: "workspace-couple", role: "partner" },
      ],
    });
});

test("a revoked partner invite cannot be redeemed and offers a replacement", async ({ page }) => {
  const oldPath = await createInvite(page);
  await page.getByRole("button", { name: "Cabut tautan", exact: true }).click();
  await page
    .getByRole("dialog", { name: "Cabut tautan pasangan?" })
    .getByRole("button", { name: "Cabut tautan", exact: true })
    .click();
  await expect(page.getByText(/Tautan sudah dicabut/)).toBeVisible();
  await page.goto(oldPath);
  await expect(page.getByText(/Tautan sudah dicabut/)).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Terima undangan simulasi", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("link", { name: "Kembali ke undangan pasangan", exact: true }).click();
  await page.getByRole("button", { name: "Buat tautan undangan", exact: true }).click();
  const nextPath = await page.locator('a[href^="/preview-ui/join/"]').getAttribute("href");
  expect(nextPath).not.toBe(oldPath);
});

test("an expired capability has a recovery path and is never admitted", async ({ page }) => {
  const path = await createInvite(page);
  await page.evaluate(() => {
    const stored = localStorage.getItem("ma-v2-workspace");
    if (!stored) throw new Error("Expected an invite draft");
    const draft = JSON.parse(stored) as { invite: { expiresAt: number } };
    draft.invite.expiresAt = Date.now() - 1;
    localStorage.setItem("ma-v2-workspace", JSON.stringify(draft));
  });
  await page.goto(path);
  await expect(page.getByText(/Tautan kedaluwarsa/)).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Terima undangan simulasi", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("link", { name: "Kembali ke undangan pasangan", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Buat tautan undangan", exact: true }),
  ).toBeVisible();
});
