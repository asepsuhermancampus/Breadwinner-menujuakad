import { describe, expect, it } from "vitest";
import {
  buildOverviewSavingsSlices,
  buildOverviewBudgetSlices,
  OVERVIEW_COLORS,
} from "./overview-donut-slices";

describe("overview-donut-slices", () => {
  it("builds savings slices for single user correctly", () => {
    const result = buildOverviewSavingsSlices({
      hasPartner: false,
      isBride: false,
      partnerNames: { user: "Rian", partner: "Aulia" },
      availableSavings: 50000000,
      userSavings: 50000000,
      partnerSavings: 0,
      paidAmount: 10000000,
      totalSavingsPool: 60000000,
    });

    expect(result.slices.length).toBe(2);
    expect(result.slices[0]?.color).toBe(OVERVIEW_COLORS.groom);
    expect(result.slices[0]?.purpose).toContain("kewajiban anggaran");
    expect(result.slices[1]?.color).toBe(OVERVIEW_COLORS.used);
    expect(result.slices[1]?.purpose).toContain("terealisasi");
  });

  it("builds savings slices for couple correctly with groom and bride colors", () => {
    const result = buildOverviewSavingsSlices({
      hasPartner: true,
      isBride: false,
      partnerNames: { user: "Rian", partner: "Aulia" },
      availableSavings: 90000000,
      userSavings: 50000000,
      partnerSavings: 40000000,
      paidAmount: 0,
      totalSavingsPool: 90000000,
    });

    expect(result.slices.length).toBe(2);
    expect(result.slices[0]?.color).toBe(OVERVIEW_COLORS.groom);
    expect(result.slices[1]?.color).toBe(OVERVIEW_COLORS.bride);
    expect(result.slices[0]?.purpose).toContain("pria");
    expect(result.slices[1]?.purpose).toContain("wanita");
  });

  it("builds budget slices with paid, overdue, dueToday, dueSoon, and unpaid statuses", () => {
    const result = buildOverviewBudgetSlices({
      totalFinanceAmount: 100000000,
      paidAmount: 40000000,
      overdueAmount: 15000000,
      dueTodayAmount: 10000000,
      dueSoonAmount: 15000000,
      unpaidRegularAmount: 20000000,
    });

    expect(result.slices.length).toBe(5);
    expect(result.slices[0]?.id).toBe("paid");
    expect(result.slices[0]?.color).toBe(OVERVIEW_COLORS.paid);

    expect(result.slices[1]?.id).toBe("overdue");
    expect(result.slices[1]?.color).toBe(OVERVIEW_COLORS.overdue);
    expect(result.slices[1]?.label).toBe("Lewat Tenggat");

    expect(result.slices[2]?.id).toBe("dueToday");
    expect(result.slices[2]?.color).toBe(OVERVIEW_COLORS.dueToday);
    expect(result.slices[2]?.label).toBe("Tenggat Hari Ini");

    expect(result.slices[3]?.id).toBe("dueSoon");
    expect(result.slices[3]?.color).toBe(OVERVIEW_COLORS.dueSoon);
    expect(result.slices[3]?.label).toBe("Mendekati Tenggat");

    expect(result.slices[4]?.id).toBe("unpaid");
    expect(result.slices[4]?.color).toBe(OVERVIEW_COLORS.unpaid);
    expect(result.slices[4]?.label).toBe("Belum Dibayar");
  });
});
