import { test, expect } from "@playwright/test";
import { customerSession, seedCustomerPayment } from "../helpers/customer-session";

for (const plan of ["guest", "free", "premium", "lifetime"] as const) {
  test(`${plan} uses the canonical Pencil customer shell and overview`, async ({
    page,
    context,
    baseURL,
  }) => {
    if (plan !== "guest") {
      const owner = await customerSession(context, baseURL!, `pencil-${plan}`);
      if (plan !== "free") seedCustomerPayment(owner, plan, true);
    }
    await page.setViewportSize({ width: 1600, height: 1160 });
    await page.goto("/dashboard");
    if (plan === "premium" || plan === "lifetime")
      await page.getByRole("button", { name: "Nanti saja" }).click();
    const shell = page.getByTestId("customer-shell");
    await expect(shell).toBeVisible();
    const geometry = await shell.evaluate((element) => {
      const dock = element.querySelector("aside")!;
      const canvas = element.querySelector("[data-app-canvas]")!;
      const header = canvas.querySelector("header")!;
      return {
        dock: dock.getBoundingClientRect().width,
        left: dock.getBoundingClientRect().left,
        header: header.getBoundingClientRect().height,
        radius: getComputedStyle(canvas).borderRadius,
        gap: getComputedStyle(element).columnGap,
      };
    });
    expect(geometry).toEqual({
      dock: 272,
      left: 0,
      header: 76,
      radius: "0px",
      gap: "0px",
    });
    await expect(shell).toHaveCSS("background-color", "rgb(244, 251, 247)");
    await expect(shell.locator("[data-app-canvas]")).toHaveCSS(
      "background-color",
      "rgb(255, 255, 255)",
    );
    await expect(page.locator('section[aria-labelledby="greeting-title"]')).toHaveCSS(
      "background-color",
      "rgb(236, 253, 245)",
    );
    await expect(page.locator("#greeting-title")).toBeVisible();
    await expect(
      page.getByRole("region", { name: "Metrik perencanaan" }).locator("article"),
    ).toHaveCount(4);
    await expect(page.getByRole("navigation", { name: "Navigasi dashboard" })).not.toContainText(
      "terkunci",
    );
    await expect(
      page.getByRole("link", {
        name: plan === "premium" ? "Premium" : plan === "lifetime" ? "Lifetime" : "Free",
        exact: true,
      }),
    ).toBeVisible();
    for (const id of [
      "studio",
      "pdf",
      "moodboard",
      "custom-domain",
      "priority-support",
      "multi-invitation",
    ])
      await expect(page.locator(`#feature-${id}`)).toHaveCount(1);
    if (plan === "premium" || plan === "lifetime") {
      await page.goto("/account/plans");
      const active = page.getByTestId(`plan-${plan}`);
      await expect(active.getByRole("button", { name: "Paket aktif", exact: true })).toBeDisabled();
      await expect(active).toHaveCSS("filter", /grayscale\(1\)/);
    }
  });
}

test("Pencil shell stays usable on mobile without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const path of [
    "/dashboard",
    "/planner/tasks",
    "/planner/kua",
    "/planner/guests",
    "/planner/finance",
    "/planner/calendar",
    "/planner/rundown",
    "/planner/seserahan",
    "/planner/emergency",
    "/planner/catering",
    "/planner/invitations",
    "/account",
  ]) {
    await page.goto(path);
    await expect(page.getByTestId("customer-shell")).toBeVisible();
    if (path === "/planner/finance") {
      const selected = page.getByRole("tab", { name: "Ringkasan", selected: true });
      await expect(selected).toHaveCSS("background-color", "rgb(16, 185, 129)");
      await expect(selected).toHaveCSS("color", "rgb(5, 46, 22)");
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      path,
    ).toBe(true);
  }
  await page.getByRole("button", { name: "Buka navigasi" }).click();
  await expect(page.getByRole("navigation", { name: "Navigasi dashboard" })).toBeVisible();
});

test("readiness stays unknown when actual task data cannot load", async ({
  page,
  context,
  baseURL,
}) => {
  await customerSession(context, baseURL!, "pencil-readiness-error");
  await page.route("**/api/workspace/resources/tasks?*", (route) =>
    route.fulfill({ status: 500, json: { error: "Gagal memuat tugas uji" } }),
  );
  await page.goto("/dashboard");
  await expect(page.getByRole("alert").filter({ hasText: "Gagal memuat tugas uji" })).toBeVisible();
  await expect(page.getByTestId("readiness-percent")).toHaveText("—");
});

test("overview checklist persists in trial and event context follows navigation", async ({
  page,
}) => {
  await page.goto("/planner/tasks");
  await page.getByRole("button", { name: "Tambah tugas", exact: true }).click();
  await page.getByLabel("Nama tugas").fill("Rencana dari checklist");
  await page.getByRole("button", { name: "Simpan perubahan", exact: true }).click();
  await page.goto("/dashboard");
  await page.getByRole("checkbox", { name: "Tandai Rencana dari checklist", exact: true }).click();
  await expect(page.getByRole("checkbox", { name: "Tandai Rencana dari checklist" })).toBeChecked();
  await page.reload();
  await expect(page.getByRole("checkbox", { name: "Tandai Rencana dari checklist" })).toBeChecked();
  await page.evaluate(() => {
    sessionStorage.setItem("menuju-akad:event-context", "engagement");
    window.dispatchEvent(new Event("menuju-akad:event-context"));
  });
  await expect(page.getByRole("checkbox", { name: "Tandai Rencana dari checklist" })).toHaveCount(
    0,
  );
  await page.goto("/planner/tasks");
  expect(await page.evaluate(() => sessionStorage.getItem("menuju-akad:event-context"))).toBe(
    "engagement",
  );
  await expect(page.getByRole("checkbox", { name: "Tandai Rencana dari checklist" })).toHaveCount(
    0,
  );
});
