import { expect, it } from "vitest";
import { budgetDescription } from "./budget-description";
it("includes important budget fields alongside full source details", () => {
  const result = budgetDescription({
    id: "a",
    title: "Nasi putih",
    category: "Katering",
    purpose: "Pelunasan resepsi",
    amount: 240000,
    dueDate: "2026-12-15",
    priority: "Tinggi",
    completed: true,
    createdAt: "2026-10-28T03:00:00Z",
    notes: "Catatan umum",
    source: { kind: "catering", id: "rice" },
    sourceDetails:
      "Jenis: Prasmanan\nVendor: Rumah makan bunda\nJumlah: 40 porsi\nHarga per porsi: Rp 6.000",
  });
  expect(result.information).toEqual(
    expect.arrayContaining([
      { label: "Kategori", value: "Katering" },
      { label: "Tujuan", value: "Pelunasan resepsi" },
      { label: "Tenggat pembayaran", value: "15 Desember 2026" },
      { label: "Prioritas", value: "Tinggi" },
      { label: "Status", value: "Tercapai" },
      { label: "Sumber catatan", value: "Katering" },
    ]),
  );
  expect(result.information.find((item) => item.label === "Dibuat pada")?.value).toBe(
    "28 Oktober 2026",
  );
  expect(result.details).toContainEqual({ label: "Vendor", value: "Rumah makan bunda" });
  expect(result.details.at(-1)).toEqual({ label: "Harga total", value: "Rp 240.000" });
  expect(result.notes).toBe("Catatan umum");
});
it("keeps multiline package contents intact and uses the current authoritative total", () => {
  const result = budgetDescription({
    id: "b",
    title: "Paket",
    amount: 1500000,
    sourceDetails: "Isi paket: Nasi\nAyam\nMinuman\nHarga paket: Rp 1.500.000\nHarga total: Rp 1",
    notes: "n".repeat(5000),
  });
  expect(result.details).toContainEqual({ label: "Isi paket", value: "Nasi\nAyam\nMinuman" });
  expect(result.details.filter((item) => item.label === "Harga total")).toEqual([
    { label: "Harga total", value: "Rp 1.500.000" },
  ]);
  expect(result.notes).toHaveLength(5000);
});
it("explains missing fields for manual legacy budgets without inventing dates or amounts", () => {
  const result = budgetDescription({ id: "legacy", title: "Catatan lama" });
  expect(result.information).toContainEqual({
    label: "Sumber catatan",
    value: "Catatan anggaran manual",
  });
  expect(result.information).toContainEqual({ label: "Tujuan", value: "Belum ditentukan" });
  expect(result.information).toContainEqual({
    label: "Tenggat pembayaran",
    value: "Belum ditentukan",
  });
  expect(result.information).toContainEqual({ label: "Dibuat pada", value: "Belum tercatat" });
  expect(result.details.at(-1)).toEqual({ label: "Harga total", value: "Belum diisi" });
  expect(result.notes).toBe("");
});
