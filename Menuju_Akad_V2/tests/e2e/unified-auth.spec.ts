import { expect, test, type Page } from "@playwright/test";
import { DatabaseSync } from "node:sqlite";
const password = "Passphrase testing 2026!";
test.beforeEach(() =>
  test.skip(
    !process.env["E2E_AUTH_DB"]?.includes("menuju-akad-auth-e2e-"),
    "Gunakan konfigurasi playwright.auth.config.ts dengan database terisolasi.",
  ),
);
async function login(page: Page, email: string, secret = password) {
  await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(secret);
  await page.getByRole("button", { name: "Masuk", exact: true }).click();
}
test("manual registration, persisted workspace, logout, login and isolation", async ({
  page,
  browser,
}) => {
  const email = `manual-${Date.now()}@example.test`;
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/auth/register");
  await expect(page.getByRole("button", { name: "Lanjutkan dengan Google" })).toBeVisible();
  await page.getByLabel("Nama lengkap").fill("Pengguna Manual");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Konfirmasi password", { exact: true }).fill(password);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Buat akun", exact: true }).click();
  await expect(page.getByRole("status").filter({ hasText: "Pendaftaran berhasil" })).toBeVisible();
  expect((await page.request.get("/api/workspace")).status()).toBe(401);
  await expect(page).toHaveURL(/\/login\?registered=1/);
  await expect(page.getByRole("button", { name: "Lanjutkan dengan Google" })).toBeVisible();
  await login(page, email);
  await expect(page).toHaveURL(/\/(dashboard|account)$/);
  const first = await (await page.request.get("/api/workspace")).json();
  expect(first.workspace.id).toBeTruthy();
  const updated = await page.request.patch("/api/workspace", {
    headers: { Origin: "http://localhost:3229" },
    data: { fullName: "Tersimpan setelah logout", partnerName: null },
  });
  expect(updated.ok()).toBe(true);
  expect((await page.request.get("/api/superadmin/reviews")).status()).toBe(401);
  await page.goto("/account");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole("button", { name: "Keluar", exact: true }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  expect((await page.request.get("/api/workspace")).status()).toBe(401);
  await login(page, email);
  await expect(page).toHaveURL(/\/(dashboard|account)$/);
  const second = await (await page.request.get("/api/workspace")).json();
  expect(second.workspace.id).toBe(first.workspace.id);
  expect(second.workspace.profile.fullName).toBe("Tersimpan setelah logout");
  const context = await browser.newContext({ baseURL: "http://localhost:3229" });
  expect((await context.request.get("/api/workspace")).status()).toBe(401);
  await context.close();
  await page.goto("/admin");
  await expect(page).not.toHaveURL(/\/admin$/);
});
test("masked browser autofill fields, failures, hostile origin and forged roles", async ({
  page,
}) => {
  await page.goto("/login?error=Configuration");
  await expect(page.getByLabel("Email", { exact: true })).toHaveAttribute(
    "autocomplete",
    "username",
  );
  await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute("type", "password");
  await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute(
    "autocomplete",
    "current-password",
  );
  for (const width of [360, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  await login(page, "superadmin@menujuakad.test", "wrong-password");
  await expect(
    page.getByRole("alert").filter({ hasText: "Email atau password tidak sesuai" }),
  ).toBeVisible();
  await expect(page.getByLabel("Email", { exact: true })).toHaveValue("superadmin@menujuakad.test");
  expect((await page.request.get("/api/superadmin/reviews")).status()).toBe(401);
  const response = await page.request.post("/api/auth/register", {
    headers: { Origin: "https://evil.test" },
    data: {
      name: "Bad User",
      email: "bad@example.test",
      password,
      confirmation: password,
      consent: true,
      role: "superadmin",
    },
  });
  expect(response.status()).toBe(403);
});
test("server role changes are enforced immediately and revoked cookies cannot replay", async ({
  page,
  context,
}) => {
  await login(page, "superadmin@menujuakad.test", "AkadReview!2026");
  await expect(page).toHaveURL(/\/superadmin\/reviews$/);
  const cookies = await context.cookies();
  const db = new DatabaseSync(process.env["E2E_AUTH_DB"]!);
  try {
    db.prepare("UPDATE accounts SET role='customer' WHERE email=?").run(
      "superadmin@menujuakad.test",
    );
    expect((await page.request.get("/api/superadmin/reviews")).status()).toBe(401);
    db.prepare("UPDATE accounts SET role='superadmin' WHERE email=?").run(
      "superadmin@menujuakad.test",
    );
    await page.reload();
    await page.getByRole("button", { name: "Keluar", exact: true }).click();
    await expect(page).toHaveURL(/\/login$/);
    await context.addCookies(cookies);
    expect((await page.request.get("/api/superadmin/reviews")).status()).toBe(401);
  } finally {
    db.close();
  }
});

test("password changes end old sessions and retain the account workspace", async ({
  page,
  context,
}) => {
  const email = `security-${Date.now()}@example.test`,
    origin = "http://localhost:3229";
  await page.request.get("/api/reviews/identity");
  const created = await page.request.post("/api/auth/register", {
    headers: { Origin: origin },
    data: {
      name: "Security User",
      email,
      password,
      confirmation: password,
      consent: true,
      role: "superadmin",
    },
  });
  expect(created.status()).toBe(201);
  await login(page, email);
  await expect(page).toHaveURL(/\/(dashboard|account)$/);
  const session = await (await page.request.get("/api/auth/session")).json();
  expect(session.user.role).toBe("customer");
  const workspace = await (await page.request.get("/api/workspace")).json(),
    oldCookies = await context.cookies();
  await page.goto("/account/security");
  await page.getByLabel("Password saat ini", { exact: true }).fill(password);
  await page.getByLabel("Password baru", { exact: true }).fill("A new testing passphrase!");
  await page.getByLabel("Konfirmasi password", { exact: true }).fill("A new testing passphrase!");
  await page.getByRole("button", { name: "Simpan password", exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
  await context.addCookies(oldCookies);
  expect((await page.request.get("/api/workspace")).status()).toBe(401);
  await context.clearCookies();
  await login(page, email, password);
  await expect(
    page.getByRole("alert").filter({ hasText: "Email atau password tidak sesuai" }),
  ).toBeVisible();
  await login(page, email, "A new testing passphrase!");
  await expect(page).toHaveURL(/\/(dashboard|account)$/);
  expect((await (await page.request.get("/api/workspace")).json()).workspace.id).toBe(
    workspace.workspace.id,
  );
});

test("persisted admin role uses its guarded operations dashboard", async ({ page }) => {
  const email = `operator-${Date.now()}@example.test`;
  await page.request.get("/api/reviews/identity");
  expect(
    (
      await page.request.post("/api/auth/register", {
        headers: { Origin: "http://localhost:3229" },
        data: { name: "Operations User", email, password, confirmation: password, consent: true },
      })
    ).status(),
  ).toBe(201);
  const db = new DatabaseSync(process.env["E2E_AUTH_DB"]!);
  try {
    db.prepare("UPDATE accounts SET role='admin' WHERE email=?").run(email);
  } finally {
    db.close();
  }
  await login(page, email);
  await expect(page).toHaveURL(/\/admin$/);
  await expect(
    page.getByRole("heading", { name: "Gambaran bisnis, keputusan berikutnya.", exact: true }),
  ).toBeVisible();
  await page.setViewportSize({ width: 1760, height: 1200 });
  expect((await page.locator("aside").first().boundingBox())?.width).toBe(240);
  expect((await page.locator("header").first().boundingBox())?.height).toBe(76);
  expect((await page.request.get("/api/superadmin/reviews")).status()).toBe(401);
  expect((await page.request.get("/api/operations/helpdesk")).status()).toBe(200);
});
