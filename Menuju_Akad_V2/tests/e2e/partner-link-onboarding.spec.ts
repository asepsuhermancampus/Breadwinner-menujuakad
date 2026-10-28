import { expect, test } from "@playwright/test";
import { customerSession, seedCustomerPayment } from "../helpers/customer-session";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import type { APIRequestContext } from "@playwright/test";
import type { FinanceCommand } from "../../src/features/planner-finance/types/finance-ledger";

test("owner starts with a locked partner profile", async ({ page, context, baseURL }) => {
  await customerSession(context, baseURL!, "link-owner-locked");
  await page.goto("/account");
  await expect(page.getByLabel("Nama lengkap", { exact: true })).toBeEnabled();
  await expect(page.getByLabel("Nama lengkap pasangan", { exact: true })).toBeDisabled();
  await expect(
    page.getByRole("img", { name: "Profil pasangan terkunci", exact: true }),
  ).toBeVisible();
  await expect(
    page
      .locator('[data-profile-slot="partner"]')
      .getByRole("button", { name: "Unggah foto", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Bagikan undangan pasangan", exact: true }),
  ).toBeEnabled();
  const access = page.getByRole("region", { name: "Akses pasangan", exact: true });
  await expect(access.getByRole("button")).toHaveCount(1);
  await expect(page.locator('[data-profile-connection="locked"] path')).toHaveCount(1);
  for (const width of [1440, 375]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({ path: `.review-tmp/partner-access-locked-${width}.png` });
  }
  await page.getByRole("button", { name: "Bagikan undangan pasangan", exact: true }).click();
  await expect(page.getByRole("textbox", { name: "Tautan undangan", exact: true })).toBeVisible();
});

for (const side of ["groom", "bride"] as const) {
  test(`invited ${side === "groom" ? "bride" : "groom"} completes own profile, shares planning and keeps savings separate`, async ({
    page,
    context,
    browser,
    baseURL,
  }) => {
    const ownerAccount = await customerSession(context, baseURL!, `linked-owner-${side}`);
    const parentPlan = side === "groom" ? "lifetime" : "premium";
    seedCustomerPayment(ownerAccount, parentPlan, true);
    const ownerName = side === "groom" ? "Suep" : "Latifah",
      partnerName = side === "groom" ? "Latifah" : "Suep";
    const otherSide = side === "groom" ? "bride" : "groom";
    await page.goto("/account");
    const notice = page.getByRole("dialog", {
      name: "Fitur paket kalian sudah terbuka",
      exact: true,
    });
    await notice.getByRole("button", { name: "Nanti saja", exact: true }).click();
    await expect(notice).not.toBeVisible();
    await page.getByLabel("Nama lengkap", { exact: true }).fill(`${ownerName} Lengkap`);
    await page.getByLabel("Nama panggilan", { exact: true }).fill(ownerName);
    await page.getByLabel("Posisi Anda", { exact: true }).selectOption(side);
    const saved = page.waitForResponse(
      (r) => r.url().endsWith("/api/workspace") && r.request().method() === "PATCH",
    );
    await page.getByRole("button", { name: "Simpan perubahan", exact: true }).click();
    expect((await saved).ok()).toBe(true);
    await page.getByRole("button", { name: "Bagikan undangan pasangan", exact: true }).click();
    const link = page.getByRole("textbox", { name: "Tautan undangan", exact: true });
    await expect(link).toBeVisible();
    const previousUrl = await link.inputValue();
    await expect(page.getByText("Menunggu pasangan bergabung", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Bagikan undangan pasangan", exact: true }).click();
    await expect(link).not.toHaveValue(previousUrl);
    const url = await link.inputValue();
    expect(url).toMatch(/\/join\/[a-f0-9]{64}$/);
    const ownerWorkspace = (await (await context.request.get("/api/workspace")).json()).workspace
      .id as string;
    const guest = await browser.newContext({ baseURL: baseURL! });
    const guestPage = await guest.newPage();
    await guestPage.goto(url);
    await expect(guestPage).toHaveURL(/\/login\?returnTo=/);
    await guest.close();
    const child = await browser.newContext({ baseURL: baseURL! });
    await customerSession(child, baseURL!, `linked-child-${side}`);
    const childPage = await child.newPage();
    if (side === "bride") await childPage.setViewportSize({ width: 375, height: 900 });
    await childPage.goto(url);
    await expect(
      childPage.getByRole("heading", { name: "Lengkapi profil pasangan" }),
    ).toBeVisible();
    await expect(
      childPage.getByText(
        `Anda bergabung sebagai pasangan ${otherSide === "bride" ? "wanita" : "pria"}.`,
        { exact: true },
      ),
    ).toBeVisible();
    await childPage.getByLabel("Nama lengkap", { exact: true }).fill(`${partnerName} Lengkap`);
    await childPage.getByLabel("Nama panggilan", { exact: true }).fill(partnerName);
    await expect(childPage.locator('input[type="file"]')).toHaveCount(0);
    await childPage.getByRole("button", { name: "Simpan profil & bergabung", exact: true }).click();
    await expect(
      childPage.getByRole("heading", { name: "Profil berhasil disimpan", exact: true }),
    ).toBeVisible();
    await expect(childPage.getByLabel("Tautan Profil & Akses", { exact: true })).toHaveValue(
      `${baseURL}/account`,
    );
    await expect(
      childPage.getByRole("button", { name: "Salin tautan", exact: true }),
    ).toBeVisible();
    await childPage.screenshot({ path: `.review-tmp/partner-joined-${side}.png` });
    await childPage.getByRole("link", { name: "Buka Profil & Akses", exact: true }).click();
    await expect(childPage).toHaveURL(/\/account$/);
    const childWorkspace = (await (await child.request.get("/api/workspace")).json()).workspace;
    expect(childWorkspace.subscription.planId).toBe(parentPlan);
    expect(childWorkspace.subscription.capabilities).toEqual(
      (await (await context.request.get("/api/workspace")).json()).workspace.subscription
        .capabilities,
    );
    await expect(
      childPage.getByRole("banner").getByText("Latifah & Suep", { exact: true }),
    ).toBeVisible();
    await expect(page.getByLabel("Nama lengkap pasangan", { exact: true })).toHaveValue(
      `${partnerName} Lengkap`,
      { timeout: 25000 },
    );
    await expect(page.getByLabel("Nama lengkap pasangan", { exact: true })).toBeEnabled();
    const connectedAccess = page.getByRole("region", { name: "Akses pasangan", exact: true });
    await expect(connectedAccess.getByRole("button")).toHaveCount(1);
    await expect(connectedAccess.getByRole("status")).toHaveCount(0);
    await expect(
      connectedAccess.getByRole("button", { name: "Cabut akses pasangan", exact: true }),
    ).toHaveAttribute("data-ui-button", "danger");
    await expect(page.locator('[data-profile-connection="connected"] path')).toHaveCount(1);
    await page.screenshot({ path: `.review-tmp/partner-access-connected-${side}.png` });
    await child.clearCookies({ name: "ma-workspace" });
    await childPage.reload();
    expect((await (await child.request.get("/api/workspace")).json()).workspace.id).toBe(
      ownerWorkspace,
    );
    const forbidden = await child.request.post("/api/workspace/partner", {
      headers: { Origin: baseURL! },
      data: { action: "invite" },
    });
    expect(forbidden.status()).toBe(403);
    await childPage.goto("/account");
    await expect(childPage.getByLabel("Nama lengkap", { exact: true })).toHaveValue(
      `${partnerName} Lengkap`,
    );
    await expect(childPage.getByLabel("Nama lengkap pasangan", { exact: true })).toBeEnabled();
    await childPage.getByLabel("Nama lengkap", { exact: true }).fill(`${partnerName} Baru`);
    const childSaved = childPage.waitForResponse(
      (r) => r.url().endsWith("/api/workspace") && r.request().method() === "PATCH",
    );
    await childPage.getByRole("button", { name: "Simpan perubahan", exact: true }).click();
    expect((await childSaved).ok()).toBe(true);
    const names = (await (await child.request.get("/api/workspace")).json()).workspace.profile;
    expect(names.fullName).toBe(`${ownerName} Lengkap`);
    expect(names.partnerName).toBe(`${partnerName} Baru`);
    const picture = await sharp({
      create: { width: 700, height: 500, channels: 3, background: "#60956c" },
    })
      .png()
      .toBuffer();
    await childPage
      .getByLabel("Unggah foto Anda", { exact: true })
      .setInputFiles({ name: "partner.png", mimeType: "image/png", buffer: picture });
    const crop = childPage.getByRole("dialog", { name: "Atur foto Anda", exact: true });
    await expect(crop.getByAltText("Pratinjau crop foto")).toBeVisible();
    await crop.getByRole("button", { name: "Simpan foto", exact: true }).click();
    await expect(crop).not.toBeVisible();
    await childPage.getByRole("button", { name: "Simpan perubahan", exact: true }).click();
    await expect(
      childPage.getByRole("banner").getByAltText(`Foto ${partnerName}`, { exact: true }),
    ).toBeVisible();
    await childPage.goto("/planner/tasks");
    await childPage.getByRole("button", { name: "Tambah tugas", exact: true }).click();
    await childPage.getByLabel("Nama tugas").fill("Tugas dari pasangan");
    await childPage.getByRole("button", { name: "Simpan perubahan", exact: true }).click();
    await page.goto("/planner/tasks");
    await expect(page.getByText("Tugas dari pasangan", { exact: true })).toBeVisible();
    await page.goto("/account");
    const chooser = page.waitForEvent("filechooser");
    await page
      .locator('[data-profile-slot="partner"]')
      .getByRole("button", { name: /^(Ganti foto|Unggah foto)$/ })
      .click();
    await (
      await chooser
    ).setFiles({ name: "photo-by-parent.png", mimeType: "image/png", buffer: picture });
    const parentCrop = page.getByRole("dialog", { name: "Atur foto pasangan", exact: true });
    await expect(parentCrop.getByAltText("Pratinjau crop foto")).toBeVisible();
    await parentCrop.getByRole("button", { name: "Simpan foto", exact: true }).click();
    await expect(parentCrop).not.toBeVisible();
    await page.getByRole("button", { name: "Simpan perubahan", exact: true }).click();
    async function command(api: APIRequestContext, cmd: FinanceCommand) {
      const snapshot = await (
        await api.get(`/api/workspace/finance?workspace=${ownerWorkspace}`)
      ).json();
      return api.post(`/api/workspace/finance?workspace=${ownerWorkspace}`, {
        headers: { Origin: baseURL! },
        data: { revision: snapshot.revision, requestId: randomUUID(), command: cmd },
      });
    }
    const entry = (
      entrySide: "groom" | "bride",
      amount: number,
      direction: "add" | "subtract" = "add",
    ): FinanceCommand => ({
      type: "entry",
      side: entrySide,
      amount,
      direction,
      source: "Gaji",
      notes: "Uji pasangan",
    });
    expect((await command(context.request, entry(side, 1500000))).ok()).toBe(true);
    expect((await command(child.request, entry(otherSide, 2500000))).ok()).toBe(true);
    expect((await command(child.request, entry(otherSide, 100000, "subtract"))).ok()).toBe(true);
    expect((await command(context.request, entry(otherSide, 1000))).status()).toBe(403);
    expect((await command(child.request, entry(side, 1000, "subtract"))).status()).toBe(403);
    expect(
      (
        await command(context.request, {
          type: "save-budgets",
          budgets: [{ id: "flowers", title: "Bunga", amount: 100000 }],
        })
      ).ok(),
    ).toBe(true);
    expect(
      (
        await command(context.request, { type: "allocate", budgetId: "flowers", side: otherSide })
      ).ok(),
    ).toBe(true);
    await childPage.goto("/planner/finance");
    await childPage.getByRole("tab", { name: "Tabungan", exact: true }).click();
    await expect(childPage.getByRole("button", { name: "Tambah", exact: true })).toHaveCount(1);
    await expect(childPage.getByRole("button", { name: "Kurangi", exact: true })).toHaveCount(1);
    await page.goto("/account");
    await page.getByRole("button", { name: "Cabut akses pasangan", exact: true }).click();
    await expect(
      page.getByRole("img", { name: "Profil pasangan terkunci", exact: true }),
    ).toBeVisible();
    await expect(page.getByLabel("Nama lengkap pasangan", { exact: true })).toHaveValue("");
    await expect(
      page.getByRole("region", { name: "Akses pasangan", exact: true }).getByRole("button"),
    ).toHaveCount(1);
    await expect(
      page.getByRole("button", { name: "Bagikan undangan pasangan", exact: true }),
    ).toBeVisible();
    await page.reload();
    await expect(page.getByLabel("Nama lengkap pasangan", { exact: true })).toHaveValue("");
    expect(
      (await child.request.get(`/api/workspace/finance?workspace=${ownerWorkspace}`)).status(),
    ).toBe(403);
    await expect(
      childPage.getByRole("banner").getByText("Latifah & Suep", { exact: true }),
    ).toHaveCount(0, { timeout: 25000 });
    const preserved = await (
      await context.request.get(`/api/workspace/finance?workspace=${ownerWorkspace}`)
    ).json();
    expect(preserved.balances[side]).toBe(1500000);
    expect(preserved.balances[otherSide]).toBe(2300000);
    expect(preserved.entries.length).toBeGreaterThanOrEqual(4);
    await child.close();
  });
}
