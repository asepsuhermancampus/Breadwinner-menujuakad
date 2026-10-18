import { describe, expect, it } from "vitest";
import { generateFinanceCsv, parseCsvRows } from "./csv-helpers";
import type { DepositItem, ExpenseItem } from "../types/finance";

describe("csv-helpers", () => {
  const sampleDeposits: DepositItem[] = [
    {
      id: "DEP-01",
      contributor: "Andi",
      amount: 25_000_000,
      accountId: "acc-1",
      accountName: "BCA ••4821",
      date: "20 Sep 2026",
      reference: "Setoran awal",
    },
  ];

  const sampleExpenses: ExpenseItem[] = [
    {
      id: "EX-1001",
      title: "DP Venue Bumi Samami",
      category: "Venue",
      amount: 15_000_000,
      paidBy: "Bersama",
      fundingScope: "event_fund",
      accountId: "acc-1",
      accountName: "BCA ••4821",
      date: "25 Sep 2026",
      status: "dp",
      recordedBy: "Andi",
      version: 1,
      notes: "Kuitansi No. 102",
    },
  ];

  it("generates CSV with semicolon delimiter and headers", () => {
    const csv = generateFinanceCsv(sampleDeposits, sampleExpenses);
    expect(csv).toContain("id;tanggal;tipe;kategori;nominal_idr;pihak;sumber_dana;status;catatan");
    expect(csv).toContain(
      "DEP-01;20 Sep 2026;Setoran;Kontribusi;25000000;Andi;BCA ••4821;Tercatat;",
    );
    expect(csv).toContain("EX-1001;25 Sep 2026;Pengeluaran;Venue;15000000;Bersama;BCA ••4821;dp;");
  });

  it("handles private notes inclusion flag", () => {
    const privateCsv = generateFinanceCsv(sampleDeposits, sampleExpenses, {
      includePrivateNotes: true,
    });
    expect(privateCsv).toContain("Kuitansi No. 102");
    expect(privateCsv).toContain("Setoran awal");
  });

  it("parses 5 CSV lines detecting 3 valid, 1 invalid date, and 1 duplicate", () => {
    const rawInput = `tanggal;keterangan;nominal;kategori;pembayar
24 Okt 2026;Transport survei;500.000;Transportasi;Andi
24 Okt 2026;Cetak undangan;750.000;Undangan;Risa
25 Okt 2026;Sampel souvenir;250.000;Souvenir;Andi
32 Okt 2026;Parkir survei;150.000;Transportasi;Andi
05 Okt 2026;DP Venue Bumi Samami;15.000.000;Venue;Bersama`;

    const parsed = parseCsvRows(rawInput);
    expect(parsed.length).toBe(5);

    const validRows = parsed.filter((r) => r.status === "valid");
    expect(validRows.length).toBe(3);
    const sumValid = validRows.reduce((s, r) => s + r.amount, 0);
    expect(sumValid).toBe(1_500_000);

    const invalidRow = parsed.find((r) => r.status === "invalid_date");
    expect(invalidRow).toBeDefined();
    expect(invalidRow?.date).toBe("32 Okt 2026");
    expect(invalidRow?.selected).toBe(false);

    const dupRow = parsed.find((r) => r.status === "duplicate");
    expect(dupRow).toBeDefined();
    expect(dupRow?.amount).toBe(15_000_000);
    expect(dupRow?.selected).toBe(false);
  });
});
