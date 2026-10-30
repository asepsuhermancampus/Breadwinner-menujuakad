import { expect, test } from "@playwright/test";

test("catering stops using trial guest data when guest management is restricted", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "menuju-akad:guest-trial:v2",
      JSON.stringify({
        version: 2,
        revision: 0,
        used: {},
        resources: {
          guests: [
            {
              id: "guest",
              name: "Tamu percobaan",
              group: "Teman",
              quota: 37,
              rsvpStatus: "PENDING",
              attendingCount: 0,
              waConsent: false,
              personalToken: "guest-token-123456",
            },
          ],
        },
      }),
    );
  });
  let available = true;
  await page.route("**/api/workspace/feature-availability", async (route) => {
    const response = await route.fetch();
    const body = await response.json();
    await route.fulfill({ response, json: { ...body, guests: available } });
  });
  await page.goto("/planner/catering");
  await expect(page.getByText(/kuota 37 orang/)).toBeVisible();
  available = false;
  await page.evaluate(() => window.dispatchEvent(new Event("feature-availability-changed")));
  await expect(page.getByText(/kuota 37 orang/)).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Kelola daftar tamu/ })).toHaveCount(0);
  await page.getByRole("tab", { name: "Menu katering tersimpan" }).click();
  await page.getByRole("button", { name: "+ Menu katering" }).click();
  await expect(page.getByRole("link", { name: "Isi daftar tamu" })).toHaveCount(0);
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("menuju-akad:guest-trial:v2")!).resources.guests[0].quota,
    ),
  ).toBe(37);
});

test("a catering draft using guest estimates stays hidden and preserved during restriction", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "menuju-akad:guest-trial:v2",
      JSON.stringify({
        version: 2,
        revision: 0,
        used: {},
        resources: {
          guests: [
            {
              id: "guest",
              name: "Tamu",
              group: "Teman",
              quota: 37,
              rsvpStatus: "PENDING",
              attendingCount: 0,
              waConsent: false,
              personalToken: "guest-token-123456",
            },
          ],
        },
      }),
    );
  });
  let available = true;
  await page.route("**/api/workspace/feature-availability", async (route) => {
    const response = await route.fetch();
    await route.fulfill({ response, json: { ...(await response.json()), guests: available } });
  });
  await page.goto("/planner/catering");
  await expect(page.getByText(/kuota 37 orang/)).toBeVisible();
  await page.getByRole("tab", { name: "Menu katering tersimpan" }).click();
  await page.getByRole("button", { name: "+ Menu katering" }).click();
  const dialog = page.getByRole("dialog", { name: "Tambah menu katering", includeHidden: true });
  await expect(dialog).toContainText("37 orang");
  available = false;
  await page.evaluate(() => window.dispatchEvent(new Event("feature-availability-changed")));
  await expect(dialog).toBeHidden();
  available = true;
  await page.evaluate(() => window.dispatchEvent(new Event("feature-availability-changed")));
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("37 orang");
});
