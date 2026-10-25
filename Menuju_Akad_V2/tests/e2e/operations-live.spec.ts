import { test, expect } from "@playwright/test";
for (const [route, target] of [
  ["/dev/admin", "/superadmin/login"],
  ["/dev/vendor", "/marketplace"],
  ["/dev/ba", "/dashboard"],
  ["/dev/operations", "/account"],
]) {
  test(`legacy operations entry ${route} uses real authorized product`, async ({ page }) => {
    await page.goto(route!);
    await expect(page).toHaveURL(new RegExp(target!.replaceAll("/", "\\/") + "(?:\\?|$)"));
    await expect(
      page.getByText(/Simulasikan versi berubah|WD-105|TK-2051|Skenario pratinjau internal/),
    ).toHaveCount(0);
  });
}
test("anonymous caller cannot mutate catalog or read private operations inbox", async ({
  request,
  baseURL,
}) => {
  expect((await request.get("/api/marketplace/requests")).status()).toBe(403);
  expect(
    (
      await request.post("/api/marketplace/vendors", {
        headers: { Origin: baseURL! },
        data: { name: "Invalid" },
      })
    ).status(),
  ).toBe(403);
});
