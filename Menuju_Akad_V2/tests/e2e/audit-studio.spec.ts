import { expect, test } from "@playwright/test";

test.describe("Studio audit regression tests", () => {
  let consoleErrors: string[] = [];

  test.beforeEach(({ page }) => {
    consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" || /hydration/i.test(msg.text())) {
        consoleErrors.push(msg.text());
      }
    });
    page.on("pageerror", (err) => {
      consoleErrors.push(err.message);
    });
  });

  test.afterEach(() => {
    expect(consoleErrors).toEqual([]);
  });

  test("default cover preserves locked 340 height and crop behavior", async ({ page }) => {
    await page.goto("/planner/invitations/studio");
    await page.getByRole("button", { name: "Layer", exact: true }).click();
    await page.getByRole("option", { name: /Foto sampul/ }).click();
    await expect(page.getByLabel("H", { exact: true })).toBeDisabled();
    await expect(page.getByLabel("H", { exact: true })).toHaveValue("340");
    await page.getByLabel("Ukuran preview", { exact: true }).selectOption("375");
    await page.getByRole("button", { name: "Preview tamu", exact: true }).click();
    const frame = page.frameLocator('iframe[title="Undangan preview 375"]');
    const geo = await frame.locator(".photo-wrap").evaluate((el) => ({
      container: Math.round(el.getBoundingClientRect().height),
      cover: Math.round(el.querySelector(".cover-node")!.getBoundingClientRect().height),
    }));
    expect(geo.container).toBe(340);
    expect(geo.cover).toBe(340);
  });

  for (const height of [170, 340, 510]) {
    test(`unlocked cover resize ${height} updates preview 375 height`, async ({ page }) => {
      await page.goto("/planner/invitations/studio");
      await page.getByRole("button", { name: "Layer", exact: true }).click();
      await page.getByRole("option", { name: /Foto sampul/ }).click();
      await page.getByRole("button", { name: "Buka kunci", exact: true }).click();
      await page.getByLabel("H", { exact: true }).fill(String(height));
      await page.getByLabel("Ukuran preview", { exact: true }).selectOption("375");
      await page.getByRole("button", { name: "Preview tamu", exact: true }).click();
      const frame = page.frameLocator('iframe[title="Undangan preview 375"]');
      const geo = await frame.locator(".photo-wrap").evaluate((el) => ({
        container: Math.round(el.getBoundingClientRect().height),
        cover: Math.round(el.querySelector(".cover-node")!.getBoundingClientRect().height),
      }));
      expect(geo.container).toBe(height);
      expect(geo.cover).toBe(height);
    });
  }

  test("responsive 1280 preview cover fills 720 frame and applies desktop margin", async ({
    page,
  }) => {
    await page.goto("/planner/invitations/studio");
    await page.getByLabel("Ukuran preview", { exact: true }).selectOption("1280");
    await page.getByRole("button", { name: "Preview tamu", exact: true }).click();
    const frame = page.frameLocator('iframe[title="Undangan preview 1280"]');
    const geo = await frame.locator(".photo-wrap").evaluate((el) => ({
      container: Math.round(el.getBoundingClientRect().height),
      cover: Math.round(el.querySelector(".cover-node")!.getBoundingClientRect().height),
    }));
    expect(geo.container).toBe(720);
    expect(geo.cover).toBe(720);
  });

  test("theme gallery shows Tema Aktif only for published project with actual version", async ({
    page,
  }) => {
    await page.goto("/planner/invitations/studio?project=inv-engagement");
    await expect(page.getByText("Draf v1 · versi aktif belum ada", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: /RSVP.*Privasi/ }).click();
    await page.getByText("Galeri Tema", { exact: true }).click();
    await expect(page.getByText(/Tema Aktif/)).not.toBeVisible();

    await page.goto("/planner/invitations/studio");
    await page.getByRole("button", { name: /RSVP.*Privasi/ }).click();
    await page.getByText("Galeri Tema", { exact: true }).click();
    await expect(page.getByText(/✓ Tema Aktif/)).toBeVisible();
  });

  test("public fonts have CORS header, resolve via document.fonts.load, and API routes do not gain broad CORS", async ({
    page,
  }) => {
    const fontRes = await page.request.get("/assets/fonts/jakarta.woff2");
    expect(fontRes.status()).toBe(200);
    expect(fontRes.headers()["access-control-allow-origin"]).toBe("*");

    const instrumentRes = await page.request.get("/assets/fonts/instrument.woff2");
    expect(instrumentRes.status()).toBe(200);
    expect(instrumentRes.headers()["access-control-allow-origin"]).toBe("*");

    const apiRes = await page.request.get("/api/health/live");
    expect(apiRes.status()).toBe(200);
    expect(apiRes.headers()["access-control-allow-origin"]).toBeUndefined();

    await page.goto("/planner/invitations/studio");
    await page.getByLabel("Ukuran preview", { exact: true }).selectOption("375");
    await page.getByRole("button", { name: "Preview tamu", exact: true }).click();
    const frame = page.frameLocator('iframe[title="Undangan preview 375"]');
    const fontsLoaded = await frame.locator("body").evaluate(async () => {
      const [jakarta, instrument] = await Promise.all([
        document.fonts.load("16px Jakarta"),
        document.fonts.load("16px Instrument"),
      ]);
      return jakarta.length > 0 && instrument.length > 0;
    });
    expect(fontsLoaded).toBe(true);
  });
});
