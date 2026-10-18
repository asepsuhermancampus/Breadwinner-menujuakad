import { test, expect } from "@playwright/test";

test.describe("Batch 05 — Multi-undangan & pengalaman tamu", () => {
  test("53: Manager multi-undangan dengan proyek terpisah", async ({ page }) => {
    await page.goto("/planner/invitations");
    await expect(
      page.getByRole("heading", { name: "Undangan yang terasa personal." }),
    ).toBeVisible();

    // Metrics: 3 projects, single wedding guest pool, active version v3
    await expect(page.getByText("1 terbit · 2 draf")).toBeVisible();
    await expect(page.getByText("350 undangan", { exact: true })).toBeVisible();
    await expect(page.getByText("Draf v4 tetap terpisah")).toBeVisible();

    // Published project with live slug; drafts without published address
    await expect(page.getByText("● TERBIT · V3")).toBeVisible();
    await expect(page.getByText("menujuakad.id/andi-risa").first()).toBeVisible();
    await expect(page.getByText("Lamaran keluarga")).toBeVisible();
    await expect(page.getByText("Varian dari Pernikahan · Subset 12 dari 350")).toBeVisible();
    await expect(page.getByText(/VIP memakai subset dari daftar Pernikahan/i)).toBeVisible();
  });

  test("54: Slug konflik tidak membocorkan pemilik; saran tersedia", async ({ page }) => {
    await page.goto("/planner/invitations");
    await page.getByText("menujuakad.id/andi-risa").first().click();

    const inspector = page.getByRole("dialog");
    await expect(inspector).toBeVisible();
    await expect(inspector.getByText("menujuakad.id/andi-risa")).toBeVisible();

    // Proposed taken slug: blocked, no owner identity leaked
    const slugInput = inspector.getByLabel("Usulan slug baru");
    await slugInput.fill("andi-risa-story");
    await expect(inspector.getByText("Slug belum tersedia")).toBeVisible();
    expect(await inspector.getByText(/Budi|Santoso/i).count()).toBe(0);

    // Contract suggestion is available; save becomes enabled
    await inspector.getByRole("button", { name: "Gunakan andi-risa-14feb2027" }).click();
    await expect(inspector.getByText(/andi-risa-14feb2027 tersedia/i)).toBeVisible();
    await expect(inspector.getByText("Pilih slug yang tersedia terlebih dahulu.")).toHaveCount(0);

    await slugInput.fill("andi-risa");
    await expect(inspector.getByText(/alamat aktif Anda sendiri/i)).toBeVisible();

    await slugInput.fill("andi-risa-14feb2027");
    await inspector.getByRole("button", { name: "Simpan draf alamat" }).click();
    await expect(page.getByText("menujuakad.id/andi-risa-14feb2027").first()).toBeVisible();
  });

  test("55: Domain & DNS Hidden — preview internal, tidak ada keberhasilan palsu", async ({
    page,
  }) => {
    await page.goto("/planner/invitations");
    await page.getByRole("button", { name: "Domain · internal" }).click();

    await expect(page.getByText("PREVIEW INTERNAL · DOMAIN HIDDEN")).toBeVisible();
    await expect(page.getByLabel("Domain contoh")).toHaveValue("undangan.andi-risa.example");
    await expect(page.getByText("Terdeteksi · simulasi").first()).toBeVisible();
    await expect(page.getByText("Belum terdeteksi")).toBeVisible();
    await expect(page.getByText("Kepemilikan TXT")).toBeVisible();
    await expect(page.getByText("Belum diterbitkan")).toBeVisible();

    // Simulation never grants production success
    await page.getByRole("button", { name: "Simulasikan verifikasi" }).click();
    await expect(page.getByText(/Domain tetap Hidden pada rilis aktif/i)).toBeVisible();
  });

  test("56: Bandingkan tema — konten sama, pemilihan tidak mereset", async ({ page }) => {
    await page.goto("/planner/invitations");
    await page.getByRole("button", { name: "Bandingkan tema" }).click();

    await expect(page.getByText("Editorial Light").first()).toBeVisible();
    await expect(page.getByText("Cypress Modern").first()).toBeVisible();
    await expect(page.getByText("Termasuk").first()).toBeVisible();
    await expect(page.getByText("Sama · tanpa input ulang").first()).toBeVisible();
    await expect(
      page.getByText(/konten, jawaban RSVP, dan tautan personal tidak direset/i),
    ).toBeVisible();
  });

  test("57: Analitik — funnel & rekonsiliasi CRM", async ({ page }) => {
    await page.goto("/planner/invitations");
    await page.getByRole("button", { name: "Analitik" }).click();

    await expect(page.getByText("280", { exact: true })).toBeVisible();
    await expect(page.getByText("340", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("168 · 80%")).toBeVisible();
    for (const day of ["19 Okt", "24 Okt", "25 Okt"]) {
      await expect(page.getByText(day, { exact: true })).toBeVisible();
    }
    await expect(page.getByText(/Daring: 150 hadir \+ 18 berhalangan = 168/i)).toBeVisible();
    await expect(
      page.getByText(/Total CRM: 170 hadir \+ 30 berhalangan = 200 jawaban/i),
    ).toBeVisible();
  });

  test("65: Moderasi — antrean dan persetujuan beralasan", async ({ page }) => {
    await page.goto("/planner/invitations");
    await page.getByRole("button", { name: "Moderasi" }).click();

    await expect(page.getByText("12", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("8 ucapan · 4 foto")).toBeVisible();
    await expect(page.getByText("4 dari 12 kiriman menunggu ditampilkan")).toBeVisible();

    await page
      .getByRole("button", { name: /Tinjau →/ })
      .first()
      .click();
    const review = page.getByRole("dialog");
    await expect(review).toBeVisible();
    await expect(review.getByText(/Nama publik:/)).toBeVisible();

    await review.getByRole("button", { name: "Tolak dengan alasan…" }).click();
    const reject = page.getByRole("dialog").last();
    await reject.getByLabel(/Alasan/).fill("Konten tidak sesuai");
    await reject.getByRole("button", { name: "Sembunyikan kiriman" }).click();
    await expect(page.getByText("Disembunyikan").first()).toBeVisible();
  });

  test("66: Tindak lanjut CRM — 4 dari 42, tanpa penggandaan kampanye", async ({ page }) => {
    await page.goto("/planner/guests");
    await page.getByRole("button", { name: "Tindak Lanjut" }).click();

    await expect(
      page.getByRole("heading", { name: "Tamu yang perlu ditindaklanjuti" }),
    ).toBeVisible();
    await expect(page.getByText("150 undangan", { exact: true })).toBeVisible();
    await expect(page.getByText("42 undangan", { exact: true })).toBeVisible();
    await expect(page.getByText("108 undangan", { exact: true })).toBeVisible();
    await expect(page.getByText("4 dipilih").first()).toBeVisible();
    await expect(page.getByRole("cell", { name: "Hendra & Partner", exact: true })).toBeVisible();

    // Bulk action keeps the 4 selected — not all 42
    await page.getByRole("button", { name: "Tinjau 4 pengingat" }).click();
    const review = page.getByRole("dialog");
    await expect(review).toBeVisible();
    await expect(review.getByText(/Hendra & Partner/)).toBeVisible();
    await expect(review.getByText(/Salsa Putri/)).toBeVisible();
    await review.getByRole("button", { name: "Jadwalkan 4 pengingat" }).click();
    await expect(review.getByText(/4 pengingat masuk antrean simulasi/i)).toBeVisible();
  });

  test("58-64: Microsite tamu — seksi, RSVP per sesi, ucapan, foto, hadiah nonaktif", async ({
    page,
  }) => {
    await page.goto("/i/token-budi-a7c6/acara");

    // Hero & story
    await expect(page.getByText("THE WEDDING · 14 FEBRUARI 2027")).toBeVisible();
    await expect(page.getByText("Andi Ramadhan")).toBeVisible();
    await expect(
      page.getByText("Putri dari Bapak H. Dedi Prasetyo & Ibu Hj. Ratna Dewi"),
    ).toBeVisible();
    await expect(
      page.getByText("Sebuah pertemuan, lalu percakapan yang tak selesai."),
    ).toBeVisible();

    // RSVP per session: Akad 1/2, Resepsi 2/2 — not summed as unique people
    await page.getByRole("button", { name: "RSVP per Sesi" }).click();
    await expect(page.getByRole("heading", { name: "Akad nikah" })).toBeVisible();
    await expect(page.getByText("1 orang").first()).toBeVisible();
    await expect(page.getByText("2 orang", { exact: true })).toBeVisible();
    await expect(page.getByText(/bukan jumlah orang unik/i)).toBeVisible();

    // Stepper refuses to exceed the per-session quota: + disables at max
    await page.getByRole("button", { name: "Tambah jumlah sesi Akad nikah" }).click();
    await expect(
      page.getByRole("button", { name: "Tambah jumlah sesi Akad nikah" }),
    ).toBeDisabled();
    await page.getByRole("button", { name: "Simpan jawaban per sesi" }).click();
    await expect(page.getByText(/Jawaban per sesi tersimpan/i)).toBeVisible();
    await expect(
      page.getByText(/pax lintas sesi — bukan jumlah orang unik/i).first(),
    ).toBeVisible();

    // Wishes require consent
    await page.getByRole("button", { name: "← Kembali" }).click();
    await page.getByRole("button", { name: "Ucapan & Doa" }).click();
    await expect(page.getByText(/Tidak perlu membuat akun/i)).toBeVisible();
    await expect(page.getByRole("button", { name: "Kirim ucapan" })).toBeDisabled();
    await page.getByLabel(/Ucapan & doa/i).fill("Selamat menempuh hidup baru!");
    await expect(page.getByRole("button", { name: "Kirim ucapan" })).toBeDisabled();
    await page.getByRole("checkbox").check();
    await expect(page.getByRole("button", { name: "Kirim ucapan" })).toBeEnabled();

    // Moments: photo queued for moderation, not auto-published
    await page.getByRole("button", { name: "← Kembali" }).click();
    await page.getByRole("button", { name: "Kirim Foto" }).click();
    await expect(page.getByText("momen-kami.jpg · 2,8 MB")).toBeVisible();
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Kirim untuk moderasi" }).click();
    await expect(page.getByText(/Foto masuk antrean moderasi/i)).toBeVisible();

    // Gifts inactive: masked accounts, no QRIS
    await page.getByRole("button", { name: "← Kembali" }).click();
    await page.getByRole("button", { name: /Hadiah \(nonaktif\)/ }).click();
    await expect(page.getByText("•••• 4821")).toBeVisible();
    await expect(page.getByText(/Tidak ada QRIS aktif/i)).toBeVisible();

    // Guide: schematic disclaimer, no auto-geolocation
    await page.getByRole("button", { name: "← Kembali" }).first().click();
    await page.getByRole("button", { name: "Panduan Acara" }).click();
    await expect(
      page.getByText(/Denah skematik contoh, bukan peta lokasi terverifikasi/i),
    ).toBeVisible();
  });
});
