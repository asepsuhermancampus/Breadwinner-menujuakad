import { expect, test } from "@playwright/test";
import sharp from "sharp";
import { linkedSession } from "../helpers/linked-session";

for (const side of ["groom", "bride"] as const) {
  test(`profile portraits crop, persist and follow bride-first order for ${side} owner`, async ({
    page,
    context,
    browser,
    baseURL,
  }) => {
    const child = await linkedSession(context, browser, baseURL!, `portrait-${side}`, side);
    const female = side === "bride";
    if (female) await page.setViewportSize({ width: 375, height: 900 });
    await page.goto("/account");
    await expect(page.getByRole("region", { name: "Profil pasangan wanita" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Profil pasangan pria" })).toBeVisible();
    const left = await sharp({
      create: { width: 600, height: 600, channels: 3, background: "#ff0000" },
    })
      .png()
      .toBuffer();
    const landscape = await sharp({
      create: { width: 1200, height: 600, channels: 3, background: "#00ff00" },
    })
      .composite([{ input: left, left: 0, top: 0 }])
      .png()
      .toBuffer();
    await page
      .getByLabel("Unggah foto Anda", { exact: true })
      .setInputFiles({ name: "portrait.png", mimeType: "image/png", buffer: landscape });
    let crop = page.getByRole("dialog", { name: "Atur foto Anda", exact: true });
    await expect(crop.getByAltText("Pratinjau crop foto")).toBeVisible();
    await crop.getByLabel("Pembesaran foto").fill("2");
    const frame = crop.getByRole("group", { name: "Area crop foto 1:1" });
    const box = (await frame.boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.1, box.y + box.height * 0.5, { steps: 8 });
    await page.mouse.up();
    await page.screenshot({ path: `.review-tmp/portrait-crop-${side}.png` });
    await crop.getByRole("button", { name: "Simpan foto", exact: true }).click();
    await expect(crop).not.toBeVisible();
    await page.getByRole("button", { name: "Simpan perubahan", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Simpan perubahan", exact: true }),
    ).toBeDisabled();
    const blue = await sharp({
      create: { width: 600, height: 600, channels: 3, background: "#0000ff" },
    })
      .png()
      .toBuffer();
    const workspace = (await (await child.request.get("/api/workspace")).json()).workspace;
    const partnerJpeg = await sharp(blue).resize(512, 512).jpeg().toBuffer();
    expect(
      (
        await child.request.put(`/api/workspace/profile-photo?workspace=${workspace.id}`, {
          headers: { Origin: baseURL! },
          data: {
            slot: "partner",
            dataUrl: `data:image/jpeg;base64,${partnerJpeg.toString("base64")}`,
          },
        })
      ).ok(),
    ).toBe(true);
    await page.reload();
    const portraits = page.locator("header [data-header-avatar] img");
    await expect(portraits).toHaveCount(2);
    await expect(portraits.nth(0)).toHaveAttribute("alt", "Foto Latifah");
    await expect(portraits.nth(1)).toHaveAttribute("alt", "Foto Suep");
    const own = page.locator("header").getByAltText(female ? "Foto Latifah" : "Foto Suep");
    const photo = await context.request.get((await own.getAttribute("src"))!);
    expect(photo.ok()).toBe(true);
    const stored = await photo.body(),
      metadata = await sharp(stored).metadata();
    expect([metadata.width, metadata.height]).toEqual([512, 512]);
    const channels = (await sharp(stored).stats()).channels;
    expect(channels[1]!.mean).toBeGreaterThan(245);
    expect(channels[0]!.mean).toBeLessThan(10);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const picker = page.waitForEvent("filechooser");
    await page
      .getByRole("region", { name: female ? "Profil pasangan wanita" : "Profil pasangan pria" })
      .getByRole("button", { name: "Ganti foto", exact: true })
      .click();
    await (await picker).setFiles({ name: "new.png", mimeType: "image/png", buffer: blue });
    crop = page.getByRole("dialog", { name: "Atur foto Anda", exact: true });
    await expect(crop.getByAltText("Pratinjau crop foto")).toBeVisible();
    await page.route("**/api/workspace", async (route) => {
      if (route.request().method() === "PATCH")
        await route.fulfill({
          status: 500,
          json: { error: "Foto belum tersimpan. Coba kembali." },
        });
      else await route.continue();
    });
    await crop.getByRole("button", { name: "Simpan foto", exact: true }).click();
    await expect(crop).not.toBeVisible();
    await page.getByRole("button", { name: "Simpan perubahan", exact: true }).click();
    await expect(page.getByRole("alert").filter({ hasText: "Foto belum tersimpan" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Simpan perubahan", exact: true })).toBeVisible();
    const viewport = page.viewportSize()!;
    for (const element of [
      page.getByRole("banner"),
      page.getByRole("region", { name: "Profil pasangan wanita" }),
      page.getByRole("region", { name: "Profil pasangan pria" }),
    ]) {
      const bounds = (await element.boundingBox())!;
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(viewport.width);
    }
    await page.screenshot({ path: `.review-tmp/profile-portraits-${side}.png`, fullPage: true });
    await page.unroute("**/api/workspace");
    await page.getByRole("button", { name: "Hapus foto Anda", exact: true }).click();
    await page.getByRole("button", { name: "Simpan perubahan", exact: true }).click();
    await expect(page.locator("header [data-header-avatar] img")).toHaveCount(1);
    await child.close();
    await expect(
      page.locator("header").getByAltText(female ? "Foto Suep" : "Foto Latifah"),
    ).toBeVisible();
    await page.reload();
    await expect(page.locator("header [data-header-avatar] img")).toHaveCount(1);
  });
}
