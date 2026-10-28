import { expect, test } from "@playwright/test";

const groups = [
  {
    name: "Rundown & Kepanitiaan",
    base: "/planner/rundown",
    routes: ["/planner/rundown", "/planner/calendar", "/planner/emergency"],
  },
  {
    name: "Seserahan & Moodboard",
    base: "/planner/seserahan",
    routes: ["/planner/seserahan", "/planner/moodboard"],
  },
  {
    name: "Catatan Vendor Manual",
    base: "/marketplace",
    routes: ["/marketplace", "/marketplace/favorites"],
  },
  {
    name: "Pesanan & Kontrak",
    base: "/marketplace/bundles",
    routes: ["/marketplace/bundles", "/checkout/services"],
  },
  {
    name: "Studio Undangan",
    base: "/planner/invitations",
    routes: ["/planner/invitations", "/planner/invitations/studio"],
  },
];

for (const width of [1440, 375]) {
  test(`feature groups expose their secondary destinations as tabs at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const group of groups) {
      await page.goto(group.base);
      const nav = page.getByRole("navigation", { name: `Bagian ${group.name}`, exact: true });
      await expect(nav.getByRole("link")).toHaveCount(group.routes.length);
      await expect(page.getByRole("button", { name: /^Pilihan / })).toHaveCount(0);
      for (const href of group.routes.filter((route) => !route.endsWith("/studio"))) {
        await nav.locator(`a[href="${href}"]`).click();
        await expect(page).toHaveURL(new RegExp(`${href}$`));
        await expect(nav.locator(`a[href="${href}"]`)).toHaveAttribute("aria-current", "page");
        const h1 = page.locator("main#main-content").getByRole("heading", { level: 1 });
        await expect(h1).toHaveCount(1);
        const headingBox = await h1.boundingBox(),
          navBox = await nav.boundingBox();
        expect(headingBox!.y + headingBox!.height).toBeLessThanOrEqual(navBox!.y);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        );
      }
    }
  });
}

test("studio feature tab preserves the unsaved-change exit guard", async ({ page }) => {
  await page.goto("/planner/invitations/studio");
  const nav = page.getByRole("navigation", { name: "Fitur undangan", exact: true });
  await expect(nav.getByText("Studio visual", { exact: true })).toHaveAttribute(
    "aria-current",
    "page",
  );
  const heading = await page
    .getByRole("heading", { level: 1, name: "Studio Undangan", exact: true })
    .boundingBox();
  const navigation = await nav.boundingBox();
  expect(heading!.y + heading!.height).toBeLessThanOrEqual(navigation!.y);
  await page.getByRole("button", { name: "Form", exact: true }).click();
  await page.getByLabel("Nama mempelai pria", { exact: true }).fill("Draf belum tersimpan");
  await nav.getByRole("button", { name: "Kembali ke daftar undangan", exact: true }).click();
  await expect(
    page.getByRole("dialog", { name: "Perubahan belum tersinkron", exact: true }),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/planner\/invitations\/studio$/);
  await page.getByRole("button", { name: "Lanjut mengedit", exact: true }).click();
  await expect(page.getByLabel("Nama mempelai pria", { exact: true })).toHaveValue(
    "Draf belum tersimpan",
  );
});

for (const width of [1440, 375]) {
  test(`customer menu route audit fits and uses compact controls at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const route of [
      "/dashboard",
      "/planner/tasks",
      "/planner/kua",
      "/planner/rundown",
      "/planner/calendar",
      "/planner/emergency",
      "/planner/catering",
      "/planner/seserahan",
      "/planner/moodboard",
      "/planner/finance",
      "/planner/guests",
      "/planner/invitations",
      "/planner/wedding-kit",
      "/marketplace",
      "/marketplace/favorites",
      "/marketplace/bundles",
      "/checkout/services",
      "/account",
      "/account/plans",
      "/account/security",
      "/account/domain",
      "/account/support",
    ]) {
      const response = await page.goto(route);
      expect(response?.ok()).toBe(true);
      await expect(page.getByTestId("customer-shell")).toBeVisible();
      await expect(page.getByRole("heading").first()).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        route,
      ).toBe(true);
      const controls = page.locator('[data-ui-button]:not([data-ui-size="icon"]):visible');
      const dimensions = await controls.evaluateAll((nodes) =>
        nodes.map((node) => ({
          font: getComputedStyle(node).fontSize,
          height: getComputedStyle(node).minHeight,
        })),
      );
      expect(
        dimensions.every((value) => value.font === "13px" && value.height === "36px"),
        route,
      ).toBe(true);
      await page.screenshot({
        path: `.review-tmp/customer-consistency/${width}/${route.replaceAll("/", "_")}.png`,
      });
    }
    expect(errors).toEqual([]);
  });
}
