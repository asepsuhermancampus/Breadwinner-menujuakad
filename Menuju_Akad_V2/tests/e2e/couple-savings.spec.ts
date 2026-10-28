import { expect, test, type Page } from "@playwright/test";
import { customerSession, seedCustomerPayment } from "../helpers/customer-session";
test.beforeEach(async ({ context }) => {
  context.on("page", (page) => {
    page.on("pageerror", (error) => console.log("Savings browser error:", error.message));
    page.on("requestfailed", (request) =>
      console.log("Savings failed request:", request.url(), request.failure()?.errorText),
    );
  });
});

async function savings(page: Page) {
  await page.getByRole("tab", { name: "Tabungan", exact: true }).click();
  await expect(page.getByRole("region", { name: "Tabungan pasangan", exact: true })).toBeVisible();
}
function card(page: Page, side: "pria" | "wanita") {
  return page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: `Pasangan ${side}`, exact: true }) });
}
async function deposit(page: Page, side: "pria" | "wanita", amount: string, source = "Gaji") {
  await card(page, side).getByRole("button", { name: "Tambah", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Catat perubahan tabungan", exact: true });
  await dialog.getByLabel("Nominal (Rp)", { exact: true }).fill(amount);
  await expect(dialog.getByLabel("Nominal (Rp)", { exact: true })).toHaveValue(
    Number(amount.replaceAll(".", "")).toLocaleString("id-ID"),
  );
  await dialog.getByLabel("Sumber dana", { exact: true }).selectOption(source);
  await dialog
    .getByLabel("Catatan (opsional)", { exact: true })
    .fill("Pendapatan untuk rencana acara");
  await dialog.getByRole("button", { name: "Simpan perubahan", exact: true }).click();
  await expect(dialog).toBeHidden();
}

test("two real accounts own separate manual controls and can allocate either savings source without approval", async ({
  browser,
  baseURL,
}) => {
  const pria = await browser.newContext(),
    wanita = await browser.newContext();
  try {
    const owner = await customerSession(pria, baseURL!, "savings-pria");
    seedCustomerPayment(owner, "premium", true);
    await customerSession(wanita, baseURL!, "savings-wanita");
    const invite = await pria.request.post("/api/workspace/partner", {
      headers: { Origin: baseURL! },
      data: { action: "invite" },
    });
    expect(invite.ok()).toBe(true);
    const accepted = await wanita.request.post("/api/workspace/partner", {
      headers: { Origin: baseURL! },
      data: { action: "accept", token: (await invite.json()).token },
    });
    expect(accepted.ok()).toBe(true);
    const workspaceId = (await accepted.json()).workspaceId;
    const male = await pria.newPage(),
      female = await wanita.newPage();
    await male.goto("/planner/finance", { waitUntil: "domcontentloaded" });
    const later = male.getByRole("button", { name: "Nanti saja", exact: true });
    await later.click({ timeout: 30000 });
    await savings(male);
    await male.getByRole("button", { name: "Saya pasangan pria", exact: true }).click();
    await expect(
      card(male, "pria").getByRole("button", { name: "Tambah", exact: true }),
    ).toBeVisible();
    await expect(
      card(male, "wanita").getByRole("button", { name: "Tambah", exact: true }),
    ).toHaveCount(0);
    await deposit(male, "pria", "2000000");
    await deposit(male, "pria", "1000000", "Sampingan/Freelance");
    await expect(card(male, "pria")).toContainText("Rp 3.000.000");
    await female.goto("/planner/finance", { waitUntil: "domcontentloaded" });
    await savings(female);
    await female.getByRole("button", { name: "Saya pasangan wanita", exact: true }).click();
    await expect(
      card(female, "pria").getByRole("button", { name: "Tambah", exact: true }),
    ).toHaveCount(0);
    await deposit(female, "wanita", "1500000", "Jualan/Dagang");
    const before = await (
      await pria.request.get(`/api/workspace/finance?workspace=${workspaceId}`)
    ).json();
    const denied = await pria.request.post(`/api/workspace/finance?workspace=${workspaceId}`, {
      headers: { Origin: baseURL! },
      data: {
        revision: before.revision,
        requestId: "forbidden-side",
        command: {
          type: "entry",
          side: "bride",
          direction: "subtract",
          amount: 1,
          source: "Koreksi",
          notes: "Uji larangan",
        },
      },
    });
    expect(denied.status()).toBe(403);
    await expect(card(male, "wanita")).toContainText("Rp 1.500.000");
    await male.getByRole("tab", { name: "Anggaran", exact: true }).click();
    await male.getByRole("button", { name: "Catat anggaran", exact: true }).click();
    const form = male.getByRole("dialog", { name: "Anggaran baru", exact: true });
    await form.getByLabel("Nama anggaran", { exact: true }).fill("DP gedung dari tabungan wanita");
    await form.getByLabel("Target (Rp)", { exact: true }).fill("1000000");
    await form.getByRole("button", { name: "Simpan", exact: true }).click();
    await expect(form).toBeHidden();
    await male
      .getByRole("button", {
        name: "Gunakan tabungan untuk DP gedung dari tabungan wanita",
        exact: true,
      })
      .click();
    const funding = male.getByRole("dialog", {
      name: "Gunakan tabungan untuk anggaran",
      exact: true,
    });
    await funding.getByRole("radio", { name: /Tabungan pasangan wanita/ }).check();
    await funding
      .getByRole("button", { name: "Gunakan dana & tandai tercapai", exact: true })
      .click();
    await expect(funding).toBeHidden();
    await expect(card(female, "wanita")).toContainText("Rp 500.000");
    const funded = await (
      await pria.request.get(`/api/workspace/finance?workspace=${workspaceId}`)
    ).json();
    expect(funded.balances).toEqual({ groom: 3000000, bride: 500000, total: 3500000 });
    expect(
      funded.entries.filter((entry: { kind: string }) => entry.kind === "allocation"),
    ).toHaveLength(1);
    expect(funded.budgets[0].completed).toBe(true);
    await male
      .getByRole("group", { name: "Filter status anggaran" })
      .getByRole("button", { name: /^Tercapai/ })
      .click();
    await male
      .getByRole("button", {
        name: "Batalkan alokasi untuk DP gedung dari tabungan wanita",
        exact: true,
      })
      .click();
    await male
      .getByRole("dialog", { name: "Batalkan alokasi anggaran?", exact: true })
      .getByRole("button", { name: "Batalkan alokasi", exact: true })
      .click();
    await expect
      .poll(
        async () =>
          (await (await pria.request.get(`/api/workspace/finance?workspace=${workspaceId}`)).json())
            .balances.bride,
      )
      .toBe(1500000);
    await expect(card(female, "wanita")).toContainText("Rp 1.500.000");
    await savings(male);
    await male.setViewportSize({ width: 1440, height: 1000 });
    const left = await card(male, "pria").boundingBox(),
      right = await card(male, "wanita").boundingBox();
    expect(left!.x).toBeLessThan(right!.x);
    expect(left!.y).toBe(right!.y);
    await male.screenshot({ path: ".review-tmp/couple-savings-desktop.png" });
    await male.setViewportSize({ width: 375, height: 950 });
    await card(male, "pria").scrollIntoViewIfNeeded();
    expect(await male.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const mobileLeft = await card(male, "pria").boundingBox(),
      mobileRight = await card(male, "wanita").boundingBox();
    expect(mobileLeft!.y).toBeLessThan(mobileRight!.y);
    await male.screenshot({ path: ".review-tmp/couple-savings-mobile.png" });
    const popup = male.waitForEvent("popup");
    await male.getByRole("button", { name: "Simpan laporan PDF", exact: true }).click();
    const report = await popup;
    await expect(report.locator("body")).toContainText("Laporan tabungan pasangan");
    await expect(report.locator("body")).toContainText("Sampingan/Freelance");
    await expect(report.locator("body")).toContainText("Jualan/Dagang");
    await expect(report.locator("th")).toHaveCount(2);
    await report.close();
  } finally {
    await pria.close();
    await wanita.close();
  }
});

test("trial own-side savings supports formatted inputs, allocation, history and failed storage", async ({
  page,
}) => {
  await page.goto("/planner/finance", { waitUntil: "domcontentloaded" });
  await savings(page);
  await page.getByRole("button", { name: "Saya pasangan pria", exact: true }).click();
  await deposit(page, "pria", "2000000");
  await deposit(page, "pria", "1000000");
  const history = page.getByRole("region", { name: "Riwayat tabungan pasangan pria", exact: true });
  await expect(history.locator("li")).toHaveCount(2);
  await card(page, "pria").getByRole("button", { name: "Kurangi", exact: true }).click();
  const form = page.getByRole("dialog", { name: "Catat perubahan tabungan", exact: true });
  await form.getByLabel("Nominal (Rp)", { exact: true }).fill("500000");
  await form.getByLabel("Catatan (wajib)", { exact: true }).fill("Kebutuhan pribadi");
  await form.getByRole("button", { name: "Simpan perubahan", exact: true }).click();
  await expect(form).toBeHidden();
  await expect(card(page, "pria")).toContainText("Rp 2.500.000");
  await page.reload({ waitUntil: "domcontentloaded" });
  await savings(page);
  await expect(card(page, "pria")).toContainText("Rp 2.500.000");
  await card(page, "pria").getByRole("button", { name: "Tambah", exact: true }).click();
  await form.getByLabel("Nominal (Rp)", { exact: true }).fill("100000");
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw Error("Storage penuh untuk uji");
    };
  });
  await form.getByRole("button", { name: "Simpan perubahan", exact: true }).click();
  await expect(form.getByLabel("Nominal (Rp)", { exact: true })).toHaveValue("100.000");
  await expect(form.getByRole("alert")).toBeVisible();
});

test("trial savings report respects the shared PDF export limit", async ({ page }) => {
  await page.goto("/planner/finance", { waitUntil: "domcontentloaded" });
  await savings(page);
  const popup = page.waitForEvent("popup");
  await page.getByRole("button", { name: "Simpan laporan PDF", exact: true }).click();
  const report = await popup;
  await expect(report.locator("body")).toContainText("Laporan tabungan pasangan");
  await report.close();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("menuju-akad:guest-trial:v2")!).used.pdf,
    ),
  ).toBe(1);
  await page.evaluate(() => {
    const key = "menuju-akad:guest-trial:v2";
    const state = JSON.parse(localStorage.getItem(key)!);
    state.used.pdf = 5;
    localStorage.setItem(key, JSON.stringify(state));
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await savings(page);
  const deniedPopup = page.waitForEvent("popup");
  await page.getByRole("button", { name: "Simpan laporan PDF", exact: true }).click();
  const denied = await deniedPopup;
  await expect.poll(() => denied.isClosed()).toBe(true);
  await expect(
    page.getByRole("dialog", { name: "Masuk untuk melanjutkan", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("menuju-akad:guest-trial:v2")!).used.pdf,
    ),
  ).toBe(5);
});
