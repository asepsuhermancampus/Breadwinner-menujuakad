import type { DonutSlice } from "@/components/ui/reui-capital-inflows-types";
import { OVERVIEW_COLORS } from "./overview-donut-colors";

export type OverviewSavingsParams = {
  hasPartner: boolean;
  isBride: boolean;
  partnerNames: { user: string; partner: string };
  availableSavings: number;
  userSavings: number;
  partnerSavings: number;
  paidAmount: number;
  totalSavingsPool: number;
};

export function buildOverviewSavingsSlices(params: OverviewSavingsParams): {
  slices: DonutSlice[];
  centerValue: string | number;
  centerLabel: string;
} {
  const {
    hasPartner,
    isBride,
    partnerNames,
    availableSavings,
    userSavings,
    partnerSavings,
    paidAmount,
    totalSavingsPool,
  } = params;

  const slices: DonutSlice[] = [];
  let centerValue: string | number = "Rp 0";
  let centerLabel = "Belum Ada";

  if (totalSavingsPool <= 0) {
    return { slices, centerValue, centerLabel };
  }

  const userColor = isBride ? OVERVIEW_COLORS.bride : OVERVIEW_COLORS.groom;
  const partnerColor = isBride ? OVERVIEW_COLORS.groom : OVERVIEW_COLORS.bride;
  const userRole = isBride ? "wanita" : "pria";
  const partnerRole = isBride ? "pria" : "wanita";

  if (!hasPartner) {
    const availPercent = Math.round((availableSavings / totalSavingsPool) * 100);
    const usedPercent = Math.max(0, 100 - availPercent);

    if (availPercent > 0) {
      slices.push({
        id: "available",
        label: "Tabungan Tersedia",
        percent: availPercent,
        color: userColor,
        amount: availableSavings,
        purpose: "Total tabungan aktif yang siap digunakan untuk membayar kewajiban anggaran acara.",
      });
    }
    if (usedPercent > 0) {
      slices.push({
        id: "used",
        label: "Terpakai",
        percent: usedPercent,
        color: OVERVIEW_COLORS.used,
        amount: paidAmount,
        purpose: "Alokasi tabungan yang telah terealisasi untuk membayar dan melunasi pos anggaran kebutuhan acara.",
      });
    }
    centerValue = `${availPercent}%`;
    centerLabel = "Tersedia";
  } else {
    const userPercent = Math.round((userSavings / totalSavingsPool) * 100);
    const partnerPercent = Math.round((partnerSavings / totalSavingsPool) * 100);
    const usedPercent = Math.max(0, 100 - userPercent - partnerPercent);

    if (userPercent > 0) {
      slices.push({
        id: "user",
        label: partnerNames.user,
        percent: userPercent,
        color: userColor,
        amount: userSavings,
        purpose: `Alokasi simpanan dari pihak ${userRole} (${partnerNames.user}) untuk mendanai pembiayaan acara pernikahan.`,
      });
    }
    if (partnerPercent > 0) {
      slices.push({
        id: "partner",
        label: partnerNames.partner,
        percent: partnerPercent,
        color: partnerColor,
        amount: partnerSavings,
        purpose: `Alokasi simpanan dari pihak ${partnerRole} (${partnerNames.partner}) untuk mendanai pembiayaan acara pernikahan.`,
      });
    }
    if (usedPercent > 0) {
      slices.push({
        id: "used",
        label: "Terpakai",
        percent: usedPercent,
        color: OVERVIEW_COLORS.used,
        amount: paidAmount,
        purpose: "Alokasi tabungan yang telah terealisasi untuk membayar dan melunasi pos anggaran kebutuhan acara.",
      });
    }
    centerValue = `${Math.min(100, userPercent + partnerPercent)}%`;
    centerLabel = "Total Tersedia";
  }

  return { slices, centerValue, centerLabel };
}

