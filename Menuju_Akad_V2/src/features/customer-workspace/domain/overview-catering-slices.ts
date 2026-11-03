import type { DonutSlice } from "@/components/ui/reui-capital-inflows-types";
import {
  calculateCatering,
  defaultCateringInput,
  type CateringCalculationInput,
  type CateringCalculationResult,
} from "@/features/catering/utils/calculator";

export function buildCateringDonutSlices(
  input: CateringCalculationInput = defaultCateringInput,
): {
  ratioSlices: DonutSlice[];
  ratioCenterValue: string;
  portionsSlices: DonutSlice[];
  portionsCenterValue: string | number;
  result: CateringCalculationResult;
} {
  const result = calculateCatering(input);

  // 1. Rasio Proporsi Tamu (Buffet vs Stall)
  const ratioSlices: DonutSlice[] = [
    {
      id: "buffet",
      label: "Prasmanan (Buffet)",
      percent: input.buffetPercent,
      amount: result.buffetPax,
      color: "#059669", // emerald-600
    },
    {
      id: "stall",
      label: "Gubukan (Food Stall)",
      percent: Math.max(0, 100 - input.buffetPercent),
      amount: result.stallPax,
      color: "#f59e0b", // amber-500
    },
  ];

  // 2. Total Distribusi Porsi Makanan (Buffet + Stall Portions + Buffer)
  const total = Math.max(1, result.totalPortions);
  const buffetPortionPercent = Math.round((result.buffetPax / total) * 100);
  const stallPortionPercent = Math.max(0, 100 - buffetPortionPercent);

  const portionsSlices: DonutSlice[] = [
    {
      id: "buffet-portions",
      label: "Porsi Prasmanan",
      percent: buffetPortionPercent,
      amount: result.buffetPax,
      color: "#059669", // emerald-600 (matches ratioSlices buffet)
    },
    {
      id: "stall-portions",
      label: "Porsi Gubukan",
      percent: stallPortionPercent,
      amount: result.stallPortionsTotal,
      color: "#f59e0b", // amber-500 (matches ratioSlices stall)
    },
  ];

  return {
    ratioSlices,
    ratioCenterValue: `${input.buffetPercent}%`,
    portionsSlices,
    portionsCenterValue: result.totalPortions,
    result,
  };
}

