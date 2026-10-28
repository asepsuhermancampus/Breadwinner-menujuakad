import { expect, test } from "@playwright/test";
import { randomUUID } from "node:crypto";
test.beforeEach(() =>
  test.skip(
    !process.env.E2E_CUSTOMER_DB?.includes("menuju-akad-customer-e2e-"),
    "Isolated registration database required",
  ),
);
test("new partner registers and signs in from invitation on wildcard local server", async ({
  page,
  browser,
  baseURL,
}) => {
  const owner = await browser.newContext({ baseURL: baseURL!, ignoreHTTPSErrors: true });
  const ownerPage = await owner.newPage();
  await ownerPage.goto("/login");
  const parentEmail = `parent-register-${randomUUID()}@example.test`;
  const parentStatus = await ownerPage.evaluate(async (email) => {
    await fetch("/api/reviews/identity", { cache: "no-store" });
    return (
      await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Pemilik Akun",
          email,
          password: "Account testing 2026!",
          confirmation: "Account testing 2026!",
          consent: true,
        }),
      })
    ).status;
  }, parentEmail);
  expect(parentStatus).toBe(201);
  await ownerPage.getByLabel("Email", { exact: true }).fill(parentEmail);
  await ownerPage.getByLabel("Password", { exact: true }).fill("Account testing 2026!");
  await ownerPage.getByRole("button", { name: "Masuk", exact: true }).click();
  await expect(ownerPage).toHaveURL(/\/(dashboard|account)$/);
  const { token, workspaceId } = await ownerPage.evaluate(async () => {
    const workspace = (await (await fetch("/api/workspace")).json()).workspace;
    const invitation = await (
      await fetch("/api/workspace/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "invite" }),
      })
    ).json();
    return { token: invitation.token as string, workspaceId: workspace.id as string };
  });
  expect(token).toMatch(/^[a-f0-9]{64}$/);
  const target = `/join/${token}`;
  const staticContext = await browser.newContext({
    baseURL: baseURL!,
    javaScriptEnabled: false,
    ignoreHTTPSErrors: true,
  });
  const staticPage = await staticContext.newPage();
  await staticPage.goto(`/login?returnTo=${encodeURIComponent(target)}`);
  await expect(staticPage.getByRole("link", { name: "Buat akun", exact: true })).toHaveAttribute(
    "href",
    `/auth/register?returnTo=${encodeURIComponent(target)}`,
  );
  await staticContext.close();
  await page.goto(target);
  await expect(page).toHaveURL(/\/login\?returnTo=/);
  await page.getByRole("link", { name: "Buat akun", exact: true }).click();
  await expect(page).toHaveURL(/\/auth\/register\?returnTo=/);
  const email = `partner-register-${randomUUID()}@example.test`,
    password = "Account testing 2026!";
  await page.getByLabel("Nama lengkap", { exact: true }).fill("Pasangan Baru");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Konfirmasi password", { exact: true }).fill(password);
  await page.getByRole("checkbox").check();
  const registered = page.waitForResponse(
    (r) => r.url().endsWith("/api/auth/register") && r.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Buat akun", exact: true }).click();
  expect((await registered).status()).toBe(201);
  await expect(page).toHaveURL(new RegExp(`/join/${token}$`));
  await expect(
    page.getByRole("heading", { name: "Lengkapi profil pasangan", exact: true }),
  ).toBeVisible();
  await page.getByLabel("Nama lengkap", { exact: true }).fill("Pasangan Baru Lengkap");
  await page.getByLabel("Nama panggilan", { exact: true }).fill("Baru");
  await page.getByRole("button", { name: "Simpan profil & bergabung", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Profil berhasil disimpan", exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("Tautan Profil & Akses", { exact: true })).toHaveValue(
    `${baseURL}/account`,
  );
  await page.getByRole("link", { name: "Buka Profil & Akses", exact: true }).click();
  await expect(page).toHaveURL(/\/account$/);
  const workspace = await page.evaluate(
    async () => (await (await fetch("/api/workspace")).json()).workspace,
  );
  expect(workspace.id).toBe(workspaceId);
  expect(workspace.role).toBe("partner");
  expect(workspace.profile.partnerNickname).toBe("Baru");
  await owner.close();
});
test("ordinary registration keeps its normal sign-in confirmation", async ({ page }) => {
  await page.goto("/auth/register");
  await page.getByLabel("Nama lengkap", { exact: true }).fill("Akun Biasa");
  await page.getByLabel("Email", { exact: true }).fill(`ordinary-${randomUUID()}@example.test`);
  await page.getByLabel("Password", { exact: true }).fill("Account testing 2026!");
  await page.getByLabel("Konfirmasi password", { exact: true }).fill("Account testing 2026!");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Buat akun", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Pendaftaran berhasil" })).toBeVisible();
  expect(await page.evaluate(async () => (await fetch("/api/workspace")).status)).toBe(401);
  await expect(page).toHaveURL(/\/login\?registered=1/);
});
