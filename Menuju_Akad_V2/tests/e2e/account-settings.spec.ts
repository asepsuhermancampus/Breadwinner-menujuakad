import { expect, test } from "@playwright/test";
import { customerSession, seedCustomerPayment } from "../helpers/customer-session";

const tabs = [
  ["Profil & akses", "/account"],
  ["Paket & langganan", "/account/plans"],
  ["Privasi & keamanan", "/account/security"],
  ["Custom domain", "/account/domain"],
  ["Prioritas bantuan", "/account/support"],
] as const;

for (const width of [1600, 375]) {
  test(`settings menu provides five separate tabs without a sidebar overflow at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/dashboard");
    if (width === 375)
      await page.getByRole("button", { name: "Buka navigasi", exact: true }).click();
    const dock = page.getByRole("complementary", { name: "Navigasi ruang bersama" });
    await expect(dock.getByRole("button", { name: "Buka menu akun" })).toHaveCount(0);
    await dock.getByRole("link", { name: "Pengaturan", exact: true }).click();
    await expect(page).toHaveURL(/\/account$/);
    for (const [label, href] of tabs) {
      const navigation = page.getByRole("navigation", { name: "Pengaturan akun", exact: true });
      await expect(navigation.getByRole("link")).toHaveText(tabs.map(([title]) => title));
      await navigation.getByRole("link", { name: label, exact: true }).click();
      await page.waitForURL(`**${href}`);
      await expect(page.getByRole("heading", { name: "Pengaturan", exact: true })).toBeVisible();
      await expect(navigation.getByRole("link", { name: label, exact: true })).toHaveAttribute(
        "aria-current",
        "page",
      );
      await expect(page.getByRole("region", { name: label, exact: true })).toBeVisible();
      await expect(page.locator("[data-settings-panel]")).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
    await expect(
      page.getByRole("link", { name: "Masuk atau daftar", exact: true }),
    ).toHaveAttribute("href", "/login?returnTo=%2Faccount%2Fsupport");
  });
}

test("legacy domain and support links resolve to their dedicated settings tab", async ({
  page,
}) => {
  for (const [section, label] of [
    ["domain", "Custom domain"],
    ["support", "Prioritas bantuan"],
  ] as const) {
    await page.goto(`/account?section=${section}`);
    await expect(page).toHaveURL(new RegExp(`/account/${section}$`));
    await expect(
      page
        .getByRole("navigation", { name: "Pengaturan akun" })
        .getByRole("link", { name: label, exact: true }),
    ).toHaveAttribute("aria-current", "page");
  }
  const response = await page.goto("/account/unrecognized-tab");
  expect([200, 404]).toContain(response?.status());
  await expect(
    page.getByRole("heading", { name: "Halaman belum tersedia", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Pengaturan akun" })).toHaveCount(0);
});

test("Free settings keep domain locked and standard support available in separate tabs", async ({
  page,
  context,
  baseURL,
}) => {
  await customerSession(context, baseURL!, "settings-free");
  const domainRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/api/workspace/domain")) domainRequests.push(request.url());
  });
  await page.goto("/account");
  await expect(page.getByLabel("Nama lengkap", { exact: true })).toBeVisible();
  await expect(page.getByRole("region", { name: "Custom domain terkunci" })).toHaveCount(0);
  await expect(page.getByLabel("Pesan bantuan")).toHaveCount(0);
  await page.goto("/account/domain");
  await expect(page.getByRole("region", { name: "Custom domain terkunci" })).toBeVisible();
  expect(domainRequests).toEqual([]);
  await page.goto("/account/support");
  await expect(page.getByRole("region", { name: "Prioritas bantuan terkunci" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Pesan bantuan", exact: true })).toBeEditable();
  await expect(page.getByRole("button", { name: "Keluar", exact: true })).toBeVisible();
});

test("Lifetime domain and priority support retain their existing controls", async ({
  page,
  context,
  baseURL,
}) => {
  const owner = await customerSession(context, baseURL!, "settings-lifetime");
  seedCustomerPayment(owner, "lifetime", true);
  await page.goto("/account/domain");
  await expect(page.getByLabel("Domain", { exact: true })).toBeEditable();
  await expect(page.getByRole("button", { name: "Simpan domain" })).toBeEnabled();
  await expect(page.getByRole("region", { name: "Custom domain terkunci" })).toHaveCount(0);
  await page.goto("/account/support");
  await expect(
    page.getByRole("heading", { name: "Bantuan pasangan · Prioritas Lifetime" }),
  ).toBeVisible();
  await expect(page.getByLabel("Pesan bantuan")).toBeEditable();
  await expect(page.getByRole("region", { name: "Prioritas bantuan terkunci" })).toHaveCount(0);
});
