import { expect, it } from "vitest";
import { trialReport } from "./trial-export";
import { emptyTrial } from "./trial-snapshot";
it("prints budget metadata with Indonesian dates and funds-collected status safely", () => {
  const snapshot = emptyTrial();
  snapshot.resources.finance = [
    {
      title: "<script>target</script>",
      purpose: "<img src=x>",
      notes: "<b>catatan</b>",
      amount: 1250000,
      createdAt: "2026-10-26T18:00:00Z",
      dueDate: "2026-10-28",
      priority: "Tinggi",
      completed: true,
    },
    { title: "Legacy" },
  ];
  const html = trialReport(snapshot);
  for (const text of [
    "Target nominal: Rp 1.250.000",
    "Tujuan: &lt;img src=x&gt;",
    "Deskripsi: &lt;b&gt;catatan&lt;/b&gt;",
    "Tanggal dibuat: 27 Oktober 2026",
    "Tenggat: 28 Oktober 2026",
    "Prioritas: Tinggi",
    "Dana terkumpul",
    "Dana belum terkumpul",
    "&lt;script&gt;target&lt;/script&gt;",
  ])
    expect(html).toContain(text);
  expect(html).not.toContain("<script>");
  expect(html).not.toContain("<img");
  expect(html).toContain("Tanggal dibuat: Belum ditentukan");
  expect(html).toContain("Tenggat: Belum ditentukan");
  expect(html).toContain("Prioritas: Normal");
});
it("does not print archived document history or internal template metadata", () => {
  const snapshot = emptyTrial();
  snapshot.resources.documents = [
    { id: "hidden", title: "Sudah dihapus", templateId: "private-template-marker", archived: true },
    { id: "active", title: "Berkas aktif", group: "additional", completed: false },
  ];
  const html = trialReport(snapshot);
  expect(html).toContain("Berkas aktif");
  expect(html).not.toContain("Sudah dihapus");
  expect(html).not.toContain("private-template-marker");
  expect(html).not.toContain("additional");
});
it("prints actual resource content safely without invitation credentials", () => {
  const html = trialReport({
    version: 2,
    revision: 1,
    used: {},
    resources: {
      guests: [
        {
          id: "private-id",
          name: "<script>alert(1)</script>",
          personalToken: "secret-invitation-token",
          waConsent: true,
        },
      ],
      tasks: [{ title: "Tugas milik pengguna" }],
    },
  });
  expect(html).toContain("Tugas milik pengguna");
  expect(html).toContain("&lt;script&gt;");
  expect(html).not.toContain("<script>");
  expect(html).not.toContain("secret-invitation-token");
  expect(html).not.toContain("private-id");
});
