import type { DonutSlice } from "@/components/ui/reui-capital-inflows-types";
import { OVERVIEW_COLORS } from "./overview-donut-colors";

export type OverviewBudgetParams = {
  totalFinanceAmount: number;
  paidAmount: number;
  overdueAmount: number;
  dueTodayAmount: number;
  dueSoonAmount: number;
  unpaidRegularAmount: number;
};

export function buildOverviewBudgetSlices(params: OverviewBudgetParams): {
  slices: DonutSlice[];
  centerValue: string | number;
  centerLabel: string;
} {
  const {
    totalFinanceAmount,
    paidAmount,
    overdueAmount,
    dueTodayAmount,
    dueSoonAmount,
    unpaidRegularAmount,
  } = params;

  const slices: DonutSlice[] = [];
  let centerValue: string | number = "0%";
  let centerLabel = "0 Pos";

  if (totalFinanceAmount <= 0) {
    return { slices, centerValue, centerLabel };
  }

  const paidPercent = Math.round((paidAmount / totalFinanceAmount) * 100);
  const overduePercent = Math.round((overdueAmount / totalFinanceAmount) * 100);
  const dueTodayPercent = Math.round((dueTodayAmount / totalFinanceAmount) * 100);
  const dueSoonPercent = Math.round((dueSoonAmount / totalFinanceAmount) * 100);
  const unpaidPercent = Math.max(
    0,
    100 - paidPercent - overduePercent - dueTodayPercent - dueSoonPercent,
  );

  if (paidPercent > 0) {
    slices.push({
      id: "paid",
      label: "Sudah Dibayar",
      percent: paidPercent,
      color: OVERVIEW_COLORS.paid,
      amount: paidAmount,
      purpose: "Pos anggaran pernikahan yang pembayarannya telah beres atau lunas seluruhnya.",
    });
  }
  if (overduePercent > 0) {
    slices.push({
      id: "overdue",
      label: "Lewat Tenggat",
      percent: overduePercent,
      color: OVERVIEW_COLORS.overdue,
      amount: overdueAmount,
      purpose: "Pos anggaran yang batas waktu pembayarannya telah terlewat dan perlu diselesaikan segera.",
    });
  }
  if (dueTodayPercent > 0) {
    slices.push({
      id: "dueToday",
      label: "Tenggat Hari Ini",
      percent: dueTodayPercent,
      color: OVERVIEW_COLORS.dueToday,
      amount: dueTodayAmount,
      purpose: "Pos anggaran yang jatuh tempo pembayarannya hari ini.",
    });
  }
  if (dueSoonPercent > 0) {
    slices.push({
      id: "dueSoon",
      label: "Mendekati Tenggat",
      percent: dueSoonPercent,
      color: OVERVIEW_COLORS.dueSoon,
      amount: dueSoonAmount,
      purpose: "Pos anggaran yang mendekati batas tanggal pembayaran (≤ 7 hari).",
    });
  }
  if (unpaidPercent > 0) {
    slices.push({
      id: "unpaid",
      label: "Belum Dibayar",
      percent: unpaidPercent,
      color: OVERVIEW_COLORS.unpaid,
      amount: unpaidRegularAmount,
      purpose: "Pos anggaran terencana yang masih menunggu pembayaran sesuai jadwal reguler.",
    });
  }

  centerValue = `${paidPercent}%`;
  centerLabel = "Terbayar";

  return { slices, centerValue, centerLabel };
}

