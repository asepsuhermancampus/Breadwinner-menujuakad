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
it("omits task content when the task feature is unavailable", () => {
  const snapshot = emptyTrial();
  snapshot.resources.tasks = [{ title: "Tugas pribadi" }];
  const html = trialReport(snapshot, false);
  expect(html).not.toContain("Tugas pribadi");
  expect(html).not.toContain("<h2>Tugas</h2>");
  expect(snapshot.resources.tasks).toHaveLength(1);
});
it("omits emergency content when that feature is unavailable without deleting it", () => {
  const snapshot = emptyTrial();
  snapshot.resources.emergency = [{ title: "Kotak khusus" }];
  const html = trialReport(snapshot, true, false);
  expect(html).not.toContain("Kotak khusus");
  expect(html).not.toContain("<h2>Emergency</h2>");
  expect(snapshot.resources.emergency).toHaveLength(1);
});
it("omits calendar content when unavailable without deleting it", () => {
  const snapshot = emptyTrial();
  snapshot.resources.calendar = [{ title: "Janji rahasia" }];
  const html = trialReport(snapshot, true, true, false);
  expect(html).not.toContain("Janji rahasia");
  expect(html).not.toContain("<h2>Kalender</h2>");
  expect(snapshot.resources.calendar).toHaveLength(1);
});
it("omits documents when unavailable without deleting them", () => {
  const snapshot = emptyTrial();
  snapshot.resources.documents = [{ title: "Dokumen pribadi" }];
  const html = trialReport(snapshot, true, true, true, false);
  expect(html).not.toContain("Dokumen pribadi");
  expect(html).not.toContain("<h2>Dokumen KUA</h2>");
  expect(snapshot.resources.documents).toHaveLength(1);
});
it("omits rundown when unavailable without deleting it", () => {
  const snapshot = emptyTrial();
  snapshot.resources.rundown = [{ title: "Acara pribadi" }];
  const html = trialReport(snapshot, true, true, true, true, false);
  expect(html).not.toContain("Acara pribadi");
  expect(html).not.toContain("<h2>Rundown</h2>");
  expect(snapshot.resources.rundown).toHaveLength(1);
});
it("omits guest data when guest management is unavailable without deleting it", () => {
  const snapshot = emptyTrial();
  snapshot.resources.guests = [{ name: "Tamu pribadi" }];
  const html = trialReport(snapshot, true, true, true, true, true, false);
  expect(html).not.toContain("Tamu pribadi");
  expect(html).not.toContain("<h2>Tamu</h2>");
  expect(snapshot.resources.guests).toHaveLength(1);
});
it("omits finance details when finance is unavailable without deleting them", () => {
  const snapshot = emptyTrial();
  snapshot.resources.finance = [{ title: "Anggaran pribadi", amount: 12345 }];
  const html = trialReport(snapshot, true, true, true, true, true, true, false);
  expect(html).not.toContain("Anggaran pribadi");
  expect(snapshot.resources.finance).toHaveLength(1);
});
it("omits restricted seserahan and its linked budget from the trial report", () => {
  const snapshot = emptyTrial();
  snapshot.resources.seserahan = [{ title: "Hadiah pribadi" }];
  snapshot.resources.finance = [
    {
      id: "expense:seserahan:gift",
      title: "Hadiah pribadi",
      amount: 100,
      source: { kind: "seserahan", id: "gift" },
    },
  ];
  const html = trialReport(snapshot, true, true, true, true, true, true, true, false, true);
  expect(html).not.toContain("Hadiah pribadi");
  expect(snapshot.resources.finance).toHaveLength(1);
});
