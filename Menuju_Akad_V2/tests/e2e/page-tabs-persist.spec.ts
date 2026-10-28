import { expect, test } from "@playwright/test";
const cases = [
  ["/planner/catering", "tab", "Menu katering tersimpan", "menus", "aria-selected"],
  ["/planner/finance", "tab", "Anggaran", "Anggaran", "aria-selected"],
  ["/planner/finance", "tab", "Tabungan", "Tabungan", "aria-selected"],
  ["/planner/kua", "button", "Pilih template", "templates", "aria-pressed"],
  ["/planner/guests", "button", "Pengiriman WA", "whatsapp", "aria-pressed"],
  ["/planner/calendar", "tab", "Minggu", "Minggu", "aria-selected"],
  ["/planner/tasks", "tab", "Selesai", "Selesai", "aria-selected"],
  ["/planner/moodboard", "tab", "Busana", "Busana", "aria-selected"],
  ["/planner/seserahan", "tab", "Sudah dibeli", "Sudah dibeli", "aria-selected"],
  ["/planner/emergency", "tab", "Kontak penting", "contact", "aria-selected"],
] as const;
for (const [path, role, label, value, attribute] of cases) {
  test(`${path}: ${label} remains selected after refresh`, async ({ page }) => {
    await page.goto(path);
    const tab =
      path === "/planner/kua"
        ? page
            .getByRole("navigation", { name: "Tampilan berkas KUA", exact: true })
            .getByRole(role, { name: label, exact: true })
        : page.getByRole(role, {
            name: path === "/planner/tasks" ? /^Selesai\b/ : label,
            exact: path !== "/planner/tasks",
          });
    await tab.click({ timeout: 15000 });
    await expect(tab).toHaveAttribute(attribute, "true");
    await expect.poll(() => new URL(page.url()).searchParams.get("tab")).toBe(value);
    await page.reload();
    await expect(tab).toHaveAttribute(attribute, "true");
  });
}
test("budget status stays selected after refresh and reset clears its URL state", async ({
  page,
}) => {
  await page.goto("/planner/finance?tab=Anggaran");
  const group = page.getByRole("group", { name: "Filter status anggaran", exact: true });
  for (const status of ["Belum tercapai", "Tercapai"]) {
    const selected = group.getByRole("button", { name: new RegExp(`^${status}`) });
    await selected.click();
    await page.reload();
    await expect(selected).toHaveAttribute("aria-pressed", "true");
  }
  await page.getByRole("button", { name: "Reset filter", exact: true }).click();
  await page.reload();
  await expect(group.getByRole("button", { name: /^Semua/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByText(/\d+ dari \d+ anggaran/)).toHaveCount(0);
});
test("invalid tab values recover and tab changes preserve query and hash", async ({ page }) => {
  await page.goto("/planner/finance?tab=unknown&category=Katering#anggaran");
  await expect(page.getByRole("tab", { name: "Ringkasan", exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.getByRole("tab", { name: "Anggaran", exact: true }).click();
  expect(new URL(page.url()).searchParams.get("category")).toBe("Katering");
  expect(new URL(page.url()).hash).toBe("#anggaran");
  await page.evaluate(() => {
    const url = new URL(location.href);
    url.searchParams.set("tab", "Tabungan");
    history.replaceState(history.state, "", url);
    dispatchEvent(new PopStateEvent("popstate"));
  });
  await expect(page.getByRole("tab", { name: "Tabungan", exact: true })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});
