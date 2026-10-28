import { expect, test, type Page } from "@playwright/test";
import sharp from "sharp";
import { customerSession } from "../helpers/customer-session";
async function saveProfile(page: Page) {
  const saved = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/workspace") && response.request().method() === "PATCH",
  );
  await page.getByRole("button", { name: "Simpan perubahan", exact: true }).click();
  expect((await saved).ok()).toBe(true);
  await expect(page.getByRole("button", { name: "Simpan perubahan", exact: true })).toBeDisabled();
}

test("both partners edit profiles and positions, and save only changed names or staged photos", async ({
  page,
  context,
  browser,
  baseURL,
}) => {
  await customerSession(context, baseURL!, "profile-edit-owner");
  expect(
    (
      await context.request.patch("/api/workspace", {
        headers: { Origin: baseURL! },
        data: { fullName: "Owner Full", nickname: "Owner" },
      })
    ).ok(),
  ).toBe(true);
  const invite = await (
    await context.request.post("/api/workspace/partner", {
      headers: { Origin: baseURL! },
      data: { action: "invite" },
    })
  ).json();
  const child = await browser.newContext({ baseURL: baseURL! });
  try {
    await customerSession(child, baseURL!, "profile-edit-child");
    expect(
      (
        await child.request.post("/api/workspace/partner", {
          headers: { Origin: baseURL! },
          data: {
            action: "accept",
            token: invite.token,
            fullName: "Child Full",
            nickname: "Child",
          },
        })
      ).ok(),
    ).toBe(true);
    const childPage = await child.newPage();
    await childPage.goto("/account");
    const save = childPage.getByRole("button", { name: "Simpan perubahan", exact: true });
    await expect(save).toBeDisabled();
    await expect(childPage.getByLabel("Posisi Anda", { exact: true })).toBeEnabled();
    expect(await save.evaluate((button) => getComputedStyle(button).backgroundColor)).toBe(
      "rgb(229, 231, 235)",
    );
    await expect(childPage.getByLabel("Posisi pasangan", { exact: true })).toBeEnabled();
    const labels = await childPage.locator('[data-profile-slot="partner"] label').allTextContents();
    expect(labels.indexOf("Nama lengkap")).toBeLessThan(labels.indexOf("Nama panggilan"));
    expect(labels.indexOf("Nama panggilan")).toBeLessThan(labels.indexOf("Posisi Anda"));
    await childPage.getByLabel("Nama panggilan", { exact: true }).fill("Changed");
    await expect(save).toBeEnabled();
    await childPage.getByLabel("Nama panggilan", { exact: true }).fill("Child");
    await expect(save).toBeDisabled();
    await childPage.getByLabel("Posisi Anda", { exact: true }).selectOption("bride");
    await expect(childPage.getByLabel("Posisi pasangan", { exact: true })).toHaveValue("groom");
    await childPage.getByLabel("Nama panggilan pasangan", { exact: true }).fill("Owner Updated");
    await childPage.getByLabel("Nama panggilan", { exact: true }).fill("Child Updated");
    const image = await sharp({
      create: { width: 600, height: 500, channels: 3, background: "#60956c" },
    })
      .png()
      .toBuffer();
    const ownCard = childPage.locator('[data-profile-slot="partner"]');
    const chooser = childPage.waitForEvent("filechooser");
    await ownCard.getByRole("button", { name: "Unggah foto", exact: true }).click();
    await (await chooser).setFiles({ name: "portrait.png", mimeType: "image/png", buffer: image });
    const crop = childPage.getByRole("dialog", { name: "Atur foto Anda", exact: true });
    await expect(crop.getByAltText("Pratinjau crop foto")).toBeVisible();
    await crop.getByRole("button", { name: "Simpan foto", exact: true }).click();
    await expect(crop).not.toBeVisible();
    expect(
      (await (await child.request.get("/api/workspace")).json()).workspace.profile.partnerPhotoUrl,
    ).toBeNull();
    await childPage.route("**/api/workspace", async (route) => {
      if (route.request().method() === "PATCH")
        await route.fulfill({ status: 500, json: { error: "Uji gagal menyimpan" } });
      else await route.continue();
    });
    await save.click();
    await expect(
      childPage.getByRole("alert").filter({ hasText: "Uji gagal menyimpan" }),
    ).toBeVisible();
    await expect(save).toBeEnabled();
    await expect(childPage.getByLabel("Nama panggilan", { exact: true })).toHaveValue(
      "Child Updated",
    );
    await childPage.unroute("**/api/workspace");
    await saveProfile(childPage);
    await expect(
      childPage.getByRole("banner").getByAltText("Foto Child Updated", { exact: true }),
    ).toBeVisible();
    await childPage.reload();
    await expect(save).toBeDisabled();
    await expect(childPage.getByLabel("Posisi Anda", { exact: true })).toHaveValue("bride");
    await ownCard.getByRole("button", { name: "Hapus foto Anda", exact: true }).click();
    await expect(save).toBeEnabled();
    expect(
      (await (await child.request.get("/api/workspace")).json()).workspace.profile.partnerPhotoUrl,
    ).toContain("slot=partner");
    await saveProfile(childPage);
    expect(
      (await (await child.request.get("/api/workspace")).json()).workspace.profile.partnerPhotoUrl,
    ).toBeNull();
    await page.goto("/account");
    const ownerSave = page.getByRole("button", { name: "Simpan perubahan", exact: true });
    await expect(ownerSave).toBeDisabled();
    await page.getByLabel("Posisi pasangan", { exact: true }).selectOption("groom");
    await expect(page.getByLabel("Posisi Anda", { exact: true })).toHaveValue("bride");
    await page.getByLabel("Nama lengkap pasangan", { exact: true }).fill("Child Updated Full");
    await saveProfile(page);
    await page.reload();
    await expect(page.getByLabel("Nama lengkap pasangan", { exact: true })).toHaveValue(
      "Child Updated Full",
    );
    await expect(page.getByLabel("Posisi pasangan", { exact: true })).toHaveValue("groom");
    await page.setViewportSize({ width: 375, height: 950 });
    await expect(page.getByLabel("Posisi Anda", { exact: true })).toBeEnabled();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({ path: ".review-tmp/profile-editing-mobile.png" });
  } finally {
    await child.close();
  }
});
