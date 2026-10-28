import { expect, test } from "@playwright/test";
import { customerSession } from "../helpers/customer-session";
test("anonymous guest groups are neutral and login is compact", async ({ page }) => {
  await page.goto("/planner/guests");
  await page.getByRole("button", { name: "+ Tambah Undangan", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Tambah Undangan Baru", exact: true });
  const select = dialog.getByRole("combobox");
  await expect(select.getByRole("option", { name: "Keluarga pria", exact: true })).toHaveCount(1);
  await expect(select.getByRole("option", { name: "Keluarga wanita", exact: true })).toHaveCount(1);
  await expect(dialog).not.toContainText("Keluarga Andi");
  await expect(dialog).not.toContainText("Keluarga Risa");
  await expect(dialog).not.toContainText("Kebijakan Komunikasi & Izin WA");
  await expect(dialog).not.toContainText("token opak");
  await page.goto("/login");
  await expect(
    page.getByRole("heading", { name: "Selamat datang kembali", exact: true }),
  ).toBeVisible();
  await expect(page.getByText(/Browser dapat menawarkan/)).toHaveCount(0);
  await page.setViewportSize({ width: 320, height: 812 });
  await expect(page.getByLabel("Email", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Password", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
for (const side of ["groom", "bride"] as const) {
  test(`guest groups use saved nicknames with ${side} account owner`, async ({
    page,
    context,
    baseURL,
  }) => {
    await customerSession(context, baseURL!, `guest-family-${side}`);
    const female = side === "bride";
    const profile = await context.request.patch("/api/workspace", {
      headers: { Origin: baseURL! },
      data: {
        fullName: female ? "Latifah Lengkap" : "Suep Lengkap",
        partnerName: female ? "Suep Lengkap" : "Latifah Lengkap",
        nickname: female ? "Latifah" : "Suep",
        partnerNickname: female ? "Suep" : "Latifah",
      },
    });
    expect(profile.ok()).toBe(true);
    const finance = await (await context.request.get("/api/workspace/finance")).json();
    const claim = await context.request.post("/api/workspace/finance", {
      headers: { Origin: baseURL! },
      data: {
        revision: finance.revision,
        requestId: `guest-family-${side}`,
        command: { type: "claim", side },
      },
    });
    expect(claim.ok()).toBe(true);
    await page.goto("/planner/guests");
    await page.getByRole("button", { name: "+ Tambah Undangan", exact: true }).click();
    const select = page
      .getByRole("dialog", { name: "Tambah Undangan Baru", exact: true })
      .getByRole("combobox");
    await expect(
      select.getByRole("option", { name: "Keluarga Suep", exact: true }),
    ).toHaveAttribute("value", "Keluarga Andi");
    await expect(
      select.getByRole("option", { name: "Keluarga Latifah", exact: true }),
    ).toHaveAttribute("value", "Keluarga Risa");
  });
}
