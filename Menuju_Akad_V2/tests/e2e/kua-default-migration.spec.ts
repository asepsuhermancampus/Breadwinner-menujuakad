import { expect, test } from "@playwright/test";
import { customerSession, seedCustomerPayment } from "../helpers/customer-session";
const oldDocuments = [
  "Identitas calon pasangan",
  "Kartu keluarga",
  "Akta kelahiran",
  "Pasfoto pasangan",
  "Surat pengantar administrasi nikah",
  "Dokumen wali dan saksi",
  "Dokumen tambahan sesuai kondisi pasangan",
  "Konfirmasi jadwal dan pemeriksaan berkas KUA",
].map((title, index) => ({
  id: `kua-template-${index + 1}`,
  title,
  completed: false,
  notes: "Sesuaikan kebutuhan dan format dengan KUA setempat.",
}));
for (const mode of ["guest", "free", "premium", "lifetime"] as const) {
  test(`old automatic KUA samples disappear for ${mode} and chosen templates persist`, async ({
    page,
    context,
    baseURL,
  }) => {
    if (mode === "guest") {
      await context.addInitScript((documents) => {
        const key = "menuju-akad:guest-trial:v2";
        if (!localStorage.getItem(key))
          localStorage.setItem(
            key,
            JSON.stringify({ version: 2, revision: 0, used: {}, resources: { documents } }),
          );
      }, oldDocuments);
    } else {
      const owner = await customerSession(context, baseURL!, `kua-migration-${mode}`);
      if (mode !== "free") {
        seedCustomerPayment(owner, mode, true);
        const { notice } = await (await context.request.get("/api/subscriptions/notices")).json();
        if (notice) {
          const dismissed = await context.request.patch(
            `/api/subscriptions/notices/${notice.grantId}`,
            {
              headers: { Origin: baseURL! },
              data: { action: "dismiss", expectedStep: notice.step },
            },
          );
          expect(dismissed.ok()).toBe(true);
        }
      }
      const seeded = await context.request.put("/api/workspace/resources/documents", {
        headers: { Origin: baseURL! },
        data: { revision: 0, data: oldDocuments },
      });
      expect(seeded.ok()).toBe(true);
    }
    await page.goto("/planner/kua");
    await expect(
      page.getByRole("heading", { name: "Belum ada berkas di checklist kalian", exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("region", { name: "Berkas opsional", exact: true })).toHaveCount(0);
    await page.reload();
    await expect(
      page.getByRole("heading", { name: "Belum ada berkas di checklist kalian", exact: true }),
    ).toBeVisible();
    await page
      .getByRole("navigation", { name: "Tampilan berkas KUA", exact: true })
      .getByRole("button", { name: "Pilih template", exact: true })
      .click();
    await page
      .getByRole("region", { name: "Template berkas", exact: true })
      .getByRole("article")
      .first()
      .getByRole("button", { name: "Gunakan template", exact: true })
      .click();
    const main = page.getByRole("region", { name: "Berkas wajib", exact: true });
    await expect(main.getByRole("checkbox")).toHaveCount(11);
    await page.reload();
    await expect(main.getByRole("checkbox")).toHaveCount(11);
    await expect(page.getByText("Identitas calon pasangan", { exact: true })).toHaveCount(0);
  });
}
