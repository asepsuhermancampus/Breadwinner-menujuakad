"use client";

import type { SeserahanItem } from "@/features/wedding-preparation/types/seserahan";
import { DualSeserahanDonutCard } from "./dual-seserahan-donut-card";
import { SeserahanStatusScrollCard } from "./seserahan-status-scroll-card";
import {
  categorizeSeserahan,
  buildOverviewSeserahanSlices,
  buildOverviewSeserahanCategorySlices,
} from "../domain/overview-seserahan-slices";

export type CustomerSeserahanStatisticsProps = {
  items: SeserahanItem[];
  seserahanAvailable?: boolean | undefined;
};

export function CustomerSeserahanStatistics({
  items,
  seserahanAvailable = true,
}: CustomerSeserahanStatisticsProps) {
  const c = categorizeSeserahan(items);

  const {
    slices: statusSlices,
    centerValue: statusCenterValue,
  } = buildOverviewSeserahanSlices(c);

  const {
    slices: categorySlices,
    centerValue: categoryCenterValue,
  } = buildOverviewSeserahanCategorySlices(items);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-stretch">
      <DualSeserahanDonutCard
        className="xl:col-span-2"
        categorization={c}
        statusSlices={statusSlices}
        statusCenterValue={statusCenterValue}
        categorySlices={categorySlices}
        categoryCenterValue={categoryCenterValue}
        manageHref={seserahanAvailable ? "/planner/seserahan" : undefined}
      />
      <SeserahanStatusScrollCard
        className="xl:col-span-1"
        items={items}
        manageHref={seserahanAvailable ? "/planner/seserahan" : undefined}
      />
    </div>
  );
}

