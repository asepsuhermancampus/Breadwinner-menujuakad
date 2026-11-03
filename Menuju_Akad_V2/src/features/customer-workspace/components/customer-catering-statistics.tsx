"use client";

import { DualCateringDonutCard } from "./dual-catering-donut-card";
import { CateringStatusScrollCard } from "./catering-status-scroll-card";
import { buildCateringDonutSlices } from "../domain/overview-catering-slices";
import { defaultCateringInput, type CateringCalculationInput } from "@/features/catering/utils/calculator";

export type CustomerCateringStatisticsProps = {
  cateringInput?: CateringCalculationInput | undefined;
  guestQuota?: number | undefined;
};

export function CustomerCateringStatistics({
  cateringInput,
  guestQuota,
}: CustomerCateringStatisticsProps) {
  const input = {
    ...defaultCateringInput,
    ...cateringInput,
    ...(guestQuota && guestQuota > 0 ? { invitations: Math.round(guestQuota / 2) } : {}),
  };

  const {
    ratioSlices,
    ratioCenterValue,
    portionsSlices,
    portionsCenterValue,
    result,
  } = buildCateringDonutSlices(input);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">
      <DualCateringDonutCard
        className="xl:col-span-2"
        result={result}
        ratioSlices={ratioSlices}
        ratioCenterValue={ratioCenterValue}
        portionsSlices={portionsSlices}
        portionsCenterValue={portionsCenterValue}
      />
      <CateringStatusScrollCard
        className="xl:col-span-1"
        result={result}
      />
    </div>
  );
}
